import setCorrectDate from './setCorrectDate';

const convertDataTime = (time) => {
  const startHours = Math.floor(time / 3600);
  const startMinutes = Math.floor((time % 3600) / 60);
  const startSeconds = Math.floor(time % 3600 % 60);

  return {
    hours: setCorrectDate(startHours) || '00',
    minutes: setCorrectDate(startMinutes) || '00',
    seconds: setCorrectDate(startSeconds) || '00',
  };
};

export default convertDataTime;
