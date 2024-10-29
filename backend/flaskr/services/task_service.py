from flaskr.services.singletons.Firestore_Singleton import FirestoreSingleton

from flaskr.utils import CurrentTimestamp


class TasksService:
    @staticmethod
    def createTask(title, description, due_date, priority, uid):
        try:
            # Get Firestore instance
            db_instance = FirestoreSingleton.get_instance()
            db = db_instance.db  # Access the Firestore client
            taskData = {
                'title': title,
                'description': description,
                'createdAt': CurrentTimestamp.get_current_timestamp(),
                'due_date': due_date,
                'priority': priority,
            }
            user_ref = db.collection('Users').document(uid)
            new_task_ref = user_ref.collection('Tasks').document(title)
            # Set the task data in Firestore
            new_task_ref.set(taskData)
        except Exception as e:
            print(e)
    @staticmethod
    def createSubtask(taskTitle, subtaskTitle, description, uid):
        # Get Firestore instance
        db_instance = FirestoreSingleton.get_instance()
        db = db_instance.db  # Access the Firestore client
        userUID = uid
        subaskData = {
            'subtaskTitle': subtaskTitle,
            'description': description,
            'createdAt': Tasks_Service.getCurrentTimestamp(),  # Use Firestore's server timestamp
        }
        task_ref = db.collection('Users').document(userUID).collection('Tasks')
        task_ref.document(taskTitle).collection('Subtasks').document(subtaskTitle).set(subaskData)
    @staticmethod
    def getCurrentTimestamp():
        from datetime import datetime
        current_timestamp = datetime.now()
        formatted_timestamp = current_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return formatted_timestamp
