from .app import app, db, ma, bcrypt
from flask import Flask, request, jsonify, make_response
import uuid
import jwt
import datetime
from functools import wraps
#from models import User, Project, projects_schema, project_schema, user_schema
from .models import *

PREFIX = 'Bearer'

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = None

    if 'Authorization' in request.headers:
      bearer, _ , token = request.headers['Authorization'].partition(' ')
      if bearer != PREFIX:
        return jsonify({'error': 'Token is missing!'}), 401
    
    if not token:
      return jsonify({'error': 'Token is missing!'}), 401

    try:
      data = jwt.decode(token, app.config['SECRET_KEY'])
      current_user = User.query.filter_by(public_id=data['public_id']).first()
    except:
      return jsonify({'error': 'Token is invalid!'}), 401

    return f(current_user, *args, **kwargs)
  
  return decorated
    

@app.route('/register', methods=['POST'])
def register_user():
  data = request.get_json()

  if data['password1'] != data['password2']:
    return jsonify({"error": "passwords do not match!"}), 400
  
  pw_hash = bcrypt.generate_password_hash(data['password1'])

  new_user = User(public_id = str(uuid.uuid4()), username=data['username'], email=data['email'], password=pw_hash, admin=False)
  db.session.add(new_user)
  db.session.commit()
  
  # add default project to user.
  default_project = Project(name="Default", user_id=new_user.id)
  db.session.add(default_project)
  db.session.commit()

  return jsonify({"message": "Registration complete!"})

@app.route('/login', methods=['POST'])
def login():
  auth = request.authorization
  print(request.data)
  print(auth)
  if not auth or not auth.username or not auth.password:
    return make_response('Could not verify!', 401, {"WWW-Authenticate": "Basic realm='Login Required!' "})
  
  print(Project.query.all())
  user = User.query.filter_by(username=auth.username).first()

  if not user:
    return make_response('Could not verify!', 401, {"WWW-Authenticate": "Basic realm='Login Required!' "})
  
  if bcrypt.check_password_hash(user.password, auth.password):
    token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])

    return jsonify({'token': token.decode('UTF-8')})
  
  return make_response('Could not verify!', 401, {"WWW-Authenticate": "Basic realm='Login Required!' "})

@app.route('/project', methods=['POST'])
@token_required
def add_project(current_user):
  name = request.json['name']
  user_id = current_user.id
  project = Project(name=name, user_id=user_id)
  db.session.add(project)
  db.session.commit()

  return project_schema.jsonify(project)

@app.route('/project', methods=['GET'])
@token_required
def get_projects(current_user):
  all_projects = Project.query.all()
  result = projects_schema.dump(all_projects)
  return jsonify(result)

@app.route('/project/<id>', methods=['GET'])
@token_required
def get_project(current_user, id):
  project = Project.query.get(id)
  return project_schema.jsonify(project)

@app.route('/project/<id>', methods=['DELETE'])
@token_required
def delete_project(current_user, id):
  project = Project.query.get(id)
  db.session.delete(project)
  db.session.commit()
  return project_schema.jsonify(project)

