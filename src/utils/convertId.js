'use strict';

const convertIdToPrettyString = (id) => {
  return `${id.slice(0, 8)}:${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
};

const convertPrettyStringToId = (id) => {
  id = id.split(':').join('');
  id = id.split('-').join('');
  return id;
};

export { convertIdToPrettyString, convertPrettyStringToId };
