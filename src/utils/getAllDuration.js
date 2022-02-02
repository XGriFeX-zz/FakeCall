import convertDataTime from './convertDataTime';

const getAllDuration = (calls) => {
  const time = calls.reduce((acc, el) => {
    // eslint-disable-next-line no-param-reassign
    acc += (el.date.endTime.getTime() - el.date.startTime.getTime()) / 1000;
    return acc;
  }, 0);

  return convertDataTime(time);
};

export default getAllDuration;
