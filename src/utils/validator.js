import * as Yup from 'yup';

export default (urlObj, stateUrls) => {
  const schema = Yup.object().shape({
    url: Yup.string().url().notOneOf(stateUrls).required(),
  });
  return schema.validate(urlObj);
};
