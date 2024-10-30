from tkinter.constants import SEL_FIRST

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


class Retrieve:
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


