import moment from "moment-timezone";

function getFormattedDate() {
  return moment()
    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    .format("ddd MMM DD HH:mm:ss z YYYY");
}

export default getFormattedDate;
