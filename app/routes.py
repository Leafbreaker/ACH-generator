from flask import render_template, flash, redirect, url_for, send_file, request
from app import app
from app.forms import MalwareForm, SerialForm, ACHForm

from json import dumps
import os, time, datetime, re, subprocess, smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itertools import product

#Current JSON format version
FORMAT_VERSION = "1.0"

#File folder
DOWNLOAD_FOLDER = os.path.dirname(os.path.realpath(__file__)) + "/files/"
GIT_FOLDER = os.path.dirname(os.path.realpath(__file__)) + "/files/flashcards/"
LOG_FOLDER = os.path.dirname(os.path.realpath(__file__)) + "/logs/"

#File names
SERIAL_NUMER_FILE_NAME = "serial_number.txt"

#Git
USER_NAME = "Jostein Løvbråten"
USER_MAIL = "jostein.lovbraten@cert.no"



@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    form = MalwareForm()
    serial_number = get_next_serial_number()
    if form.validate_on_submit():
        flash('Flashcard for {} with serial number {} has been submitted!'.format(form.serial_number.data, form.name.data.upper()))
        
        #Populate dictionary with data provided by the user
        meta = {}
        
        meta["timestamp_created"] = int(time.time()) #epoch
        meta["timestamp_modified"] = meta["timestamp_created"]
        meta["serial_number"] = form.serial_number.data
        meta["version"] = FORMAT_VERSION
        meta["author"] = form.author.data
        
        
        flashcard = {}
        flashcard["meta"] = meta
        flashcard["name"] = form.name.data.upper()
        
        flashcard["type"] = form.type.data
        flashcard["communications"] = form.communication.data.splitlines()
        flashcard["aliases"] = form.alias.data.splitlines()
        flashcard["impacts"] = (form.impact.data).split(",")[:-1]
        
        flashcard["operating_systems"] = form.operative_system.data.splitlines()
        flashcard["application"] = form.application.data
        flashcard["vulnerabillity"] = form.vulnerabillity.data
        
        flashcard["capabillities"] = (form.key_capabillities.data).split(",")[:-1]
        
        flashcard["previous_incidents"] = form.previous_incidents.data.splitlines()
        flashcard["require_user_interraction"] = form.require_user_interaction.data
        flashcard["persistence"] = form.persistence.data
        
        flashcard["key_properties"] = form.key_properties.data.splitlines()
        flashcard["key_indicators"] = form.key_indicators.data.splitlines()
        
        flashcard["threat_actor"] = form.threat_actor.data
        flashcard["sources"] = form.sources.data.splitlines()
        flashcard["git_link"] = form.git_link.data.splitlines()
        
        flashcard["description"] = form.description.data
        
        
        #Create the file to be served to the user
        filename = GIT_FOLDER + form.name.data + ".json"
        file_to_serve = open(filename, "w")
        
        #Convert the dict to JSON and write the data to file
        file_to_serve.write(dumps(flashcard))
        
        file_to_serve.close()
        
        pull_from_git()
        commit_to_git("Added flashcard for " + flashcard["name"])
        commit_serial_number(meta["serial_number"])

        
        

    return render_template('index.html', title='flashGen', form=form, serial_number = serial_number)

@app.route('/serial_number', methods=['GET','POST'])
def serial_number():
    form = SerialForm()
    current_serial_number = get_serial_number()
    next_serial_number = get_next_serial_number()
    
    if form.validate_on_submit():
        flash('Serial number {}  claimed!'.format(next_serial_number))
        commit_serial_number(next_serial_number)
        return redirect('/serial_number')

    
    return render_template('serial_number.html', title='Serial Number', current_serial_number = current_serial_number, next_serial_number = next_serial_number, form=form)

@app.route('/edit_json', methods=['GET','POST'])
def edit_json():
    pass
    
@app.route('/mhg', methods=['GET', 'POST'])
def mhg():
    form = ACHForm()
    if form.validate_on_submit():
        flash('Hypothesis with who: {} ,what {} and why: {}has been submitted!'.format(form.who_1.data, form.what_1.data, form.why_1.data))

        #Extract data from forms
        who = [form.who_1.data,form.who_2.data, form.who_3.data]
        what = [form.what_1.data,form.what_2.data, form.what_3.data]
        why = [form.why_1.data,form.why_2.data, form.why_3.data]

        generated_hypotheses = []
        for r in product(who, what, why):
            generated_hypotheses.append(r)

        messages = generated_hypotheses
        session['messages'] = generated_hypotheses
        return redirect(url_for("eliminate_hypothesis", messages=messages))
        
        #Populate dictionary with data provided by the user
    return render_template('mhg.html', title='MHG', form=form)

@app.route('/hypothesis_elimination', methods=['GET', 'POST'])
def eliminate_hypothesis():
    messages = session['messages']
    return render_template("foo.html", messages=json.loads(messages))

def get_serial_number():
    current_year = datetime.datetime.now().year
    
    path_to_serial_number = GIT_FOLDER + SERIAL_NUMER_FILE_NAME
    file_handle = open(path_to_serial_number, "r")
    
    serial_number = file_handle.read()
    file_handle.close()
    
    serial_year = int(re.search('REM#(\d{4}).*', serial_number).group(1))
    
    if current_year > serial_year:
        serial_number = "REM#" + str(current_year) + "-000"
    
    return serial_number
    
def get_next_serial_number():
    serial_number = get_serial_number()
    serial_year = re.search('REM#(\d{4}).*', serial_number).group(1)
    serial_delivery = int(re.search('REM#\d{4}-(\d*)', serial_number).group(1))
    
    serial_delivery += 1
    
    if serial_delivery < 10:
        serial_delivery = '00' + str(serial_delivery)
    elif serial_delivery >= 10 & serial_delivery < 100:
        serial_delivery = '0' + str(serial_delivery)
    else:
        serial_delivery = str(serial_delivery)
    
    return "REM#" + serial_year + '-' + serial_delivery

def commit_serial_number(serial_number):
    path_to_serial_number = GIT_FOLDER + SERIAL_NUMER_FILE_NAME
    file_handle = open(path_to_serial_number, "w")
    
    file_handle.write(serial_number)
    file_handle.close()
    
    message = 'Incremented serial_number to ' + serial_number
    commit_to_git(message)
    push_to_git()

def pull_from_git():
    proc1 = subprocess.Popen(['git', '-C', GIT_FOLDER, 'pull'], stdout=subprocess.PIPE)
    
    result = proc1.communicate()
    app.logger.info(result)
    
def commit_to_git(mess):
    message = mess
    proc1 = subprocess.Popen(['git', '-C', GIT_FOLDER, 'add', '.'], stdout=subprocess.PIPE)
    proc2 = subprocess.Popen(['git', '-C', GIT_FOLDER, 'commit', '-m', message], stdout=subprocess.PIPE)
    
    result1 = proc1.communicate()
    result2 = proc2.communicate()
    
    app.logger.info(result1)
    app.logger.info(result2)
    
def push_to_git():
    proc1 = subprocess.Popen(['git', '-C', GIT_FOLDER, 'push'], stdout=subprocess.PIPE)
    
    result = proc1.communicate()
    app.logger.info(result)
    
    
    