import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import './css/styles.css';

import { actions } from './constants';
import {
  deleteNode,
  generateHours,
  getRangeByIndex,
  paintHourRange,
} from './helpers';
import { SliderNode } from './SliderNode';
import { findEditRange } from './helpers/findEditRange';

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
  const rangeMin = 2;
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
  const [editRange, setEditRange] = useState({
    left: null,
    right: null,
    selected: null,
  });

  useEffect(() => {
    const newHours = generateHours(hoursDb);

    setHours(newHours);
  }, []);

  const onSelected = (node, index, action, dataToEditAux = dataToEdit) => {
    if ([actions.add].includes(action)) onAdd(node, index, dataToEditAux);

    if ([actions.none].includes(action) && !node.node)
      onChangeTypeResponse(index);

    if ([actions.none].includes(action) && node.node) onEdit(index);

    if ([actions.edit].includes(action)) onSaveEdit(node, index);

    if (
      [actions.delete].includes(action) &&
      node.node &&
      index > 0 &&
      index + 1 < hours.length
    )
      onDelete(node, index);
  };

  const onChangeTypeResponse = (index) => {
    let auxHours = [...hours];

    const rangeByIndex = getRangeByIndex(index, auxHours);

    auxHours = onPaintHourRange(auxHours, {
      count: 0,
      ...rangeByIndex,
    });

    setHours(auxHours);
  };

  const onAdd = (node, index, dataToEditAux) => {
    let auxHours = [...hours];

    auxHours[index] = {
      ...node,
      node: true,
    };

    const count = dataToEditAux.count === 2 ? 0 : dataToEditAux.count + 1;

    const newDataToEdit = {
      count,
      start: dataToEditAux.count === 1 ? node.hour : dataToEditAux.start,
      startIndex: dataToEditAux.count === 1 ? index : dataToEditAux.startIndex,
      end: dataToEditAux.count === 2 ? node.hour : dataToEditAux.end,
    };

    setDataToEdit(newDataToEdit);

    auxHours = onPaintHourRange(auxHours, newDataToEdit);

    if (newDataToEdit.count === 0 && newDataToEdit.start && newDataToEdit.end) {
      setPreviewRange({
        startIndex: -1,
        endIndex: -1,
      });

      setAction(actions.none);
    }

    setHours(auxHours);
  };

  const onEdit = (index) => {
    const editRangeAux = findEditRange(index, hours);

    setEditRange(editRangeAux);
    setAction(actions.edit);
  };

  const onDelete = (node, index) => {
    let { start, end, typeResponse, auxHours } = deleteNode(hours, node, index);

    const newDataToEdit = {
      count: 0,
      startIndex: -1,
      start,
      end,
    };

    setDataToEdit(newDataToEdit);

    const newHours = paintHourRange(
      auxHours,
      newDataToEdit,
      action,
      typeResponse
    );

    setHours(newHours);
    setAction(actions.none);
  };

  const onPaintHourRange = (auxHours, newDataToEdit) => {
    if (newDataToEdit.count === 0 && newDataToEdit.start && newDataToEdit.end) {
      const newHours = paintHourRange(auxHours, newDataToEdit, action);

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

  const onSaveEdit = (node, index) => {
    if (
      index <= editRange?.right?.index - rangeMin &&
      index >= editRange?.left?.index + rangeMin
    ) {
      const auxHours = [...hours];

      auxHours[index].node = true;
      auxHours[editRange.selected.index].node = false;

      setHours(auxHours);
      setAction(actions.none);
    }
  };

  const onPreviewRange = (index) => {
    if ([actions.edit].includes(action)) {
      let start = null;
      let startIndex = null;
      let end = null;
      let typeResponse = null;

      if (index > editRange?.right?.index - rangeMin) {
        start = editRange.selected.hour;
        startIndex = editRange.selected.index;
        end = hours[editRange?.right?.index - rangeMin].hour;
        typeResponse = editRange.left.typeResponse;
      } else {
        if (index < editRange?.left?.index + rangeMin) {
          start = hours[editRange?.left?.index + rangeMin].hour;
          startIndex = hours[editRange?.left?.index + rangeMin].index;
          end = editRange.selected.hour;
          typeResponse = editRange.right.typeResponse;
        } else {
          if (editRange.preview && index > editRange.preview.index) {
            start = editRange.left.hour;
            startIndex = editRange.left.index;
            end = hours[index].hour;
            typeResponse = editRange.left.typeResponse;
          }

          if (editRange.preview && index < editRange.preview.index) {
            start = hours[index].hour;
            startIndex = hours[index].index;
            end = editRange.right.hour;
            typeResponse = editRange.right.typeResponse;
          }
        }
      }

      const newDataToEdit = {
        count: 0,
        start,
        startIndex,
        end,
      };

      const newHours = paintHourRange(
        hours,
        newDataToEdit,
        actions.edit,
        typeResponse
      );

      setHours(newHours);

      setEditRange({
        ...editRange,
        preview: {
          hour: hours[index].hour,
          index,
          typeResponse: hours[index].typeResponse,
        },
      });
    }

    if ([actions.add].includes(action) && dataToEdit.count === 2) {
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

  const onEnableDelete = () => {
    setAction(actions.delete);
  };

  return (
    <>
      <div>{title}</div>
      <div className='slider-container'>
        <div className='slider'>
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
              editRange={editRange}
              onSelected={onSelected}
              onPreviewRange={onPreviewRange}
              onMouseDownNode={onMouseDownNode}
              rangeMin={rangeMin}
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
