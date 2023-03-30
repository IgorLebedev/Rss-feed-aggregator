import _ from 'lodash';
import getter from './getter.js';
import xmlParser from './xmlParser.js';
import rssStateBuilder from './rssStateBuilder.js';

const updater = (currentUrl, watchedState, currentfeedId) => setTimeout(() => getter(currentUrl)
  .then((response) => {
    watchedState.process = 'updating';
    const parsedRss = xmlParser(response.data.contents);
    const oldPosts = watchedState.rssData.posts;
    const filteredById = oldPosts.filter(({ feedId }) => feedId === currentfeedId);
    const [, postsArr] = rssStateBuilder(currentUrl, parsedRss);
    const comparator = (arrayValue, otherValue) => arrayValue.title === otherValue.title;
    const newPosts = _.differenceWith(postsArr, filteredById, comparator);
    const newPostsWithIds = newPosts.map((post) => ({
      feedId: currentfeedId,
      id: _.uniqueId(),
      ...post,
    }));
    if (newPostsWithIds.length > 0) {
      oldPosts.unshift(...newPostsWithIds);
    }
    watchedState.process = 'success';
  })
  .then(() => updater(currentUrl, watchedState, currentfeedId))
  .catch((e) => {
    throw new Error(e);
  }), 5000);

export default updater;
