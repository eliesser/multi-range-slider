import React from 'react';
import ReactDOM from 'react-dom/client';

import './style.css';

import { SliderMultiRangeHours } from './components/SliderMultiRangeHours/SliderMultiRangeHours';
import { typesResponse } from './components/SliderMultiRangeHours/constants';

const literalsButtons = { textButtonAdd: 'Add', textButtonDelete: 'Delete' };
const literalsTypesResponse = {
  'type-disable': 'Disable',
  'type-automatic-response': 'Automatic Response',
  'type-operator-assistance': 'Operator Assistance',
  'type-smart-chat': 'SmartChat',
};

const hour1 = [];

const hour2 = [
  {
    start: '00:00',
    end: '09:00',
    typeResponse: typesResponse.typeSmartChat,
  },
  {
    start: '09:00',
    end: '14:00',
    typeResponse: typesResponse.typeAutomaticResponse,
  },
  {
    start: '14:00',
    end: '15:00',
    typeResponse: typesResponse.typeSmartChat,
  },
  {
    start: '15:00',
    end: '18:00',
    typeResponse: typesResponse.typeAutomaticResponse,
  },
  {
    start: '18:00',
    end: '23:59',
    typeResponse: typesResponse.typeSmartChat,
  },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SliderMultiRangeHours
      title='Lunes'
      hoursDb={hour1}
      literalsButtons={literalsButtons}
      literalsTypesResponse={literalsTypesResponse}
    />
    <SliderMultiRangeHours
      title='Martes'
      hoursDb={hour2}
      literalsButtons={literalsButtons}
      literalsTypesResponse={literalsTypesResponse}
    />
  </React.StrictMode>
);
