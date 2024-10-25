from flask import Flask
from flaskr.config import Config
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    try:
        firebase_app = FirebaseAppSingleton().app

        db = FirestoreSingleton().client
        app.config['db'] = db

    except Exception as e:
        raise RuntimeError(f'Failed to initialize Firebase or Firestore: {str(e)}')

    return app
