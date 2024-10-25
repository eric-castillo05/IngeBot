from firebase_admin import credentials, initialize_app
from flaskr.config import Config
from flaskr.utils.singleton_meta import SingletonMeta


class FirebaseAppSingleton(metaclass=SingletonMeta):
    def __init__(self):
        self._app = None
        self._initialize()

    def _initialize(self):
        cred_path = Config.SECRET_KEY
        bucket_name = Config.BUCKET_NAME
        if not cred_path or not bucket_name:
            raise ValueError('Credentials or bucket name missing from configuration.')

        try:
            cred = credentials.Certificate(cred_path)
            self._app = initialize_app(cred, {
                'storageBucket': bucket_name
            })
        except Exception as e:
            raise RuntimeError(f'Failed to initialize Firebase app: {e}')

    @property
    def app(self):
        if self._app is None:
            raise RuntimeError('Firebase app not initialized')
        return self._app
