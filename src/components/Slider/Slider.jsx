import { useEffect, useState } from 'react';
import { SliderMultiRangeHours } from '../SliderMultiRangeHours/SliderMultiRangeHours';
import { typesResponse } from '../SliderMultiRangeHours/constants';

const literalsButtons = { textButtonAdd: 'Add', textButtonDelete: 'Delete' };
const literalsTypesResponse = {
  'type-disable': 'Disable',
  'type-automatic-response': 'Automatic Response',
  'type-operator-assistance': 'Operator Assistance',
  'type-smart-chat': 'SmartChat',
};

const hour1 = [
  {
    start: '15:00',
    end: '19:00',
    typeResponse: typesResponse.typeSmartChat,
  },
];

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

export const Slider = () => {
  const [hoursDBMonday, setHoursDBMonday] = useState(hour1);
  const [hoursDBTuesday, setHoursDBTuesday] = useState(hour2);

  useEffect(() => {
    console.log(hoursDBMonday);
  }, [hoursDBMonday]);

  useEffect(() => {
    console.log(hoursDBTuesday);
  }, [hoursDBTuesday]);

  return (
    <>
      <SliderMultiRangeHours
        title='Lunes'
        hoursDB={hoursDBMonday}
        setHoursDB={setHoursDBMonday}
        literalsButtons={literalsButtons}
        literalsTypesResponse={literalsTypesResponse}
      />
      <SliderMultiRangeHours
        title='Martes'
        hoursDB={hoursDBTuesday}
        setHoursDB={setHoursDBTuesday}
        literalsButtons={literalsButtons}
        literalsTypesResponse={literalsTypesResponse}
      />
    </>
  );
};
