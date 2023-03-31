import i18n from 'i18next';
import _ from 'lodash';
import getter from './utils/getter.js';
import xmlParser from './utils/xmlParser.js';
import validator from './utils/validator.js';
import rssStateBuilder from './utils/rssStateBuilder.js';
import initWatchedState from './view.js';
import updater from './utils/postsUpdater.js';
import ru from './locales/ru.js';

const idAdder = (feed, posts) => {
  const feedWithId = { id: _.uniqueId(), ...feed };
  const postsWithIds = posts.map((post) => ({ feedId: feedWithId.id, id: _.uniqueId(), ...post }));
  return [feedWithId, postsWithIds];
};

const initFormListener = (form, watchedState) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedState.process = 'processing';
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  const activeUrls = watchedState.rssData.feeds.map(({ url }) => url);
  validator(inputValue, activeUrls)
    .then(() => getter(inputValue))
    .then((response) => {
      const parsedRss = xmlParser(response.data.contents);
      const [feed, posts] = rssStateBuilder(inputValue, parsedRss);
      const [feedWithId, postsWithIds] = idAdder(feed, posts);
      watchedState.rssData.feeds.push(feedWithId);
      watchedState.rssData.posts.unshift(...postsWithIds);
      postsWithIds.forEach(({ id }) => {
        watchedState.uiState[id] = 'unread';
      });
      updater(inputValue, watchedState, feedWithId.id);
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
    rssData: {
      feeds: [],
      posts: [],
    },
    uiState: {},
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
