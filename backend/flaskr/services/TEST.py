

from firebase_admin import auth #Authentication service

from flaskr.models import User
from flaskr.services.singletons.Firebase_Singleton import FirebaseAppSingleton
from flaskr.services.singletons.Firestore_Singleton import FirestoreSingleton
from flaskr.services.singletons.Storage_Singleton import StorageBucketSingleton

# Get Firestore instance
db_instance = FirestoreSingleton.get_instance()
db = db_instance.db  # Acceder al cliente de Firestore

# Get Storage Bucket instance
bucket_instance = StorageBucketSingleton.get_instance()
bucket = bucket_instance.bucket  # Acceder al bucket de Storage


user = auth.get_user("GGh07R3wtdets9UYiHmRTxuGHRJ3")
print(db.collection("Users").document("GGh07R3wtdets9UYiHmRTxuGHRJ3").get().to_dict())


# Create an instance of the User class
user1 = User(
    first_name="John",
    middle_name="Doe",
    last_name="Smith",
    control_number="123456",
    email="john.doe@example.com",
    password="securepassword123"
)

# Print the user information
print("User Information:")
print(f"First Name: {user1.first_name}")
print(f"Middle Name: {user1.middle_name}")
print(f"Last Name: {user1.last_name}")
print(f"Control Number: {user1.control_number}")
print(f"Email: {user1.email}")
print(f"Password: {user1.password}")

