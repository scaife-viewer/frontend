<template>
  <li v-if="citation.label">
    <ReaderLink v-if="resolveable" :urn="citation.textPartUrn">
      {{ labelOrFallback }}
    </ReaderLink>
    <span v-else>{{ citation.label }}</span>
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
        return this.citation.textPartUrn;
      },
      labelOrFallback() {
        return this.citation.label
          ? this.citation.label
          : this.citation.textPartUrn;
      },
    },
  };
</script>
