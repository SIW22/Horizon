import { getCookie } from "./shared.js";
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
    content.innerHTML = `${event.fields.title} - ${event.fields.where}`;
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
  card.classList.add(["primary-card", "card"]);

  //Render title
  const title = document.createElement("p");
  title.classList.add(["title", "card-content"]);
  title.innerHTML = userEvent.getAttribute("data-title");
  card.appendChild(title);

  //Need to render where, and edit / delete

  cardContainer.appendChild(card);
}

function selectCalendarDate(id) {
  console.log(id);
  //Get our selected date block
  const userEvents = document
    .querySelector(`#${id}`)
    .querySelectorAll(".calendar-event-content");

  const cardContainer = document.querySelector(".cards");
  cardContainer.innerHTML = "";
  userEvents.forEach((userEvent) => {
    renderEventCard(userEvent, cardContainer);
  });

  //Render add event button
  const newEventButton = document.createElement("a");
  newEventButton.style.display = "block";
  newEventButton.setAttribute("href", `/events/new`); //Add the date string at the end of this for optional parameter
  newEventButton.setAttribute("data-selectedDate", `${id}`);
  newEventButton.innerHTML = "Create New Event";
  cardContainer.appendChild(newEventButton);
}

//Adds all the necessary event listeners to main
const main = document.querySelector("main");
//Main inputs
main.addEventListener("input", (event) => {
  //Change the input
  if (event.target.getAttribute("id") === "date-thing") {
    setUpCalendar();
  }
});
//Main clicks
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
});

//Set up the calendar when you first load the page
setUpCalendar();
