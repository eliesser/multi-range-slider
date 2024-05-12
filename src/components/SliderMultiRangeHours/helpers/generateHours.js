import { actions, typesResponse } from '../constants';
import { paintHourRange } from './paintHourRange';

export const generateHours = (hoursDB) => {
  let hours = [];

  for (let index = 0; index < 23; index++) {
    const hour = index < 10 ? `0${index}` : `${index}`;

    for (let index2 = 0; index2 < 60; index2 += 15) {
      const minutos = index2 < 10 ? `0${index2}` : `${index2}`;

      hours.push({
        hour: `${hour}:${minutos}`,
        typeResponse: typesResponse.typeDisable,
        node: index === 0 && index2 === 0 ? true : false,
      });
    }
  }

  hours.push({
    hour: `23:59`,
    typeResponse: typesResponse.typeDisable,
    node: true,
  });

  if (hoursDB.length)
    hoursDB.forEach((h) => {
      hours = paintHourRange(
        hours,
        {
          count: 1,
          start: h.start,
          startIndex: -1,
          end: h.end,
        },
        actions.add,
        h.typeResponse
      );
    });

  return hours;
};
