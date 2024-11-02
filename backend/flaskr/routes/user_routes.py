
from flask import Blueprint, request, jsonify
from flaskr.models import User

from flaskr.services.user_service import UserService


user_bp = Blueprint('user', __name__)

@user_bp.route('/users/register', methods=['POST'])
def create_user():
    try:
        if not request.form:
            return jsonify({'message': 'No form data provided'}), 400

        if 'image' not in request.files:
            return jsonify({'message': 'No image file provided'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'message': 'No selected image file'}), 400

        data = request.form
        user = User(
            first_name=data.get('first_name'),
            middle_name=data.get('middle_name'),
            last_name=data.get('last_name'),
            control_number=data.get('control_number'),
            email=data.get('email'),
            password=data.get('password'),
            image_path=None
        )

        required_fields = ['first_name', 'middle_name', 'last_name', 'control_number', 'password']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'message': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400

        user_service = UserService(user)
        result = user_service.create_user(image_file)

        if result:
            return jsonify({'message': 'User created successfully.'}), 201
        return jsonify({'message': 'User could not be created.'}), 400

    except Exception as e:
        print(f"Error in create_user: {str(e)}")
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500


@user_bp.route('/users/<uid>', methods=['DELETE'])
def delete_user(uid):
    try:
        user_service = UserService(None)
        success, message = user_service.delete_user(uid)

        if success:
            return jsonify({'message': message}), 200
        return jsonify({'message': message}), 404

    except Exception as e:
        return jsonify({'message': f'Error eliminando usuario: {str(e)}'}), 500


@user_bp.route('/users/<uid>', methods=['PUT'])
def update_user(uid):
    try:
        if not request.form and 'image' not in request.files:
            return jsonify({'message': 'No data provided for update'}), 400

        # Gather fields to update
        update_data = {}
        allowed_fields = ['email', 'first_name', 'middle_name', 'last_name',
                          'control_number', 'password', 'display_name']

        for field in allowed_fields:
            if field in request.form:
                update_data[field] = request.form[field]

        image_file = request.files.get('image')

        if not update_data and not image_file:
            return jsonify({'message': 'No valid fields provided for update'}), 400

        user_service = UserService(None)
        success, message = user_service.update_user(uid, update_data, image_file)

        if success:
            return jsonify({'message': message}), 200
        return jsonify({'message': message}), 400

    except Exception as e:
        print(f"Error in update_user: {str(e)}")
        return jsonify({'message': f'Error updating user: {str(e)}'}), 500





# -------------------GET METHODS -------------------
#The route '/users/<uid> ONLY returns user's personal information in a json format
@user_bp.route('/users/<uid>', methods=['GET'])
def get_user_personal_data(uid):
    try:
        user_service = UserService(None)
        user_data, message = user_service.get_user(uid)

        if user_data:
            return jsonify({
                'message': message,
                'user': user_data
            }), 200
        return jsonify({'message': message}), 404

    except Exception as e:
        return jsonify({'message': f'Error obteniendo usuario: {str(e)}'}), 500

"""
This route '/users/<uid>/doc' will return a json that contains users's personal information, as well as
the information within its subcollections Tasks/Subtasks
"""
@user_bp.route('/users/<uid>/doc', methods=['GET'])
def get_user_doc(uid):
    try:
        user_service = UserService(None)
        user_doc = user_service.get_user_doc(uid=uid)
        if user_doc:
            return jsonify(user_doc), 200
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        print(f"Error retrieving user: {str(e)}")
        return jsonify({"message": f"Error retrieving User info: {str(e)}"}), 500