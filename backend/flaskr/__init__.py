import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask
from flaskr.config import Config


class FirestoreClient():
    _instance = None

    @classmethod
    def get_instance(cls, cred_path):
        if cls._instance is None:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            cls._instance = firestore.client()
        return cls._instance


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db = FirestoreClient.get_instance(app.config['SECRET_KEY'])
    app.config['db'] = db
    return app
