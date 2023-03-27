const renderMessage = (isValid, value, i18nInst) => {
  const messageContainer = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');
  switch (isValid) {
    case true:
      urlInput.classList.remove('is-invalid');
      messageContainer.textContent = i18nInst.t('messages.success');
      messageContainer.classList.add('text-success');
      messageContainer.classList.remove('text-danger');
      break;
    case false:
      urlInput.classList.add('is-invalid');
      messageContainer.textContent = i18nInst.t(`messages.errors.${value}`);
      messageContainer.classList.add('text-danger');
      messageContainer.classList.remove('text-success');
      break;
    default:
      throw new Error(`Unexpected state: ${isValid}`);
  }
};

const renderPage = () => {
};

export { renderMessage, renderPage };
