from flaskr.models import Task, Subtask
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.utils import CurrentTimestamp


class TaskService:
    def __init__(self, task:Task):
        self.task = task

    def create_task(self, uid):
        try:
            # Get Firestore instance
            db_instance = FirestoreSingleton().client

            task_data = {
                'title': self.task.title,
                'description': self.task.description,
                'createdAt': CurrentTimestamp.get_current_timestamp(),
                'due_date': self.task.due_date,
                'priority': self.task.priority,
            }
            # Find "User" document within the "Users" collection with "uid"
            user_ref = db_instance.collection('users').document(uid)
            #Create a "Task" document based on the "user_ref"
            task_ref = user_ref.collection('Tasks').document()
            # Set the task data in Firestore
            task_ref.set(task_data)
            return True
        except Exception as e:
            print(f'Error creating task{str(e)}')
            return False

    def update_task(self, uid, task_id):
        try:
            db_instance = FirestoreSingleton().client
            task_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id)
            task_data = {
                'title': self.task.title,
                'description': self.task.description,
                'due_date': self.task.due_date,
                'priority': self.task.priority,
                'updatedAt': CurrentTimestamp.get_current_timestamp()
            }
            task_ref.update(task_data)
            return True
        except Exception as e:
            print(f'Error updating task: {str(e)}')
            return False

    def delete_task(self, uid, task_id):
        try:
            db_instance = FirestoreSingleton().client
            task_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id)
            task_ref.delete()
            return True
        except Exception as e:
            print(f'Error deleting task: {str(e)}')
            return False

    @staticmethod
    def get_task(uid, task_id):
        try:
            db_instance = FirestoreSingleton().client
            task_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id)
            task_doc = task_ref.get()
            return task_doc.to_dict() if task_doc.exists else None
        except Exception as e:
            print(f'Error retrieving task: {str(e)}')
            return None


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


class Retrieve:
    @staticmethod
    def fetch_user_doc(uid):
        db_instance = FirestoreSingleton().client
        document_ref = db_instance.collection('users').document(uid)

        data = Retrieve._fetch_document_with_subcollections(document_ref)
        return data

    @staticmethod
    def _fetch_document_with_subcollections(document_ref):
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
                subcollection_data.append(Retrieve._fetch_document_with_subcollections(doc.reference))
            data[subcollection.id] = subcollection_data

        return data
    @staticmethod
    def find_subtask(uid, task_id, subtask_id):
        """
        Retrieve a subtask by its ID, given the user ID and task ID.

        :param uid: User ID
        :param task_id: Task ID
        :param subtask_id: Subtask ID
        :return: Subtask data as a dictionary if found, else None
        """

        try:
            db_instance = FirestoreSingleton().client
            subtask_ref = db_instance.collection('users').document(uid).collection('Tasks').document(
                task_id).collection('Subtasks').document(subtask_id)

            subtask_doc = subtask_ref.get()
            if subtask_doc.exists:
                return subtask_doc.to_dict()
            else:
                return None

        except Exception as e:
            print(f"Error querying subtask by ID: {str(e)}")
            return None


