import _ from 'lodash';
import axios from 'axios';
import { xmlParser, postsStateBuilder } from './parsing.js';

export const getter = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

export const updater = (watchedState) => {
  const { feeds } = watchedState.rssData;
  const addGetter = feeds.map(({ url }) => getter(url));
  return Promise.all(addGetter)
    .then((responses) => {
      responses.forEach((response) => {
        watchedState.updatingProcess = 'updating';
        const parsedRss = xmlParser(response.data.contents);
        const oldPosts = watchedState.rssData.posts;
        const postsArr = postsStateBuilder(parsedRss);
        const comparator = (arrayValue, otherValue) => arrayValue.title === otherValue.title;
        const newPosts = _.differenceWith(postsArr, oldPosts, comparator);
        if (newPosts.length > 0) {
          const newPostsWithIds = newPosts.map((post) => ({
            id: _.uniqueId(),
            ...post,
          }));
          oldPosts.unshift(...newPostsWithIds);
        }
      });
      watchedState.updatingProcess = 'updated';
    })
    .catch((e) => {
      throw new Error(e);
    });
};
