# API Server

The API server application runs using [Flask](https://flask.palletsprojects.com/).

## Development Setup
First off, you will need a somewhat recent version of
[Python 3](https://www.python.org/downloads/).

You will most likely want to use a
[Python virtual environment](https://docs.python.org/3/library/venv.html)
for this project, explained in more detail in the
[Flask documentation](https://flask.palletsprojects.com/installation/#virtual-environments)

Once the environment is activated, install the dependencies from the requirements file:
```sh
pip install -r requirements.txt
```

Then just run the Flask server:
```
flask run
```
Now the API server should be running on localhost port 5000.

To verify that the server is running properly, you can check the `status` endpoint:
```
curl -s http://127.0.0.1:5000/status
```

You should see a response like:
```
{"success":true}
```

Next you will need to load some data into the database.
For local development the databases are run from an SQLite database
(in a file named `temp.db`). If you run `util.py` as a script,
it will automatically create the databases and load them with the JSON data.

## Production Deployment

The components that need to be configured and deployed are:
- nginx reverse proxy
- Let's Encrypt HTTPS certificates
- Gunicorn WSGI server
- MariaDB database
- Flask + SQLAlchemy Python server application

TODO: fill in details