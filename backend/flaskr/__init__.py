from flask import Flask
from flaskr.config import Config
from flaskr.routes.motivational_routes import motivational_bp
from flaskr.routes.user_routes import user_bp
from flaskr.routes.task_routes import task_bp
from flaskr.routes.subtask_routes import subtask_bp
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton


def create_app():
    # Inicialización de la aplicación Flask
    app = Flask(__name__)
    app.config.from_object(Config)

    # Registro de blueprints para las rutas
    app.register_blueprint(user_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(subtask_bp)
    app.register_blueprint(motivational_bp)

    # Configuración de Firestore
    try:
        app.config['db'] = FirestoreSingleton().client
    except Exception as e:
        raise RuntimeError(f'Failed to initialize Firebase or Firestore: {str(e)}')

    return app