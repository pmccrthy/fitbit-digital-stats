import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { today } from 'user-activity';
import { units, preferences } from "user-settings";
import * as util from "../common/utils";
import { me } from "appbit";
import * as messaging from "messaging";
import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let days = ["SUN","MON","TUE","WED","THU","FRI", "SAT"];
let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

let timeField = document.getElementById("timeField");
let dateField = document.getElementById("dateField");
let ampmField = document.getElementById("ampmField");
let distanceField = document.getElementById("distanceField");
let actminsField = document.getElementById("actminsField");
let stepsField = document.getElementById("stepsField");
let heartrateField = document.getElementById("heartrateField");
let floorsField = document.getElementById("floorsField");
let calsField = document.getElementById("calsField");
let backgroundGradient = document.getElementById("backgroundGradient");
let statsCycle = document.getElementById("stats-cycle");
var hours, mins;
var showDateAndStats = true;

let hrm = new HeartRateSensor();
hrm.onreading = () => {
  heartrateField.text = `${hrm.heartRate}`;
};

let body = new BodyPresenceSensor();
body.onreading = () => {
  if (!body.present) {
    hrm.stop();
    heartrateField.text = "--";
  } else {
    hrm.start();
  }
};

let settings = loadSettings();

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
  catch (ex) {
    return {
      primarycolour: "lightgrey",
      secondarycolour: "dodgerblue",
      showBackgroundGradient: "true"
    };
  }
}

me.addEventListener("unload", saveSettings);

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

messaging.peerSocket.onmessage = evt => {
  if (evt.data.newValue) {
    switch (evt.data.key) {
      case "primaryColour":
        settings.primarycolour = JSON.parse(evt.data.newValue);
        break;
      case "secondaryColour":
        settings.secondarycolour = JSON.parse(evt.data.newValue);
        break;
      case "showBackgroundGradient":
        settings.showBackgroundGradient = JSON.parse(evt.data.newValue); 
        break;
    }
    setColours(settings.primarycolour, settings.secondarycolour, settings.showBackgroundGradient);
  }
};

function setColours(primarycolour, secondarycolour, showBackgroundGradient) {
  let elements = document.getElementsByClassName("primaryColour");
  elements.forEach(function (element) {
    element.style.fill = primarycolour;
  });
 
  elements = document.getElementsByClassName("secondaryColour");
  elements.forEach(function (element) {
    element.style.fill = secondarycolour;
  });
  
  backgroundGradient.gradient.colors.c1 = (showBackgroundGradient ? secondarycolour : "black");
}

timeField.onclick = function(e) {
  showDateAndStats = !showDateAndStats;

  if (showDateAndStats) {
    dateField.style.display="inline";
    statsCycle.style.display="inline";
  } else {
    dateField.style.display="none";
    statsCycle.style.display="none";
  }
}


clock.granularity = "seconds";
clock.ontick = (evt) => { 
  stepsField.text = today.adjusted.steps;
  actminsField.text = today.adjusted.activeMinutes;
  distanceField.text = (units.distance === "metric" ? today.adjusted.distance * 0.001 : today.adjusted.distance * 0.000621371).toFixed(2);
  floorsField.text = today.adjusted.elevationGain;
  calsField.text = today.adjusted.calories;
  
  hours = evt.date.getHours();
  if (preferences.clockDisplay === "12h") {
    ampmField.text = (hours >= 12 ? "PM" : "AM ");
    hours = hours % 12 || 12;
  }
  else {
    ampmField.text = "";
    hours = util.zeroPad(hours);
  }
  timeField.text = `${hours}:${util.zeroPad(evt.date.getMinutes())}`;
  dateField.text = `${days[evt.date.getDay()]} ${evt.date.getDate()} ${months[evt.date.getMonth()]}`
};

setColours(settings.primarycolour, settings.secondarycolour, settings.showBackgroundGradient);
body.start();
document.getElementById("cv2").activate;