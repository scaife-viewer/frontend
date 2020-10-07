import Vue from 'vue';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import { ApolloClient, HttpLink } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';

import createStore from '@scaife-viewer/store';

const link = new HttpLink({
  uri: process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-atlas-dev.scaife-viewer.org/graphql/',
});
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        passageTextParts: {
          merge: false,
        },
      },
    },
  },
});
const client = new ApolloClient({ link, cache });

const apolloProvider = new VueApollo({
  defaultClient: client,
});

const scaifeStore = createStore(client);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    [scaifeStore.namespace]: scaifeStore.store,
  },
});
export { apolloProvider };
