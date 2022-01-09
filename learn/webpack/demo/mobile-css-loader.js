const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    width: {
      type: 'number',
    },
  },
};

module.exports = function loader(source) {
  const options = getOptions(this);
  validate(schema, options, {
    name: 'px2vw Loader',
    baseDataPath: 'options',
  });
  const px2vw = px => px / options.width * 100 + 'vw';
  return source.replace(/(\d+)px/g, (_, px) => px2vw(px));
};
