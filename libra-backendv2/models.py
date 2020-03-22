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

class ProjectSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name', 'desc')

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)
