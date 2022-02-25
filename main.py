from start_server import app
from error import InvalidUsage
from flask import jsonify

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

app.run('0.0.0.0', 8080)