import { config } from '@/config';
import ConfigNotFoundError from '@/errors/types/config-not-found';

import devApi from './developer-api/api';
// import mobileApi from './mobile-api/api';
import webApi from './web-api/api';
import type { ApiParams } from './web-api/utils';

type ApiItem = (id: string, params?: ApiParams) => Promise<any> | null;

interface TwitterApi {
    init: () => void | Promise<void>;
    getUser: ApiItem;
    getUserTweets: ApiItem;
    getUserTweetsAndReplies: ApiItem;
    getUserMedia: ApiItem;
    getUserLikes: ApiItem;
    getUserTweet: ApiItem;
    getSearch: ApiItem;
    getList: ApiItem;
    getHomeTimeline: ApiItem;
    getHomeLatestTimeline: ApiItem;
}

// Select the API at request time. Cloudflare supplies secrets in c.env after
// the Worker module has loaded, so selecting it at module initialization misses them.
const getApi = (): TwitterApi => {
    if (config.twitter.thirdPartyApi || config.twitter.authToken?.length) {
        return webApi;
    }
    if (config.twitter.consumerKey && config.twitter.consumerSecret) {
        return devApi;
    }
    throw new ConfigNotFoundError(`No valid Twitter token found: thirdPartyApi=${Boolean(config.twitter.thirdPartyApi)}, authTokenLength=${config.twitter.authToken?.length ?? 0}`);
};

const dynamicApi: TwitterApi = {
    init: () => getApi().init(),
    getUser: (id, params) => getApi().getUser(id, params),
    getUserTweets: (id, params) => getApi().getUserTweets(id, params),
    getUserTweetsAndReplies: (id, params) => getApi().getUserTweetsAndReplies(id, params),
    getUserMedia: (id, params) => getApi().getUserMedia(id, params),
    getUserLikes: (id, params) => getApi().getUserLikes(id, params),
    getUserTweet: (id, params) => getApi().getUserTweet(id, params),
    getSearch: (id, params) => getApi().getSearch(id, params),
    getList: (id, params) => getApi().getList(id, params),
    getHomeTimeline: (id, params) => getApi().getHomeTimeline(id, params),
    getHomeLatestTimeline: (id, params) => getApi().getHomeLatestTimeline(id, params),
};

export default dynamicApi;
