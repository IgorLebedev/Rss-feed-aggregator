import * as Yup from 'yup';

const validator = (urlObj, stateUrls) => {
  const isValid = Yup.object().shape({
    url: Yup.string().url().required().notOneOf(stateUrls),
  });
  return isValid.validate(urlObj);
};

export default validator;
