# API Server

The API server application uses [Connexion](https://connexion.readthedocs.io/)
on top of [Flask](https://flask.palletsprojects.com/).

## Development Setup
First off, you will need [Python 3.10](https://www.python.org/downloads/) or newer.

You will probably want to use a
[Python virtual environment](https://docs.python.org/3/library/venv.html)
for this project, explained in more detail in the
[Flask documentation](https://flask.palletsprojects.com/installation/#virtual-environments), e.g.:
```sh
python3 -m venv venv
. venv/bin/activate
```
Once the environment is activated, install the dependencies from the requirements file:
```sh
pip install -r requirements.txt
```

Before running the server, make sure you have run the [code generation](../api/README.md)
from the API specification.

Then just run the server application:
```sh
python app.py
```
Now the API server should be running on localhost port 5000.

To verify that the server is running properly, you can check the `status` endpoint
using curl or your browser:
```
curl -s http://127.0.0.1:5000/api/status
```
You should see a response like:
```
{"success":true}
```

Next you will need to load some data into the database.
For local development the databases are run from an SQLite database
(in a file named `temp.db`). If you run `util.py` as a script,
it will automatically create the databases and load them with the JSON data.
