from firebase_admin import credentials, initialize_app

class FirebaseAppSingleton:
    __instance = None

    @staticmethod
    def get_instance():
        if FirebaseAppSingleton.__instance is None:
            FirebaseAppSingleton()
        return FirebaseAppSingleton.__instance

    def __init__(self):
        if FirebaseAppSingleton.__instance is not None:
            raise Exception("This is a singleton!")
        else:
            # Init Firebase App only once
            cred = credentials.Certificate('/home/aldo/IngeBot/backend/ingebot_key.json')
            self.app = initialize_app(cred, {'storageBucket': 'ingebot-5c0de.appspot.com'})  # Inicializa la app
            FirebaseAppSingleton.__instance = self

