export default (post) => {
  const modal = document.querySelector('.modal-content');
  const title = modal.querySelector('.modal-title');
  const description = modal.querySelector('.modal-body');
  const btnRead = modal.querySelector('.btn-primary');
  title.textContent = post.title;
  description.textContent = post.description;
  btnRead.href = post.link;
};
