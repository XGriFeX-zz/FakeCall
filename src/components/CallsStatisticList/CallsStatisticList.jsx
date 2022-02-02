import React from 'react';
import PropTypes from 'prop-types';
import CallsStatisticItem from '../CallsStatisticItem/CallsStatisticItem';

import styles from './CallsStatisticList.module.sass';
import getAllDuration from '../../utils/getAllDuration';

function CallsStatisticList({ calls }) {
  const time = getAllDuration(calls);

  return (
    <div className={styles.calls}>
      <header className={styles.calls__header}>
        <div className={styles.title}>CALLS</div>
        <div className={styles.calls__header__duration}>
          {`DURATION: ${time.hours}:${time.minutes}:${time.seconds}`}
        </div>
      </header>
      <ul className={styles.calls__list}>
        {
          calls.map((call) => <CallsStatisticItem key={call.id} call={call} />)
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
};

export default CallsStatisticList;
