<template>
  <tr :class="{ selected }">
    <td>
      <router-link :to="destinationPassage">
        {{ versionAbbreviation }} {{ textPartUrn.reference }}
      </router-link>
    </td>
    <td>
      {{ token.data.wordValue }}
    </td>
    <td>
      {{ token.data.tag }}
    </td>
  </tr>
</template>

<script>
  import URN from '@scaife-viewer/common';

  export default {
    props: ['token', 'passage'],
    computed: {
      textPartUrn() {
        return new URN(this.token.textPartUrn);
      },
      versionAbbreviation() {
        // # FIXME: This is a hack for demo only
        const isIliad = this.textPartUrn.work === 'tlg0012.tlg001.perseus-grc2';
        return isIliad ? 'Il.' : 'Od.';
      },
      destinationPassage() {
        // TODO: Persist lemma selection across page loads
        // also impact Word and ReaderToken selections
        return {
          name: this.$route.name,
          params: { urn: `${this.textPartUrn}` },
          query: this.$route.query,
        };
      },
      selected() {
        return this.textPartUrn.absolute === this.passage.absolute;
      },
    },
  };
</script>
<style scoped scss>
  /* TODO: rem from siblings vs px from dictionary entry */
  a {
    font-size: 0.7rem;
    padding: 0.15rem 0;
  }
  .selected {
    color: var(--sv-widget-passage-lemma-traversal-active-text-color, #000000);
    background: var(
      --sv-widget-passage-lemma-traversal-active-background-color,
      #dee2e6
    );
  }
  td {
    padding-right: 1em;
  }
</style>
