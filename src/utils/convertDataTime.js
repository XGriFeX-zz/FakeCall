import setCorrectDate from './setCorrectDate';

const convertDataTime = (time) => {
  const startHours = Math.floor(time / 3600);
  const startMinutes = Math.floor((time % 3600) / 60);
  const startSeconds = Math.floor(time % 3600 % 60);

  return {
    hours: setCorrectDate(Math.round(startHours)),
    minutes: setCorrectDate(Math.round(startMinutes)),
    seconds: setCorrectDate(Math.round(startSeconds)),
  };
};

export default convertDataTime;
