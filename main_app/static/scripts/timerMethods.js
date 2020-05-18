import { getCookie } from "./shared.js";

function queryForMainCountdown() {
  const today = luxon.DateTime.local();
  fetch(
    `/events/get/${today.toFormat("yyyy-LL-dd")}/${today
      .plus({ days: 365 })
      .toFormat("yyyy-LL-dd")}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }
  )
    .then((response) => response.json())
    .then((json) => updateMainCountdown(JSON.parse(json)))
    .catch((err) =>
      console.log(`You must be logged in to see your next good thing`)
    );
}

function getMinTime(eventJson) {
  eventJson.map((event) => {
    const stringTime = event.fields.start_date;
    const dateArray = stringTime.split("-");
    const thisDate = luxon.DateTime.local(
      parseInt(dateArray[0]),
      parseInt(dateArray[1]),
      parseInt(dateArray[2])
    );
    event.luxonTime = thisDate;
  });

  let minTime;
  let minEvent;
  eventJson.forEach((event) => {
    if (minTime === undefined || event.luxonTime.ts < minTime) {
      minTime = event.luxonTime.ts;
      minEvent = event;
    }
  });
  return minEvent;
}

function updateMainCountdown(eventJson) {
  const minTime = getMinTime(eventJson);
  const mainTimer = document.querySelector(".main-countdown");
  mainTimer.setAttribute("data_targetdate", minTime.fields.start_date);
  updateCountdowns();
}

function renderDurationString(timeDifference) {
  if (timeDifference.seconds < 0) {
    return `00:00:00`;
  }
  let adjustedDays = Math.floor(
    luxon.Duration.fromObject(timeDifference).shiftTo("days").get("days")
  );
  const adjustedDifference = luxon.Duration.fromObject({
    days: adjustedDays,
    hours: timeDifference.hours,
    minutes: timeDifference.minutes,
  }).toFormat("dd-hh-mm");
  const splitValues = adjustedDifference.split("-");
  return `${splitValues[0]}:${splitValues[1]}:${splitValues[2]}`;
}

function updateCountdowns() {
  const countdownObjects = document.querySelectorAll(".countdown");
  countdownObjects.forEach((targetObject) => {
    const targetDate = targetObject.getAttribute("data_targetDate");
    const targetDateArray = targetDate.split("-");

    const targetTime = luxon.DateTime.local(
      parseInt(targetDateArray[0]),
      parseInt(targetDateArray[1]),
      parseInt(targetDateArray[2])
    );

    const timeDifference = targetTime
      .diffNow(["years", "months", "days", "hours", "minutes", "seconds"])
      .toObject();

    targetObject.querySelector(".result").innerHTML = renderDurationString(
      timeDifference
    );
  });
}

queryForMainCountdown();

setInterval(function () {
  updateCountdowns();
}, 500);

export { updateCountdowns, queryForMainCountdown };
