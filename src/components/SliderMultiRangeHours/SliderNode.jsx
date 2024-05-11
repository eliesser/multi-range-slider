import PropTypes from 'prop-types';

import { actions, typesResponse } from './constants';

export const SliderNode = ({
  action,
  count,
  hour,
  index,
  literalsTypesResponse,
  node,
  onPreviewRange,
  onSelected,
  previewRange,
  typeResponse,
}) => {
  return (
    <div className='tooltip'>
      <div
        className={`hour ${
          [actions.add, actions.edit].includes(action)
            ? 'hour-hover cursor-pointer'
            : [actions.delete, actions.none].includes(action) &&
              node &&
              index > 0 &&
              index + 1 < count
            ? 'cursor-pointer'
            : ''
        } ${node ? 'node' : ''} ${typeResponse} ${
          index >= previewRange.startIndex && index < previewRange.endIndex
            ? typesResponse.typeEdit
            : ''
        }`}
        onMouseEnter={() => onPreviewRange(index)}
        onClick={() => onSelected({ hour, typeResponse, node }, index, action)}
      >
        <div
          className={`dot ${
            [hour.split(':')[0] + ':00', '23:59'].includes(hour)
              ? 'dot-00'
              : 'dot-any'
          }  ${action === actions.edit ? 'edit' : ''} ${
            [actions.delete].includes(action) && index > 0 && index + 1 < count
              ? 'focus'
              : ''
          } ${index > 0 && index + 1 < count ? 'hover' : ''}`}
        >
          <span className='tooltip-text'>{`${
            node || action === actions.add
              ? hour
              : literalsTypesResponse[typeResponse]
          }`}</span>
        </div>

        <div className='hour-value'>
          {[`${hour.split(':')[0]}:00`, '23:59'].includes(hour) && hour}
        </div>
      </div>
    </div>
  );
};

SliderNode.propTypes = {
  hour: PropTypes.string.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
  typeResponse: PropTypes.string.isRequired,
  node: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  previewRange: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onPreviewRange: PropTypes.func.isRequired,
};
