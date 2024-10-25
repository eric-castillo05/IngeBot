from flaskr.models import User

from firebase_admin import auth #Authentication service

from flaskr.models.task_model import iTask
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.services.singletons.StorageBucketSingleton import StorageBucketSingleton


class iFirebase:
    def __init__(self, user:User):
        self.user = user

    def create_user(self):

        try:
            image_path = self.user.imagePath
            # Get Firestore instance
            db_instance = FirestoreSingleton.get_instance()
            db = db_instance.db  # Acceder al cliente de Firestore

            # Step 1: Create the user in Firebase Authentication
            # Firebase Authentication only needs email and password, the other parameters are optional
            user = auth.create_user(
                email=self.user.email,
                email_verified=False,
                password=self.user.password,
                display_name=self.user.first_name,
                disabled=False
            )
            print(f'Successfully created new user: {user.uid}')

            # Step 2: Upload profile picture if provided
            if image_path:
                image_url = self.upload_image_and_get_url(image_path, user.uid)
                print(f'Profile image URL: {image_url}')
            else:
                image_url = None

            # Step 3: Store user data in Firestore
            user_data = {
                'uid': user.uid,
                'first_name': self.user.first_name,
                'middle_name':  self.user.middle_name,
                'last_name':  self.user.last_name,
                'display_name': self.user.first_name,
                'control_number':  self.user.control_number,
                'email':  self.user.email,
                'photo_url': image_url,
                'created_at':self.getCurrentTimestamp(),

            }

            # Step 4: Add the user document to Firestore
            user_ref = db.collection('Users').document(user.uid)
            user_ref.set(user_data)
            return user

        except Exception as e:
            print(f'Error creating user or adding to Firestore: {str(e)}')

    def getCurrentTimestamp(self):
        from datetime import datetime
        current_timestamp = datetime.now()
        formatted_timestamp = current_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return formatted_timestamp


    def upload_image_and_get_url(self,image_path, user_uid):
        """Upload a profile image to Firebase Storage and return its URL."""
        try:
            #Get Storage Bucket instance
            bucket_instance = StorageBucketSingleton.get_instance()
            bucket = bucket_instance.bucket  # Acceder al bucket de Storage

            # Create a blob (object) for the image in Storage
            blob = bucket.blob(f'user_profile_pictures/{user_uid}/{image_path.split("/")[-1]}')  # Storage path
            blob.upload_from_filename(image_path)  # Upload the image file

            # Make the blob publicly accessible (optional)
            blob.make_public()

            # Return the URL of the uploaded image
            return blob.public_url
        except Exception as e:
            print(f'Error uploading image: {str(e)}')
            return None



