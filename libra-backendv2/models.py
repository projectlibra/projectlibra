from .app import app, db, ma, bcrypt

# User Model
class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  public_id = db.Column(db.String(50), unique=True)
  username = db.Column(db.String(50))
  email = db.Column(db.String(80))
  password = db.Column(db.String(80))
  admin = db.Column(db.Boolean)
  projects = db.relationship('Project', backref='user')

class UserSchema(ma.Schema):
  class Meta:
    fields = ('id', 'username', 'email', 'admin')

user_schema = UserSchema()

class Project(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50))
  desc = db.Column(db.Text())
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  files = db.relationship('File', backref='project')

class ProjectSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name', 'desc')

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

class File(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200))
  path = db.Column(db.String(300))
  project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

class FileSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name', 'path')

file_schema = FileSchema()
files_schema = FileSchema(many=True)
class VCFs(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  filename = db.Column(db.String(50))
  project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  chrom = db.Column(db.String(5))
  pos = db.Column(db.Integer)
  # need to fix the following column types into more appropriate ones
  variant_id = db.Column(db.String(50))
  ref = db.Column(db.String(50))
  alt = db.Column(db.String(50))
  qual = db.Column(db.String(50))
  filter = db.Column(db.String(100))
  info = db.Column(db.String(100))
  sample_id = db.Column(db.String(100))
  sample_data = db.Column(db.String(100))

class VCFsSchema(ma.Schema):
  class Meta:
    fields = ('id', 'filename', 'chrom', 'pos', 'variant_id', 'ref',
              'alt', 'qual', 'filter', 'info', 'sample_id', 'sample_data')

vcfs_schema = VCFsSchema()
