'use strict';

const convertIdToPrettyString = (id) => {
  return `${id.slice(0, 8)}:${id.slice(9, 13)}-${id.slice(13, 17)}-${id.slice(17, 21)}-${id.slice(21)}`;
};

const convertPrettyStringToId = (id) => {
  id = id.split(':').join('');
  id = id.split('-').join('');
  return id;
};

export { convertIdToPrettyString, convertPrettyStringToId };
