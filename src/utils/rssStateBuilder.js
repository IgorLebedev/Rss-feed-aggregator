import _ from 'lodash';

export default (url, rss, state) => {
  const { feeds } = state.rss;
  const { posts } = state.rss;

  try {
    const feedObj = {
      url,
      title: rss.querySelector('title').textContent,
      description: rss.querySelector('description').textContent,
    };
    feeds.push(feedObj);

    const postsFromRss = rss.querySelectorAll('item');
    postsFromRss.forEach((post) => {
      const postObj = {
        id: _.uniqueId(),
        title: post.querySelector('title').textContent,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
      };
      posts.push(postObj);
    });
  } catch {
    throw new Error('Incorrect RSS');
  }
};
