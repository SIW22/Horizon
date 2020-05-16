console.log("I'm still alive, though very badly burned");

const mainEl = document.querySelector("main");
mainEl.addEventListener("click", (event) => {
  //Delete Feeding

  if (event.target.classList.contains("delete-event")) {
    const button = event.target;
    let csrftoken = getCookie("csrftoken");
    fetch(`/events/${button.getAttribute("data_eventid")}/remove_event`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrftoken },
    })
      .then((response) => {
        if (response.status == 200) {
          window.location.href = window.location;
        } else {
          window.location.href = window.location;
        }
      })
      .catch();
  }
});

//Get our CSRF token
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

let currentDate;

function renderCurrentDate(dayBlock, isFirstDay) {
  dayBlock.setAttribute("id", currentDate.toFormat("yyyy-LL-dd"))
  if (currentDate.c.day === 1) {
    dayBlock.innerHTML = `${currentDate.monthShort} - ${currentDate.c.day}`;
  } else {
    dayBlock.innerHTML = `${isFirstDay ? currentDate.monthShort + " - " : ""}${
      currentDate.c.day
    }`;
  }
}

function getRecentSunday(referenceDate) {
  if (referenceDate.weekday === 7) return referenceDate;
  else return referenceDate.plus({ days: -referenceDate.weekday });
}

function renderCalendar() {
  const dayBlocks = document.querySelectorAll(".day-square");

  dayBlocks.forEach((dayBlock) => {
    let isFirstDay;
    if (currentDate === undefined) {
      isFirstDay = true;
      const currentDateData = dayBlock.getAttribute("data_selectedDate");
      const dateArray = currentDateData.split("-");
      const thisDate = luxon.DateTime.local(
        parseInt(dateArray[0]),
        parseInt(dateArray[1]),
        parseInt(dateArray[2])
      );
      currentDate = getRecentSunday(thisDate);
    } else {
      currentDate = currentDate.plus({ days: 1 });
    }
    renderCurrentDate(dayBlock, isFirstDay);
  });
  currentDate = undefined;
}

function rerenderCalendar() {
  const firstDay = document.querySelector(".day-square");
  const datePicker = document.querySelector("#date-thing");
  firstDay.setAttribute("data_selectedDate", datePicker.value);
  renderCalendar();
}

const datePicker = document.querySelector("#date-thing");
datePicker.addEventListener("blur", function () {
  rerenderCalendar();
});

//Do it the first time
renderCalendar();