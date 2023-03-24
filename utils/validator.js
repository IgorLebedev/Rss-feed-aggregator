import * as Yup from 'yup';

const validator = (urlObj, stateUrls) => {
  const schema = Yup.object().shape({
    url: Yup.string().url().notOneOf(stateUrls).required(),
  });
  return schema.validate(urlObj);
};

export default validator;
