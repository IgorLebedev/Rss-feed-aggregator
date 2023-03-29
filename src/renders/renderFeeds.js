export default (feeds, i18nInst) => {
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
