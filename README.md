Un petit serveur en nodejs, bootstrap, expressjs, handlebars pour gérer les chauffages grâce au [programmateur-fil-pilote-wifi](https://github.com/thibdct/programmateur-fil-pilote-wifi).

#Installation
Créer config/default.json à partir de config/default-sample.json et le remplir avec votre device_id et token. On peut spécifier que certains fils pilotes sont désactivés, ils seront mis par défaut sur Arrêt.

npm install

node Server.js

Par défaut, le serveur est dispo à http://localhost:9999

##Disclaimer
Ça marche mais ça peut certainement être amélioré et mieux conçu.
