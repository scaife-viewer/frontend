<template>
  <div class="treant" :style="{ 'max-width': width }">
    <div :id="`tree-${treeBankId}`" class="tree-container"></div>
  </div>
</template>

<script>
  import './vendor/Treant';
  import './vendor/Treant.css';

  export default {
    props: ['treeBankId', 'tree', 'highlighted', 'config', 'redrawKey'],
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
      onNodeLeave() {
        this.$emit('leave');
      },
      onTreeLoaded() {
        const nodes = this.$el.querySelectorAll('.node');
        nodes.forEach(node => {
          node.addEventListener('mouseenter', this.onNodeEnter);
          node.addEventListener('mouseleave', this.onNodeLeave);
        });
      },
      setWidth() {
        this.width = `${this.$parent.$parent.$el.clientWidth}px`;
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
            container: `#tree-${this.treeBankId}`,
            rootOrientation: 'NORTH',
            scrollbar: 'native',
            levelSeparation: 60,
            connectors: {
              type: 'curve',
              style: {
                'stroke-width': 2,
                stroke: 'navy',
                opacity: 0.3,
              },
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
      highlighted() {
        if (this.highlighted.word === null) {
          this.$el.querySelectorAll('.node.highlight').forEach(node => {
            node.classList.remove('highlight');
          });
          this.$el.querySelectorAll('.node.highlight-parent').forEach(node => {
            node.classList.remove('highlight-parent');
          });
          this.$el.querySelectorAll('.node.highlight-child').forEach(node => {
            node.classList.remove('highlight-child');
          });
        } else {
          this.$el.querySelectorAll('.node').forEach(node => {
            const { text } = node.data.treenode;
            if (text.id === this.highlighted.word) {
              node.classList.add('highlight');
            } else if (text.id === this.highlighted.parent) {
              node.classList.add('highlight-parent');
            } else if (
              (this.highlighted.children || []).indexOf(text.id) > -1
            ) {
              node.classList.add('highlight-child');
            }
          });
        }
      },
      redrawKey() {
        this.onResize();
      },
      tree() {
        this.onResize();
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
    },
  };
</script>
