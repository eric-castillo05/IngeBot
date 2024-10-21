
from firebase_admin import firestore

from flaskr.services.singletons.Firebase_Singleton import FirebaseAppSingleton


class FirestoreSingleton:
    __instance = None

    @staticmethod
    def get_instance():
        if FirestoreSingleton.__instance is None:
            FirestoreSingleton()
        return FirestoreSingleton.__instance

    def __init__(self):
        if FirestoreSingleton.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            # Reuse firebase app
            app_instance = FirebaseAppSingleton.get_instance().app
            self.db = firestore.client()  # Create Firestore client
            FirestoreSingleton.__instance = self
