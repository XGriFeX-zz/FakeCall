import React, { useRef } from 'react';
import propTypes from 'prop-types';
import setCorrectDate from '../../utils/setCorrectDate';
import convertDataTime from '../../utils/convertDataTime';

import styles from './CallsStatisticItem.module.sass';

function CallsStatisticItem({ call: { id, date }, setCalls }) {
  const dataTime = useRef(
    convertDataTime((date.endTime.getTime() - date.startTime.getTime()) / 1000),
  );
  return (
    <li className={styles.calls__list__item}>
      <div className={styles.calls__list__item__id}>
        {`ID: ${id}`}
      </div>
      <div className={styles.calls__list__item__date}>
        {`DATE: ${setCorrectDate(date.startTime.getDate())}.${setCorrectDate(date.startTime.getMonth())}.${setCorrectDate(date.startTime.getFullYear())}`}
      </div>
      <div className={styles.calls__list__item__start__end}>
        {
          `
          ${setCorrectDate(date.startTime.getHours())}:${setCorrectDate(date.startTime.getMinutes())}
          -
          ${setCorrectDate(date.endTime.getHours())}:${setCorrectDate(date.endTime.getMinutes())}
          `
        }
      </div>
      <div className={styles.calls__list__item__duration}>
        {`DURATION: ${dataTime.current.hours}`}
        :
        {dataTime.current.minutes}
        :
        {dataTime.current.seconds}
        <button
          className={styles.calls__list__item__duration__trash}
          type="button"
          onClick={() => setCalls(
            (prev) => prev.filter((call) => (call.id !== id ? call : null)),
          )}
        >
          ❌
        </button>
      </div>
    </li>
  );
}

CallsStatisticItem.propTypes = {
  call: propTypes.shape({
    id: propTypes.number.isRequired,
    date: propTypes.exact({
      startTime: propTypes.instanceOf(Date),
      endTime: propTypes.instanceOf(Date),
    }),
  }).isRequired,
  setCalls: propTypes.func.isRequired,
};

export default CallsStatisticItem;
