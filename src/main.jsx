import React from 'react';
import ReactDOM from 'react-dom/client';

import './style.css';

import { SliderMultiRangeHours } from './components/SliderMultiRangeHours/SliderMultiRangeHours';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SliderMultiRangeHours
      literalsButtons={{ textButtonAdd: 'Add', textButtonDelete: 'Delete' }}
      literalsTypesResponse={{
        'type-disable': 'Disable',
        'type-automatic-response': 'Automatic Response',
        'type-operator-assistance': 'Operator Assistance',
        'type-smart-chat': 'SmartChat',
      }}
    />
  </React.StrictMode>
);
