import PropTypes from 'prop-types';

import { actions, typesResponse } from './constants';

export const SliderNode = ({
  action,
  cantHour,
  editRange,
  hour,
  index,
  literalsTypesResponse,
  node,
  onPreviewRange,
  onSelected,
  previewRange,
  rangeMin,
  typeResponse,
}) => {
  let showNode = false;
  let showHover = false;
  let showCursorPointer = false;
  let showPreviewColorAdd = false;
  let showDot00 = false;
  let showDotFocus = false;
  let showDotHover = false;
  let showLabelHour = false;

  if (
    [actions.add].includes(action) ||
    ([actions.edit].includes(action) &&
      editRange?.preview?.index <= editRange?.right?.index - rangeMin &&
      editRange?.preview?.index >= editRange?.left?.index + rangeMin)
  ) {
    showHover = true;
  } else {
    showHover = false;
  }

  if (
    ([actions.delete, actions.none].includes(action) &&
      node &&
      index > 0 &&
      index + 1 < cantHour) ||
    ([actions.none].includes(action) && !node) ||
    [actions.add].includes(action) ||
    ([actions.edit].includes(action) &&
      editRange?.preview?.index <= editRange?.right?.index - rangeMin &&
      editRange?.preview?.index >= editRange?.left?.index + rangeMin)
  ) {
    showCursorPointer = true;
  } else {
    showCursorPointer = false;
  }

  if (![actions.edit].includes(action)) {
    showNode = node;
  } else {
    if (node) {
      if (
        index !== editRange?.selected?.index ||
        (index !== editRange?.selected?.index &&
          editRange?.preview?.index <= editRange?.right?.index - rangeMin)
      ) {
        showNode = true;
      } else {
        showNode = false;
        showCursorPointer = true;
      }
    } else {
      if (
        editRange?.preview?.index <= editRange?.right?.index - rangeMin &&
        editRange?.preview?.index >= editRange?.left?.index + rangeMin
      ) {
        showHover = true;
        showCursorPointer = true;
      } else {
        showHover = false;
      }

      if (
        (index === editRange?.right?.index - rangeMin &&
          editRange?.preview?.index > editRange?.right?.index - rangeMin) ||
        (index === editRange?.left?.index + rangeMin &&
          editRange?.preview?.index < editRange?.left?.index + rangeMin)
      ) {
        showNode = true;
      } else {
        showNode = false;
      }
    }
  }

  if ([hour.split(':')[0] + ':00', '23:59'].includes(hour)) showDot00 = true;

  if ([actions.delete].includes(action) && index > 0 && index + 1 < cantHour)
    showDotFocus = true;

  if (
    (index > 0 && index + 1 < cantHour && ![actions.edit].includes(action)) ||
    ([actions.edit].includes(action) &&
      editRange?.preview?.index <= editRange?.right?.index - rangeMin &&
      editRange?.preview?.index >= editRange?.left?.index + rangeMin)
  )
    showDotHover = true;

  if ([actions.add].includes(action) && editRange?.selected) {
    if (index >= previewRange.startIndex && index < previewRange.endIndex) {
      showPreviewColorAdd = true;
    } else if (
      index < editRange?.left?.index ||
      index > editRange?.right?.index
    ) {
      showHover = false;
      showCursorPointer = false;
    }
  }

  if ([`${hour.split(':')[0]}:00`, '23:59'].includes(hour))
    showLabelHour = true;

  return (
    <div
      className={`
        hour
        ${showNode ? ' node' : ''}
        ${showHover ? ' hour-hover' : ''}
        ${showCursorPointer ? ' cursor-pointer' : ''}
        ${
          showPreviewColorAdd
            ? ' ' + typesResponse.typeEdit
            : ' ' + typeResponse
        }
      `}
      onMouseEnter={() => onPreviewRange(index)}
      onClick={() => onSelected({ hour, typeResponse, node }, index, action)}
    >
      <div className='tooltip'>
        <span className='tooltip-text'>
          {`${
            node || [actions.add, actions.edit].includes(action)
              ? hour
              : literalsTypesResponse[typeResponse]
          }`}
        </span>
        <div
          className={`
            dot
            ${showDot00 ? ' dot-00' : ' dot-any'}
            ${[actions.edit].includes(action) ? ' edit' : ''}
            ${showDotFocus ? ' focus' : ''}
            ${showDotHover ? ' hover' : ''}
          `}
        ></div>
      </div>

      {showLabelHour && <div className='hour-value'>{hour}</div>}
    </div>
  );
};

SliderNode.propTypes = {
  action: PropTypes.string.isRequired,
  cantHour: PropTypes.number.isRequired,
  editRange: PropTypes.object.isRequired,
  hour: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
  node: PropTypes.bool.isRequired,
  previewRange: PropTypes.object.isRequired,
  typeResponse: PropTypes.string.isRequired,
  rangeMin: PropTypes.number.isRequired,
  onPreviewRange: PropTypes.func.isRequired,
  onSelected: PropTypes.func.isRequired,
};
