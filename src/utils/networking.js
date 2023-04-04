import _ from 'lodash';
import axios from 'axios';
import xmlParser from './xmlParser.js';
import rssStateBuilder from './rssStateBuilder.js';

export const getter = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

export const updater = (currentUrl, watchedState, currentfeedId) => getter(currentUrl)
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
    watchedState.process = 'updated';
  })
  .then(() => updater(currentUrl, watchedState, currentfeedId))
  .catch((e) => {
    throw new Error(e);
  });
