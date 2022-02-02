import convertDataTime from './convertDataTime';

const getAllDuration = (calls) => {
  const time = calls.reduce((acc, el) => {
    // eslint-disable-next-line no-param-reassign
    acc += Math.floor((el.date.endTime.getTime() - el.date.startTime.getTime()) / 1000);
    return acc;
  }, 0);

  const avarage = time / calls.length;
  return {
    time: convertDataTime(time),
    avarage: convertDataTime(avarage),
  };
};

export default getAllDuration;
