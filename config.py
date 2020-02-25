import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hvorfor-sette-CSRF-sikring-paa-en-lokal-app?'
    
    basedir = os.path.abspath(os.path.dirname(__file__))