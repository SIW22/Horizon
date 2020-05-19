import { getCookie } from "./shared.js";
import { updateCountdowns, queryForMainCountdown } from "./timerMethods.js";
let currentDate;
const calendarDuration = 34;

function renderCurrentDate(dayBlock, isFirstDay) {
  dayBlock.setAttribute("id", `date-${currentDate.toFormat("yyyy-LL-dd")}`);
  if (currentDate.c.day === 1) {
    dayBlock.querySelector(
      ".day-square"
    ).innerHTML = `${currentDate.monthShort} - ${currentDate.c.day}`;
  } else {
    dayBlock.querySelector(".day-square").innerHTML = `${
      isFirstDay ? currentDate.monthShort + " - " : ""
    }${currentDate.c.day}`;
  }
}

function renderDayNumbers(dayBlocks) {
  dayBlocks.forEach((dayBlock) => {
    let isFirstDay;
    if (currentDate === undefined) {
      isFirstDay = true;
      const currentDateData = dayBlock
        .querySelector(".day-square")
        .getAttribute("data_selectedDate");
      const dateArray = currentDateData.split("-");
      const thisDate = luxon.DateTime.local(
        parseInt(dateArray[0]),
        parseInt(dateArray[1]),
        parseInt(dateArray[2])
      );
      currentDate = thisDate;
    } else {
      currentDate = currentDate.plus({ days: 1 });
    }
    renderCurrentDate(dayBlock, isFirstDay);
  });
}

function renderEvents(eventsJson) {
  const previousEvents = document.querySelectorAll(".calendar-event-content");
  previousEvents.forEach((previousEvent) => previousEvent.remove());

  eventsJson.forEach((event) => {
    const dateBlock = document.querySelector(
      `#date-${event.fields.start_date}`
    );
    const content = document.createElement("p");
    content.classList.add("calendar-event-content");
    content.setAttribute("id", `event-id-${event.pk}`);
    content.innerHTML = `${event.fields.title}`;
    content.setAttribute("data-pk", event.pk);
    content.setAttribute("data-title", event.fields.title);
    content.setAttribute("data-where", event.fields.where);
    content.setAttribute("data-startDate", event.fields.start_date);
    dateBlock.appendChild(content);
  });
}

function renderCalendar(eventsJson) {
  const dayBlocks = document.querySelectorAll(".day-block");
  renderDayNumbers(dayBlocks);
  renderEvents(eventsJson);
  currentDate = undefined;
}

function getRecentSunday(referenceDate) {
  const dateArray = referenceDate.split("-");
  const thisDate = luxon.DateTime.local(
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(dateArray[2])
  );
  if (thisDate.weekday === 7) return thisDate;
  else return thisDate.plus({ days: -thisDate.weekday });
}

function shiftByWeek(direction) {
  const datePicker = document.querySelector("#date-thing");
  const dateArray = datePicker.value.split("-");
  const thisDate = luxon.DateTime.local(
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(dateArray[2])
  );
  const change = direction === "forward" ? 7 : -7;
  const returnDate = thisDate.plus({ days: change });
  datePicker.value = returnDate.toFormat("yyyy-LL-dd");
  setUpCalendar();
}

function setUpCalendar() {
  const firstDay = document.querySelector(".day-square");
  const datePicker = document.querySelector("#date-thing");
  if (datePicker.value === "") {
    datePicker.value = new Date().toISOString().substring(0, 10);
  }
  const firstDate = getRecentSunday(datePicker.value);
  firstDay.setAttribute("data_selectedDate", firstDate.toFormat("yyyy-LL-dd"));

  fetch(
    `/events/get/${firstDate.toFormat("yyyy-LL-dd")}/${firstDate
      .plus({ days: calendarDuration })
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
    .then((json) => renderCalendar(JSON.parse(json)))
    .catch((err) => console.log(`Err: ${err}`));
}

function renderEventCard(userEvent, cardContainer) {
  const card = document.createElement("div");
  card.classList.add("primary-card", "card");
  card.setAttribute("target-event-id", `${userEvent.id}`);

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");

  const titleTimer = document.createElement("div");

  //Title
  const title = document.createElement("span");
  title.classList.add("event-title");
  title.innerHTML = userEvent.getAttribute("data-title");
  titleTimer.appendChild(title);

  //Timer
  const timer = document.createElement("span");
  timer.classList.add("countdown", "event-countdown");
  timer.setAttribute(
    "data_targetdate",
    userEvent.getAttribute("data-startdate")
  );
  const result = document.createElement("span");
  result.classList.add("result");
  timer.appendChild(result);
  titleTimer.appendChild(timer);
  cardContent.appendChild(titleTimer);

  //Where
  const whereDiv = document.createElement("div");
  const where = document.createElement("p");
  where.classList.add("event-where");
  where.innerHTML = userEvent.getAttribute("data-where");
  whereDiv.appendChild(where);
  cardContent.appendChild(whereDiv);
  card.append(cardContent);

  const eventActions = document.createElement("div");
  eventActions.classList.add("event-actions");
  //Edit
  const editLink = document.createElement("a");
  editLink.classList.add("edit-event", "event-button");
  editLink.setAttribute(
    "href",
    `/events/${userEvent.getAttribute("data-pk")}/edit`
  );

  const editImg = document.createElement("i");
  editImg.classList.add("fas", "fa-pencil-alt");
  editLink.appendChild(editImg);
  eventActions.appendChild(editLink);

  //Delete
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-event", "event-button");
  deleteButton.setAttribute("data-eventId", userEvent.getAttribute("data-pk"));

  const deleteImg = document.createElement("i");
  deleteImg.classList.add("fas", "fa-trash-alt");
  deleteButton.appendChild(deleteImg);
  eventActions.appendChild(deleteButton);

  card.append(eventActions);

  //Add the card to the card container
  cardContainer.appendChild(card);
}

function selectCalendarDate(id) {
  const userEvents = document
    .querySelector(`#${id}`)
    .querySelectorAll(".calendar-event-content");

  const cardContainer = document.querySelector(".cards");
  cardContainer.innerHTML = "";

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const selectedDateString = id.substring(5, id.length);
  const dateArray = selectedDateString.split("-");
  const thisDate = luxon.DateTime.local(
    parseInt(dateArray[0]),
    parseInt(dateArray[1]),
    parseInt(dateArray[2])
  );

  const cleanDate = `${thisDate.monthShort} ${thisDate.c.day}`;
  cardHeader.innerHTML = cleanDate;
  cardContainer.appendChild(cardHeader);

  userEvents.forEach((userEvent) => {
    renderEventCard(userEvent, cardContainer);
  });

  updateCountdowns();

  //Render add event button
  const newEventButton = document.createElement("a");
  newEventButton.style.display = "block";
  const selectedDate = id.substring(5, id.length);
  newEventButton.setAttribute("href", `/events/new/${selectedDate}`); //Add the date string at the end of this for optional parameter
  newEventButton.setAttribute("data-selectedDate", `${selectedDate}`);
  newEventButton.innerHTML = "Create New Event";
  cardContainer.appendChild(newEventButton);
}

function deleteEvent(button) {
  let csrftoken = getCookie("csrftoken");
  fetch(`/events/${button.getAttribute("data-eventid")}/remove_event`, {
    method: "DELETE",
    headers: { "X-CSRFToken": csrftoken },
  })
    .then((response) => {
      if (response.status == 200) {
        //Removes event from calendar
        const calendarEvent = document.querySelector(
          `#${button.parentElement.getAttribute("target-event-id")}`
        );
        calendarEvent.remove();
        //Removes parent event after removing all children
        const parentElement = button.parentElement;
        button.parentElement.innerHTML = "";
        parentElement.remove();

        queryForMainCountdown();
      } else {
        window.location.href = window.location;
      }
    })
    .catch();
}

const main = document.querySelector("main");
main.addEventListener("input", (event) => {
  //Change the input
  if (event.target.getAttribute("id") === "date-thing") {
    setUpCalendar();
  }
});

main.addEventListener("click", (event) => {
  //If you click a day block itself
  if (event.target.classList.contains("day-block")) {
    selectCalendarDate(event.target.getAttribute("id"));
  }
  // If you click inside a day block
  if (
    event.target.classList.contains("calendar-event-content") ||
    event.target.classList.contains("day-square")
  ) {
    selectCalendarDate(event.target.parentElement.getAttribute("id"));
  }

  //If you click the up or down arrow
  if (event.target.classList.contains("arrow")) {
    const direction = event.target.classList.contains("up-one-week")
      ? "reverse"
      : "forward";
    shiftByWeek(direction);
  }
  //Delete event
  if (event.target.classList.contains("delete-event")) {
    deleteEvent(event.target);
  }
});

setUpCalendar();
