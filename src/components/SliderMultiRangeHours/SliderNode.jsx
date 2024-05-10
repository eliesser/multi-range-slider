import PropTypes from 'prop-types';

import { Tooltip } from '@mui/material';

import { actions, typesResponse } from './constants';

export const SliderNode = ({
  hour,
  literalsTypesResponse,
  typeResponse,
  node,
  index,
  action,
  previewRange,
  onSelected,
  onPreviewRange,
}) => {
  return (
    <div className='tooltip'>
      <div
        className={`hour ${
          [actions.add, actions.edit].includes(action)
            ? 'hour-hover cursor-pointer'
            : ([actions.none].includes(action) ||
                ([actions.delete].includes(action) ? node : '')) &&
              'cursor-pointer'
        } ${node && 'node'} ${typeResponse} ${
          index >= previewRange.initIndex && index < previewRange.endIndex
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
          }  ${action === actions.edit && 'edit'} ${
            [actions.delete].includes(action) && 'focus'
          }`}
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
{
  /* <Tooltip
  title={`${
    node || action === actions.add
      ? hour
      : literalsTypesResponse[typeResponse]
  }`}
  placement='top'
  TransitionProps={{ timeout: 0 }}
>
    </Tooltip> */
}

SliderNode.propTypes = {
  hour: PropTypes.string.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
  typeResponse: PropTypes.string.isRequired,
  node: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  previewRange: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  onPreviewRange: PropTypes.func.isRequired,
};
