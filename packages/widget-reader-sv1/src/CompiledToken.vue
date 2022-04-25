<template>
  <span
    :class="[
      t,
      {
        c: clickable,
        selected,
        highlighted,
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
    },
    // NOTE: We're injecting highlighting because the state
    // will not be passed when initializing this component
    // https://vuejs.org/guide/components/provide-inject.html
    inject: ['highlighting'],
    computed: {
      idx() {
        return `${this.w}[${this.i}]`;
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
        return this.$store.getters['reader/annotations'];
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
    methods: {
      processTokenClick(evt) {
        if (evt.metaKey && this.selected) {
          // clear input
          this.$store.dispatch(
            `${READER_NS}/${constants.READER_SET_SELECTED_TOKEN}`,
            { token: null },
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
