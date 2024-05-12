export const generateHoursDB = (hours) => {
  let hoursDB = [];

  let start = hours[0];
  let end = null;
  let typeResponse = null;

  for (let index = 1; index < hours.length; index++) {
    const hour = hours[index];
    if (hour.node) {
      end = hour;

      typeResponse = hours[index - 1].typeResponse;

      hoursDB.push({ start: start.hour, end: end.hour, typeResponse });

      start = hour;
    }
  }

  return hoursDB;
};
