import renderModal from './renderModal.js';

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
    ul.prepend(li);
  });

  postsContainer.append(mainCard);
  postsContainer.append(ul);
};

export default renderPosts;
