import { updateCountdowns } from "./timerMethods.js";
import { getCookie } from "./shared.js";

function updateNavTimer() {
  const mainTimer = document.querySelector(".main-countdown");
  const today = luxon.DateTime.local();
  mainTimer.setAttribute("data_targetdate", today.toFormat("yyyy-LL-dd"));
  updateCountdowns();
}

updateNavTimer();
