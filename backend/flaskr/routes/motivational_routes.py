# flaskr/routes/motivational_routes.py
from flask import Blueprint, jsonify
import random

# Crear un blueprint para las rutas de mensajes motivacionales
motivational_bp = Blueprint('motivational', __name__)

# Lista de mensajes motivacionales
messages = [
    "¡Sigue adelante, lo estás haciendo genial!",
    "Recuerda: un paso a la vez.",
    "Confía en el proceso, ¡cada esfuerzo cuenta!",
    "Hoy es un gran día para alcanzar tus metas.",
    "La constancia es clave. ¡No te detengas!"
]

# Ruta para obtener un mensaje aleatorio
@motivational_bp.route('/motivational-message', methods=['GET'])
def get_motivational_message():
    message = random.choice(messages)
    return jsonify({"message": message})
