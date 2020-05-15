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
