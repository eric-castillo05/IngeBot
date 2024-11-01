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

@task_bp.route('/tasks/update', methods=['PUT'])
def update_task():
    try:
        data = request.json
        uid = data.get('uid')
        task_id = data.get('task_id')
        title = data.get('title')
        description = data.get('description')
        due_date = data.get('due_date')
        priority = data.get('priority')

        if not uid or not task_id or not title or not description or not due_date or not priority:
            return jsonify({'message': 'Missing required fields'}), 400

        task = Task(title=title, description=description, priority=priority, due_date=due_date)
        task_service = TaskService(task)

        if task_service.update_task(uid, task_id):
            return jsonify({'message': 'Task updated successfully.'}), 200
        else:
            return jsonify({'message': 'Failed to update task.'}), 400

    except Exception as e:
        print(f"Error in update_task: {str(e)}")
        return jsonify({'message': 'An error occurred while updating the task.'}), 500


@task_bp.route('/tasks/delete', methods=['DELETE'])
def delete_task():
    try:
        data = request.json
        uid = data.get('uid')
        task_id = data.get('task_id')

        if not uid or not task_id:
            return jsonify({'message': 'Missing required fields'}), 400

        task_service = TaskService(None)
        if task_service.delete_task(uid, task_id):
            return jsonify({'message': 'Task deleted successfully.'}), 200
        else:
            return jsonify({'message': 'Failed to delete task.'}), 400

    except Exception as e:
        print(f"Error in delete_task: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the task.'}), 500


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

@task_bp.route('/tasks/get', methods=['GET'])
def get_task():
    try:
        data = request.args
        uid = data.get('uid')
        task_id = data.get('task_id')

        task = TaskService.get_task(uid, task_id)
        if task:
            return jsonify(task), 200
        else:
            return jsonify({"message": "Task not found"}), 404

    except Exception as e:
        print(f"Error retrieving task: {str(e)}")
        return jsonify({"message": f"Error retrieving task: {str(e)}"}), 500


@task_bp.route('/subtasks/update', methods=['PUT'])
def update_subtask():
    try:
        data = request.json
        uid = data.get('uid')
        task_id = data.get('task_id')
        subtask_id = data.get('subtask_id')
        title = data.get('title')
        description = data.get('description')

        if not uid or not task_id or not subtask_id or not title or not description:
            return jsonify({'message': 'Missing required fields'}), 400

        subtask = Subtask(title=title, description=description)
        subtask_service = SubtaskService(subtask)

        if subtask_service.update_subtask(uid, task_id, subtask_id):
            return jsonify({'message': 'Subtask updated successfully.'}), 200
        else:
            return jsonify({'message': 'Failed to update subtask.'}), 400

    except Exception as e:
        print(f"Error in update_subtask: {str(e)}")
        return jsonify({'message': 'An error occurred while updating the subtask.'}), 500


@task_bp.route('/subtasks/delete', methods=['DELETE'])
def delete_subtask():
    try:
        data = request.json
        uid = data.get('uid')
        task_id = data.get('task_id')
        subtask_id = data.get('subtask_id')

        if not uid or not task_id or not subtask_id:
            return jsonify({'message': 'Missing required fields'}), 400

        subtask_service = SubtaskService(None)
        if subtask_service.delete_subtask(uid, task_id, subtask_id):
            return jsonify({'message': 'Subtask deleted successfully.'}), 200
        else:
            return jsonify({'message': 'Failed to delete subtask.'}), 400

    except Exception as e:
        print(f"Error in delete_subtask: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the subtask.'}), 500


@task_bp.route('/subtasks/get', methods=['GET'])
def get_subtask():
    try:
        data = request.form
        uid = data.get('uid')
        task_id = data.get('task_id')
        subtask_id = data.get('subtask_id')


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