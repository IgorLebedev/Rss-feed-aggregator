import i18n from 'i18next';
import * as Yup from 'yup';
import _ from 'lodash';
import { xmlParser, feedStateBuilder, postsStateBuilder } from './utils/parsing.js';
import initWatchedState from './view.js';
import { updater, getter } from './utils/networking.js';
import ru from './locales/ru.js';

const validator = (url, stateUrls) => {
  const schema = Yup
    .string()
    .url('Incorrect Url')
    .notOneOf(stateUrls, 'Already Exists')
    .required('Empty field');
  return schema.validate(url);
};

const timeoutWrapper = (fn, time) => setTimeout(() => fn()
  .then(timeoutWrapper(fn, time)), time);

const addId = (feed, posts) => {
  const feedWithId = { id: _.uniqueId(), ...feed };
  const postsWithIds = posts.map((post) => ({ id: _.uniqueId(), ...post }));
  return [feedWithId, postsWithIds];
};

const initFormListener = (form, watchedState) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.addingFeedProcess = 'processing';
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  const activeUrls = watchedState.rssData.feeds.map(({ url }) => url);
  validator(inputValue, activeUrls)
    .then(watchedState.formValidation = 'valid')
    .catch((error) => {
      watchedState.error = error.message;
      watchedState.formValidation = 'error';
      throw error;
    })
    .then(() => getter(inputValue))
    .then((response) => {
      const parsedRss = xmlParser(response.data.contents);
      const feed = feedStateBuilder(inputValue, parsedRss);
      const posts = postsStateBuilder(parsedRss);
      const [feedWithId, postsWithIds] = addId(feed, posts);
      watchedState.rssData.feeds.push(feedWithId);
      watchedState.rssData.posts.unshift(...postsWithIds);
      if (watchedState.updatingProcess === null) {
        timeoutWrapper(() => updater(watchedState), 5000);
        watchedState.updatingProcess = 'updating';
      }
      const input = document.getElementById('url-input');
      form.reset();
      input.focus();
      watchedState.error = null;
      watchedState.addingFeedProcess = 'success';
    })
    .catch((error) => {
      watchedState.error = error.message;
      watchedState.addingFeedProcess = 'error';
    });
});

export default () => {
  const state = {
    addingFeedProcess: null,
    formValidation: null,
    updatingProcess: null,
    rssData: {
      feeds: [],
      posts: [],
    },
    uiState: {
      isButtonCLicked: null,
      readLinks: [],
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
