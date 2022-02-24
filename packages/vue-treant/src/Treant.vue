<template>
  <div class="treant-wrapper">
    <!-- TODO: Move controls to a child component -->
    <div class="controls-container">
      <div class="controls">
        <div class="buttons">
          <small>
            <a
              class="link"
              @click.prevent="
                onResize();
                sliderValue = 100;
              "
            >
              <icon name="home" />
            </a>
          </small>
          <small>
            <a
              class="link"
              @click="
                panzoom.zoomOut({ step: 0.1 });
                sliderValue = convertToSlider(panzoom.getScale());
              "
            >
              <icon name="search-minus" />
            </a>
          </small>
          <small>
            <a
              class="link"
              @click="
                panzoom.zoomIn({ step: 0.1 });
                sliderValue = convertToSlider(panzoom.getScale());
              "
            >
              <icon name="search-plus" />
            </a>
          </small>
          <VueSlider
            :min="20"
            :max="100"
            :step="10"
            v-model="sliderValue"
            :tooltipPlacement="'right'"
            :tooltip-formatter="`${sliderValue}%`"
          />
        </div>
      </div>
    </div>
    <div class="treant" :style="treantStyles">
      <div :id="`tree-${treeBankId}`" class="tree-container" />
    </div>
  </div>
</template>

<script>
  import './vendor/Treant';
  import Panzoom from '@panzoom/panzoom';

  import VueSlider from 'vue-slider-component';

  export default {
    components: {
      VueSlider,
    },
    props: ['treeBankId', 'tree', 'highlighted', 'config', 'redrawKey'],
    data() {
      return {
        treant: null,
        maxWidth: null,
        // NOTE: Setting `max-height` fits Treant into
        // the Panzoom world; if we left it unset, we would be
        // scrolling rather than panning.
        maxHeight: null,
        lastEvent: null,
        sliderValue: 100,
      };
    },
    computed: {
      treantStyles() {
        if (!this.maxWidth) {
          return {
            'max-width': '50vw',
            'max-height': '80vw',
          };
        }
        // NOTE: Around 400 px, our layout ends up breaking, so
        // we will bail and let the browser handle it.
        if (this.maxWidth < 400) {
          return {
            width: 'auto',
          };
        }
        return {
          'max-width': `${this.maxWidth}px`,
          'max-height': `${this.maxHeight}px`,
        };
      },
    },
    methods: {
      // NOTE: Slider works with max 100, but
      // Panzoom expects max 1
      convertFromSlider(value) {
        return value / 100;
      },
      convertToSlider(value) {
        return value * 100;
      },
      updateSlider() {
        this.panzoom.zoom(this.sliderValue);
      },
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
      onAfterClickCollapseSwitch(nodeSwitch, event) {
        // NOTE: This prevents the tree from being
        // "scrolled" out of view in certain situations
        let yOffset = 0;
        const containerHeight = event.target.closest('.Treant').clientHeight;
        if (containerHeight > window.innerHeight) {
          yOffset = (containerHeight - window.innerHeight) * -1;
        }
        this.$nextTick(() => {
          this.panzoom.pan(0, yOffset);
        });
      },
      calculateMaxWidth() {
        let width = document.body.clientWidth;

        // Subtract sidebars
        this.leftWidth = document.querySelector(
          '.left.sidebar-wrapper',
        ).clientWidth;
        width -= this.leftWidth;

        this.rightWidth = document.querySelector(
          '.right.sidebar-wrapper',
        ).clientWidth;
        width -= this.rightWidth;

        // FIXME: Standardize "CSS math" in the most compliant way possible
        const mainWidgetElem = document.querySelector('.main-layout > .widget');
        const mainPadding = parseInt(
          window.getComputedStyle(mainWidgetElem).paddingLeft,
          10,
        );

        const paginatorWidth = document.querySelector('.paginator').clientWidth;

        const readerElem = document.querySelector('.reader');
        const readerMargin = parseInt(
          window.getComputedStyle(readerElem).marginLeft,
          10,
        );
        const everythingElse =
          (mainPadding + paginatorWidth + readerMargin) * 2;
        width -= everythingElse;
        return width;
      },
      setConstraints() {
        this.maxHeight = this.$parent.$parent.$el.clientHeight;
        this.maxWidth = this.calculateMaxWidth();
      },
      onResize() {
        this.treant.destroy();
        this.panzoom.destroy();
        this.$nextTick(() => {
          this.setConstraints();
          this.drawTree();
        });
      },
      drawTree() {
        const config = {
          chart: {
            container: `#tree-${this.treeBankId}`,
            rootOrientation: 'NORTH',
            // NOTE: Disable scrolling since panning
            // is enablef
            scrollbar: 'none',
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
              onAfterClickCollapseSwitch: this.onAfterClickCollapseSwitch,
            },
          },
          ...(this.config || {}),
          nodeStructure: this.tree,
        };
        this.treant = new window.Treant(config);
        this.$nextTick(() => {
          this.initializePanzoom();
        });
      },
      onPanzoomMousewheel(event) {
        /*
        FIXME: Document why this was necessary

        */
        // TODO: Add tooltip explaining that shift can be used
        // to scroll
        if (!event.shiftKey) return;
        event.preventDefault();

        const $vm = this;
        const $opts = {
          ...$vm.panzoom.getOptions(),
        };

        const delta =
          event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
        const wheel = delta < 0 ? 1 : -1;
        const scale = $vm.panzoom.getScale();
        function constrainScale(toScale, opts) {
          const result = { scale, opts };
          if (!opts.force && opts.disableZoom) {
            return result;
          }
          result.scale = Math.min(
            Math.max(toScale, opts.minScale),
            opts.maxScale,
          );
          return result;
        }
        const toScale = constrainScale(
          scale * Math.exp((wheel * $opts.step) / 3),
          $opts,
        ).scale;
        $vm.panzoom.zoom(toScale);
      },
      initializePanzoom() {
        const elem = this.$el.querySelector('.tree-container');
        this.panzoom = Panzoom(elem, {
          canvas: true,
          animate: false,
          maxScale: 1,
        });
        // TODO: Vue refs might be cleaner but it is what it is
        const parent = elem.parentElement;
        parent.addEventListener('wheel', this.onPanzoomMousewheel);
      },
    },
    watch: {
      sliderValue: {
        handler(value) {
          const converted = this.convertFromSlider(value);
          this.panzoom.zoom(converted);
        },
      },
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
      this.setConstraints();
      window.addEventListener('resize', this.onResize);
    },
    destroyed() {
      const nodes = this.$el.querySelectorAll('.node');
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', this.onNodeEnter);
        node.removeEventListener('mouseleave', this.onNodeLeave);
      });
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('wheel', this.onPanzoomMousewheel);
    },
    mounted() {
      this.drawTree();
    },
  };
</script>
<style src="./vendor/Treant.css"></style>
<style lang="scss">
  .tree-container {
    // NOTE: This is set to ensure that the entire tree can be drawn
    width: 100vw;
  }
  .controls-container {
    display: flex;
    flex-direction: column-reverse;
    .controls {
      margin-left: auto;
      margin-right: 2em;
      margin-bottom: 1em;
      .link {
        font-size: 18px;
        cursor: pointer;
        margin: 0 0.5rem;
        padding: 0.25rem;
        border-radius: 3px;
      }
      .link:hover {
        color: var(--sv-treant-control-hover-link-text-color, #fff);
        background: var(
          --sv-treant-control-hover-link-background-color,
          #b45141
        );
      }
    }
  }
  $themeColor: #b45141;
  @import '~vue-slider-component/lib/theme/antd.scss';
</style>
