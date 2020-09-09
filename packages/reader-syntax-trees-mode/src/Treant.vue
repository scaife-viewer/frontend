<template>
  <div class="treant">
    <div class="tree-container"></div>
  </div>
</template>

<script>
  import 'treantjs';
  import 'treantjs/Treant.css';
  import Raphael from 'treantjs/vendor/raphael';
  window.Raphael = Raphael;

  export default {
    props: ['tree'],
    data() {
      return {
        treant: null,
      };
    },
    mounted() {
      const config = {
        chart: {
          container: '.tree-container',
          rootOrientation: 'NORTH',
          scrollbar: 'native',
          levelSeparation: 60,
          connectors: {
            type: 'curve',
            style: {
              'stroke-width': 2,
              'stroke': 'navy',
              'opacity': 0.3,
            }
          },
          node: {
            collapsable: true,
          }
        },
        nodeStructure: this.tree,
      };
      this.treant = new window.Treant(config);
    }
  }
</script>

<style lang="scss" scoped>

</style>
