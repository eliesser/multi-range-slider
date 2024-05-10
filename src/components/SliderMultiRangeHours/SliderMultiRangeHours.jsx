import { useEffect, useState } from 'react';

import './css/styles.css';

import { actions } from './constants';
import {
  deleteNodeRange,
  generateHours,
  getRangeByIndex,
  setTypeResponse,
} from './helpers';
import { SliderNode } from './SliderNode';

export const SliderMultiRangeHours = () => {
  const [hours, setHours] = useState([]);
  const [dataToEdit, setDataToEdit] = useState({
    count: 0,
    init: '',
    initIndex: -1,
    end: '',
    endIndex: -1,
  });
  const [action, setAction] = useState(actions.none);
  const [previewRange, setPreviewRange] = useState({
    initIndex: -1,
    endIndex: -1,
  });

  useEffect(() => {
    const newHours = generateHours();

    setHours(newHours);
  }, []);

  const onSelected = (node, index, actionAux, dataToEditAux = dataToEdit) => {
    if ([actions.add, actions.edit].includes(actionAux)) {
      const auxHours = [...hours];

      auxHours[index] = {
        ...node,
        node: true,
      };

      setHours(auxHours);

      const count = dataToEditAux.count === 2 ? 0 : dataToEditAux.count + 1;

      const newDataToEdit = {
        count,
        init: dataToEditAux.count === 1 ? node.hour : dataToEditAux.init,
        initIndex: dataToEditAux.count === 1 ? index : dataToEditAux.initIndex,
        end: dataToEditAux.count === 2 ? node.hour : dataToEditAux.end,
      };

      setDataToEdit(newDataToEdit);

      onSetTypeResponse(auxHours, newDataToEdit);

      if (
        newDataToEdit.count === 0 &&
        newDataToEdit.init &&
        newDataToEdit.end
      ) {
        setPreviewRange({
          initIndex: -1,
          endIndex: -1,
        });

        setAction(actions.none);
      }
    }

    if (actionAux === actions.none && !node.node)
      onSetTypeResponse(hours, getRangeByIndex(index, hours));

    if (actionAux === actions.delete && node.node) onDelete(node, index);
  };

  const onDelete = (node, index) => {
    let { init, end, typeResponse, auxHours } = deleteNodeRange(
      hours,
      node,
      index
    );

    const newDataToEdit = {
      count: 0,
      initIndex: -1,
      init,
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
    if (newDataToEdit.count === 0 && newDataToEdit.init && newDataToEdit.end) {
      const newHours = setTypeResponse(auxHours, newDataToEdit, action);

      setHours(newHours);
    }
  };

  const onEnableAdd = () => {
    setAction(actions.add);

    setDataToEdit({
      count: 1,
      init: '',
      initIndex: -1,
      end: '',
    });
  };

  const onPreviewRange = (index) => {
    if (
      [actions.add, actions.edit].includes(action) &&
      dataToEdit.count === 2
    ) {
      let initIndex = dataToEdit.initIndex;
      let endIndex = index;

      if (initIndex > endIndex) {
        initIndex = index;
        endIndex = dataToEdit.initIndex;
      }

      setPreviewRange({
        initIndex,
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
        <div
          className={`slider ${
            [actions.add, actions.edit, actions.delete].includes(action) &&
            'active'
          }`}
        >
          <div className='hour type-disable'>
            <div className='dot dot-any'></div>
          </div>
          {hours.map((node, index) => (
            <SliderNode
              key={node.hour}
              {...node}
              index={index}
              action={action}
              previewRange={previewRange}
              onSelected={onSelected}
              onPreviewRange={onPreviewRange}
              onMouseDownNode={onMouseDownNode}
            />
          ))}
        </div>
        <div className='buttons'>
          <button
            disabled={!hours.length || action !== actions.none}
            onClick={onEnableAdd}
          >
            Add section
          </button>
          <button
            onClick={() => onEnableDelete()}
            disabled={!hours.length || action !== actions.none}
          >
            Delete section
          </button>
        </div>
      </div>
    </>
  );
};
