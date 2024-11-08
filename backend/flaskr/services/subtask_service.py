from flaskr.models import Subtask
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.utils import CurrentTimestamp


class SubtaskService:
    def __init__(self, subtask: Subtask):
        self.subtask = subtask

    def create_subtask(self, uid, task_id):
        try:
            # 1. Get Firestore instance
            db_instance = FirestoreSingleton().client
            # 2. GET USER REFERENCE
            user_ref = db_instance.collection('users').document(uid)
            # 3. GET TASK REFERENCE
            task_ref = user_ref.collection('Tasks').document(task_id)
            # 4. CREATE SUBTASK DOCUMENT AND SAVE ITS REFERENCE
            subtask_ref = task_ref.collection('Subtasks').document()
            # 5. GET subtask_id based on the reference we just created above
            subtask_id = subtask_ref.id

            # Prepare subtask data with specified attributes
            subtask_data = {
                'subtaskTitle': self.subtask.title,
                'id': subtask_id,
                'description': self.subtask.description,
                'createdAt': CurrentTimestamp.get_current_timestamp(),
                'status': self.subtask.status,
            }


            # Set subtask data in Firestore
            subtask_ref.set(subtask_data)
            return True
        except Exception as e:
            print(f'Error creating subtask: {str(e)}')
            return False

    def update_subtask(self, uid, task_id, subtask_id):
        try:
            db_instance = FirestoreSingleton().client
            subtask_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id).collection('Subtasks').document(subtask_id)
            subtask_data = {
                'subtaskTitle': self.subtask.title,
                'description': self.subtask.description,
                'updatedAt': CurrentTimestamp.get_current_timestamp()
            }
            subtask_ref.update(subtask_data)
            return True
        except Exception as e:
            print(f'Error updating subtask: {str(e)}')
            return False

    def delete_subtask(self, uid, task_id, subtask_id):
        try:
            db_instance = FirestoreSingleton().client
            subtask_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id).collection('Subtasks').document(subtask_id)
            subtask_ref.delete()
            return True
        except Exception as e:
            print(f'Error deleting subtask: {str(e)}')
            return False

    @staticmethod
    def get_subtask(uid, task_id, subtask_id):
        try:
            db_instance = FirestoreSingleton().client
            subtask_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id).collection('Subtasks').document(subtask_id)
            subtask_doc = subtask_ref.get()
            return subtask_doc.to_dict() if subtask_doc.exists else None
        except Exception as e:
            print(f'Error retrieving subtask: {str(e)}')
            return None

    @staticmethod
    def fetch_subtasks(uid, task_id):
        """
        Fetch all subtasks for a given user and task, and return the data as a dictionary.
        """
        subtasks_data = []
        # db instance
        db_instance = FirestoreSingleton().client
        # Reference to the subtasks collection
        subtasks_ref = db_instance.collection("users").document(uid).collection("Tasks").document(task_id).collection(
            "Subtasks")

        # Stream through all subtasks
        subtasks = subtasks_ref.stream()

        for subtask in subtasks:
            # Append each subtask's data to the list
            subtasks_data.append({

                "data": subtask.to_dict()
            })

        return subtasks_data





