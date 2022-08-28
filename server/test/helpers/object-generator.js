const getRandomObject = () => {
  const randomObject = {
    randomString: Math.random(),
    randomNumber: Math.floor(Math.random() * 1000),
  };
  return randomObject;
};

module.exports = { getRandomObject };
