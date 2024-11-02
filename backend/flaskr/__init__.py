from flask import Flask
from flaskr.config import Config
from flaskr.routes.user_routes import user_bp
from flaskr.routes.task_routes import task_bp
from flaskr.routes.subtask_routes import subtask_bp

from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(user_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(subtask_bp)

    try:
        app.config['db'] = FirestoreSingleton().client
    except Exception as e:
        raise RuntimeError(f'Failed to initialize Firebase or Firestore: {str(e)}')

    return app
