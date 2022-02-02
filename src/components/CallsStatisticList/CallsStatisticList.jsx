import React from 'react';
import PropTypes from 'prop-types';
import CallsStatisticItem from '../CallsStatisticItem/CallsStatisticItem';
import getAllDuration from '../../utils/getAllDuration';

import styles from './CallsStatisticList.module.sass';

function CallsStatisticList({ calls, setCalls }) {
  const { time, avarage } = getAllDuration(calls);
  return (
    <div className={styles.calls}>
      <header className={styles.calls__header}>
        <div className={styles.title}>CALLS</div>
        <div className={styles.calls__header__average__call__time}>
          {`average call time: 
          ${avarage.hours}:${avarage.minutes}:${avarage.seconds}`}
        </div>
        <div className={styles.calls__header__duration}>
          {`duration: ${time.hours}:${time.minutes}:${time.seconds}`}
        </div>
      </header>
      <ul className={styles.calls__list}>
        {
          calls.map(
            (call) => <CallsStatisticItem key={call.id} call={call} setCalls={setCalls} />,
          )
        }
      </ul>
    </div>
  );
}

CallsStatisticList.propTypes = {
  calls: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    data: PropTypes.exact({
      startTime: PropTypes.number,
      endTime: PropTypes.number,
    }),
  })).isRequired,
  setCalls: PropTypes.func.isRequired,
};

export default CallsStatisticList;
