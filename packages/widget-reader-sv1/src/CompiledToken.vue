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
  import constants from './constants';

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
        return this.$store.getters[`${READER_NS}/showCommentary`];
      },
      syncCommentary() {
        // TODO: Integrate this with the "scroll to" affordance
        return this.$store.state.reader.syncCommentary;
      },
      commentaries() {
        if (!this.commentary) {
          return [];
        }
        const { commentariesHash } = this.$store.state.reader;
        return commentariesHash[this.veRef] || [];
      },
      selectedCommentaries() {
        return this.$store.state.reader.selectedCommentaries || [];
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
          this.addressable && this.$store.state.reader.textMode === 'clickable'
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
          this.$store.dispatch(
            `${READER_NS}/${constants.READER_CLEAR_SELECTED_COMMENTARIES}`,
          );
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
            this.$store.dispatch(
              `${READER_NS}/${constants.READER_SET_SELECTED_COMMENTARIES}`,
              { commentaries: this.commentaries },
            );
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
