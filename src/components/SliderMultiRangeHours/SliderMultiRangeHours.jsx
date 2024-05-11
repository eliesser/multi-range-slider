import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import './css/styles.css';

import { actions } from './constants';
import {
  deleteNodeRange,
  generateHours,
  getRangeByIndex,
  setTypeResponse,
} from './helpers';
import { SliderNode } from './SliderNode';

export const SliderMultiRangeHours = ({
  title = '',
  hoursDb,
  literalsButtons = { textButtonAdd: 'Add', textButtonDelete: 'Delete' },
  literalsTypesResponse = {
    'type-disable': 'Disable',
    'type-automatic-response': 'Automatic Response',
    'type-operator-assistance': 'Operator Assistance',
    'type-smart-chat': 'SmartChat',
  },
}) => {
  const [hours, setHours] = useState([]);
  const [dataToEdit, setDataToEdit] = useState({
    count: 0,
    start: '',
    startIndex: -1,
    end: '',
    endIndex: -1,
  });
  const [action, setAction] = useState(actions.none);
  const [previewRange, setPreviewRange] = useState({
    startIndex: -1,
    endIndex: -1,
  });
  /* const [editRange, setEditRange] = useState({
    startIndex: -1,
    endIndex: -1,
  }); */

  useEffect(() => {
    const newHours = generateHours(hoursDb);

    setHours(newHours);
  }, []);

  const onSelected = (node, index, actionAux, dataToEditAux = dataToEdit) => {
    let auxHours = [...hours];

    if ([actions.add, actions.edit].includes(actionAux)) {
      auxHours[index] = {
        ...node,
        node: true,
      };

      const count = dataToEditAux.count === 2 ? 0 : dataToEditAux.count + 1;

      const newDataToEdit = {
        count,
        start: dataToEditAux.count === 1 ? node.hour : dataToEditAux.start,
        startIndex:
          dataToEditAux.count === 1 ? index : dataToEditAux.startIndex,
        end: dataToEditAux.count === 2 ? node.hour : dataToEditAux.end,
      };

      setDataToEdit(newDataToEdit);

      auxHours = onSetTypeResponse(auxHours, newDataToEdit);

      if (
        newDataToEdit.count === 0 &&
        newDataToEdit.start &&
        newDataToEdit.end
      ) {
        setPreviewRange({
          startIndex: -1,
          endIndex: -1,
        });

        setAction(actions.none);
      }

      setHours(auxHours);
    }

    if (actionAux === actions.none && !node.node) {
      auxHours = onSetTypeResponse(auxHours, {
        count: 0,
        ...getRangeByIndex(index, auxHours),
      });

      setHours(auxHours);
    }

    if (actionAux === actions.none && node.node) onEdit(node, index);

    if (
      actionAux === actions.delete &&
      node.node &&
      index > 0 &&
      index + 1 < hours.length
    )
      onDelete(node, index);
  };

  const onEdit = (/* node, index */) => {
    /* setAction(actions.edit);

    const range = findEditRange(node, index, hours);

    console.log({
      ...range,
      mid: {
        hour: node.hour,
        index,
        typeResponse: node.typeResponse,
      },
    }); */
    /* const dataToEditAux = {
      count: 1,
      start: range.hourStart,
      startIndex: range.hourIndex,
      end: node.hour,
    };

    setDataToEdit(dataToEditAux);

    onSelected(
      node,
      range.hourIndex,
      actions.edit,
      dataToEditAux,
      range.typeResponse
    );

    let auxHours = [...hours];

    auxHours[index] = {
      ...node,
      node: false,
    };

    setHours(auxHours); */
  };

  const onDelete = (node, index) => {
    let { start, end, typeResponse, auxHours } = deleteNodeRange(
      hours,
      node,
      index
    );

    const newDataToEdit = {
      count: 0,
      startIndex: -1,
      start,
      end,
    };

    setDataToEdit(newDataToEdit);

    const newHours = setTypeResponse(
      auxHours,
      newDataToEdit,
      action,
      typeResponse
    );

    setHours(newHours);
    setAction(actions.none);
  };

  const onSetTypeResponse = (auxHours, newDataToEdit) => {
    if (newDataToEdit.count === 0 && newDataToEdit.start && newDataToEdit.end) {
      const newHours = setTypeResponse(auxHours, newDataToEdit, action);

      return newHours;
    }

    return auxHours;
  };

  const onEnableAdd = () => {
    setAction(actions.add);

    setDataToEdit({
      count: 1,
      start: '',
      startIndex: -1,
      end: '',
    });
  };

  const onPreviewRange = (index) => {
    if (
      [actions.add, actions.edit].includes(action) &&
      dataToEdit.count === 2
    ) {
      let startIndex = dataToEdit.startIndex;
      let endIndex = index;

      if (startIndex > endIndex) {
        startIndex = index;
        endIndex = dataToEdit.startIndex;
      }

      setPreviewRange({
        startIndex,
        endIndex,
      });
    }
  };

  const onMouseDownNode = (index, node) => {
    if (node) console.log(index);
  };

  /* const onSaveEdit = () => {
    setAction(actions.none);
  }; */

  const onEnableDelete = () => {
    setAction(actions.delete);
  };

  return (
    <>
      <div>{title}</div>
      <div className='slider-container'>
        <div
          className={`slider ${
            [actions.add, actions.edit, actions.delete].includes(action)
              ? 'active'
              : ''
          }`}
        >
          <div className='hour type-disable'>
            <div className='dot dot-any'></div>
          </div>
          {hours.map((node, index) => (
            <SliderNode
              key={node.hour}
              {...node}
              literalsTypesResponse={literalsTypesResponse}
              index={index}
              action={action}
              previewRange={previewRange}
              onSelected={onSelected}
              onPreviewRange={onPreviewRange}
              onMouseDownNode={onMouseDownNode}
              count={hours.length}
            />
          ))}
        </div>
        <div className='buttons'>
          <button
            disabled={!hours.length || action !== actions.none}
            onClick={onEnableAdd}
          >
            {literalsButtons.textButtonAdd}
          </button>
          {/* <button
            disabled={!hours.length || action !== actions.none}
            hidden={action === actions.edit}
            onClick={onEdit}
          >
            Edit type section
          </button>
          <button hidden={action !== actions.edit} onClick={onSaveEdit}>
            Save type section
          </button> */}
          <button
            onClick={() => onEnableDelete()}
            disabled={!hours.length || action !== actions.none}
          >
            {literalsButtons.textButtonDelete}
          </button>
        </div>
      </div>
    </>
  );
};

SliderMultiRangeHours.propTypes = {
  title: PropTypes.string.isRequired,
  hoursDb: PropTypes.array.isRequired,
  literalsButtons: PropTypes.object.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
};
