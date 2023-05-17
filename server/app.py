import connexion
from connexion.resolver import RelativeResolver
from flask_cors import CORS

app = connexion.FlaskApp(__name__, specification_dir='../api/', options={'swagger_ui': False})
app.add_api('api.yaml', resolver=RelativeResolver('service'))
CORS(app.app)

if __name__ == '__main__':
    app.run()
