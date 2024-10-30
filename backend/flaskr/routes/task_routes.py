from flask import Blueprint, request, jsonify
from flaskr.models import Task, Subtask
from flaskr.services.task_service import TaskService, SubtaskService, Retrieve
from flaskr.utils import CurrentTimestamp

task_bp = Blueprint('task', __name__)


@task_bp.route('/tasks/create', methods=['POST'])
def create_task():
    try:
        data = request.json
        if not data:
            return jsonify({'message': 'No JSON data provided'}), 400

        title = data.get('title')
        description = data.get('description')
        due_date = data.get('due_date')
        priority = data.get('priority')
        uid = data.get('uid')

        # Validate required fields
        if not title or not description or not due_date or not priority or not uid:
            return jsonify({'message': 'Missing required fields'}), 400


        # Create Task object
        task = Task(title=title, description=description, priority=priority, due_date=due_date)
        task_service = TaskService(task)

        # Save task
        if task_service.create_task(uid):
            return jsonify({'message': 'Task created successfully.'}), 201
        else:
            return jsonify({'message': 'Failed to create task.'}), 400

    except Exception as e:
        print(f"Error in create_task: {str(e)}")
        return jsonify({'message': 'An error occurred creating the task.'}), 500


@task_bp.route('/tasks/create_subtask', methods=['POST'])
def create_subtask():
    try:
        # Check for JSON data
        if not request.json:
            return jsonify({'message': 'No JSON data provided'}), 400

        data = request.json

        # Validate required fields
        required_fields = ['title', 'description', 'uid', 'task_id']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({'message': 'Missing required fields', 'missing_fields': missing_fields}), 400

        # Create Subtask object
        subtask = Subtask(
            title=data['title'],
            description=data['description']
        )

        # Initialize SubtaskService
        subtask_service = SubtaskService(subtask)

        # Use SubtaskService to create subtask in Firestore
        if subtask_service.create_subtask(data['uid'], data['task_id']):  # Pass uid and task_id
            return jsonify({'message': 'Subtask created successfully.'}), 201
        else:
            return jsonify({'message': 'Subtask could not be created.'}), 400

    except Exception as e:
        print(f"Error in create_subtask: {str(e)}")
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500





@task_bp.route('/subtasks/get', methods=['GET'])
def get_subtask():
    try:
        data = request.form
        uid = data.get('uid')
        task_id = data.get('task_id')
        subtask_id = data.get('subtask_id')

        #uid = "Yd1O5nPJWOTSFAEfB8dJ7hQzyP22"
        #task_id ="rC1CKCNYcjSl9RvZgfZP"
        #subtask_id ="M6nkwrZ3YhmwZjYGaREA"
        subtask = Retrieve.find_subtask(uid=uid, task_id=task_id, subtask_id=subtask_id)

        # Return the result
        if subtask:
            return jsonify(subtask), 200
        else:
            return jsonify({"message": "Subtask not found"}), 404

    except Exception as e:
        print(f"Error retrieving subtask: {str(e)}")
        return jsonify({"message": f"Error retrieving subtask: {str(e)}"}), 500

@task_bp.route('/user/fetch', methods=['GET'])
def get_user():
    try:
        data = request.form
        uid = data.get('uid')

        user_doc = Retrieve.fetch_user_doc(uid=uid)
        if user_doc:
            return jsonify(user_doc), 200
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        print(f"Error retrieving user: {str(e)}")
        return jsonify({"message": f"Error retrieving User info: {str(e)}"}), 500