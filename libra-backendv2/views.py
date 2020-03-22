from .app import app, db, ma, bcrypt, basedir
from flask import Flask, request, jsonify, make_response
from werkzeug.utils import secure_filename
import uuid
import jwt
import datetime
from functools import wraps
#from models import User, Project, projects_schema, project_schema, user_schema
from .models import *
import os

PREFIX = 'Bearer'

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = None

    print(request.headers)
    print(request)
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
  pw_hash = pw_hash.decode('utf-8')
  new_user = User(public_id = str(uuid.uuid4()), username=data['username'], email=data['email'], password=pw_hash, admin=False)
  db.session.add(new_user)
  db.session.commit()
  
  # add default project to user.
  default_project = Project(name="Default", desc="Default project for quick operations.", user_id=new_user.id)
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
  desc = request.json['desc']
  user_id = current_user.id
  project = Project(name=name, desc=desc, user_id=user_id)
  db.session.add(project)
  db.session.commit()

  return project_schema.jsonify(project)

@app.route('/project', methods=['GET'])
@token_required
def get_projects(current_user):
  all_projects = Project.query.filter_by(user_id=current_user.id)
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


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']

    print(file.filename)
    print("HEre: ", os.path.join(basedir, secure_filename(file.filename)))
    print(basedir)
    print(request.form)
    save_path = os.path.join(basedir, secure_filename(file.filename))
    current_chunk = int(request.form['dzchunkindex'])
    print(save_path)

    # If the file already exists it's ok if we are appending to it,
    # but not if it's new file that would overwrite the existing one
    if os.path.exists(save_path) and current_chunk == 0:
        # 400 and 500s will tell dropzone that an error occurred and show an error
        return make_response(('File already exists', 400))

    try:
        with open(save_path, 'ab') as f:
            f.seek(int(request.form['dzchunkbyteoffset']))
            f.write(file.stream.read())
    except OSError:
        # log.exception will include the traceback so we can see what's wrong 
        log.exception('Could not write to file')
        return make_response(("Not sure why,"
                              " but we couldn't write the file to disk", 500))

    total_chunks = int(request.form['dztotalchunkcount'])

    if current_chunk + 1 == total_chunks:
        # This was the last chunk, the file should be complete and the size we expect
        if os.path.getsize(save_path) != int(request.form['dztotalfilesize']):
            log.error(f"File {file.filename} was completed, "
                      f"but has a size mismatch."
                      f"Was {os.path.getsize(save_path)} but we"
                      f" expected {request.form['dztotalfilesize']} ")
            return make_response(('Size mismatch', 500))
        else:
            log.info(f'File {file.filename} has been uploaded successfully')
    else:
        log.debug(f'Chunk {current_chunk + 1} of {total_chunks} '
                  f'for file {file.filename} complete')

    return make_response(("Chunk upload successful", 200))