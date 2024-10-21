
from firebase_admin import storage

from flaskr.services.singletons.Firebase_Singleton import FirebaseAppSingleton


class StorageBucketSingleton:
    __instance = None

    @staticmethod
    def get_instance():
        if StorageBucketSingleton.__instance is None:
            StorageBucketSingleton()
        return StorageBucketSingleton.__instance

    def __init__(self):
        if StorageBucketSingleton.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            # Reuse Firebase App
            app_instance = FirebaseAppSingleton.get_instance().app
            self.bucket = storage.bucket(app=app_instance)  # Init bucket
            StorageBucketSingleton.__instance = self
