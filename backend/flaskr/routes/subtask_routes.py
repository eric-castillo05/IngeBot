from flask import Blueprint, request, jsonify

from flaskr.models import Subtask
from flaskr.services.subtask_service import SubtaskService

subtask_bp = Blueprint('subtask', __name__)
@subtask_bp.route('/subtasks/create', methods=['POST'])
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


@subtask_bp.route('/subtasks/update', methods=['PUT'])
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


@subtask_bp.route('/subtasks/delete', methods=['DELETE'])
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



@subtask_bp.route('/subtasks/get', methods=['GET'])
def get_subtask():
    try:
        data = request.json
        uid = data.get('uid')
        task_id = data.get('task_id')
        subtask_id = data.get('subtask_id')

        if not uid or not task_id or not subtask_id:
            return jsonify({'message': 'Missing required fields'}), 400

        st = SubtaskService(None)
        #subtask = Retrieve.find_subtask(uid=uid, task_id=task_id, subtask_id=subtask_id)
        subtask = st.get_subtask(uid=uid, task_id=task_id, subtask_id=subtask_id)

        # Return the result
        if subtask:
            return jsonify(subtask), 200
        else:
            return jsonify({"message": "Subtask not found"}), 404

    except Exception as e:
        print(f"Error retrieving subtask: {str(e)}")
        return jsonify({"message": f"Error retrieving subtask: {str(e)}"}), 500


@subtask_bp.route('/subtasks/<uid>/<task_id>/get_all', methods=['GET'])
def get_all_subtasks(uid, task_id):
    st = SubtaskService(None)
    try:
        subtasks = st.fetch_subtasks(task_id=task_id, uid=uid)
        if subtasks:
            return jsonify(subtasks), 200
        else:
            return jsonify({"message": "Subtasks not found"}), 404

    except Exception as e:
        print(f"Error retrieving subtasks: {str(e)}")

