import firebase_admin
from firebase_admin import credentials
from flask import Flask
from flaskr.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cred = credentials.Certificate(app.config['SECRET_KEY'])
    firebase_admin.initialize_app(cred)
    return app
