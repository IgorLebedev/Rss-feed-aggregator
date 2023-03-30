import onChange from 'on-change';
import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';

const processHandler = (process, i18nInst, state) => {
  const messageContainer = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');
  const errorMessage = state.error;
  const rssData = state.rss;
  const button = document.querySelector('[type="submit"]');

  switch (process) {
    case 'updating':
      break;
    case 'processing':
      urlInput.classList.remove('is-invalid');
      messageContainer.textContent = '';
      button.disabled = true;
      break;
    case 'success':
      renderFeeds(rssData.feeds, i18nInst);
      renderPosts(rssData.posts, i18nInst);
      urlInput.classList.remove('is-invalid');
      messageContainer.textContent = i18nInst.t('messages.success');
      messageContainer.classList.add('text-success');
      messageContainer.classList.remove('text-danger');
      button.disabled = false;
      break;
    case 'error':
      urlInput.classList.add('is-invalid');
      messageContainer.textContent = i18nInst.t(`messages.errors.${errorMessage}`);
      messageContainer.classList.add('text-danger');
      messageContainer.classList.remove('text-success');
      button.disabled = false;
      break;
    default:
      throw new Error(`Unexpected state: ${process}`);
  }
};

const initWatchedState = (state, i18nInst) => onChange(state, (path, value) => {
  if (path === 'process') {
    processHandler(value, i18nInst, state);
  }
});

export default initWatchedState;
