<template>
  <div class="dictionary-entries" :key="urn.absolute">
      <DictionaryEntry
        v-for="(entry, index) in entries"
        :key="urn.absolute + '-idx-' +index"
        :entry="entry"
      />
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import {
    MODULE_NS,
  } from '@scaife-viewer/store';

  import DictionaryEntry from './DictionaryEntry.vue';

  export default {
    scaifeConfig: {
      displayName: 'Dictionary Entries',
    },
    data() {
      return {
        entries: [
          {
            'label': 'sample'
          },
        ],
      };
    },
    components: {
      DictionaryEntry,
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
    }
  }
</script>
