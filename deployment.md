# Production server setup and deployment
The components that need to be configured and deployed on production are:
- nginx reverse proxy
- Let's Encrypt HTTPS certificates
- Gunicorn WSGI server
- MariaDB database
- Flask + SQLAlchemy Python server application
- React client web application

The instructions below will walk you through the process.

A few notes about these instructions:
- This assumes you already have a domain name set up and pointing to your host IP.
- You will need to replace `celestespeed.run` in the instructions with your actual domain.
- These were written for an Ubuntu 20.04 server, i.e. assuming `apt` and `snap` are available/used.
  Check the individual software sites for info on installing using other package managers.

## 0. Update package lists
```
sudo apt update
```

## 1. Install nginx reverse proxy
Install [nginx](https://nginx.org/) (HTTP and reverse proxy server):
```
sudo apt install nginx -y
```
Now go to `http://celestespeed.run/` in your browser. You should see a page that says `Welcome to nginx!`.

## 2. Generate HTTPS certificates
Install and run [Certbot](https://certbot.eff.org/) to generate (and automatically renew) HTTPS certificates
provided via [Let's Encrypt](https://letsencrypt.org/) and automatically add them to your nginx config.
```
# Ensure snapd is up to date
sudo snap install core; sudo snap refresh core
# Install Certbot
sudo snap install --classic certbot
# Prepare the Certbot command
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# Get and install your certificates (updates nginx config)
sudo certbot --nginx
```
You will have to enter domain and contact info here.

Once you are done, go to `https://celestespeed.run/` in your browser.
It should take you to the `Welcome to nginx!` page from above and show a lock icon in the URL bar.

```
# Test automatic renewal
sudo certbot renew --dry-run
```

## 3. MariaDB database
TODO: Add database setup instructions!

## 4. Clone the project repositories
```
mkdir ~/celeste-library
cd ~/celeste-library/
git clone https://github.com/celeste-library/celeste-metadata.git
git clone https://github.com/celeste-library/celeste-speedrun-data.git
git clone https://github.com/celeste-library/celeste-speedrun-library.git
```

## 5. [API code generation](api/README.md)
Install the [OpenAPI Generator](https://openapi-generator.tech/) dependencies:
```
sudo apt install openjdk-17-jre-headless -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
    sudo apt install -y nodejs
cd ~/celeste-library/celeste-speedrun-library/api
npm install
npx openapi-generator-cli
```
Then run the code generator:
```
npm run generate
```

## 6. [Server application](server/README.md) setup

### a. MariaDB connector
If the desired version of MariaDB is newer than what is available through your package manager,
you will need to add package repositories for MariaDB using the
[mariadb_repo_setup](https://mariadb.com/docs/server/ref/mariadb_repo_setup/) script,
e.g. for version 10.6 (current LTS):
```
curl -LsS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup\
    | sudo bash -s -- --mariadb-server-version="10.6" --skip-maxscale
sudo apt install libmariadb3 libmariadb-dev -y
```

### b. Python
You may also need to add a [PPA](https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa)
to be able to install Python 3.10 through your package manager:
```
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install build-essential python3.10 python3.10-dev python3.10-venv -y
```

### c. Install the server dependencies
```
cd ~/celeste-library/celeste-speedrun-library/server
./install.sh
```
This will also load the data into the database.

### d. Test server
You should now be able to test the API by running:
```
~/celeste-library/celeste-speedrun-library/server/venv/gunicorn -w 4 'app:app'
```
Then from another session:
```
curl -s localhost:8000/api/status
```
You should see a response like:
```
{"success":true}
```
You can stop the `gunicorn` process with `Ctrl+C`.

## d. [Web client](client/README.md):
Build and deploy:
```
cd ~/celeste-library/celeste-speedrun-library/client
npm install
npm run build
sudo cp -r ~/celeste-library/celeste-speedrun-library/client/build/* /var/www/html/
sudo mkdir /var/www/html/assets/metadata/
sudo cp -r ~/celeste-library/celeste-metadata/images/ /var/www/html/assets/metadata/
```
Now when navigating to `https://celestespeed.run/` in your browser, you should see
a partially loaded view of the client site.

## 7. Setup API redirect in nginx
Now we can config nginx to redirect API calls to the proper port:
```
sudo rm /etc/nginx/sites-enabled/default
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-enabled/csl
```
Open `/etc/nginx/sites-enabled/csl` in your editor of choice and
find the **SECOND** block that looks like:
```
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
```
(The first one is for plain HTTP which we don't care about.)

Modify it so that it says:
```
        location / {
                try_files $uri /index.html;
        }
```

Below that, add a new block:
```
    # Redirect API calls
    location /api/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://localhost:8000;
    }
```
Now reload nginx to load the update config.
```
sudo service nginx reload
```

If you start `gunicorn` again:
```
server/venv/gunicorn -w 4 'app:app'
```
now when you pull up `https://celestespeed.run/` in your browser  it should load the full view of the site!
Stop `gunicorn` with `Ctrl+C` once again.

## 8. Gunicorn as a systemd service
Create a file `/etc/systemd/system/gunicorn.service` with the follow contents:
```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
RuntimeDirectory=gunicorn
WorkingDirectory=/home/dev/celeste-library/celeste-speedrun-library/server
ExecStart=/home/dev/celeste-library/celeste-speedrun-library/server/venv/bin/gunicorn -w 4 'app:app'
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
and run
```sh
sudo systemctl enable --now gunicorn
```

See [here](https://flask.palletsprojects.com/en/2.2.x/deploying/gunicorn/#running)
and [here](https://docs.gunicorn.org/en/stable/deploy.html#systemd) for more details.

# Deploying with CircleCI

### On your local machine

Create a new SSH key that will be used to deploy:
```
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_deploy -N ""
```

### On the server

Create a new user on the server and create the `.ssh` directory:
```
sudo adduser deployer --create-home --user-group --disabled-password
sudo su deployer
mkdir ~/.ssh
```
Then paste your new public key (`~/.ssh/id_ed25519_deploy.pub` from your local machine) into the new user's
`~/.ssh/authorized_keys` on the server.

Exit back out and change the owner of the web directory to the new user:
```
exit
sudo chwon -R deployer /var/www/html/
```

Edit the sudoers file with visudo:
```
sudo visudo /etc/sudoers.d/deploy-sudoers
```
Paste the following:
```
deployer ALL=NOPASSWD: /usr/bin/systemctl stop gunicorn
deployer ALL=NOPASSWD: /usr/bin/systemctl restart gunicorn
```
This will allow the deployer user to stop and restart the gunicorn service.

### In Circle CI
Under `Project Settings` > `Advanced`, enable "Enable dynamic config using setup workflows".

Under `Project Settings` > `Environment Variables`, add the following variables:

- `DEPLOY_HOST` - The URL or IP address of the server to deploy to.
- `DEPLOY_USER` - The user to login as on the server to deploy to.
- `DEPLOY_FINGERPRINT` - Public key of the server to deploy to (e.g. to prevent man-in-the-middle attacks).
  This can be obtained on the server by running:
  ```
  ssh-keyscan -t ed25519 localhost 2>/dev/null | cut -d' ' -f2-
  ```

Add the private key from `~/.ssh/id_ed25519_deploy` on your local machine under: `SSH Keys` > `Additional SSH Keys`.

# Manually deploying new changes
CircleCI deploys automatically on push to main. However, the steps to manually deploy are outlined below:

1. Stop the gunicorn server to free up hardware resources if necessary.
   ```
   sudo systemctl stop gunicorn
   ```

2. Grab the latest changes, including any changes to `celeste-metadata` or `celeste-speedrun-data`:
   ```
   cd ~/celeste-library/celeste-metadata/
   git pull
   cd ~/celeste-library/celeste-speedrun-data/
   git pull
   cd ~/celeste-library/celeste-speedrun-library/
   git pull
   ```

3. Run code generation (if any API changes):
   ```
   cd ~/celeste-library/celeste-speedrun-library/api/
   npm run generate
   cd ..
   ```

4. Reload the database from data files:
   ```
   cd ~/celeste-library/celeste-speedrun-library/server/
   . venv/bin/activate
   # if any changes to python dependencies, also pip install -r requirements
   python util.py
   deactivate
   ```

5. Build client and copy to www:
   ```
   cd ~/celeste-library/celeste-speedrun-library/client
   npm run build
   sudo cp -r ~/celeste-library/celeste-speedrun-library/client/build/* /var/www/html/
   ```

   Or, after building the client locally on another machine:
   ```
   scp -r build servername:/home/dev/celeste-library/celeste-speedrun-library/client/build
   sudo cp -r ~/celeste-library/celeste-speedrun-library/client/build/* /var/www/html/
   ```

6. Restart the gunicorn server:
   ```
   sudo systemctl restart gunicorn
   ```
