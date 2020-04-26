from .app import app, db, ma, bcrypt, basedir, db_engine, hpo
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
from sqlalchemy import select
from sqlalchemy.sql import and_, or_, not_
import os
import json
import vcf
import fastsemsim

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
    print(request.files)
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join(dir_path, filename)
    file.save(file_path)

    # save file to db
    file_db = File(name=file.filename, path=file_path, project_id=project_id)
    db.session.add(file_db)
    db.session.commit()

    #parse vcf using pyvcf and upload to database
    #vcf_reader = vcf.Reader(open(file_path, 'r'))
    vcf_reader = vcf.Reader(filename=file_path)
    user_id = current_user.id
    print("FILE OPEN")
    cnt= 0
    for record in vcf_reader:
        # print (record)
      cnt+=1
      print(cnt)
      new_vcf = VCFs(filename=filename, project_id=project_id, user_id=user_id, chrom=str(record.CHROM),
              pos=record.POS, variant_id=record.ID, ref=str(record.REF)[:20], alt=str(record.ALT)[:20], qual=record.QUAL,
              filter=str(record.FILTER), info=str(record.INFO))
      db.session.add(new_vcf)
      
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
  columns2 = [column.key for column in Sample.__table__.columns]
  columns = columns + list(set(columns2) - set(columns))
  #for column in VCFs.__table__.columns
    #if column.key not in columns
    #  columns.append(column.key)
  print(columns)
  
  #result = VCFs.query.filter_by(user_id=current_user.id, project_id=id).options(load_only(*columns[4:])).all()
  #result = db.session.query(VCFs, Sample).outerjoin(Sample, VCFs.vcf_id == Sample.vcf_id).all()
  #result = db.session.query(VCFs, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, VCFs.vcf_id == Sample.vcf_id).all()
  result = db.session.query(VCFs, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, VCFs.vcf_id == Sample.vcf_id).all()
  #print(result)
  print(len(result))
  '''table_data = []
  for vcf in result:
    row_data = []
    for col in columns[4:]:
      row_data.append(vcf.__dict__[col])
    table_data.append(row_data)'''

  table_data = []
  cnt_dbsnp = 0
  cnt_all = 0
  cnt_1k = 0
  for vcf in result:
    row_data = []
    row_data.append(vcf[0].chrom)
    row_data.append(vcf[0].pos)
    cnt_all+=1
    if vcf[0].variant_id is None:
      row_data.append(vcf[0].variant_id)
    else:
      cnt_dbsnp +=1
      row_data.append('<a href="https://www.ncbi.nlm.nih.gov/snp/' + vcf[0].variant_id + '" target="_blank">' + vcf[0].variant_id +  '</a>')
    row_data.append(vcf[0].ref)
    row_data.append(vcf[0].alt)
    row_data.append(vcf[0].qual)
    row_data.append(vcf[0].filter)
    if "VT" in vcf[0].info:
      cnt_1k+=1
    row_data.append(vcf[0].info)
    #row_data.append(vcf[1].sample_id)
    #row_data.append(vcf[1].sample_data)
    table_data.append(row_data)

  #print(table_data)
  print(len(table_data))
    

  print("Columns:", columns[4:len(columns)-2])

  resp = {
    'columns': columns[4:len(columns)-2],
    'table_data': table_data,
    'pie_data' : [['db', 'count'], ['dbSNP', cnt_dbsnp], ['Novel', cnt_all - cnt_dbsnp]],
    'pie1k_data' : [['db', 'count'], ['1KG', cnt_1k], ['Novel', cnt_all - cnt_1k]] 
  }

  return resp, 200


@app.route('/createPatientProfile', methods=['POST'])
@token_required
def create_patient(current_user):
  name = request.json['name']
  diagnosis = request.json['diagnosis']
  patient_contact = current_user.email
  user_id = current_user.id
  hpo_tag_ids = request.json['hpo_tag_ids']
  hpo_tag_names = request.json['hpo_tag_names']
  hpo_tag_names_str = ""
  hpo_tag_ids_str = ""
  for i in range(len(hpo_tag_ids)):
    hpo_tag_names_str = hpo_tag_names_str + str(hpo_tag_names[i])
    hpo_tag_ids_str = hpo_tag_ids_str + str(hpo_tag_ids[i])
    if i != len(hpo_tag_ids)-1:
      hpo_tag_names_str = hpo_tag_names_str +", "
      hpo_tag_ids_str = hpo_tag_ids_str +", " 
 
  patient = Patient(name=name, diagnosis=diagnosis, patient_contact=patient_contact,
                    user_id=user_id, hpo_tag_names=hpo_tag_names_str, hpo_tag_ids=hpo_tag_ids_str, go_tag_ids="", resolve_state=False)

  db.session.add(patient)
  db.session.commit()

  for i in range(len(hpo_tag_ids)):
    hpo_tag = HPOTag(hpo_tag_id=hpo_tag_ids[i], hpo_tag_name=hpo_tag_names[i], patient_id=patient.id, resolve_state=False)
    db.session.add(hpo_tag)
    db.session.commit()
  
  return patient_schema.jsonify(patient)

@app.route('/editPatientProfile/<patient_id>', methods=['POST'])
@token_required
def edit_patient(current_user, patient_id):
  db.session.query(HPOTag).filter(HPOTag.patient_id == patient_id).delete()
  db.session.commit()

  name = request.json['name']
  diagnosis = request.json['diagnosis']
  patient_contact = current_user.email
  user_id = current_user.id
  hpo_tag_ids = request.json['hpo_tag_ids']
  hpo_tag_names = request.json['hpo_tag_names']
  hpo_tag_names_str = ""
  hpo_tag_ids_str = ""
  for i in range(len(hpo_tag_ids)):
    hpo_tag_names_str = hpo_tag_names_str + str(hpo_tag_names[i])
    hpo_tag_ids_str = hpo_tag_ids_str + str(hpo_tag_ids[i])
    if i != len(hpo_tag_ids)-1:
      hpo_tag_names_str = hpo_tag_names_str +", "
      hpo_tag_ids_str = hpo_tag_ids_str +", " 
 
  db.session.query(Patient).filter(Patient.id == patient_id).\
                            update({"name":name, 
                                    "diagnosis":diagnosis, 
                                    "patient_contact":patient_contact,
                                    "user_id":user_id, 
                                    "hpo_tag_names":hpo_tag_names_str, 
                                    "hpo_tag_ids":hpo_tag_ids_str})
  
  for i in range(len(hpo_tag_ids)):
    hpo_tag = HPOTag(hpo_tag_id=hpo_tag_ids[i], hpo_tag_name=hpo_tag_names[i], patient_id=patient_id, resolve_state=False)
    db.session.add(hpo_tag)
    
  db.session.commit()
  patient = Patient.query.filter_by(id=patient_id).first()
  return patient_schema.jsonify(patient)

@app.route('/patientprofile', methods=['GET'])
@token_required
def get_patients(current_user):
  all_patients = Patient.query.filter_by(user_id=current_user.id)
  result = patients_schema.dump(all_patients)
  return jsonify(result)

@app.route('/patientprofile/<patient_id>', methods=['GET'])
@token_required
def get_patient_by_id(current_user, patient_id):
  patient = Patient.query.filter_by(id=patient_id).first()
  result = patient_schema.dump(patient)
  return jsonify(result)

@app.route('/gethpotags/<patient_id>', methods=['GET'])
@token_required
def get_hpo_tags(current_user, patient_id):
  hpo_tags = HPOTag.query.filter(HPOTag.patient_id == patient_id)
  result = HPOs_schema.dump(hpo_tags)
  return jsonify(result)

@app.route('/matchmakerresults/<cur_hpo_id>', methods=['GET'])
@token_required
def get_matchmaker_results(current_user, cur_hpo_id):
  matched_patitents = Patient.query.join(HPOTag)\
                                  .add_columns(Patient.id, Patient.patient_contact, Patient.diagnosis, Patient.hpo_tag_names)\
                                  .filter(HPOTag.hpo_tag_id == cur_hpo_id)
  result = patients_schema.dump(matched_patitents)
  return jsonify(result)

def query_db(query, args=(), one=False):
    cur = db.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/matchmakerhpo/<patient_id>', methods=['GET'])
@token_required
def get_matchmaker_hpo(current_user, patient_id):
  patient_file = open('./metricFiles/patient'+str(current_user.id), 'w')
  for patient in db_engine.execute('select id, hpo_tag_ids from patient where hpo_tag_ids is not null'):
    patient_to_write = str(patient)
    print(patient_to_write)
    patient_to_write = (patient_to_write[1:len(patient_to_write)-1]).replace('\'', '').replace('\'', '')
    patient_file.write(patient_to_write+'\n')
  patient_file.close()
  ac_params = {}
  ac_params['filter'] = {}
  ac_params['multiple'] = True
  ac_params['term first'] = False
  ac_params['separator'] = ", "
  ac = fastsemsim.load_ac(ontology=hpo, source_file='./metricFiles/patient'+str(current_user.id), file_type='plain',params=ac_params)

  # Parameters for the SS
  semsim_type='obj'
  semsim_measure='Cosine'
  mixing_strategy='BMA'

  # Initializing semantic similarity
  ss = fastsemsim.init_semsim(ontology = hpo, ac = ac, semsim_type = semsim_type, semsim_measure = semsim_measure, mixing_strategy = mixing_strategy)
  result = []
  for patient in ac.obj_set:
    if patient != patient_id:
      patient_element = {"patient_id": str(patient), 
                        "similarity": ss.SemSim(patient_id, patient)}
      result.append(patient_element)
      print(ss.SemSim(patient_id, patient))
  sorted_results = sorted(result, key=lambda k: k['similarity'], reverse=True)
  return jsonify(sorted_results)
  