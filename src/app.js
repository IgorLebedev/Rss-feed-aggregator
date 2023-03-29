import i18n from 'i18next';
import axios from 'axios';
import xmlParser from './utils/xmlParser.js';
import validator from './utils/validator.js';
import rssStateBuilder from './utils/rssStateBuilder.js';
import initWatchedState from './view.js';
import ru from './locales/ru.js';

const initFormListener = (form, watchedState) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.process = 'processing';
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  const activeUrls = watchedState.rss.feeds.map(({ url }) => url);
  validator(inputValue, activeUrls)
    .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputValue)}`))
    .then((response) => {
      const parsedRss = xmlParser(response.data.contents);
      rssStateBuilder(inputValue, parsedRss, watchedState);
      const input = document.getElementById('url-input');
      form.reset();
      input.focus();
      watchedState.error = null;
      watchedState.process = 'success';
    })
    .catch((error) => {
      watchedState.error = error.message;
      watchedState.process = 'error';
    });
});

export default () => {
  const state = {
    process: null,
    rss: {
      feeds: [],
      posts: [],
    },
    error: null,
  };

  const i18nInst = i18n.createInstance();
  i18nInst.init({
    lng: 'ru',
    resources: {
      ru,
    },
  })
    .then(() => {
      const watchedState = initWatchedState(state, i18nInst);

      const form = document.querySelector('.rss-form');
      initFormListener(form, watchedState);
    });
};
