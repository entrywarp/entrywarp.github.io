from flask import Flask, render_template, request
from api import api

app = Flask("EntryWarp")

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api", methods=["POST"])
def post():
    data = request.data.decode()
    print(data)
    code = api(data)
    return code
