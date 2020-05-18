import { updateCountdowns } from "./timerMethods.js";

function updateNavTimer() {
  const mainTimer = document.querySelector(".main-countdown");
  mainTimer.setAttribute("data_targetdate", "2020-05-18");
  updateCountdowns();
}

updateNavTimer();
