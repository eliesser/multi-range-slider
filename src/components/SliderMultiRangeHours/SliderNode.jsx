import PropTypes from 'prop-types';

import { Tooltip } from '@mui/material';

import { actions, typesResponse } from './constants';

export const SliderNode = ({
  hour,
  typeResponse,
  node,
  index,
  action,
  previewRange,
  onSelected,
  onPreviewRange,
}) => {
  return (
    <div
      key={hour}
      className={`hour ${
        [actions.add, actions.edit].includes(action)
          ? 'hour-hover cursor-pointer'
          : ([actions.none].includes(action) ||
              ([actions.delete].includes(action) && node)) &&
            'cursor-pointer'
      } ${node && 'node'} ${typeResponse} ${
        index >= previewRange.initIndex &&
        index < previewRange.endIndex &&
        typesResponse.typeEdit
      }`}
      onMouseEnter={() => onPreviewRange(index)}
      onClick={() => onSelected({ hour, typeResponse, node }, index, action)}
    >
      <Tooltip
        arrow
        title={`${node || action === actions.add ? hour : typeResponse}`}
        placement='top'
        TransitionProps={{ timeout: 0 }}
      >
        <div
          className={`dot ${
            [hour.split(':')[0] + ':00', '23:59'].includes(hour)
              ? 'dot-00'
              : 'dot-any'
          }  ${action === actions.edit && 'edit'} ${
            [actions.delete].includes(action) && 'focus'
          }`}
        ></div>
      </Tooltip>

      <div className='hour-value'>
        {[`${hour.split(':')[0]}:00`, '23:59'].includes(hour) && hour}
      </div>
    </div>
  );
};

SliderNode.propTypes = {
  hour: PropTypes.string.isRequired,
  typeResponse: PropTypes.string.isRequired,
  node: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  previewRange: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onPreviewRange: PropTypes.func.isRequired,
};
