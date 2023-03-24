import onChange from 'on-change';
import validator from './validator.js';
import { renderMessage, renderPage } from './view.js';

export default () => {
  const state = {
    feeds: [],
    error: null,
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'error') {
      renderMessage(value);
    }
    if (path === 'feeds') {
      renderMessage(state.error);
      renderPage(value);
    }
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    const urlObj = { url: inputValue };
    validator(urlObj, state.feeds)
      .then(({ url }) => {
        watchedState.feeds.push(url);
        watchedState.error = null;
        form.reset();
        form.focus();
      })
      .catch((error) => {
        switch (error.type) {
          case 'url':
            watchedState.error = 'Ссылка должна быть валидным URL';
            break;
          case 'notOneOf':
            watchedState.error = 'RSS уже существует';
            break;
          default:
            throw new Error(`unexpected error type: ${error.type}`);
        }
      });
  });
};
