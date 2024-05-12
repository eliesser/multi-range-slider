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
import { generateHoursDB } from './helpers/generateHoursDB';

export const SliderMultiRangeHours = ({
  title,
  hoursDB,
  setHoursDB,
  literalsButtons,
  literalsTypesResponse,
}) => {
  const rangeMin = 2;
  const [hours, setHours] = useState([]);
  const [dataToEdit, setDataToEdit] = useState({
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
    const newHours = generateHours(hoursDB);

    setHours(newHours);
  }, []);

  const onSelected = (node, index, action) => {
    if ([actions.add].includes(action) && !dataToEdit.start.length) {
      onAdd(node, index);
      return;
    }

    if ([actions.add].includes(action) && dataToEdit.start.length) {
      onSaveAdd(node, index);
      return;
    }

    if ([actions.none].includes(action) && !node.node) {
      onChangeTypeResponse(index);
      return;
    }

    if ([actions.none].includes(action) && node.node) {
      onEdit(index);
      return;
    }

    if ([actions.edit].includes(action)) {
      onSaveEdit(node, index);
      return;
    }

    if (
      [actions.delete].includes(action) &&
      node.node &&
      index > 0 &&
      index + 1 < hours.length
    ) {
      onDelete(node, index);
      return;
    }
  };

  const onSaveAdd = (node, index) => {
    let updatedHours = [...hours];

    updatedHours[index] = {
      ...node,
      node: true,
    };

    const newDataToEdit = {
      ...dataToEdit,
      end: node.hour,
    };

    updatedHours = onPaintHourRange(updatedHours, newDataToEdit);
    const hoursDBAux = generateHoursDB(updatedHours);

    setHoursDB(hoursDBAux);
    setDataToEdit({
      start: '',
      startIndex: -1,
      end: '',
      endIndex: -1,
    });
    setPreviewRange({
      startIndex: -1,
      endIndex: -1,
    });
    setAction(actions.none);
    setHours(updatedHours);
  };

  const onAdd = (node, index) => {
    let updatedHours = [...hours];

    updatedHours[index] = {
      ...node,
      node: true,
    };

    const newDataToEdit = {
      start: node.hour,
      startIndex: index,
      end: '',
    };

    setDataToEdit(newDataToEdit);
    setHours(updatedHours);
  };

  const onChangeTypeResponse = (index) => {
    let updatedHours = [...hours];

    const rangeByIndex = getRangeByIndex(index, updatedHours);

    updatedHours = onPaintHourRange(updatedHours, {
      ...rangeByIndex,
    });

    const hoursDBAux = generateHoursDB(updatedHours);

    setHoursDB(hoursDBAux);
    setHours(updatedHours);
  };

  const onEdit = (index) => {
    if (index > 0 && index + 1 < hours.length) {
      const editRangeAux = findEditRange(index, hours);

      setEditRange(editRangeAux);
      setAction(actions.edit);
    }
  };

  const onDelete = (node, index) => {
    let { start, end, typeResponse, auxHours } = deleteNode(hours, node, index);

    const newDataToEdit = {
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

    const hoursDBAux = generateHoursDB(newHours);

    setHoursDB(hoursDBAux);
    setHours(newHours);
    setAction(actions.none);
  };

  const onPaintHourRange = (auxHours, newDataToEdit) => {
    if (
      (dataToEdit.start.length && dataToEdit.end.length) ||
      !(dataToEdit.start.length && dataToEdit.end.length)
    ) {
      const newHours = paintHourRange(auxHours, newDataToEdit, action);

      return newHours;
    }

    return auxHours;
  };

  const onEnableAdd = () => {
    setAction(actions.add);

    setDataToEdit({
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

      if (index !== editRange.selected.index) {
        auxHours[index].node = true;
        auxHours[editRange.selected.index].node = false;
      }

      const hoursDBAux = generateHoursDB(auxHours);

      setHoursDB(hoursDBAux);
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
      } else if (index < editRange?.left?.index + rangeMin) {
        start = hours[editRange?.left?.index + rangeMin].hour;
        startIndex = hours[editRange?.left?.index + rangeMin].index;
        end = editRange.selected.hour;
        typeResponse = editRange.right.typeResponse;
      } else if (editRange.preview) {
        if (index > editRange.preview.index) {
          start = editRange.left.hour;
          startIndex = editRange.left.index;
          end = hours[index].hour;
          typeResponse = editRange.left.typeResponse;
        } else if (index < editRange.preview.index) {
          start = hours[index].hour;
          startIndex = hours[index].index;
          end = editRange.right.hour;
          typeResponse = editRange.right.typeResponse;
        }
      }

      const newDataToEdit = {
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
    } else if (
      [actions.add].includes(action) &&
      dataToEdit.start.length &&
      !dataToEdit.end.length
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

  const onEnableDelete = () => {
    setAction(actions.delete);
  };

  return (
    <>
      <div className='slider-container'>
        <div className='slider-container-border'>
          <div>{title}</div>
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
                cantHour={hours.length}
              />
            ))}
          </div>

          <div className='buttons'>
            <button
              className={`button
                ${
                  [actions.add, actions.edit, actions.delete].includes(action)
                    ? 'disable'
                    : ''
                }
              `}
              disabled={!hours.length || action !== actions.none}
              onClick={onEnableAdd}
            >
              {literalsButtons.textButtonAdd}
            </button>
            <button
              className={`button
                ${
                  [actions.add, actions.edit, actions.delete].includes(action)
                    ? 'disable'
                    : ''
                }
              `}
              onClick={onEnableDelete}
              disabled={!hours.length || action !== actions.none}
            >
              {literalsButtons.textButtonDelete}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SliderMultiRangeHours.propTypes = {
  hoursDB: PropTypes.array.isRequired,
  literalsButtons: PropTypes.object.isRequired,
  literalsTypesResponse: PropTypes.object.isRequired,
  setHoursDB: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
