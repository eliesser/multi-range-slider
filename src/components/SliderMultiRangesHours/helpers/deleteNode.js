import { tags } from '../constants'

export const deleteNode = (hours, node, index) => {
  let tag = tags.disable
  let nodeEnd

  if (index > 0 && index < hours.length) {
    for (let i = index + 1; i <= hours.length; i++) {
      if (hours[i].node) {
        nodeEnd = hours[i]
        break
      }

      if (i === 0) {
        tag = tags.disable
        nodeEnd = hours[i]
      } else {
        if (index - 1 === 0) {
          tag = tags.disable
        } else {
          tag = hours[index - 1].tag
        }
      }
    }
  } else {
    tag = tags.disable
    for (let i = 1; i < hours.length; i++) {
      if (hours[i].node) {
        nodeEnd = hours[i]
        break
      }
    }
  }

  let auxHours = [...hours]

  auxHours[index] = {
    ...node,
    node: false,
  }

  const count = auxHours.filter((n) => n.node).length

  if (count === 3) {
    tag = tags.disable
    auxHours = auxHours.map((n, index) =>
      index === 0 || index + 1 === auxHours.length
        ? { ...n }
        : { ...n, node: false, tag }
    )
  }

  return {
    start: node.hour,
    end: nodeEnd.hour,
    tag,
    auxHours,
  }
}
