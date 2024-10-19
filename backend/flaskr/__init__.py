import firebase_admin
from firebase_admin import credentials
from flask import Flask
from flask.config import Config

def create_app(config_name = Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    cred = credentials.Certificate(app.config['../ingebot_key.json'])
    firebase_admin.initialize_app(cred)
