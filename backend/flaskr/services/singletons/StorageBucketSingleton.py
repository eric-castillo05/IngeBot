from firebase_admin import storage
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.utils.singleton_meta import SingletonMeta


class StorageBucketSingleton(metaclass=SingletonMeta):
    def __init__(self):
        self.bucket = None
        self._initialize()

    def _initialize(self):
        try:
            firebase_app = FirebaseAppSingleton()
            self.bucket = storage.bucket(app=firebase_app.app)
        except Exception as e:
            raise RuntimeError(f'Failed to initialize storage bucket: {e}')

    @property
    def storage_bucket(self):
        if self.bucket is None:
            raise RuntimeError('Storage bucket is not initialized')
        return self.bucket
