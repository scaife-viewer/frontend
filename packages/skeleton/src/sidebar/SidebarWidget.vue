<template>
  <div class="widget widget-sidebar">
    <div class="sticky-block">
      <h2>
        <span @click.prevent="toggle">
          <span class="open-toggle">
            <Icon :name="open ? 'chevron-down' : 'chevron-right'" />
          </span>
          <slot name="heading" />
        </span>
        <a
          v-if="editing"
          href="#"
          @click.prevent="$emit('remove')"
          class="remove-link"
        >
          <Icon name="minus-circle" />
        </a>
        <span
          v-if="open & !editing"
          class="fixed-toggle"
          @click.prevent="toggleFix"
        >
          <Icon
            class="fa-flip-horizontal"
            :name="fixed ? 'expand' : 'compress'"
          />
        </span>
      </h2>
      <div v-show="open" class="sticky-body">
        <slot name="sticky" />
      </div>
    </div>
    <div v-show="open" :class="['body', { fixed }]">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
  export default {
    props: ['editing', 'defaults'],
    created() {
      if (this.defaults) {
        this.open = this.defaults.open;
        this.fixed = this.defaults.fixed;
      }
    },
    data() {
      return {
        open: true,
        fixed: false,
      };
    },
    methods: {
      toggle() {
        this.open = !this.open;
      },
      toggleFix() {
        this.fixed = !this.fixed;
      },
    },
  };
</script>

<style lang="scss">
  .remove-link {
    color: var(--sv-sidebar-widget-remove-link-text-color, red);
  }

  .widget {
    background: var(--sv-widget-background-color, #FFF);
    position: relative;
    padding: 0 8px 8px 8px;
    border-bottom: 1px solid var(--sv-widget-bottom-border-color, #e9ecef);
    &:first-of-type {
      border-top: 1px solid var(--sv-widget-top-border-color, #e9ecef);
    }
    .sticky-block {
      background: inherit;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    h2 {
      background: var(--sv-widget-h2-background-color, #FFF);
      padding: 15px 0 5px;
      display: flex;
      justify-content: space-between;
      margin: 0;
      color: var(--sv-widget-h2-text-color, #495057);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      > span:first-of-type {
        flex-grow: 2;
        display: flex;
        .open-toggle {
          text-align: center;
          min-width: 2em;
          color: var(--sv-widget-open-toggle-text-color, #ced4da);
        }
        &:hover .open-toggle {
          color: var(--sv-widget-open-toggle-hover-text-color, #495057);
        }
      }
      .fixed-toggle {
        opacity: 0;
        font-size: 0.9rem;
        max-width: 2em;
        color: var(--sv-widget-fixed-toggle-text-color, #ced4da);
        text-align: right;
        &:hover {
          color: var(--sv-widget-fixed-toggle-hover-text-color, #495057);
        }
      }
    }
    &:hover .fixed-toggle {
      opacity: 1;
    }
    div.sticky-body {
      background: var(--sv-widget-sticky-body-background-color, #FFF);
    }
    div.body {
      position: relative;
      margin: 0;
      &.fixed {
        max-height: 200px;
        overflow-y: auto;
      }
    }
  }
  .widget.widget-sidebar h2 {
    cursor: pointer;
  }
</style>
