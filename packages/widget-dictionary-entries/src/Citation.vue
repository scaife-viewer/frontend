<template>
  <!-- non null citations? -->
  <span v-if="noRefs"></span>
  <li v-else-if="hasContent" :class="{ 'ref-only': refsOnly }">
    <ReaderLink v-if="resolveable" :urn="passageUrn" :title="passageUrn">
      <span class="ref">{{ ref }}</span>
    </ReaderLink>
    <span class="ref" v-else-if="ref">
      {{ ref }}
    </span>
    <span class="quote" v-if="quote && !refsOnly">
      {{ quote }}
    </span>
  </li>
</template>
<script>
  import { ReaderLink } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    CITATION_DISPLAY_REFS,
    CITATION_DISPLAY_HIDDEN,
  } from '@scaife-viewer/store';
  export default {
    props: {
      citation: {
        type: Object,
        required: true,
      },
    },
    components: {
      ReaderLink,
    },
    computed: {
      noRefs() {
        return (
          this.$store.state[MODULE_NS].citationDisplay ===
          CITATION_DISPLAY_HIDDEN
        );
      },
      refsOnly() {
        return (
          this.$store.state[MODULE_NS].citationDisplay === CITATION_DISPLAY_REFS
        );
      },
      resolveable() {
        // TODO: Resolve via text parts in the future;
        // for now, we'll just use the destination
        // return this.citation.textPartUrn;
        return this.passageUrn;
      },
      hasContent() {
        return this.refsOnly ? this.ref : this.ref || this.quote;
      },
      ref() {
        return this.citation.ref;
      },
      quote() {
        return this.citation.quote;
      },
      passageUrn() {
        return this.citation.passageUrn;
      },
    },
  };
</script>
<style lang="scss" scoped>
  li.ref-only {
    // TODO: Try these in a grid?
    display: inline-block;
    margin-right: 0.5em;
  }
  .ref {
    padding: 1px 3px 0px 0px;
    border-radius: 1px;
    background-color: #fcfcfc;
  }
  .quote {
    font-family: var(
      --sv-widget-dictionary-entry-citation-quote-font-family,
      'Noto Serif'
    );
  }
</style>
