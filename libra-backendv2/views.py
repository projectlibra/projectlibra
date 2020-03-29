from .app import app, db, ma, bcrypt, basedir
from flask import Flask, request, jsonify, make_response, flash, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import uuid
import jwt
import datetime
from functools import wraps
#from models import User, Project, projects_schema, project_schema, user_schema
from .models import *
from flask_cors import cross_origin
from sqlalchemy.orm import load_only
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

#
@app.route('/vcf_upload', methods=['POST'])
@token_required
def fileUpload(current_user):
    #save file to file system
    project_id = int(request.form['project_id'])
    #target=os.path.join(app.config['UPLOAD_FOLDER'],'test_vcfs')
    dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(current_user.id), str(project_id))
    #if not os.path.isdir(target):
    #    os.mkdir(target)
    os.makedirs(dir_path, exist_ok=True)
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join(dir_path, filename)
    file.save(file_path)

    # save file to db
    file_db = File(name=file.filename, path=file_path, project_id=project_id)
    db.session.add(file_db)
    db.session.commit()

    #parse vcf using pyvcf and upload to database
    vcf_reader = vcf.Reader(open(file_path, 'r'))
    user_id = current_user.id
    
    for record in vcf_reader:
        # print (record)
         new_vcf = VCFs(filename=filename, project_id=project_id, user_id=user_id, chrom=str(record.CHROM),
              pos=record.POS, variant_id=record.ID, ref=record.REF, alt=str(record.ALT), qual=record.QUAL,
              filter=str(record.FILTER), info=str(record.INFO))
             db.session.add(new_vcf)
             db.session.commit()
        for sample in record.samples:
            # print (sample)
            # sample_data = str(sample.data)[9:-1] because pyvcf has "CallData()" wrapping it
            # new_vcf = VCFs(filename=filename, project_id=project_id, user_id=user_id, chrom=str(record.CHROM),
            #  pos=record.POS, variant_id=record.ID, ref=record.REF, alt=str(record.ALT), qual=record.QUAL,
            #  filter=str(record.FILTER), info=str(record.INFO), sample_id = str(sample.sample),
            #  sample_data = str(sample.data)[9:-1])
            # db.session.add(new_vcf)
            # db.session.commit()
            new_sample = Sample(sample_id = str(sample.sample), vcf_id = (new_vcf.vcf_id), sample_data = str(sample.data)[9:-1])
            db.session.add(new_sample)
            db.session.commit()

    return make_response('File Upload Successful!', 200)

@app.route('/upload/<id>', methods=['POST'])
@token_required
def upload(current_user, id):
    """print("HERE")
    print(request)
    print(request.headers)
    data = request.form.get('file')
    print(data)
    print(request.form)
    print(request.data)
    print(request.files)"""
    f = request.files['file']
    dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(current_user.id), str(id))
    os.makedirs(dir_path, exist_ok=True)
    f_path = os.path.join(dir_path, secure_filename(f.filename)) 
    f.save(f_path)
    file_db = File(name=f.filename, path=f_path, project_id=id)
    db.session.add(file_db)
    db.session.commit()
    
    return make_response('File Upload Successful!', 200)

@app.route('/files/<id>', methods=['GET'])
@token_required
def get_files(current_user, id):
  files = File.query.filter_by(id=id)
  
  return files_schema.jsonify(files) 

#
@app.route('/vcf_table/<id>', methods=['GET'])
@token_required
def get_vcf_table(current_user, id):
  columns = [column.key for column in VCFs.__table__.columns]
  print(columns)
  result = VCFs.query.filter_by(user_id=current_user.id, project_id=id).options(load_only(*columns[4:])).all()
  table_data = []
  for vcf in result:
    row_data = []
    for col in columns[4:]:
      row_data.append(vcf.__dict__[col])
    table_data.append(row_data)

  print(table_data)
    

  print(columns[4:])

  resp = {
    'columns': columns[4:],
    'table_data': table_data
  }

  return resp, 200


@app.route('/createPatientProfile', methods=['POST'])
@token_required
def create_patient(current_user):
  firstname = request.json['firstname']
  surname= request.json['surname']
  user_id = current_user.id
  hpo_tag_ids = request.json['hpo_tag_ids']
  hpo_tag_names = request.json['hpo_tag_names']
  hpo_tag_names_str = ""+str(hpo_tag_names[0])
  hpo_tag_ids_str = ""+str(hpo_tag_ids[0])
  for i in range(1,len(hpo_tag_ids)):
    hpo_tag_names_str = hpo_tag_names_str +", " + str(hpo_tag_names[i])
    hpo_tag_ids_str = hpo_tag_ids_str +", " + str(hpo_tag_ids[i])
 
  patient = Patient(firstname=firstname, surname=surname, user_id=user_id,  hpo_tag_names=hpo_tag_names_str, hpo_tag_ids=hpo_tag_ids_str, resolve_state=False)
  db.session.add(patient)
  db.session.commit()

  for i in range(len(hpo_tag_ids)):
    hpo_tag = HPOTag(hpo_tag_id=hpo_tag_ids[i], hpo_tag_name=hpo_tag_names[i], patient_id=patient.id, resolve_state=False)
    db.session.add(hpo_tag)
    db.session.commit()
  
  return patient_schema.jsonify(patient)

@app.route('/patientprofile', methods=['GET'])
@token_required
def get_patients(current_user):
  all_patients = Patient.query.filter_by(user_id=current_user.id)
  result = patients_schema.dump(all_patients)
  return jsonify(result)
