import { sortTypeResponse } from '../constants'

export const getNextTypeResponse = (tag) => {
  const index = sortTypeResponse.indexOf(tag)

  const nextIndex = index === sortTypeResponse.length - 1 ? 0 : index + 1

  return sortTypeResponse[nextIndex]
}
