from flask import Blueprint, jsonify
import random

from flaskr.services import MotivationalService

motivational_bp = Blueprint('motivational', __name__)


@motivational_bp.route('/motivational-message', methods=['GET'])
def get_motivational_message():
    motivational_service = MotivationalService()
    result = motivational_service.get_phrase()
    return result
