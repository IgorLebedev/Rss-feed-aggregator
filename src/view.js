const renderMessage = (value) => {
  const messageContainer = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');
  if (value === null) {
    urlInput.classList.remove('is-invalid');
    messageContainer.textContent = 'RSS успешно загружен';
    messageContainer.classList.add('text-success');
    messageContainer.classList.remove('text-danger');
  } else {
    urlInput.classList.add('is-invalid');
    messageContainer.textContent = value;
    messageContainer.classList.add('text-danger');
    messageContainer.classList.remove('text-success');
  }
};

const renderPage = () => {
};

export { renderMessage, renderPage };
