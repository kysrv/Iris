const { default: axios } = require("axios");

let API_URL;
if (document.location.origin.includes("localhost")) {
  // * en local l'api sera toujours à la même adresse

  API_URL = `https://${document.location.hostname}:1337`;

  // alert(API_URL);
} else if (document.location.origin.includes("ngrok")) {
  // * si c'est forward sur ngrok l'api sera forcement sur le serveur en lui même
  API_URL = document.location.origin;
} else {
  console.warn("Le fichier de configuration pour trouver l'API test potentiellement invalide (app-config.js)");
  API_URL = `https://${document.location.hostname}`;
}

module.exports = { API_URL: API_URL + "/api" };
