//working status: js working fine 

const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  searchDate = document.querySelector(".date-input"),
  gotoBtn = document.querySelector(".goto-btn");

const eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventWrapperClose = document.querySelector(".close"),
  eventName = document.querySelector(".event-name"),
  eventTimeFrom = document.querySelector(".event-time-from"),
  eventTimeTo = document.querySelector(".event-time-to"),
  addEventFooterBtn = document.querySelector(".add-event-btn"),
  eventList = document.querySelector(".events"),
  eventOptions = document.querySelector(".event-options");

let eventEntries = JSON.parse(localStorage.getItem("todo-list"));

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let isEdited = {status: false, id: -1}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];

//------------------------------Functions--------------------------

// to add days
function initCalendar() {
  //getting the prev month days, all current month days and remaining next month days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  //update date top of calendar
  date.innerHTML = months[month] + " " + year;

  //adding days on dom
  let days = "";

  //prev month days
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  //current month days
  for (let i = 1; i <= lastDate; i++) {
    if (
      i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth()
    ) {
      days += `<div class="day cur-mnth-day today active">${i}</div>`;
    } else {
      days += `<div class="day cur-mnth-day">${i}</div>`;
    }
  }

  //next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  if(eventEntries)addEventMarker()
}

//prev month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

function showEvent() {
  const showDay = parseInt(document.querySelector(".active").innerHTML);
  const showYearMonth = date.innerHTML.split(" ");
  const showYear = parseInt(showYearMonth[1]);
  const showMonth = months.indexOf(`${showYearMonth[0]}`);
  const showDate = new Date(showYear, showMonth, showDay);

  eventDay.innerHTML = dayNames[showDate.getDay()];
  eventDate.textContent = `${showDay} ${showYearMonth}`;
  addEvent();
}

function storeEvent(){
  if (!eventEntries) {
    eventEntries = [];
  }
  if (eventName.value) {
    let newEntry = {
      name: eventName.value,
      timeFrom: eventTimeFrom.value,
      timeTo: eventTimeTo.value,
      date: eventDate.textContent,
      status: "Pending",
      calendarInfo: date.textContent,
      calendarNo: parseInt(document.querySelector(".active").textContent),
    };
    if(isEdited.status === false){
      eventEntries.push(newEntry);
    }else{
      eventEntries[isEdited.id] = newEntry;
    }
    localStorage.setItem("todo-list", JSON.stringify(eventEntries));
  }
  addEvent();
  addEventMarker();
}

function addEvent() {
  let event = ``;
  if (eventEntries) {
    eventEntries.forEach((entry) => {
      if (entry.date === eventDate.textContent) {
        event += `
          <li class="event">
            <div class="title">
                <i class="fa-solid fa-circle"></i>
                <h3 class="event-title" style="text-decoration:${entry.status == "Completed" ? "line-through":"none"}">${entry.name}</h3>
            </div>
            <div class="event-time">${entry.timeFrom} - ${entry.timeTo}</div>
            <i class="${entry.status == "Pending" ? "fa-regular":"fa-solid"} fa-circle-check event-done" onclick='statusChange(${eventEntries.indexOf(
                  entry)})'></i>
            <i class="fa-solid fa-ellipsis-vertical event-options"></i>
            <div class="mod-change">
              <ul style="list-style: none; padding: 0;">
                <li onclick='editTask(${eventEntries.indexOf(
                  entry
                )})'><i class="fa-regular fa-pen-to-square"></i>Edit</li>
                <li onclick='deleteTask(${eventEntries.indexOf(
                  entry
                )})'><i class="fa-solid fa-trash-can"></i>Delete</li>
              </ul>
            </div>
          </li>    
          `;
      }
    });
  }
  eventList.innerHTML = event;
}

function addEventMarker(){
    const filterEntry = eventEntries.filter((entry) => entry.calendarInfo === date.textContent);
    const filterEntryNo = [];
    filterEntry.forEach(key => {
        filterEntryNo.push(key.calendarNo)
    });
    const currDays = document.querySelectorAll(".cur-mnth-day");
    currDays.forEach((day)=>{
        if(filterEntryNo.includes(parseInt(day.textContent))){
            day.classList.add("event-indicator")
        }
    })
}

function deleteTask(entryId){
    eventEntries.splice(entryId, 1);
    localStorage.setItem("todo-list", JSON.stringify(eventEntries));
    showEvent();
    initCalendar();
}
function editTask(entryId){
  addEventBtn.click();
  const editEntry = eventEntries[entryId];
  eventName.value = editEntry.name
  eventTimeFrom.value = editEntry.timeFrom
  eventTimeTo.value = editEntry.timeTo
  isEdited.status = true;
  isEdited.id = entryId;
}
function statusChange(entryId){
  if(eventEntries[entryId].status == "Pending"){
    eventEntries[entryId].status = "Completed";
  }else{
    eventEntries[entryId].status = "Pending"
  }
  localStorage.setItem("todo-list", JSON.stringify(eventEntries));
  showEvent();
}
//-------------------------Function Calls-----------------------

initCalendar();
showEvent();

//------------------------------Events--------------------------

prev.addEventListener("click", (e) => prevMonth());
next.addEventListener("click", (e) => nextMonth());

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
  showEvent();
});

gotoBtn.addEventListener("click", (e) => {
  const arr = searchDate.value.split("-");
  year = parseInt(arr[0]);
  month = parseInt(arr[1]-1);
  activeDay = parseInt(arr[2]);
  today = new Date(year, month, activeDay);
  initCalendar();
  showEvent();
});

daysContainer.addEventListener("click", (e) => {
  daysContainer.childNodes.forEach((day) => {
    day.classList.remove("active");
  });
  if (
    e.target.classList.contains("cur-mnth-day")
  ) {
    e.target.classList.add("active");
    showEvent();
  }
});

addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.add("active");
  addEventBtn.style.display = "none";
});
addEventWrapperClose.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  addEventBtn.style.display = "flex";
});

addEventFooterBtn.addEventListener("click", () => {
  storeEvent();
  eventName.value = '';
  eventTimeFrom.value = '';
  eventTimeTo.value = '';
});

eventList.addEventListener("click",(e)=>{
  event.stopPropagation();
    if(e.target.classList.contains("event-options")){
        e.target.nextElementSibling.classList.toggle("active");
    }
})

