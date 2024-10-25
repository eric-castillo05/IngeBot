from firebase_admin import storage
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.utils.singleton_meta import SingletonMeta

class StorageBucketSingleton(metaclass=SingletonMeta):
    _instance = None
    _bucket = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StorageBucketSingleton, cls).__new__(cls)
        return cls._instance

    @property
    def storage_bucket(self):
        if self._bucket is None:
            self._initialize()
        return self._bucket

    def _initialize(self):
        try:
            firebase_app = FirebaseAppSingleton().app
            self._bucket = storage.bucket(app=firebase_app)
        except Exception as e:
            raise RuntimeError(f'Failed to initialize storage bucket: {e}')
