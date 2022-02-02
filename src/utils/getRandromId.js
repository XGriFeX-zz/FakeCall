const getRandromId = () => {
  const cache = {};

  return () => {
    const randomId = Math.floor(Math.random() * 1000);
    if (cache[randomId] !== undefined) {
      return randomId;
    }
    cache[randomId] = randomId;
    return randomId;
  };
};

export default getRandromId;
