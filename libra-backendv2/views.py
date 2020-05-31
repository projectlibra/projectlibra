from .app import app, db, ma, bcrypt, basedir, db_engine, hpo, go, mail
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
import time
from flask_mail import Message
from threading import Thread
import pandas as pd
import io
from .mail_template import *

PREFIX = 'Bearer'
ss = 0
ac = 0
ss_hpo, ac_hpo = 0, 0

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
  new_user = User(public_id = str(uuid.uuid4()), username=data['username'], name=data['name'], email=data['email'], password=pw_hash, admin=False, ph_thrs=50.0, gn_thrs=50.0)
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


@app.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
  return user_schema.jsonify(current_user)

@app.route('/user_update', methods=['POST'])
@token_required
def update_user(current_user):
  current_user.username = request.json['username']
  current_user.name = request.json['name']
  current_user.email = request.json['email']
  current_user.ph_thrs = request.json['ph_thrs']
  current_user.gn_thrs = request.json['gn_thrs']

  db.session.commit()
  return user_schema.jsonify(current_user)

@app.route('/project', methods=['POST'])
@token_required
def add_project(current_user):
  name = request.json['name']
  desc = request.json['desc']
  disease = request.json['disease']
  user_id = current_user.id
  project = Project(name=name, desc=desc, disease=disease, user_id=user_id)
  db.session.add(project)
  db.session.commit()

  return project_schema.jsonify(project)

@app.route('/testfilter', methods=['POST'])
@token_required
def test_filter(current_user):
  impactInput = request.json['impactInput']
  frequencyInput = request.json['frequencyInput']
  scenarioInput = request.json['scenarioInput']
  if(len(impactInput['highImpactArray']) == 0):
    print("high impact is empty")
  else:
    print("high impact is not empty")

  if(len(impactInput['medImpactArray']) == 0):
    print("medImpactArray is empty")
  else:
    print("medImpactArray is not empty")

  print("high impact types")
  for type in impactInput['highImpactArray']:
    print(type)
  
  print(impactInput)
  print(frequencyInput)
  print(scenarioInput)

  query = ''
  for type in impactInput['highImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['medImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['lowImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''

  query = query[3:]
  print(query)
  execquery = 'select * from vcf WHERE ' + query
  print(execquery)

  return make_response('Testing filters', 200)

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
    patient_id = int(request.form['patient_id'])
    has_disease = request.form['has_disease']
    if has_disease == 'true':
      has_disease = True
    else:
      has_disease = False
    
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
    
    """
    # ANNOTATE DBSNP ID
    file_path2 = file_path[:-4] + "_dbsnp.vcf"
    print("java -jar " + app.config['SNPEFF_FOLDER'] + "/SnpSift.jar annotate -id " + app.config['SNPEFF_FOLDER'] + "/00-All.vcf.gz " + file_path + " > " + file_path[:-4] + "_dbsnp.vcf")
    
    os.system("java -jar " + app.config['SNPEFF_FOLDER'] + "/SnpSift.jar annotate -id " + app.config['SNPEFF_FOLDER'] + "/00-All.vcf.gz " + file_path + " > " + file_path2)

    # ANNOTATE 1KG
    file_path3 = file_path2[:-4] + "_1k.vcf"
    print("java -jar " + app.config['SNPEFF_FOLDER'] + "/SnpSift.jar annotate -v " + app.config['SNPEFF_FOLDER'] + "/ALL.chr22.shapeit2_integrated_snvindels_v2a_27022019.GRCh38.phased.vcf.gz " + file_path2 + " > " + file_path3)
    
    os.system("java -jar " + app.config['SNPEFF_FOLDER'] + "/SnpSift.jar annotate -v " + app.config['SNPEFF_FOLDER'] + "/ALL.chr22.shapeit2_integrated_snvindels_v2a_27022019.GRCh38.phased.vcf.gz " + file_path2 + " > " + file_path3)

    # ANNOTATE SNPEFF
    file_path4 = file_path3[:-4] + "_anno.vcf"
    print("java -Xmx4g -jar " + app.config['SNPEFF_FOLDER'] + "/snpEff.jar -v -t GRCh38.86 " + file_path3 + " > " + file_path4)
    
    os.system("java -Xmx4g -jar " + app.config['SNPEFF_FOLDER'] + "/snpEff.jar -v -t GRCh38.86 " + file_path3 + " > " + file_path4)

    #file_path = os.path.join(app.config['UPLOAD_FOLDER'], '06A010111.vcf')
    # save file to db
    file_db = File(name=file.filename, path=file_path4, project_id=project_id)
    #file_db = File(name='06A010111.vcf', path=file_path, project_id=project_id)
    db.session.add(file_db)
    db.session.commit()
    """
    #parse vcf using pyvcf and upload to database
    #vcf_reader = vcf.Reader(open(file_path, 'r'))
    vcf_reader = vcf.Reader(filename=file_path)
    user_id = current_user.id
    print("FILE OPEN")
    cnt= 0
    variant_list = []
    np_id_list = []
    start = time.time()
    #new_patient = Patient(name="RandPatient", diagnosis="rand_diag", patient_contact="rand@gmail.com", user_id=current_user.id, hpo_tag_names="", hpo_tag_ids="", go_tag_ids="")
    if patient_id != 0 and patient_id != -1:
      db.session.add(PatientProject(patient_id=patient_id, project_id=project_id, has_disease=has_disease))
    elif patient_id == -1: # batch upload
      for record in vcf_reader:
        for sample in record.samples:
          np = Patient(name=sample.sample, user_id=current_user.id)
          db.session.add(np)
          db.session.commit()
          db.session.add(PatientProject(patient_id=np.id, project_id=project_id, has_disease=True))
          db.session.commit()
          np_id_list.append(np.id)
        break

    db.session.commit()
    go_list = []
    if patient_id == -1: # batch upload
      for np_id in np_id_list:
        for record in vcf_reader:
          if cnt % 10000 == 0:
            print(cnt)
          cnt+=1
          if cnt % 1000 == 0:
            start2 = time.time()
            db.session.flush()
            end2 = time.time()
            print("Elapsed time for db flush: ", end2 - start2)
          
          anno = record.INFO['ANN'][0].split('|')

          # for now assuming every sample has the disease
          dom = True
          rec = True
          for sample in record.samples:
            if sample['GT'] != "1/1":
              rec = False
              if sample['GT'] != "0/1":
                dom = False
                break

          new_vcf = Vcf(filename='file.filename', project_id=project_id, user_id=user_id, patient_id=np_id, chrom=str(record.CHROM), pos=record.POS, variant_id=record.ID, ref=str(record.REF)[:20], alt=str(record.ALT)[:20], qual=record.QUAL, filter=str(record.FILTER), info=str(record.INFO), alelle=anno[0], annotation=anno[1], annotation_impact=anno[2], gene_name=anno[3], gene_id=anno[4], feature_type=anno[5], feature_id=anno[6], dominant=dom, recessive=rec)
          db.session.add(new_vcf)
          #db.session.commit()

          if new_vcf.annotation_impact == "HIGH":
            print("Inside HIGH")
            if new_vcf.gene_name in app.config['GENE_DICT']:
              db_gene_name = GeneName(name=new_vcf.gene_name)
              db.session.merge(db_gene_name)
              for go_id in app.config['GENE_DICT'][new_vcf.gene_name]:
                go_list.append(go_id)
                db_gene_id = GeneId(gene_id=go_id)
                db.session.merge(db_gene_id)
              db.session.commit()
              if '&' in anno[1]:
                pat_anno = anno[1].split('&')[0]
              else:
                pat_anno = anno[1]
              db.session.merge(PatientGeneName(patient_id=np_id, gene_name=new_vcf.gene_name, anno=pat_anno))
              for go_id in app.config['GENE_DICT'][new_vcf.gene_name]:
                db.session.merge(PatientGeneID(patient_id=np_id, gene_id=go_id))
              db.session.commit()
            
          """
          #variant_list.append(new_vcf)
          for sample in record.samples:
              # print (sample)
              # sample_data = str(sample.data)[9:-1] because pyvcf has "CallData()" wrapping it
              # new_vcf = VCFs(filename=filename, project_id=project_id, user_id=user_id, chrom=str(record.CHROM),
              #  pos=record.POS, variant_id=record.ID, ref=record.REF, alt=str(record.ALT), qual=record.QUAL,
              #  filter=str(record.FILTER), info=str(record.INFO), sample_id = str(sample.sample),
              #  sample_data = str(sample.data)[9:-1])
              # db.session.add(new_vcf)
              # db.session.commit()
              new_sample = Sample(sample_id = str(sample.sample), vcf_id = (new_vcf.id), sample_data = str(sample.data)[9:-1])
              db.session.add(new_sample)
              db.session.commit()
              """
        end = time.time()
        print("Elapsed time for processing: ", end - start)
        #start = time.time()
        #db.session.add_all(variant_list)
        #end = time.time()
        #print("Elapsed time for db add: ", end - start)
        start = time.time()
        db.session.commit()
        end = time.time()
        #new_patient = Patient.query.get(np_id)
        #new_patient.go_ids = ','.join(list(set(go_list)))
        break
        db.session.commit()
        print("Elapsed time for db commit: ", end - start)
    else:
      for record in vcf_reader:
          # print (record)
        
        if cnt % 10000 == 0:
          print(cnt)
        cnt+=1
        if cnt % 1000 == 0:
          start2 = time.time()
          db.session.flush()
          end2 = time.time()
          print("Elapsed time for db flush: ", end2 - start2)
        
        anno = record.INFO['ANN'][0].split('|')
        if patient_id == 0:
          new_vcf = Vcf(filename='file.filename', project_id=project_id, user_id=user_id, chrom=str(record.CHROM), pos=record.POS, variant_id=record.ID, ref=str(record.REF)[:20], alt=str(record.ALT)[:20], qual=record.QUAL, filter=str(record.FILTER), info=str(record.INFO), alelle=anno[0], annotation=anno[1], annotation_impact=anno[2], gene_name=anno[3], gene_id=anno[4], feature_type=anno[5], feature_id=anno[6], dominant=False, recessive=False)
        else:
          new_vcf = Vcf(filename='file.filename', project_id=project_id, user_id=user_id, patient_id=patient_id, chrom=str(record.CHROM), pos=record.POS, variant_id=record.ID, ref=str(record.REF)[:20], alt=str(record.ALT)[:20], qual=record.QUAL, filter=str(record.FILTER), info=str(record.INFO), alelle=anno[0], annotation=anno[1], annotation_impact=anno[2], gene_name=anno[3], gene_id=anno[4], feature_type=anno[5], feature_id=anno[6], dominant=False, recessive=False)
        db.session.add(new_vcf)
        #db.session.commit()
        if patient_id != 0:
          if new_vcf.annotation_impact == "HIGH":
            if new_vcf.gene_name in app.config['GENE_DICT']:
              db_gene_name = GeneName(name=new_vcf.gene_name)
              db.session.merge(db_gene_name)
              for go_id in app.config['GENE_DICT'][new_vcf.gene_name]:
                go_list.append(go_id)
                db_gene_id = GeneId(gene_id=go_id)
                db.session.merge(db_gene_id)
              db.session.commit()
              if '&' in anno[1]:
                pat_anno = anno[1].split('&')[0]
              else:
                pat_anno = anno[1]
              db.session.merge(PatientGeneName(patient_id=patient_id, gene_name=new_vcf.gene_name, anno=pat_anno))
              for go_id in app.config['GENE_DICT'][new_vcf.gene_name]:
                db.session.merge(PatientGeneID(patient_id=patient_id, gene_id=go_id))
              db.session.commit()
        
      """
      #variant_list.append(new_vcf)
      for sample in record.samples:
          # print (sample)
          # sample_data = str(sample.data)[9:-1] because pyvcf has "CallData()" wrapping it
          # new_vcf = Vcf(filename=filename, project_id=project_id, user_id=user_id, chrom=str(record.CHROM),
          #  pos=record.POS, variant_id=record.ID, ref=record.REF, alt=str(record.ALT), qual=record.QUAL,
          #  filter=str(record.FILTER), info=str(record.INFO), sample_id = str(sample.sample),
          #  sample_data = str(sample.data)[9:-1])
          # db.session.add(new_vcf)
          # db.session.commit()
          new_sample = Sample(sample_id = str(sample.sample), vcf_id = (new_vcf.id), sample_data = str(sample.data)[9:-1])
          db.session.add(new_sample)
          db.session.commit()
          """
    end = time.time()
    print("Elapsed time for processing: ", end - start)
    #start = time.time()
    #db.session.add_all(variant_list)
    #end = time.time()
    #print("Elapsed time for db add: ", end - start)
    start = time.time()
    db.session.commit()
    end = time.time()
    if patient_id != 0:
      new_patient = Patient.query.get(patient_id)
      new_patient.go_ids = ','.join(list(set(go_list)))
    db.session.commit()
    print("Elapsed time for db commit: ", end - start)
    
    
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
  columns = [column.key for column in Vcf.__table__.columns]
  columns2 = [column.key for column in Sample.__table__.columns]
  columns = columns + list(set(columns2) - set(columns))
  #for column in Vcf.__table__.columns
    #if column.key not in columns
    #  columns.append(column.key)
  print(columns)
  project = Project.query.get(id)
  #result = VCFs.query.filter_by(user_id=current_user.id, project_id=id).options(load_only(*columns[4:])).all()
  #result = db.session.query(VCFs, Sample).outerjoin(Sample, VCFs.vcf_id == Sample.vcf_id).all()
  #result = db.session.query(VCFs, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, VCFs.vcf_id == Sample.vcf_id).all()
  result = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.id == Sample.vcf_id).limit(1000).all()
  #print(result)
  print(result)
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
      #row_data.append('<a href="https://www.ncbi.nlm.nih.gov/snp/' + vcf[0].variant_id + '" target="_blank">' + vcf[0].variant_id +  '</a>')
      row_data.append(vcf[0].variant_id)
    row_data.append(vcf[0].ref)
    row_data.append(vcf[0].alt)
    row_data.append(vcf[0].qual)
    # row_data.append(vcf[0].filter)
    if "VT" in vcf[0].info:
      cnt_1k+=1
    # row_data.append(vcf[0].info)
    # row_data.append(vcf[0].alelle)
    row_data.append(vcf[0].annotation)
    row_data.append(vcf[0].annotation_impact)
    row_data.append(vcf[0].gene_name)
    row_data.append(vcf[0].gene_id)
    row_data.append(vcf[0].feature_type)
    row_data.append(vcf[0].feature_id)
    #row_data.append(vcf[1].sample_id)
    #row_data.append(vcf[1].sample_data)

    table_data.append(row_data)

  #print(table_data)
  print(len(table_data))
    
  cnt_1k = db.session.query(Vcf).filter_by(user_id=current_user.id, project_id=id).filter(Vcf.info.like("%EAS_AF%")).count()
  cnt_dbsnp = db.session.query(Vcf).filter_by(user_id=current_user.id, project_id=id).filter(Vcf.variant_id == None).count()
  cnt_all = db.session.query(Vcf).filter_by(user_id=current_user.id, project_id=id).count()
  print("Columns:", columns[4:len(columns)-2])

  resp = {
    'columns': columns[4:len(columns)-2],
    'table_data': table_data,
    'pie_data' : [['db', 'count'], ['dbSNP', cnt_dbsnp], ['Novel', cnt_all - cnt_dbsnp]],
    'pie1k_data' : [['db', 'count'], ['1KG', cnt_1k], ['Novel', cnt_all - cnt_1k]],
    'project' : project_schema.dump(project)
  }

  return resp, 200

@app.route('/vcf_table/<id>/<index>', methods=['GET'])
@token_required
def get_vcf_table_index(current_user, id, index):
  columns = [column.key for column in Vcf.__table__.columns]
  columns2 = [column.key for column in Sample.__table__.columns]
  columns = columns + list(set(columns2) - set(columns))
  #for column in Vcf.__table__.columns
    #if column.key not in columns
    #  columns.append(column.key)
  print(columns)
  total_cnt = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.id == Sample.vcf_id).count()
  #result = Vcf.query.filter_by(user_id=current_user.id, project_id=id).options(load_only(*columns[4:])).all()
  #result = db.session.query(Vcf, Sample).outerjoin(Sample, Vcf.vcf_id == Sample.vcf_id).all()
  #result = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.vcf_id == Sample.vcf_id).all()
  off = 1000
  lim = 1000
  if off*int(index) + lim > total_cnt:
    lim = total_cnt % off 
  result = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.id == Sample.vcf_id).offset(int(index)*off).limit(lim).all()
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
    print(vcf[0])
    row_data = []
    row_data.append(vcf[0].chrom)
    row_data.append(vcf[0].pos)
    cnt_all+=1
    if vcf[0].variant_id is None:
      row_data.append(vcf[0].variant_id)
    else:
      cnt_dbsnp +=1
      #row_data.append('<a href="https://www.ncbi.nlm.nih.gov/snp/' + vcf[0].variant_id + '" target="_blank">' + vcf[0].variant_id +  '</a>')
      row_data.append(vcf[0].variant_id)
    row_data.append(vcf[0].ref)
    row_data.append(vcf[0].alt)
    row_data.append(vcf[0].qual)
    # row_data.append(vcf[0].filter)
    if "VT" in vcf[0].info:
      cnt_1k+=1
    # row_data.append(vcf[0].info)
    # row_data.append(vcf[0].alelle)
    row_data.append(vcf[0].annotation)
    row_data.append(vcf[0].annotation_impact)
    row_data.append(vcf[0].gene_name)
    row_data.append(vcf[0].gene_id)
    row_data.append(vcf[0].feature_type)
    row_data.append(vcf[0].feature_id)
    #row_data.append(vcf[1].sample_id)
    #row_data.append(vcf[1].sample_data)
    table_data.append(row_data)

  #print(table_data)
  print(len(table_data))
    

  print("Columns:", columns[4:len(columns)-2])

  resp = {
    'table_data': table_data,
  }

  return resp, 200

@app.route('/vcf_table_filters/<id>', methods=['POST'])
@token_required
def get_vcf_table_with_filters(current_user, id):
  columns = [column.key for column in Vcf.__table__.columns]
  columns2 = [column.key for column in Sample.__table__.columns]
  columns = columns + list(set(columns2) - set(columns))
  print(columns)
  
  impactInput = request.json['impactInput']
  frequencyInput = request.json['frequencyInput']
  scenarioInput = request.json['scenarioInput']
  query = ''
  for type in impactInput['highImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['medImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['lowImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''

  if(len(query) > 0):
    query = query[3:]
    if (frequencyInput['filterDbsnp'] == "yes"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND dominant=true AND ('+ query +') LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND recessive=true AND ('+ query +') LIMIT 1000'
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND ('+ query +') LIMIT 1000'
    elif (frequencyInput['filterDbsnp'] == "no"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND dominant=true AND ('+ query +') LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND recessive=true AND ('+ query +') LIMIT 1000'
      else:
         execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND ('+ query +') LIMIT 1000'       
    else:
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND dominant=true AND ('+ query +') LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND recessive=true AND ('+ query +') LIMIT 1000'
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND ('+ query +') LIMIT 1000'   
  else:
    if (frequencyInput['filterDbsnp'] == "yes"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND dominant=true LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND recessive=true LIMIT 1000'
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL LIMIT 1000'        
    elif (frequencyInput['filterDbsnp'] == "no"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND dominant=true LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND recessive=true LIMIT 1000'
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL LIMIT 1000'       
    else:
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND dominant=true LIMIT 1000'
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND recessive=true LIMIT 1000'
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' LIMIT 1000'
        
  print(execquery)

  result = db.session.execute(execquery)

  table_data = []
  cnt_dbsnp = 0
  cnt_all = 0
  cnt_1k = 0
  print("scenario input is: ")
  print(scenarioInput)
  for vcf in result:
    if(((frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "any") 
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "yes" and (vcf[7] is not None) and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "no" and (vcf[7] is None) and ("VT" not in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "no" and (vcf[7] is not None) and ("VT" not in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "yes" and (vcf[7] is None) and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "any" and (vcf[7] is not None))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "any" and (vcf[7] is None))
      or (frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "yes" and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "no" and ("VT" not in vcf[12]))
      )
      and ((scenarioInput == "none" or scenarioInput == "")
        or (scenarioInput == "dominant" and vcf[20] == True)
        or ((scenarioInput == "recessive" and vcf[21] == True)
          )
        )
      ):
      row_data = []
      row_data.append(vcf[5]) #chrom
      row_data.append(vcf[6]) #pos
      cnt_all+=1
      if vcf[7] is None:
        row_data.append(vcf[7]) #variant_id
      else:
        cnt_dbsnp +=1
        #row_data.append('<a href={`https://www.ncbi.nlm.nih.gov/snp/$'+vcf[7]+'`} target="_blank">'+vcf[7]+'</a>')
        row_data.append(vcf[7])
        #row_data.append('<a href="https://www.ncbi.nlm.nih.gov/snp/' + vcf[7] + '" target="_blank">' + vcf[7] +  '</a>')
      row_data.append(vcf[8]) #ref
      row_data.append(vcf[9]) #alt
      row_data.append(vcf[10]) #qual
      # row_data.append(vcf[11]) #filter
      if "VT" in vcf[12]: #info
        cnt_1k+=1
      # row_data.append(vcf[12]) #info 
      # row_data.append(vcf[13]) #allele
      row_data.append(vcf[14]) #annotation
      row_data.append(vcf[15]) #annotation_impact
      row_data.append(vcf[16]) #gene_name
      row_data.append(vcf[17]) #gene_id
      row_data.append(vcf[18]) #feature_type
      row_data.append(vcf[19]) #feature_id

      table_data.append(row_data)

  print(len(table_data))
    
  print("Columns:", columns[4:len(columns)-2])

  resp = {
    'columns': columns[4:len(columns)-2],
    'table_data': table_data,
    'pie_data' : [['db', 'count'], ['dbSNP', cnt_dbsnp], ['Novel', cnt_all - cnt_dbsnp]],
    'pie1k_data' : [['db', 'count'], ['1KG', cnt_1k], ['Novel', cnt_all - cnt_1k]] 
  }

  return resp, 200

@app.route('/vcf_table_filters/<id>/<index>', methods=['POST'])
@token_required
def get_vcf_table_with_filters_index(current_user, id, index):
  columns = [column.key for column in Vcf.__table__.columns]
  columns2 = [column.key for column in Sample.__table__.columns]
  columns = columns + list(set(columns2) - set(columns))
  
  print(columns)
  #total_cnt = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.id == Sample.vcf_id).count()
  off = 1000
  lim = 1000
  #if off*int(index) + lim > total_cnt:
  #  lim = total_cnt % off 
  # result = db.session.query(Vcf, Sample).filter_by(user_id=current_user.id, project_id=id).outerjoin(Sample, Vcf.id == Sample.vcf_id).offset(int(index)*off).limit(lim).all()

  impactInput = request.json['impactInput']
  frequencyInput = request.json['frequencyInput']
  scenarioInput = request.json['scenarioInput']
  query = ''
  for type in impactInput['highImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['medImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''
  for type in impactInput['lowImpactArray']:
    query = query + ' OR annotation=\'' + type + '\''

  #if(len(query) > 0):
  #  query = query[3:]
  #  execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
  #else:
  #  execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)

  if(len(query) > 0):
    query = query[3:]
    if (frequencyInput['filterDbsnp'] == "yes"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND dominant=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND recessive=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
    elif (frequencyInput['filterDbsnp'] == "no"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND dominant=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND recessive=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
         execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
    else:
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND dominant=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND recessive=true AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND ('+ query +') OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
  else:
    if (frequencyInput['filterDbsnp'] == "yes"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND dominant=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL AND recessive=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NOT NULL OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
    elif (frequencyInput['filterDbsnp'] == "no"):
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND dominant=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL AND recessive=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND variant_id IS NULL OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
    else:
      if (scenarioInput == "dominant"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND dominant=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      elif (scenarioInput == "recessive"):
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' AND recessive=true OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
      else:
        execquery = 'select * from vcf WHERE user_id=' + str(current_user.id) + ' AND project_id=' + str(id) + ' OFFSET '+str((int(index)*off)) + ' LIMIT '+str(lim)
  print(execquery)

  result = db.session.execute(execquery)

  table_data = []
  cnt_dbsnp = 0
  cnt_all = 0
  cnt_1k = 0
  for vcf in result:
    if(((frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "any") 
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "yes" and (vcf[7] is not None) and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "no" and (vcf[7] is None) and ("VT" not in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "no" and (vcf[7] is not None) and ("VT" not in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "yes" and (vcf[7] is None) and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "yes" and frequencyInput['filter1k'] == "any" and (vcf[7] is not None))
      or (frequencyInput['filterDbsnp'] == "no" and frequencyInput['filter1k'] == "any" and (vcf[7] is None))
      or (frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "yes" and ("VT" in vcf[12]))
      or (frequencyInput['filterDbsnp'] == "any" and frequencyInput['filter1k'] == "no" and ("VT" not in vcf[12]))
      )
      and ((scenarioInput == "none" or scenarioInput == "")
        or (scenarioInput == "dominant" and vcf[20] == True)
        or ((scenarioInput == "recessive" and vcf[21] == True)
          )
        )
      ):
      row_data = []
      row_data.append(vcf[5]) #chrom
      row_data.append(vcf[6]) #pos
      cnt_all+=1
      if vcf[7] is None:
        row_data.append(vcf[7]) #variant_id
      else:
        cnt_dbsnp +=1
        row_data.append(vcf[7])
        #row_data.append('<a href="https://www.ncbi.nlm.nih.gov/snp/' + vcf[7] + '" target="_blank">' + vcf[7] +  '</a>')
      row_data.append(vcf[8]) #ref
      row_data.append(vcf[9]) #alt
      row_data.append(vcf[10]) #qual
      # row_data.append(vcf[11]) #filter
      if "VT" in vcf[12]: #info
        cnt_1k+=1
      # row_data.append(vcf[12]) #info 
      # row_data.append(vcf[13]) #allele
      row_data.append(vcf[14]) #annotation
      row_data.append(vcf[15]) #annotation_impact
      row_data.append(vcf[16]) #gene_name
      row_data.append(vcf[17]) #gene_id
      row_data.append(vcf[18]) #feature_type
      row_data.append(vcf[19]) #feature_id

      table_data.append(row_data)

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
                    user_id=user_id, hpo_tag_names=hpo_tag_names_str, hpo_tag_ids=hpo_tag_ids_str, resolve_state=False)

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

@app.route('/projectpatients/<id>', methods=['GET'])
@token_required
def get_project_patients(current_user, id):
  patients = Project.query.get(id).patients
  print(patients)

  return patients_schema.jsonify(patients)

@app.route('/gethpotags/<patient_id>', methods=['GET'])
@token_required
def get_hpo_tags(current_user, patient_id):
  hpo_tags = HPOTag.query.filter(HPOTag.patient_id == patient_id)
  result = HPOs_schema.dump(hpo_tags)
  return jsonify(result)

@app.route('/getgonames/<patient_id>', methods=['GET'])
@token_required
def get_go_names(current_user, patient_id):
  gene_names = PatientGeneName.query.filter(PatientGeneName.patient_id == patient_id)
  result = PatientGeneNames_schema.dump(gene_names)
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
  sorted_results = []
  if ss_hpo != 0:
    result = []
    for patient in ac_hpo.obj_set:
      if patient != patient_id:
        similarity = ss_hpo.SemSim(patient_id, patient)
        if similarity is not None:
          patient_element = {"patient_id": str(patient), 
                            "similarity": ss_hpo.SemSim(patient_id, patient)}
          result.append(patient_element)
    sorted_results = sorted(result, key=lambda k: k['similarity'], reverse=True)
    print(sorted_results)
  return jsonify(sorted_results)

def hpoAlgorithm():
  patient_file = open('./metricFiles/hpopatient', 'w')
  global ss_hpo, ac_hpo
  for patient in db_engine.execute('select id, hpo_tag_ids from patient'):
    patient_to_write = str(patient)
    patient_to_write = (patient_to_write[1:len(patient_to_write)-1]).replace('\'', '').replace('\'', '')
    patient_file.write(patient_to_write+'\n')
  patient_file.close()

  ac_params = {}
  ac_params['filter'] = {}
  ac_params['multiple'] = True
  ac_params['term first'] = False
  ac_params['separator'] = ", "
  ac_hpo = fastsemsim.load_ac(ontology=hpo, source_file='./metricFiles/hpopatient', file_type='plain',params=ac_params)

  # Parameters for the SS
  semsim_type='obj'
  semsim_measure='Cosine'
  mixing_strategy='BMA'

  # Initializing semantic similarity
  ss_hpo = fastsemsim.init_semsim(ontology = hpo, ac = ac_hpo, semsim_type = semsim_type, semsim_measure = semsim_measure, mixing_strategy = mixing_strategy)
  
  print("HPO-Runs")

@app.route('/matchmakergo/<patient_id>', methods=['GET'])
@token_required
def get_matchmaker_go(current_user, patient_id):
  sorted_results = []
  global ss
  if ss != 0:
    result = []
    for patient in ac.obj_set:
      if patient != patient_id:
        similarity = ss.SemSim(patient_id, patient)
        if similarity is not None:
          patient_element = {"patient_id": str(patient), 
                            "similarity": similarity}
          result.append(patient_element)
    sorted_results = sorted(result, key=lambda k: k['similarity'], reverse=True)
    print(sorted_results)
  return jsonify(sorted_results)

def goAlgortihm():
  patient_file = open('./metricFiles/gopatient', 'w')
  
  for patient in db_engine.execute('select id from patient'):
    patient_id = patient[0]
    patient_to_write = str(patient_id) 
    for gene_id in db_engine.execute('select gene_id from patient_gene_ids where patient_id =' + str(patient_id)):
      patient_to_write = patient_to_write + ", " + gene_id[0]
    patient_file.write(patient_to_write+'\n')

  patient_file.close()
  ac_params = {}
  ac_params['filter'] = {}
  ac_params['multiple'] = True
  ac_params['term first'] = False
  ac_params['separator'] = ", "
  global ac
  ac = fastsemsim.load_ac(ontology=go, source_file='./metricFiles/gopatient', file_type='plain',params=ac_params)

  # Parameters for the SS
  semsim_type='obj'
  semsim_measure='Cosine'
  mixing_strategy='BMA'

  # Initializing semantic similarity
  start_time = time.time()
  global ss
  ss = fastsemsim.init_semsim(ontology = go, ac = ac, semsim_type = semsim_type, semsim_measure = semsim_measure, mixing_strategy = mixing_strategy)
  
  print("GO Runs")

def send_async_email(msg):
    with app.app_context():
        mail.send(msg)

def notificationChecker():
  patient_ids = list(ac.obj_set)
  
  for i in range(0, len(patient_ids) - 1):
    for j in range(i+1, len(patient_ids)):
      pair_1 = str(patient_ids[i])+ "." + str(patient_ids[j])
      pair_2 = str(patient_ids[j])+ "." + str(patient_ids[i])

      pair = db.session.query(Similarity).filter(or_(Similarity.patient_pair==pair_1,
                                                    Similarity.patient_pair==pair_2)).first()

      hpo_sim = ss_hpo.SemSim(patient_ids[i], patient_ids[j])
      go_sim = ss.SemSim(patient_ids[i], patient_ids[j])
      if not hpo_sim:
        hpo_sim = 0
      if not go_sim:
        go_sim = 0
      
      if (not pair):
        print("new",pair)
        similarity = Similarity(patient_pair= pair_1, hpo_similarity=hpo_sim, go_similarity= go_sim)
        sendEmail((patient_ids[i], patient_ids[j]), hpo_sim, go_sim)
        db.session.add(similarity)
        db.session.commit() 
  
      else:
        if(pair.hpo_similarity != hpo_sim or pair.go_similarity != go_sim):  
          print("old",pair)                
          db.session.query(Similarity).filter(or_(Similarity.patient_pair==str(patient_ids[i])+ "." + str(patient_ids[j]),
                                                    Similarity.patient_pair==str(patient_ids[j])+ "." + str(patient_ids[i]))).\
                        update({"hpo_similarity":hpo_sim, 
                                "go_similarity":go_sim })
          sendEmail((patient_ids[i], patient_ids[j]), hpo_sim, go_sim)
          db.session.commit() 
       
        
def sendEmail(patient_ids, hpo_sim, go_sim):
  hpo_sim = 100* hpo_sim, 
  go_sim = 100*go_sim
  mail_info = []
  for patient_id in patient_ids:
    for user_id in db_engine.execute('select user_id from patient where id='+str(patient_id)):
      
      user = db.session.query(User).filter(User.id == int(user_id[0]))
      for row in user:
        if(row.gn_thrs <= go_sim and row.ph_thrs <= hpo_sim):
          mail_info.append([patient_id, row.email, True])
        else:
          mail_info.append([patient_id, row.email, False])
  
  if mail_info[0][2]:
    msg = Message('Similarity Notification for '+ mail_info[0][0], sender = 'projectlibra.similarity@gmail.com', recipients = [mail_info[0][1]])
    msg.html = get_mail_template(mail_info[0][0], mail_info[1][0], mail_info[1][1], go_sim, hpo_sim)
    thr = Thread(target=send_async_email, args=[msg])
    thr.start()
  if mail_info[1][2]:
    msg = Message('Similarity Notification for '+ mail_info[1][0], sender = 'projectlibra.similarity@gmail.com', recipients = [mail_info[1][1]])
    msg.html = get_mail_template(mail_info[1][0], mail_info[0][0], mail_info[0][1], go_sim, hpo_sim)
    thr = Thread(target=send_async_email, args=[msg])
    thr.start()

def matchmakerAlgorithms():
  goAlgortihm()
  hpoAlgorithm()
  notificationChecker()

