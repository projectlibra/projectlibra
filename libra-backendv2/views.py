from .app import app, db, ma, bcrypt
from flask import Flask, request, jsonify, make_response, flash, redirect, url_for, session
import uuid
import jwt
import datetime
from functools import wraps
#from models import User, Project, projects_schema, project_schema, user_schema
from .models import *
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import os
import json
import vcf

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
@token_required
def fileUpload(current_user):
    #save file to file system
    target=os.path.join(app.config['UPLOAD_FOLDER'],'test_vcfs')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)

    #parse vcf using pyvcf and upload to database
    vcf_reader = vcf.Reader(open('./test_vcfs/' + filename, 'r'))
    user_id = current_user.id
    project_id = int(request.form['project_id'])
    for record in vcf_reader:
        # print (record)
        for sample in record.samples:
            # print (sample)
            new_vcf = VCFs(filename=filename, project_id=project_id, user_id=user_id, chrom=int(record.CHROM),
              pos=record.POS, variant_id=record.ID, ref=record.REF, alt=str(record.ALT), qual=record.QUAL,
              filter=str(record.FILTER), info=str(record.INFO), sample = str(sample))
            db.session.add(new_vcf)
            db.session.commit()

    response="Whatever you wish to return"
    return response
