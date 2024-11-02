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


    def delete_user(self, uid: str):
        try:
            db_instance = FirestoreSingleton().client

            user_ref = db_instance.collection('users').document(uid)
            user_data = user_ref.get()

            if not user_data.exists:
                return False, "Usuario no encontrado"

            if user_data.to_dict().get('image_path'):
                try:
                    bucket = StorageBucketSingleton().storage_bucket
                    blob = bucket.blob(user_data.to_dict()['image_path'])
                    blob.delete()
                except Exception as e:
                    print(f'Error eliminando imagen: {str(e)}')

            auth.delete_user(uid)

            user_ref.delete()

            return True, "Usuario eliminado exitosamente"
        except Exception as e:
            print(f'Error eliminando usuario: {str(e)}')
            return False, str(e)

    def update_user(self, uid: str, update_data: dict, image_file=None):
        try:
            db_instance = FirestoreSingleton().client
            user_ref = db_instance.collection('users').document(uid)

            user_doc = user_ref.get()
            if not user_doc.exists:
                return False, "User not found"

            auth_update = {}
            if 'email' in update_data:
                current_user = auth.get_user(uid)
                if current_user.email != update_data['email']:
                    try:
                        auth.get_user_by_email(update_data['email'])
                        return False, "Email is already in use by another user"
                    except auth.UserNotFoundError:
                        auth_update['email'] = update_data['email']
            if 'first_name' in update_data:
                auth_update['display_name'] = update_data['first_name']
            if 'password' in update_data:
                auth_update['password'] = update_data['password']

            if auth_update:
                auth.update_user(uid, **auth_update)

            if image_file:
                try:
                    current_data = user_doc.to_dict()
                    if 'image_path' in current_data:
                        bucket = StorageBucketSingleton().storage_bucket
                        old_blob = bucket.blob(current_data['image_path'])
                        old_blob.delete()

                    # Upload new image
                    new_image_url = self.upload_image(image_file, uid)
                    if new_image_url:
                        update_data['image_path'] = new_image_url
                except Exception as e:
                    print(f'Error handling image: {str(e)}')


            update_data.pop('password', None)

            update_data['updated_at'] = CurrentTimestamp.get_current_timestamp()


            if update_data:
                user_ref.update(update_data)

            return True, "User successfully updated"

        except Exception as e:
            print(f'Error updating user: {str(e)}')
            return False, f"Error updating user: {str(e)}"


    def get_user_data(self, uid: str):
        try:
            db_instance = FirestoreSingleton().client
            user_doc = db_instance.collection('users').document(uid).get()

            if not user_doc.exists:
                return None, "Usuario no encontrado"

            user_data = user_doc.to_dict()

            # Obtener URL pública de la imagen si existe
            if user_data.get('image_path'):
                try:
                    bucket = StorageBucketSingleton().storage_bucket
                    blob = bucket.blob(user_data['image_path'])
                    user_data['image_url'] = blob.public_url
                except Exception as e:
                    print(f'Error obteniendo URL de imagen: {str(e)}')
                    user_data['image_url'] = None

            return user_data, "Usuario encontrado exitosamente"
        except Exception as e:
            print(f'Error obteniendo usuario: {str(e)}')


            return None, str(e)



    def get_user_doc(self, uid):
        db_instance = FirestoreSingleton().client
        document_ref = db_instance.collection('users').document(uid)

        data = self._fetch_document_with_subcollections(document_ref)
        return data


    def _fetch_document_with_subcollections(self,document_ref):
        """
        Fetch the document and recursively fetch subcollections.
        """
        data = {}

        # Get the document data
        document_data = document_ref.get().to_dict()

        # Add the document data to the result
        if document_data:
            data['data'] = document_data

        # Get subcollections
        subcollections = document_ref.collections()

        for subcollection in subcollections:
            subcollection_data = []
            for doc in subcollection.stream():
                # Use the document reference to fetch its data
                subcollection_data.append(self._fetch_document_with_subcollections(doc.reference))
            data[subcollection.id] = subcollection_data

        return data