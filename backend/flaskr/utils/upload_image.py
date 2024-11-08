from flaskr.services.singletons.StorageBucketSingleton import StorageBucketSingleton


class UploadImages:
    @staticmethod
    def upload_image_test(image_file, name: str):
        try:
            import os
            # Define temporary directory and create if it doesn't exist
            temp_dir = "/tmp"
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir)

            # Save image temporarily
            temp_path = os.path.join(temp_dir, image_file.filename)
            image_file.save(temp_path)

            # Define the Firebase Storage path for the new image
            bucket = StorageBucketSingleton().storage_bucket
            blob_path = f'default/{name}/{image_file.filename}'
            blob = bucket.blob(blob_path)

            # Check and delete existing images in user's profile picture folder
            existing_blobs = bucket.list_blobs(prefix=f'default/{name}/')
            for existing_blob in existing_blobs:
                existing_blob.delete()

            # Upload new image to Firebase Storage
            blob.upload_from_filename(temp_path)

            # Remove the temporary file
            os.remove(temp_path)

            # Make the file publicly accessible
            blob.make_public()

            # Return the public URL
            return blob.public_url

        except Exception as e:
            print(f'Error uploading image: {str(e)}')
            return None
