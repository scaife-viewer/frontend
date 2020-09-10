<template>
  <div class="treant" :style="{ 'max-width': width }">
    <div class="tree-container"></div>
  </div>
</template>

<script>
  import 'treantjs';
  import 'treantjs/Treant.css';
  import Raphael from 'treantjs/vendor/raphael';
  window.Raphael = Raphael;

  export default {
    props: ['tree', 'highlightedNode', 'config'],
    data() {
      return {
        treant: null,
        width: '600px',
      };
    },
    methods: {
      onNodeEnter(e) {
        const { text } = e.target.data.treenode;
        this.$emit('enter', text);
      },
      onNodeLeave(e) {
        this.$emit('leave');
      },
      onTreeLoaded(args) {
        const nodes = this.$el.querySelectorAll('.node');
        nodes.forEach(node => {
          node.addEventListener('mouseenter', this.onNodeEnter);
          node.addEventListener('mouseleave', this.onNodeLeave);
        });
      },
      setWidth() {
        this.width = `${this.$parent.$el.clientWidth}px`;
      },
      onResize() {
        this.treant.destroy();
        this.$nextTick(() => {
          this.setWidth();
          this.drawTree();
        });
      },
      drawTree() {
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
            },
            callback: {
              onTreeLoaded: this.onTreeLoaded,
            },
          },
          ...(this.config || {}),
          nodeStructure: this.tree,
        };
        this.treant = new window.Treant(config);
      },
    },
    watch: {
      highlightedNode() {
        if (this.highlightedNode === null) {
          this.$el.querySelectorAll('.node.highlight')
            .forEach(node => {
              node.classList.remove('highlight');
            });
        } else {
          this.$el.querySelectorAll('.node')
            .forEach(node => {
              const { text } = node.data.treenode;
              if (text.id === this.highlightedNode) {
                node.classList.add('highlight');
              }
            });
        }
      },
    },
    created() {
      this.setWidth();
      window.addEventListener('resize', this.onResize);
    },
    destroyed() {
      const nodes = this.$el.querySelectorAll('.node');
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', this.onNodeEnter);
        node.removeEventListener('mouseleave', this.onNodeLeave);
      });
      window.removeEventListener('resize', this.onResize);
    },
    mounted() {
      this.drawTree();
    }
  }
</script>

<style lang="scss" scoped>
  .treant {
  }
</style>
