export default (posts, i18nInst) => {
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

  posts.forEach(({ id, title, link }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.href = link;
    a.classList.add('fw-bold');
    a.setAttribute('data-id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    a.setAttribute('rel', 'noreferrer');
    a.textContent = title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nInst.t('buttons.view');

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  postsContainer.append(mainCard);
  postsContainer.append(ul);
};
