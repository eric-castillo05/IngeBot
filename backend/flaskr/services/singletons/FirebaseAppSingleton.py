import firebase_admin
from firebase_admin import credentials, initialize_app
from flaskr.config import Config
from flaskr.utils.singleton_meta import SingletonMeta


class FirebaseAppSingleton(metaclass=SingletonMeta):
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseAppSingleton, cls).__new__(cls)
        return cls._instance

    @property
    def app(self):
        if not self._initialized:
            self._initialize()
        return firebase_admin.get_app()

    def _initialize(self):
        if not self._initialized:
            try:
                cred = credentials.Certificate(Config.SECRET_KEY)
                firebase_admin.initialize_app(cred)
                self._initialized = True
            except ValueError:
                pass
