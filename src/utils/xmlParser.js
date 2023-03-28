export default (data) => {
  const parser = new DOMParser();
  const result = parser.parseFromString(data, 'application/xml');
  if (result.querySelector('parsererror')) {
    throw new Error('Invalid RSS');
  }
  return result;
};
