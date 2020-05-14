# Horizon

## Introduction
<a href='#' target='_blank'>Link to App (once it's done)</a><br/>
Horizon is a simple, event-tracking application where users can enter events that they are looking forward to. Horizon will track these events, let you know how long you have until they happen, and provide a platform for you to share these events with friends (or keep them private, of course) 

## Technologies Used
Horizon is built using Django as the server and templating engine, with PostgreSQL as its database. 

## Build Plan

### Core MVP
The base functionality of Horizon is a clean, clear web page with a well rendered calendar, able to handle users creating, maintaining, and deleting events. Our focus will be on simplicity and usability, creating a first rate user experience, with clean modals, and a focus on fast, client-side rendering. 

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
- Once a user has created an account, they'll be taken to their main page. We aim for a simplistic experience with as little external navigation as possible - users will be able to create and manage events and event permissions all from their main calendar page
- On visiting the main calendar page for the first time (or any time they don't have any events to look forward to in the coming cycle), users will be prompted to enter at least one event on the calendar for the foreseeable future (~ 4 weeks). Once the user has at least one event, the counter at the top of the page will provide them with a countdown for how long they have until that event happens
- If the user selects a given day, the main dashboard pane will populate with the events for that day, as well as an 'Add Event' prompt. Here, a user can edit their existing events for a given date, such as changing dates, descriptions, or anything else that may be necessary. Users can also create new events as they choose. 
- Here at Horizon, we believe that experiences and anticipation are best when shared. To that end, Users are able to add friends to their account and share events with them as they want. Any events they share will show up on their friend's calendars as well. 

## Wire Frames

![Main User Page](/readme-assets/main-page.png)

## ERD

![Core ERD](/readme-assets/core-erd.png)