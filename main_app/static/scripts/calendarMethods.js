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
    content.innerHTML = `${event.fields.title} - ${event.fields.where}`;
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

  // Get the events from the fetch API, using firstDate as the reference
  let csrftoken = getCookie("csrftoken");

  //PYTHON ENDPOINT WE'RE HITTING
  //   path('events/get/<str:start_date>/<str:end_date>',views.get_events, name='get_events'),

  //NEW IMPORTS
  //   from django.db.models import Q
  //   from django.core import serializers

  //NEW GET METHOD
  // @login_required
  // def get_events(request, start_date, end_date):
  //     profile = Profile.objects.get(user=request.user)
  //     events = Event.objects.filter(profile_to_event_rel__profile_id=profile.id).filter(
  //         Q(start_date__gte=start_date) & Q(end_date__lte=end_date))
  //     events_json = serializers.serialize('json', events)
  //     return JsonResponse(events_json, safe=False)

  fetch(
    `/events/get/${firstDate.toFormat("yyyy-LL-dd")}/${firstDate
      .plus({ days: calendarDuration })
      .toFormat("yyyy-LL-dd")}`,
    {
      method: "GET",
      headers: { Accept: "application/json", "X-CSRFToken": csrftoken },
    }
  )
    .then((response) => response.json())
    .then((json) => renderCalendar(JSON.parse(json)))
    .catch((err) => console.log(`Err: ${err}`));
}

const datePicker = document.querySelector("#date-thing");
datePicker.addEventListener("blur", function () {
  setUpCalendar();
});

//Do it the first time
setUpCalendar();
