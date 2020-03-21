from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import uuid

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db2.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = "mysecret"

# Init DB
db = SQLAlchemy(app)

# Init Marsh
ma = Marshmallow(app)

# Init BCrypt
bcrypt = Bcrypt(app)

CORS(app)

from views import *

# Run server
if __name__ == '__main__':
  app.run(debug=True)

