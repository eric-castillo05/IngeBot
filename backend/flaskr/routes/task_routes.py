from flask import Blueprint, request, jsonify
from flaskr.models import Task, Subtask
from flaskr.services.task_service import TaskService
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



# This returns its data but does not return the "subtasks" subcollection
@task_bp.route('/tasks/get', methods=['GET'])
def get_task_data():
    try:
        data = request.form
        uid = data.get('uid')
        task_id = data.get('task_id')

        task = TaskService.get_task_data(uid=uid, task_id=task_id)
        if task:
            return jsonify(task), 200
        else:
            return jsonify({"message": "Task not found"}), 404

    except Exception as e:
        print(f"Error retrieving task: {str(e)}")
        return jsonify({"message": f"Error retrieving task: {str(e)}"}), 500


@task_bp.route('/tasks/<uid>/get_all', methods=['GET'])
def get_all_tasks(uid):
    t = TaskService(None)
    try:
        tasks = t.fetch_tasks(uid=uid)
        if tasks:
            return jsonify(tasks), 200
        else:
            return jsonify({"message": "Tasks not found"}), 404
    except Exception as e:
        print(f"Error retrieving tasks: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500




@task_bp.route('/tasks/<uid>/<task_id>/get', methods=['GET'])
def get_task_with_subtasks(uid, task_id):
    t = TaskService(None)  # Initialize your TaskService
    try:
        task_with_subtasks = t.fetch_task_with_subtasks(uid=uid, task_id=task_id)
        if task_with_subtasks:
            return jsonify(task_with_subtasks), 200
        else:
            return jsonify({"message": "Task not found"}), 404

    except Exception as e:
        print(f"Error retrieving task and subtasks: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500




