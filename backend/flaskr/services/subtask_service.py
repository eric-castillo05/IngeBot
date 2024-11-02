from flaskr.models import Subtask
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.utils import CurrentTimestamp


class SubtaskService:
    def __init__(self, subtask: Subtask):
        self.subtask = subtask

    def create_subtask(self, uid, task_id):
        try:
            # Get Firestore instance
            db_instance = FirestoreSingleton().client

            # Prepare subtask data with specified attributes
            subtask_data = {
                'subtaskTitle': self.subtask.title,
                'description': self.subtask.description,
                'createdAt': CurrentTimestamp.get_current_timestamp(),
            }

            # Find the task collection and subtask collection based on task_id
            task_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id).collection(
                'Subtasks').document()

            # Set subtask data in Firestore
            task_ref.set(subtask_data)
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




