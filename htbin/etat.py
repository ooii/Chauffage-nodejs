#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
import sqlite3
import re
import Levenshtein
import json
import os
import zipfile
import commands
import sys
import urllib2
import urllib
import cgi
import getopt
from StringIO import StringIO
from zipfile import ZipFile
import shutil
import logging
import time
from bs4 import BeautifulSoup
import requests
from requests.exceptions import HTTPError
from SparkCloudAPI import SparkCore

# Logger functions
lgr = logging.getLogger('chauffages')
lgr.setLevel(logging.DEBUG)
fh = logging.FileHandler('/tmp/chauffages.log')
fh.setLevel(logging.DEBUG)
# create a formatter and set the formatter for the handler.
frmt = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(frmt)
# add the Handler to the logger
lgr.addHandler(fh)

###Variables de test
CUISINE = 3
ENTREE = 1
EMMA = 2
ZACH = 0
MILIEU = 0
SALON = 5
SDB = 6
DOUCHE = 7

ARRET = "A"
ECO = "E"
CONFORT = "C"
HORSGEL = "H"

device_id = "54ff6b066672524852431867"
mail = "spark@ooii.io"
password = "lekafel"
token = "e3d3549b644f40ad4b2976a7f3b3f442661326b6"
myCore = SparkCore(mail, password, device_id)
etats = myCore.readVariable('etatfp')
chauffages = [["Entr&eacute;e","1"], ["Emma","2"], ["Cuisine","3"], ["Milieu","4"], ["Salon","5"],["Salle de Bain","6"],["Douche","7"]]

def printEtats():
    etats = myCore.readVariable('etatfp')
    print '''
	<div class="chauffages">
	<div class="listeChauffages">
	<form name="listeEtat" action="etat.py" method="get">
	<table>
	'''
    print '<tr><td>Pi&egrave;ce</td><td>Confort</td><td>Eco</td><td>Hors-Gel</td><td>Arr&ecirc;t</td></tr>'
    for chauffage, etat in chauffages:
        etatActuel = etats[int(etat)-1]
        print '<tr>'
        if etat:
            print '<td>'+chauffage+'</td>'
            print '<td><input type="radio" name="'+etat+'" value="C"', "checked" if (etatActuel == "C") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="E"', "checked" if (etatActuel == "E") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="H"', "checked" if (etatActuel == "H") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="A"', "checked" if (etatActuel == "A") else "", "></td>"
        print '</tr>'
    print '''
	</table>
	<input type="hidden" name="action" value="setFp">
	<input type="submit" value="Submit">
	</form>
    </div>
	</div>
	'''


def printHtmlBegin():
    print '''
	<!DOCTYPE html>
	<HTML lang="fr"><HEAD>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, user-scalable=yes" />
	<TITLE>Chauffage. Spark.io. OOIIIO</TITLE></HEAD>
	<body>
    '''

	#<link rel="stylesheet" href="/style.css" />

def printHtmlEnd():
    print '''
	</body>
	</html>
	'''


def setfp(fs):
    params = list("AAAAAAA")
    for i in range(1,8,1):
        etat = fs[str(i)].value
        params[i-1] = etat
        lgr.debug(etat)
    params = "".join(params)
    lgr.debug("params est"+params)
    r = myCore.sendFunctionRequest('fp', params)
    reponse = json.loads(r)
    printHtmlBegin()
    if not reponse['return_value']:
        print ("OK.")
    else:
        print ("Ouhla, ça n'a pas marché.")
    printHtmlEnd()


def main():

    fs = cgi.FieldStorage()
    lgr.debug(fs)
    if "action" in fs:
        action = fs["action"].value
        lgr.debug("action définie, "+action)
        setfp(fs)
    else:
        lgr.debug("pas d'action")

    ##On met l'entête du fichier
    printHtmlBegin()

    ###div pour les séries à activer/désactiver
    printEtats()

    ##finir la page web
    printHtmlEnd()

if __name__ == "__main__":
    main()
