

from firebase_admin import auth #Authentication service

from flaskr.models import User
from flaskr.services.Read_Data import Read_Data
from flaskr.services.Tasks_Service import Tasks_Service

from flaskr.services.iFirebase import iFirebase

from flaskr.services.singletons.FirebaseAppSingleton import FirebaseAppSingleton
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.services.singletons.StorageBucketSingleton import StorageBucketSingleton

# Get Firestore instance
db_instance = FirestoreSingleton.get_instance()
db = db_instance.db  # Acceder al cliente de Firestore

# Get Storage Bucket instance
#bucket_instance = StorageBucketSingleton.get_instance()
#bucket = bucket_instance.bucket  # Acceder al bucket de Storage


#user = auth.get_user("GGh07R3wtdets9UYiHmRTxuGHRJ3")
#print(db.collection("Users").document("GGh07R3wtdets9UYiHmRTxuGHRJ3").get().to_dict())


# Create an instance of the User class
user2 = User(
    first_name="John",
    middle_name="Doe",
    last_name="Smith",
    control_number="123456",
    email="doe@example1.com",
    password="securepassword123",
    imagePath="/home/aldo/IngeBot/backend/aldo.jpg"
)
#CREATING A USER
#u = iFirebase(user2)
#u.create_user()
new_user =auth.get_user_by_email("7@example.com")
#CREATING A TASK
#Tasks_Service.createTask(title="Test", description="This is a test task",
#                         uid=new_user.uid,due_date="2024/02/03",priority="high")
#CREATING A SUBTASK
#Tasks_Service.createSubtask(taskTitle="Test", description="This is a test task",uid=new_user.uid, subtaskTitle="Sub Test 1")
# READ USER INFO
Read_Data.print_user_info(new_user.uid)

#Read_Data.print_subtasks_in_json(user_id=new_user.uid, task_name="almorzar")

