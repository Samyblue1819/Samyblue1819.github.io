// Hours page live status: checks the visitor's current day and time against the shop hours.

// Shop hours by day number (0 = Sunday). Times are in 24-hour format; null means closed all day.
const shopHours = [
  null,                       // Sunday
  { open: 8, close: 19 },     // Monday
  { open: 8, close: 19 },     // Tuesday
  { open: 8, close: 19 },     // Wednesday
  { open: 8, close: 19 },     // Thursday
  { open: 8, close: 19 },     // Friday
  { open: 9, close: 15 }      // Saturday
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Turns a 24-hour number like 15 into "3:00 PM".
function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return twelveHour + ":00 " + suffix;
}

// Looks ahead day by day to find the next time the shop opens.
function findNextOpening(today, hourNow) {
  for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
    const day = (today + daysAhead) % 7;
    const hours = shopHours[day];
    if (hours && (daysAhead > 0 || hourNow < hours.open)) {
      const dayLabel = daysAhead === 0 ? "today" : daysAhead === 1 ? "tomorrow" : dayNames[day];
      return dayLabel + " at " + formatHour(hours.open);
    }
  }
  return "soon";
}

// Writes the open or closed message into the page.
function updateOpenStatus() {
  const now = new Date();
  const today = now.getDay();
  const hourNow = now.getHours() + now.getMinutes() / 60;
  const hours = shopHours[today];
  const statusLine = document.getElementById("open-status");

  if (hours && hourNow >= hours.open && hourNow < hours.close) {
    statusLine.textContent = "We're open right now! Today we close at " + formatHour(hours.close) + ".";
    statusLine.className = "status-open";
  } else {
    statusLine.textContent = "We're closed right now. We open " + findNextOpening(today, hourNow) + ".";
    statusLine.className = "status-closed";
  }
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000); // check again every minute
