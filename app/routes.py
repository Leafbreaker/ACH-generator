import json, random
from flask import render_template, flash, redirect, url_for, send_file, request, make_response, Response
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




@app.route('/', methods=['GET', 'POST'])
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

        random.shuffle(generated_hypotheses)

        resp = make_response(redirect(url_for('hypothesis_elimination')))
        resp.set_cookie("hypos", json.dumps(generated_hypotheses))
        return resp
        
        #Populate dictionary with data provided by the user
    return render_template('mhg.html', title='MHG', form=form)

@app.route('/hypothesis_elimination', methods=['GET', 'POST'])
def hypothesis_elimination():
    all_hypos = json.loads(request.cookies.get("hypos"))
    print(all_hypos)

    return render_template('hypothesis_elimination.html', title='elimination', all_hypos=str(all_hypos))

@app.route('/scored', methods=['GET', 'POST'])
def scored():
    finished = []
    all_scored = request.cookies.get("scoreboard")[:-1].split(',')
    for entry in all_scored:
        hypo = str(entry).split(":")
        finished.append([hypo[0],hypo[1].strip()])
    
    finished.sort(reverse=True)

    for h in finished:
        print(h)
    


    return render_template('scored.html', title='finished!', finished=finished)

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
    
