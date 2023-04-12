export const xmlParser = (data) => {
  const parser = new DOMParser();
  const result = parser.parseFromString(data, 'application/xml');
  if (result.querySelector('parsererror')) {
    throw new Error('Invalid RSS');
  }
  return result;
};

export const feedStateBuilder = (url, rss) => {
  try {
    return {
      url,
      title: rss.querySelector('title').textContent,
      description: rss.querySelector('description').textContent,
    };
  } catch {
    throw new Error('Incorrect RSS');
  }
};

export const postsStateBuilder = (rss) => {
  try {
    const postsFromRss = rss.querySelectorAll('item');
    const postsArr = Array.from(postsFromRss).map((post) => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    }));
    return postsArr;
  } catch {
    throw new Error('Incorrect RSS');
  }
};
