import { useEffect, useState } from 'react';

import { SliderMultiRangesHours, tags } from '../SliderMultiRangesHours';
import { getSchedulesBD, buildRangeHoursByDaysOfWeek, saveSchedulesBD, prepareSchedulesToSave, daysOfWeekObject } from './helpers'
import './styles.scss'

const literals = {}
let literalsButtons = {}
const literalsTypesResponse = {}

export const Slider = () => {
  const [rangeHoursByDaysOfWeek, setRangeHoursByDaysOfWeek] = useState({})
  const [schedules, setSchedules] = useState({})

  useEffect(() => {
    literalsButtons = {
      textButtonAdd: 'Add section',
      textButtonCancelAdd: 'Cancel add',
      textButtonDelete: 'Delete section',
      textButtonCancelDelete: 'Cancel delete'
    }

    literalsTypesResponse[tags.disable] = 'Disable'
    literalsTypesResponse[tags.automaticResponse] = 'Automatic response'
    literalsTypesResponse[tags.operatorAssistance] = 'Operator assistance'
    literalsTypesResponse[tags.smartChat] = 'SmartChat'

    literals['title'] = 'Title'

    const rangeHoursByDaysOfWeekAux = { ...rangeHoursByDaysOfWeek }

    const hours = [
      {
        start: '00:00',
        end: '23:59',
        tag: tags.disable,
      },
    ]

    for (const day in daysOfWeekObject) {
      if (Object.hasOwnProperty.call(daysOfWeekObject, day)) {
        literals[day] = `${day}`
        rangeHoursByDaysOfWeekAux[day] = hours
      }
    }

    setRangeHoursByDaysOfWeek(rangeHoursByDaysOfWeekAux)

    getSchedules()
  }, [])

  const onSetHoursDB = (hours, day) => {
    const rangeHoursByDaysOfWeekAux = { ...rangeHoursByDaysOfWeek }

    rangeHoursByDaysOfWeekAux[day] = hours

    setRangeHoursByDaysOfWeek(rangeHoursByDaysOfWeekAux)

    buildSchedules(rangeHoursByDaysOfWeekAux)
  }

  const getSchedules = async () => {
    const data = await getSchedulesBD()

    console.log(data)

    setSchedules({ automaticResponsesVA: data[0], operatorAssistantVA: data[1], assistant: data[2] })

    let hours = {}

    for (const typesResp of data) {
      buildRangeHoursByDaysOfWeek(hours, typesResp)
    }

    setRangeHoursByDaysOfWeek(hours)
  }

  const buildSchedules = async (rangeHoursByDaysOfWeekAux) => {
    const schedulesAux = prepareSchedulesToSave(rangeHoursByDaysOfWeekAux, schedules)

    await saveSchedulesBD(schedulesAux)

    setSchedules(schedulesAux)
  }

  return (
    <>
      <section className='container-sliders'>
        {
          Object.keys(rangeHoursByDaysOfWeek).map((day) => (
            <SliderMultiRangesHours
              key={day}
              day={day}
              title={(literals[day])}
              hoursDB={rangeHoursByDaysOfWeek[day]}
              onSetHoursDB={onSetHoursDB}
              literalsButtons={literalsButtons}
              literalsTypesResponse={literalsTypesResponse}
              rangeMin={2}
            />
          ))
        }
      </section>
    </>
  );
};
