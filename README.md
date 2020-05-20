# Horizon

## Introduction
<a href='https://horizon-jsm-designs.herokuapp.com/' target='_blank'>Link to App</a><br/>
Horizon is a simple, event-tracking application where users can enter events that they are looking forward to. Horizon will track these events, let you know how long you have until they happen, and provide a platform for you to eventually share these events with friends (or keep them private, of course) 

## Technologies Used

- Django
- PostgreSQL
- Heroku
- Luxon
- Cron and (cron jobs)


## Build Plan

### Core MVP
The base functionality of Horizon is a clean, clear web page with a well rendered calendar, able to handle users creating, maintaining, and deleting events. Our focus will be on simplicity and usability, creating a first rate user experience, with clean modals, and a focus on fast, client-side rendering, effective on both mobile and desktop browsers. 

### Additional (but realistic) Features
Once we have the base event functionality in place, we will extend the application to allow for the same clean, clear calendar, but with the addition of shared events across users. While this is a relatively small change, it will require many subtle and not-so-subtle adjustments to the UI and the database methods.

### Stretch Features
Once we have these core features in place, there are a multitude of ways that this model can be extended, such as:

- Linking events to locations through the Google Maps API
- Scheduling recurring emails to users reminding them what good events they have coming up
- Search functionality to allow for finding, say, all upcoming birthdays

## User Stories
Here are some of the ways we expect users to interact with Horizon

- Users must first sign up for Horizon before they can create or view any materials. We respect our users privacy and come from a 'privacy-first' perspective. As such, none of our data is shareable with the public
- Once a user has created an account, they'll be taken to their main page. We aim for a simplistic experience with as little external navigation as possible - users can manage existing events all from their main calendar page, and in the future will be able to handle all event management from the overall calendar
- On visiting the main calendar page, the counter at the top of the page will provide them with a countdown for how long they have until their next event happens
- If the user selects a given day, the main dashboard pane will populate with the events for that day, as well as an 'Add Event' prompt. Here, a user can edit their existing events for the given date, as well as create or delete events
- Here at Horizon, we believe that experiences and anticipation are best when shared. To that end, we intend for Users to be able to add friends to their account and share events with them as they want. Any events they share will show up on their friend's calendars as well. 

## Wire Frames

![Splash](/readme-assets/horizon_splash.jpg)
![Login](/readme-assets/horizon_login.jpg)
![Main](/readme-assets/horizon_main.jpg)
![Mobile Login](/readme-assets/horizon_mobile_1.jpg)
![New](/readme-assets/horizon_new.jpg)
![Edit](/readme-assets/horizon_edit.jpg)
![Social](/readme-assets/horizon_social.jpg)
![Mobile Use](/readme-assets/horizon_mobile_2.jpg)



## ERD

![Core ERD](/readme-assets/core-erd.png)
