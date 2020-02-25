from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, HiddenField, FileField
from wtforms.validators import DataRequired
from wtforms.widgets import TextArea

class ACHForm(FlaskForm):
    who_1 = StringField('who', validators=[DataRequired()])
    what_1 = StringField('what', validators=[DataRequired()])
    why_1 = StringField('why', validators=[DataRequired()])

    who_2 = StringField('who', validators=[DataRequired()])
    what_2 = StringField('what', validators=[DataRequired()])
    why_2 = StringField('why', validators=[DataRequired()])

    who_3 = StringField('who', validators=[DataRequired()])
    what_3 = StringField('what', validators=[DataRequired()])
    why_3 = StringField('why', validators=[DataRequired()])

    submit = SubmitField('Generate Hypotheses')

class MalwareForm(FlaskForm):
    
    #meta
    author = StringField('Author', validators=[DataRequired()])
    serial_number = StringField('Serial Number', validators=[DataRequired()])
    #overview
    name = StringField('Name', validators=[DataRequired()])
    description = StringField('Description', widget=TextArea())
    type = StringField('Type', validators=[DataRequired()])
    communication = StringField('Communication', validators=[DataRequired()], widget=TextArea())
    alias = StringField('Alias', validators=[DataRequired()], widget=TextArea())
    
    #impact
    impact = HiddenField('Impact')
    operative_system = StringField('Operative system', validators=[DataRequired()], widget=TextArea())
    application = StringField('Application', validators=[DataRequired()])
    vulnerabillity = StringField('Vulnebillity', validators=[DataRequired()])

    #key takeaways
    key_capabillities = HiddenField('Key Capabillities')
    key_properties = StringField('Key Properties', widget=TextArea())
    key_indicators = StringField('Key Indicators', widget=TextArea())
    
    #key questions
    previous_incidents = StringField('Previous Incidents', widget=TextArea())
    require_user_interaction = RadioField('Require User Interaction', choices=[('require_interaction','YES'),('not_require_interaction','NO')])
    persistence = RadioField('Persistence', choices=[('is_persistent','YES'),('not_persistent','NO')])
    threat_actor = StringField('Threat Actor', validators=[DataRequired()])
    
    #links
    sources = StringField('Sources', widget=TextArea())
    git_link = StringField('Git Link', widget=TextArea())
    
    submit = SubmitField('Create JSON file')
    
class SerialForm(FlaskForm):
    submit = SubmitField('Submit')
    
#class fileForm(Form):
#    xmlFile = FileField('JSON File', validators=[FileRequired(),
#                        FileAllowed('json', 'Kun .json filer!')])