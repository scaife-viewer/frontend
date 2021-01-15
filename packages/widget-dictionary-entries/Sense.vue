<template>
  <div :class="[`depth-${sense.depth}`]">
    {{ sense.label }}
    <div class="definition" v-if="sense.definition" v-html="sense.definition" />
    <ul v-if="citations.length > 0">
      <Citation
        v-for="citation in citations"
        :key="citation.id"
        :citation="citation"
      />
    </ul>
  </div>
</template>
<script>
  import Citation from './Citation.vue';

  export default {
    props: {
      sense: {
        type: Object,
        required: true,
      },
    },
    components: {
      Citation,
    },
    computed: {
      citations() {
        const hasCitations =
          this.sense && this.sense.citations.edges.length > 0;
        return !hasCitations
          ? []
          : this.sense.citations.edges.map(edge => {
              const { id, urn, textParts, label, data } = edge.node;
              return {
                id,
                urn,
                label,
                data,
                textPartUrn: textParts.edges
                  .map(t => t.node.urn)
                  .slice(0, 1)[0],
              };
            });
      },
    },
  };
</script>
<style lang="scss" scoped>
  // TODO: Dynamic?
  .depth-1 {
    margin-left: 0.5em;
  }
  .depth-2 {
    margin-left: 1em;
  }
  .depth-3 {
    margin-left: 1.5em;
  }
  .depth-4 {
    margin-left: 2em;
  }
  .depth-5 {
    margin-left: 2.5em;
  }
  .depth-6 {
    margin-left: 3em;
  }
  .depth-7 {
    margin-left: 3.5em;
  }
  .definition {
    padding: 5px;
    color: gray;
  }
</style>
