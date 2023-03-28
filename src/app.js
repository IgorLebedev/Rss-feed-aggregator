import i18n from 'i18next';
import axios from 'axios';
import xmlParser from './utils/xmlParser.js';
import validator from './utils/validator.js';
import initWatchedState from './view.js';
import ru from './locales/ru.js';

const initFormListener = (form, state, watchedState) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  validator(inputValue, state.feeds)
    .then((correctUrl) => {
      watchedState.isValid = true;
      watchedState.feeds.push(correctUrl);
      watchedState.error = null;
      const input = document.getElementById('url-input');
      form.reset();
      input.focus();
      return correctUrl;
    })
    .then((correctUrl) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(correctUrl)}`))
    .then((response) => {
      xmlParser(response.data.contents);
    })
    .catch((error) => {
      watchedState.isValid = false;
      watchedState.error = error.message;
    });
});

export default () => {
  const form = document.querySelector('.rss-form');

  const i18nInst = i18n.createInstance();
  i18nInst.init({
    lng: 'ru',
    resources: {
      ru,
    },
  })
    .then(() => {
      const state = {
        isValid: null,
        feeds: [],
        error: null,
      };

      const watchedState = initWatchedState(state, i18nInst);

      initFormListener(form, state, watchedState);
    });
};
