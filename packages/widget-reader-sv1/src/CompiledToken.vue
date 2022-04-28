<template>
  <span
    :class="[
      t,
      {
        c: clickable,
        selected,
        highlighted,
        commentary: highlightCommentaries && commentaries.length > 0,
        'selected-commentary': highlightCommentaries && hasSelectedCommentary,
      },
    ]"
    @click="handleClick"
  >
    <slot name="default" />
  </span>
</template>
<script>
  import {
    MODULE_NS,
    CLEAR_SELECTED_COMMENTARIES,
    SET_SELECTED_COMMENTARIES,
  } from '@scaife-viewer/store';

  // TODO: Deprecate constants
  import constants from './constants';

  // TODO: Deprecate READER_NS
  const READER_NS = 'reader';

  export default {
    name: 'compiled-token',
    props: {
      t: { type: String, required: true },
      w: { type: String, required: true },
      i: { type: String, required: true },
      passageIdx: { type: String, required: false },
      veRef: { type: String, required: false },
    },
    // NOTE: We're injecting highlighting because the state
    // will not be passed when initializing this component
    // https://vuejs.org/guide/components/provide-inject.html
    inject: ['highlighting', 'commentary'],
    computed: {
      idx() {
        return `${this.w}[${this.i}]`;
      },
      highlightCommentaries() {
        return this.$store.getters[`${MODULE_NS}/showCommentary`];
      },
      syncCommentary() {
        // TODO: Integrate this with the "scroll to" affordance
        return this.$store.state[MODULE_NS].syncCommentary;
      },
      commentaries() {
        if (!this.commentary) {
          return [];
        }
        const { commentariesHash } = this.$store.state[MODULE_NS];
        return commentariesHash[this.veRef] || [];
      },
      selectedCommentaries() {
        return this.$store.state[MODULE_NS].selectedCommentaries || [];
      },
      hasSelectedCommentary() {
        return (
          this.commentaries.filter(
            id =>
              this.selectedCommentaries.filter(sid => sid === id).length > 0,
          ).length > 0
        );
      },
      addressable() {
        return this.visible && this.highlighting;
      },
      visible() {
        return this.$parent.visible;
      },
      clickable() {
        return (
          this.addressable &&
          this.$store.state[READER_NS].textMode === 'clickable'
        );
      },
      hasAnnotations() {
        return this.addressable && this.annotations.has(this.idx);
      },
      annotations() {
        return this.$store.getters[`${READER_NS}/annotations`];
      },
      selected() {
        return this.hasAnnotations
          ? this.annotations.get(this.idx).selected
          : false;
      },
      highlighted() {
        return this.hasAnnotations
          ? this.annotations.get(this.idx).highlighted
          : false;
      },
    },
    watch: {
      hasSelectedCommentary: {
        // FIXME: immediate:true breaks highlighting from URL
        immediate: true,
        handler(newVal) {
          if (newVal && !this.selected) {
            // TODO: Unify selection along this model;
            // we can update the highlight still but can use this internally
            this.$store
              .dispatch(`${READER_NS}/${constants.READER_SET_SELECTED_TOKEN}`, {
                token: this.idx,
              })
              .then(() => {
                // revisit the "scroll into view" functionality here
                if (this.syncCommentary) {
                  this.$nextTick(() => {
                    this.$el.scrollIntoView();
                  });
                }
              });
          } else if (!newVal && this.selected) {
            this.$store.dispatch(
              `${READER_NS}/${constants.READER_SET_SELECTED_TOKEN}`,
              { token: null },
            );
          }
        },
      },
    },
    methods: {
      processTokenClick(evt) {
        if (evt.metaKey && this.selected) {
          // clear input
          this.$store.dispatch(
            `${READER_NS}/${constants.READER_SET_SELECTED_TOKEN}`,
            { token: null },
          );
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_SELECTED_COMMENTARIES}`);
        } else if (evt.shiftKey) {
          // add to selection
          this.$store.dispatch(
            `${READER_NS}/${constants.READER_SELECT_TOKEN_RANGE}`,
            { token: this.idx },
          );
        } else {
          // set selection
          this.$store.dispatch(
            `${READER_NS}/${constants.READER_SET_SELECTED_TOKEN}`,
            { token: this.idx },
          );
          if (this.commentaries) {
            this.$store.dispatch(`${MODULE_NS}/${SET_SELECTED_COMMENTARIES}`, {
              commentaries: this.commentaries,
            });
          }
        }
        evt.stopPropagation();
      },
      handleClick(e) {
        if (this.clickable) {
          this.processTokenClick(e);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  $selected-color: #def;
  $highlight-color: #fea;
  $commentary-color: #ff6;
  $selected-commentary-color: #9f9;

  span.w.c:hover {
    cursor: pointer;
  }
  span.w.selected,
  span.w.highlighted,
  span.w.commentary {
    border-style: solid;
    border-width: 0 0.1em 0.1em 0.15em;
    margin: 0 -0.1em -0.1em -0.15em;
  }
  span.w.selected {
    background-color: var(
      --sv-widget-reader-token-selected-color,
      $selected-color
    );
    border-color: var(--sv-widget-reader-token-selected-color, $selected-color);
  }
  span.w.highlighted {
    border-color: var(
      --sv-widget-reader-token-highlight-color,
      $highlight-color
    );
    &:not(.selected):not(.commentary) {
      background-color: var(
        --sv-widget-reader-token-highlight-color,
        $highlight-color
      );
    }
    &.selected,
    &.commentary {
      border-width: 0.2em;
    }
  }

  span.w.commentary {
    background-color: var(
      --sv-widget-reader-token-commentary-color,
      $commentary-color
    );
    &:not(.highlighted) {
      border-color: var(
        --sv-widget-reader-token-commentary-color,
        $commentary-color
      );
    }
  }
  span.w.selected-commentary {
    background-color: var(
      --sv-widget-reader-token-commentary-selected-color,
      $selected-commentary-color
    );
    &:not(.highlighted) {
      border-color: var(
        --sv-widget-reader-token-commentary-selected-color,
        $selected-commentary-color
      );
    }
  }
</style>
