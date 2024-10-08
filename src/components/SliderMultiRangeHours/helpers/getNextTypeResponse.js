import { sortTypeResponse } from '../constants';

export const getNextTypeResponse = (typeResponse) => {
  const index = sortTypeResponse.indexOf(typeResponse);

  const nextIndex = index === sortTypeResponse.length - 1 ? 0 : index + 1;

  return sortTypeResponse[nextIndex];
};
