import onChange from 'on-change';

const renderMessage = (isValid, i18nInst, errorValue) => {
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
      messageContainer.textContent = i18nInst.t(`messages.errors.${errorValue}`);
      messageContainer.classList.add('text-danger');
      messageContainer.classList.remove('text-success');
      break;
    default:
      throw new Error(`Unexpected state: ${isValid}`);
  }
};

const renderPage = () => {
};

const initWatchedState = (state, i18nInst) => onChange(state, (path, value) => {
  if (path === 'error') {
    renderMessage(state.isValid, i18nInst, value);
  }
  if (path === 'feeds') {
    renderMessage(state.isValid, i18nInst);
    renderPage(value);
  }
});

export default initWatchedState;
