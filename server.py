from waitress import serve
from flask import Flask, jsonify, request

app = Flask(__name__)
#app.config['DEBUG'] = True

# Home route
@app.route('/')
def home():
    return "Welcome to the Flask Server!"

# Example API route
@app.route('/api/greet', methods=['GET'])
def greet():
    name = request.args.get('name', 'Guest')
    return jsonify({"message": f"Hello, {name}!"})

# Example POST route
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    return jsonify({"received_data": data}), 201

if __name__ == '__main__':
 #   serve(app, host='0.0.0.0', port=8080)
    app.run(debug=True)
