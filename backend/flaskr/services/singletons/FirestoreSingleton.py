from firebase_admin import firestore
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.utils.singleton_meta import SingletonMeta


class FirestoreSingleton(metaclass=SingletonMeta):
    def __init__(self):
        self.db = None
        self._initialize()

    def _initialize(self):
        try:
            firebase_app = FirebaseAppSingleton()
            self.db = firestore.client(app=firebase_app.app)
        except Exception as e:
            raise RuntimeError(f'Failed to initialize Firestore client: {e}')

    @property
    def client(self):
        if self.db is None:
            raise RuntimeError('Firestore client is not initialized')
        return self.db
