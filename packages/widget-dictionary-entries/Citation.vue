<template>
  <li v-if="hasContent">
    <ReaderLink v-if="resolveable" :urn="passageUrn" :title="passageUrn">
      <span class="ref">{{ ref }}</span>
    </ReaderLink>
    <span class="ref" v-else-if="ref">
      {{ ref }}
    </span>
    <span class="quote" v-if="quote">
      {{ quote }}
    </span>
  </li>
</template>
<script>
  import { ReaderLink } from '@scaife-viewer/common';

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
      resolveable() {
        // TODO: Resolve via text parts in the future;
        // for now, we'll just use the destination
        // return this.citation.textPartUrn;
        return this.passageUrn;
      },
      hasContent() {
        return this.ref || this.quote;
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
<style scoped>
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
