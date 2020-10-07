import gql from 'graphql-tag';
import URN from '@scaife-viewer/common';

import {
  MODULE_NS,
  ADD_LEFT_WIDGET,
  ADD_RIGHT_WIDGET,
  CHANGE_MAIN_WIDGET,
  REMOVE_LEFT_WIDGET,
  REMOVE_RIGHT_WIDGET,
  TOGGLE_LEFT_SIDEBAR,
  TOGGLE_RIGHT_SIDEBAR,
  CHANGE_SIDEBAR_VISIBILITY,
  SET_MAIN_LAYOUT_WIDTH_NORMAL,
  SET_MAIN_LAYOUT_WIDTH_WIDE,
  SET_MAIN_LAYOUT_WIDTH_WIDER,
  SELECT_NAMED_ENTITIES,
  CLEAR_NAMED_ENTITIES,
  SET_TEXT_SIZE,
  SET_TEXT_WIDTH,
  SELECT_LINE,
  SELECT_TOKEN,
  CLEAR_TOKEN,
  SET_PASSAGE,
  UPDATE_METADATA,
  PLAY_AUDIO,
  STOP_AUDIO,
  SET_DISPLAY_MODE,
  FETCH_METADATA,
  FETCH_LIBRARY,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
} from './constants';

const displayName = (name) => {
  const isCallable = typeof name === 'function';
  return isCallable ? name() : name;
};

const getDefaultState = () => ({
  rightOpen: true,
  leftOpen: true,
  leftVisible: true,
  rightVisible: true,
  widgets: {
    mainWidget: null,
    right: [],
    left: [],
  },
  mainLayoutFlexClass: 'main-layout-flex-2',
  metadata: null,
  passage: null,
  libraryTree: null,
  displayMode: 'default',
  readerTextSize: 'md',
  readerTextWidth: 'normal',
  nowPlaying: null,
  selectedLine: null,
  selectedToken: null,
  selectedNamedEntities: [],
});

const createStore = client => {
  return {
    namespace: MODULE_NS,
    store: {
      namespaced: true,
      state: getDefaultState,
      getters: {
        metadata: (state) => state.metadata,
        passage: (state) => (state.passage ? new URN(state.passage) : null),
        firstPassageUrn: (state) =>
          state.metadata ? new URN(state.metadata.firstPassageUrn) : null,
        libraryTree: (state) => state.libraryTree,

        interlinearMode: (state) => {
          return state.displayMode === DISPLAY_MODE_INTERLINEAR;
        },
        metricalMode: (state) => {
          return state.displayMode === DISPLAY_MODE_METRICAL;
        },
        namedEntitiesMode: (state) => {
          return state.displayMode === DISPLAY_MODE_NAMED_ENTITIES;
        },
        urn: (state, getters, rootState) => {
          if (!rootState.route) {
            return getters.firstPassageUrn;
          }
          const { urn } = rootState.route.params;
          return urn ? new URN(urn) : getters.firstPassageUrn;
        },
      },
      mutations: {
        [SET_MAIN_LAYOUT_WIDTH_NORMAL]: (state) => {
          state.mainLayoutFlexClass = "main-layout-flex-2";
        },
        [SET_MAIN_LAYOUT_WIDTH_WIDE]: (state) => {
          state.mainLayoutFlexClass = "main-layout-flex-4";
        },
        [SET_MAIN_LAYOUT_WIDTH_WIDER]: (state) => {
          state.mainLayoutFlexClass = "main-layout-flex-6";
        },
        [TOGGLE_LEFT_SIDEBAR]: (state) => {
          state.leftOpen = !state.leftOpen;
        },
        [TOGGLE_RIGHT_SIDEBAR]: (state) => {
          state.rightOpen = !state.rightOpen;
        },
        [ADD_LEFT_WIDGET]: (state, widget) => {
          state.widgets.left = [
            ...state.widgets.left,
            displayName(widget.scaifeConfig.displayName),
          ];
        },
        [ADD_RIGHT_WIDGET]: (state, widget) => {
          state.widgets.right = [
            ...state.widgets.right,
            displayName(widget.scaifeConfig.displayName),
          ];
        },
        [REMOVE_LEFT_WIDGET]: (state, index) => {
          const widgets = [...state.widgets.left];
          widgets.splice(index, 1);
          state.widgets.left = widgets;
        },
        [REMOVE_RIGHT_WIDGET]: (state, index) => {
          const widgets = [...state.widgets.right];
          widgets.splice(index, 1);
          state.widgets.right = widgets;
        },
        [CHANGE_MAIN_WIDGET]: (state, widget) => {
          state.widgets = {
            ...state.widgets,
            mainWidget: displayName(widget.scaifeConfig.displayName),
          };
        },
        [CHANGE_SIDEBAR_VISIBILITY]: (state, { side, bool }) => {
          if (side === "left") {
            state.leftVisible = bool;
          }
          if (side === "right") {
            state.rightVisible = bool;
          }
        },
        [SELECT_TOKEN]: (state, token) => {
          state.selectedToken = token;
        },
        [CLEAR_TOKEN]: (state) => {
          state.selectedToken = null;
        },
        [SELECT_LINE]: (state, ref) => {
          state.selectedLine = ref;
        },
        [STOP_AUDIO]: (state) => {
          state.nowPlaying = null;
        },
        [PLAY_AUDIO]: (state, ref) => {
          state.nowPlaying = ref;
        },
        [SELECT_NAMED_ENTITIES]: (state, entities) => {
          state.selectedNamedEntities = entities;
        },
        [CLEAR_NAMED_ENTITIES]: (state) => {
          state.selectedNamedEntities = [];
        },
        [SET_DISPLAY_MODE]: (state, mode) => {
          state.displayMode = mode;
        },
        [FETCH_METADATA]: (state, metadata) => {
          state.metadata = metadata;
        },
        [FETCH_LIBRARY]: (state, libraryTree) => {
          state.libraryTree = libraryTree;
        },
        [SET_PASSAGE]: (state, urn) => {
          state.passage = urn;
        },
        [SET_TEXT_SIZE]: (state, size) => {
          state.readerTextSize = size;
        },
        [SET_TEXT_WIDTH]: (state, width) => {
          state.readerTextWidth = width;
        },
      },
      actions: {
        [SET_MAIN_LAYOUT_WIDTH_NORMAL]: ({ commit }) => {
          commit(SET_MAIN_LAYOUT_WIDTH_NORMAL);
        },
        [SET_MAIN_LAYOUT_WIDTH_WIDE]: ({ commit }) => {
          commit(SET_MAIN_LAYOUT_WIDTH_WIDE);
        },
        [SET_MAIN_LAYOUT_WIDTH_WIDER]: ({ commit }) => {
          commit(SET_MAIN_LAYOUT_WIDTH_WIDER);
        },
        [TOGGLE_LEFT_SIDEBAR]: ({ commit }) => {
          commit(TOGGLE_LEFT_SIDEBAR);
        },
        [TOGGLE_RIGHT_SIDEBAR]: ({ commit }) => {
          commit(TOGGLE_RIGHT_SIDEBAR);
        },
        [ADD_LEFT_WIDGET]: ({ commit }, { widget }) => {
          commit(ADD_LEFT_WIDGET, widget);
        },
        [ADD_RIGHT_WIDGET]: ({ commit }, { widget }) => {
          commit(ADD_RIGHT_WIDGET, widget);
        },
        [REMOVE_LEFT_WIDGET]: ({ commit }, { index }) => {
          commit(REMOVE_LEFT_WIDGET, index);
        },
        [REMOVE_RIGHT_WIDGET]: ({ commit }, { index }) => {
          commit(REMOVE_RIGHT_WIDGET, index);
        },
        [CHANGE_MAIN_WIDGET]: ({ commit }, { widget }) => {
          commit(CHANGE_MAIN_WIDGET, widget);
        },
        [CHANGE_SIDEBAR_VISIBILITY]: ({ commit }, { side, bool }) => {
          commit(CHANGE_SIDEBAR_VISIBILITY, { side, bool });
        },
        [CLEAR_TOKEN]: ({ commit }) => {
          commit(CLEAR_TOKEN);
        },
        [SELECT_TOKEN]: ({ commit }, { token }) => {
          commit(SELECT_TOKEN, token);
        },
        [SELECT_LINE]: ({ commit }, { ref }) => {
          commit(SELECT_LINE, ref);
        },
        [STOP_AUDIO]: ({ commit }) => {
          commit(STOP_AUDIO);
        },
        [PLAY_AUDIO]: ({ commit }, { ref }) => {
          commit(PLAY_AUDIO, ref);
        },
        [SELECT_NAMED_ENTITIES]: ({ commit }, { entities }) => {
          commit(SELECT_NAMED_ENTITIES, entities);
        },
        [CLEAR_NAMED_ENTITIES]: ({ commit }) => {
          commit(CLEAR_NAMED_ENTITIES);
        },
        [SET_DISPLAY_MODE]: ({ commit }, { mode }) => {
          commit(SET_DISPLAY_MODE, mode);
        },
        [FETCH_METADATA]: ({ commit }) => {
          client
            .query({
              query: gql`
                {
                  versions(first: 1) {
                    edges {
                      node {
                        id
                        metadata
                      }
                    }
                  }
                }
              `,
            })
            .then((data) =>
              commit(
                FETCH_METADATA,
                data.data.versions.edges.map((e) => e.node.metadata).pop()
              )
            );
        },
        [UPDATE_METADATA]: ({ commit }, { urn }) => {
          client
            .query({
              query: gql`
          {
            versions(urn: "${urn}") {
              edges {
                node {
                  id
                  metadata
                }
              }
            }
          }
        `,
            })
            .then((data) =>
              commit(
                FETCH_METADATA,
                data.data.versions.edges.map((e) => e.node.metadata).pop()
              )
            );
        },
        // @@@ should this really be something within scaife-widgets?
        [FETCH_LIBRARY]: ({ commit }) => {
          client
            .query({
              query: gql`
                {
                  tree(urn: "urn:cts:", upTo: "version") {
                    tree
                  }
                }
              `,
            })
            .then((data) => {
              const nid = data.data.tree.tree[0];
              const textGroupsTree = nid.children.reduce((a, b) => {
                return a.concat(b.children);
              }, []);
              commit(FETCH_LIBRARY, textGroupsTree);
            });
        },
        [SET_PASSAGE]: ({ commit }, { urn }) => {
          commit(SET_PASSAGE, urn);
        },
        [SET_TEXT_SIZE]: ({ commit }, { size }) => {
          commit(SET_TEXT_SIZE, size);
        },
        [SET_TEXT_WIDTH]: ({ commit }, { width }) => {
          commit(SET_TEXT_WIDTH, width);
        },
      },
    },
  };
};

export default createStore;
