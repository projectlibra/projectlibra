from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
import os
import uuid

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# DB
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db2.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:1@localhost:5432/libra'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = "mysecret"

# Init DB
db = SQLAlchemy(app)

# Init Marsh
ma = Marshmallow(app)

# Init BCrypt
bcrypt = Bcrypt(app)

# Init Migrate
migrate = Migrate(app, db)

CORS(app, expose_headers='Authorization')

from .views import *

# Run server
if __name__ == '__main__':
  app.run(debug=True)
  # app.secret_key = os.urandom(24)
  # app.run(debug=True,host="0.0.0.0",use_reloader=False)

