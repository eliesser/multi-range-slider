import { actions, typesResponse } from '../constants';
import { setTypeResponse } from './setTypeResponse';

export const generateHours = (hoursDb) => {
  let hours = [];

  for (let index = 0; index < 23; index++) {
    const hour = index < 10 ? `0${index}` : `${index}`;

    for (let index2 = 0; index2 < 60; index2 += 15) {
      const minutos = index2 < 10 ? `0${index2}` : `${index2}`;

      // const typeResponse = hoursDb.find((h)=>h.start  `${hour}:${minutos}`)

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

  if (hoursDb.length)
    hoursDb.forEach((h) => {
      hours = setTypeResponse(
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
