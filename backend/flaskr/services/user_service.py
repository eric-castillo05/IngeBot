from datetime import datetime
from firebase_admin import auth
from flaskr.models import User
from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton


class UserService:
    def __init__(self, user: User):
        self.user = user

    def create_user(self):
        try:
            db_instance = FirestoreSingleton().client

            user_record = auth.create_user(
                email=self.user.email,
                email_verified=False,
                password=self.user.password,
                display_name=self.user.first_name,
                disabled=False
            )

            user_data = {
                'uid': user_record.uid,
                'first_name': self.user.first_name,
                'middle_name': self.user.middle_name,
                'last_name': self.user.last_name,
                'display_name': self.user.first_name,
                'control_number': self.user.control_number,
                'email': self.user.email,
                'created_at': self.get_current_timestamp(),
            }
            db_instance.collection('users').document(user_record.uid).set(user_data)
            return True
        except Exception as e:
            print(f'Error creating user or adding to Firestore: {str(e)}')
            return False

    @staticmethod
    def get_current_timestamp():
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')