import { typesResponse } from '../constants';

export const generateHours = () => {
  const hours = [];

  for (let index = 0; index < 23; index++) {
    const hour = index < 10 ? `0${index}` : `${index}`;

    for (let index2 = 0; index2 < 60; index2 += 15) {
      const minutos = index2 < 10 ? `0${index2}` : `${index2}`;

      hours.push({
        hour: `${hour}:${minutos}`,
        typeResponse: typesResponse.typeDisable,
        node: false,
      });
    }
  }

  hours.push({
    hour: `23:59`,
    typeResponse: typesResponse.typeDisable,
    node: false,
  });

  return hours;
};
