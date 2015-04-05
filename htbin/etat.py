#!/usr/bin/env python
# -*- coding: latin-1 -*-
import subprocess
import sqlite3
import re
import Levenshtein
import guessit
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
chauffages = [["Cuisine","3"], ["Entrée","1"], ["Emma","2"], ["Milieu","4"], ["Salon","5"],["Salle de Bain","6"],["Douche","7"]]
etats = myCore.readVariable('etatfp')

def printEtats():
    print '''
	<div class="chauffages">
	<div class="listeChauffages">
	<form name="listeEtat" action="etat.py" method="get">
	<table>
	'''
    print '<td>Pièce</td><td>Confort</td><td>Eco</td><td>Hors-Gel</td><td>Arrêt</td>'
    for chauffage, etat in chauffages:
        etatActuel = etats[int(etat)-1]
        print '<tr>'
        if etat:
            print '<td>'+chauffage+'</td>'
            print '<td><input type="radio" name="'+etat+'" value="C"', "checked" if (etatActuel == "C") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="E"', "checked" if (etatActuel == "E") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="H"', "checked" if (etatActuel == "H") else "", "></td>"
            print '<td><input type="radio" name="'+etat+'" value="A"', "checked" if (etatActuel == "A") else "", "></td>"
    print '''
	</table>
	'<input type="hidden" name="action" value="setFp">'
	</div>
	</div>
	'''

    print '<input type="submit" value="Submit">'
    print '</form>'


def printHtmlBegin():
    print '''
	<!DOCTYPE html>
	<HTML lang="fr"><HEAD>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, user-scalable=yes" />
	<link rel="stylesheet" href="/style.css" />
	<TITLE>Sous-titres</TITLE></HEAD>
	<body>
    '''


def printHtmlEnd():
    print '''
	</body>
	</html>
	'''


def printBack():
    print '''
	<form action="http://subs.lgc.benbadis.fr">
	Revenir vers la page principale <input type="submit" value="Back">
	</form>
	window.location.href = 'http://subs.lgc.benbadis.fr';
	'''



def printJavaScript():
    print '''
	<script type="text/javascript"> src="scripts.js"</script>
	'''


def setfp(fs):
    params = list("AAAAAAA")
    for i in range(1,8,1):
        etat = fs[str(i)].value
        params[i-1] = etat
        #lgr.debug(etat)
    params = "".join(params)
    lgr.debug("params est"+params)




def main():

    fs = cgi.FieldStorage()
    if "action" in fs:
        action = fs["action"].value
        lgr.debug("action définie"+action)
        setfp(fs)
    else:
        lgr.debug("pas d'action")

    #if fs["action"] == "setFp":
    #    commande = "AAAAAAA"
    #    for i in range(1,8):
    #        commande[srt(i)]=fs[srt(i)].value
#
    #lgr.debug(fs["1"])
    #lgr.debug (fs)
    #setfp(fs)
    #url = fs["1"].value
    #action = fs['action'].value

    #print "action is ", action
    #if (action == 'None'):
    #    lgr.debug ('url est '+url)
    #    videoFile = getVideoName(url)

    ##On met l'entête du fichier
    printHtmlBegin()
    #printJavaScript()

    ###div pour les séries à activer/désactiver
    printEtats()

    ##finir la page web
    #printJavaScript()
    printHtmlEnd()


if __name__ == "__main__":
    main()
