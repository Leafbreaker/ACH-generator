from flask import Flask
from config import Config
import logging, os

LOG_FOLDER = os.path.dirname(os.path.realpath(__file__)) + "/logs/"

#Logging configuration
for handler in logging.root.handlers[:]:
    logging.root.removeHandler(handler)
logging.basicConfig(format='%(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(LOG_FOLDER + 'app.log'),
                    logging.StreamHandler()])


app = Flask(__name__)
app.config.from_object(Config)

from app import routes