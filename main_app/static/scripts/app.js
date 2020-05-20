import { updateCountdowns } from "./timerMethods.js";
import { getCookie } from "./shared.js";

function updateNavTimer() {
  const mainTimer = document.querySelector(".main-countdown");
  const today = luxon.DateTime.local();
  mainTimer.setAttribute("data_targetdate", today.toFormat("yyyy-LL-dd"));
  updateCountdowns();
}

//Deals with hamburgler menu
const hamburger = document.getElementById("myTopnav");
hamburger.addEventListener("click", function (event) {
  const button = event.target;
  const navGroup = button.parentNode.parentNode;
  if (navGroup.classList.contains("responsive")) {
    navGroup.classList.remove("responsive");
  } else {
    navGroup.classList.add("responsive");
  }
});

updateNavTimer();
