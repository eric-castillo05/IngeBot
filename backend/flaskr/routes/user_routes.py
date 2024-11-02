from flask import Blueprint, request, jsonify
from flaskr.models import User
from flaskr.services.user_service import UserService
from firebase_admin import auth

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