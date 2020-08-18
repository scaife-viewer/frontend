import Vue from 'vue';
import Vuex from 'vuex';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

import createStore from '@scaife-viewer/store';

const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-spike-duca-8mwdty.herokuapp.com/graphql/',
});
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
