import onChange from 'on-change';

const renderModal = (post) => {
  const modal = document.querySelector('.modal-content');
  const title = modal.querySelector('.modal-title');
  const description = modal.querySelector('.modal-body');
  const btnRead = modal.querySelector('.btn-primary');
  title.textContent = post.title;
  description.textContent = post.description;
  btnRead.href = post.link;
};

const renderFeeds = (feeds, i18nInst) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';

  const mainCard = document.createElement('div');
  mainCard.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInst.t('feeds');

  cardBody.append(cardTitle);
  mainCard.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    li.append(h3);
    li.append(p);
    ul.prepend(li);
  });

  feedsContainer.append(mainCard);
  feedsContainer.append(ul);
};

const renderPosts = (watchedState, i18nInst) => {
  const { posts } = watchedState.rssData;
  const { uiState } = watchedState;
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';

  const mainCard = document.createElement('div');
  mainCard.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInst.t('posts');

  cardBody.append(cardTitle);
  mainCard.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.href = post.link;
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    a.setAttribute('rel', 'noreferrer');
    a.textContent = post.title;
    if (uiState[post.id] === 'read') {
      a.classList.add('fw-normal', 'link-secondary');
    } else { a.classList.add('fw-bold'); }

    a.addEventListener('click', () => {
      uiState[post.id] = 'read';
      renderPosts(watchedState, i18nInst);
    });

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nInst.t('buttons.view');

    button.addEventListener('click', () => {
      uiState[post.id] = 'read';
      renderPosts(watchedState, i18nInst);
      renderModal(post, watchedState);
    });

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  postsContainer.append(mainCard);
  postsContainer.append(ul);
};

const processHandler = (process, i18nInst, state) => {
  const messageContainer = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');
  const errorMessage = state.error;
  const { rssData } = state;
  const button = document.querySelector('[type="submit"]');

  switch (process) {
    case 'updating':
      break;
    case 'updated':
      renderPosts(state, i18nInst);
      break;
    case 'processing':
    case 'valid':
      urlInput.classList.remove('is-invalid');
      messageContainer.textContent = '';
      button.disabled = true;
      urlInput.setAttribute('readOnly', true);
      break;
    case 'success':
      renderFeeds(rssData.feeds, i18nInst);
      renderPosts(state, i18nInst);
      urlInput.classList.remove('is-invalid');
      messageContainer.textContent = i18nInst.t('messages.success');
      messageContainer.classList.add('text-success');
      messageContainer.classList.remove('text-danger');
      button.disabled = false;
      urlInput.removeAttribute('readOnly');
      break;
    case 'error':
      urlInput.classList.add('is-invalid');
      messageContainer.textContent = i18nInst.t(`messages.errors.${errorMessage}`);
      messageContainer.classList.add('text-danger');
      messageContainer.classList.remove('text-success');
      button.disabled = false;
      urlInput.removeAttribute('readOnly');
      break;
    default:
      throw new Error(`Unexpected state: ${process}`);
  }
};

const initWatchedState = (state, i18nInst) => onChange(state, (path, value) => {
  if (path === 'parsingProcess') {
    processHandler(value, i18nInst, state);
  } else if (path === 'formValidation') {
    processHandler(value, i18nInst, state);
  }
});

export default initWatchedState;
