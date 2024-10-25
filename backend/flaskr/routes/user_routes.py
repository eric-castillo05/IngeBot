from flask import Blueprint, request, jsonify

from flaskr.models import User
from flaskr.services.singletons.FirestoreSingleton import FirestoreSingleton
from flaskr.services.user_service import UserService

user_bp = Blueprint('user', __name__)

@user_bp.route('/users/register', methods=['GET', 'POST'])
def create_user():
    data = request.get_json()
    user = User(
        first_name=data['first_name'],
        middle_name=data['middle_name'],
        last_name=data['last_name'],
        control_number=data['control_number'],
        email=data['email'],
        password=data['password']
    )

    user_service = UserService(user)
    result = user_service.create_user()
    if result:
        return jsonify({'message': 'User created successfully.'}), 201
    return jsonify({'message': 'User could not be created.'}), 400