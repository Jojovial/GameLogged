from flask import jsonify

def generate_error_response(message, status_code):
    return jsonify({'error': message}), status_code

def generate_success_response(data):
    return jsonify(data), 200
