from flaskr.models import Task
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
                'progress': self.task.progress,
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
    def get_task_data(uid, task_id):

        try:
            db_instance = FirestoreSingleton().client
            task_ref = db_instance.collection('users').document(uid).collection('Tasks').document(task_id)
            task_doc = task_ref.get()
            return task_doc.to_dict() if task_doc.exists else None
        except Exception as e:
            print(f'Error retrieving task: {str(e)}')
            return None


    @staticmethod
    def fetch_tasks(uid):
        """
        Fetch all subtasks for a given user and task, and return the data as a dictionary.
        """
        tasks_data = []
        # db instance
        db_instance = FirestoreSingleton().client
        # Reference to the subtasks collection
        tasks_ref = db_instance.collection("users").document(uid).collection("Tasks")

        # Stream through all subtasks
        tasks = tasks_ref.stream()

        for task in tasks:
            # Append each task's data to the list
            tasks_data.append({

                "data": task.to_dict()
            })

        return tasks_data

    @staticmethod
    def fetch_task_with_subtasks( uid, task_id):
        """
        Fetch a specific task and all its subtasks for a given user and return the data as a dictionary.
        """
        db_instance = FirestoreSingleton().client
        task_data = {}
        # Reference to the task document
        task_ref = db_instance.collection("users").document(uid).collection("Tasks").document(task_id)
        task = task_ref.get()

        if task.exists:
            task_data = task.to_dict()  # Get task data
            # Reference to the subtasks collection within the specific task
            subtasks_ref = task_ref.collection("Subtasks")
            subtasks = subtasks_ref.stream()

            # Include all subtasks
            subtasks_data = [subtask.to_dict() for subtask in subtasks]
            task_data["subtasks"] = subtasks_data
        else:
            task_data = None

        return task_data

