import onChange from 'on-change';
import i18n from 'i18next';
import validator from './utils/validator.js';
import { renderMessage, renderPage } from './view.js';
import ru from './locales/ru.js';

const initFormListener = (form, state, watchedState) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  const urlObj = { url: inputValue };
  validator(urlObj, state.feeds)
    .then(({ url }) => {
      watchedState.isValid = true;
      watchedState.feeds.push(url);
      watchedState.error = null;
      const input = document.getElementById('url-input');
      form.reset();
      input.focus();
    })
    .catch((error) => {
      watchedState.isValid = false;
      watchedState.error = error.type;
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

      const watchedState = onChange(state, (path, value) => {
        if (path === 'error') {
          renderMessage(state.isValid, value, i18nInst);
        }
        if (path === 'feeds') {
          renderPage(value);
        }
      });

      initFormListener(form, state, watchedState);
    });
};
