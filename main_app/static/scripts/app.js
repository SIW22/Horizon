import { getCookie, confirmImport } from "./shared.js";

console.log("I'm still alive, though very badly burned");

confirmImport();

const mainEl = document.querySelector("main");
mainEl.addEventListener("click", (event) => {
  //Delete Event
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
