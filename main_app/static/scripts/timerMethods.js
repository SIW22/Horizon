function renderDurationString(timeDifference) {
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

setInterval(function () {
  updateCountdowns();
}, 500);

export { updateCountdowns };
