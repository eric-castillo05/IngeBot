from firebase_admin import auth
from flaskr.models import User
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.services.singletons.StorageBucketSingleton import StorageBucketSingleton
from flaskr.utils.current_timestamp import CurrentTimestamp

class UserService:
    def __init__(self, user: User):
        self.user = user

    def create_user(self, image_file):
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
                'image_path': f'user_profile/{user_record.uid}/{image_file.filename}',
                'created_at': CurrentTimestamp.get_current_timestamp()
            }
            db_instance.collection('users').document(user_record.uid).set(user_data)
            return True
        except Exception as e:
            print(f'Error creating user or adding to Firestore: {str(e)}')
            return False

    def upload_image(self, image_file, user_uid: str):
        try:
            import os
            temp_dir = "/tmp"
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir)

            temp_path = os.path.join(temp_dir, image_file.filename)
            image_file.save(temp_path)

            bucket = StorageBucketSingleton().storage_bucket
            blob = bucket.blob(f'user_profile/{user_uid}/{image_file.filename}')

            blob.upload_from_filename(temp_path)

            os.remove(temp_path)

            blob.make_public()
            return blob.public_url

        except Exception as e:
            print(f'Error uploading image: {str(e)}')
            return None
