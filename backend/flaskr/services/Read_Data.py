import json

from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton


class Read_Data:


    def fetch_subcollections(document_ref):
        """
        Recursively fetch subcollections for a given Firestore document reference.
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
            # Recursively call this function for each subcollection
            subcollection_data = []
            for doc in subcollection.stream():
                subcollection_data.append(Read_Data.fetch_subcollections(doc.reference))
            data[subcollection.id] = subcollection_data

        return data

    def print_user_info(user_id):
        db_instance = FirestoreSingleton.get_instance()
        db = db_instance.db  # Access the Firestore client
        """
        Fetch all user information from Firestore, including subcollections, and print it to the screen.
        """
        # Reference to the user's document
        user_ref = db.collection("Users").document(user_id)

        # Fetch user document and its subcollections
        user_data = Read_Data.fetch_subcollections(user_ref)

        # Print the result as a formatted JSON string
        print(json.dumps(user_data, indent=4))

    import json

    def fetch_subtasks(user_id, task_name):
        """
        Fetch all subtasks for a given user and task, and return the data as a dictionary.
        """
        db_instance = FirestoreSingleton.get_instance()
        db = db_instance.db  # Access the Firestore client
        subtasks_data = []

        # Reference to the subtasks collection
        subtasks_ref = db.collection("Users").document(user_id).collection("Tasks").document(task_name).collection(
            "Subtasks")

        # Stream through all subtasks
        subtasks1 = subtasks_ref.stream()

        for subtask in subtasks1:
            # Append each subtask's data to the list
            subtasks_data.append({

                "data": subtask.to_dict()
            })

        return subtasks_data

    def print_subtasks_in_json(user_id, task_name):
        """
        Fetch all subtasks for a user and task, and print them in JSON format.
        """
        # Fetch the subtasks
        subtasks = Read_Data.fetch_subtasks(user_id, task_name)

        # Print the subtasks in a formatted JSON string
        print(f'Subtasks for task "{task_name}" under the Uid: {user_id}')
        print(json.dumps(subtasks, indent=4))




