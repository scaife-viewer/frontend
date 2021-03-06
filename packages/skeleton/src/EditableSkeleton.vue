<template>
  <div class="skeleton">
    <SidebarLayout
      v-if="leftVisible"
      class="left"
      :class="sidebarClasses"
      :widgetOptions="sidebarWidgetOptions"
      @changeWidget="widget => addWidget('left', widget)"
      @removeWidget="index => removeWidget('left', index)"
      @editToggle="editing = !editing"
      :widgets="leftWidgets"
      :editing="editing"
    >
      <div slot="button-container" class="button-container">
        <button class="toggle-open" v-if="leftOpen" @click="onLeftToggle">
          <Icon name="arrow-left" />
        </button>
        <button class="toggle-open" v-else @click="onLeftToggle">
          <Icon name="arrow-right" />
        </button>
      </div>
    </SidebarLayout>

    <MainLayout
      @changeWidget="changeWidget"
      @editToggle="editing = !editing"
      :editing="editing"
      :widget="mainWidget"
      :widgetOptions="mainWidgetOptions"
      :isEditable="isEditable"
    />

    <SidebarLayout
      v-if="rightVisible"
      class="right"
      :class="sidebarClasses"
      :widgetOptions="sidebarWidgetOptions"
      @changeWidget="widget => addWidget('right', widget)"
      @removeWidget="index => removeWidget('right', index)"
      @editToggle="editing = !editing"
      :widgets="rightWidgets"
      :editing="editing"
    >
      <div slot="button-container" class="button-container">
        <button class="toggle-open" v-if="rightOpen" @click="onRightToggle">
          <Icon name="arrow-right" />
        </button>
        <button class="toggle-open" v-else @click="onRightToggle">
          <Icon name="arrow-left" />
        </button>
      </div>
    </SidebarLayout>
  </div>
</template>

<script>
  import {
    MODULE_NS,
    TOGGLE_LEFT_SIDEBAR,
    TOGGLE_RIGHT_SIDEBAR,
    ADD_LEFT_WIDGET,
    ADD_RIGHT_WIDGET,
    REMOVE_LEFT_WIDGET,
    REMOVE_RIGHT_WIDGET,
    CHANGE_MAIN_WIDGET,
  } from '@scaife-viewer/store';
  import MainLayout from './main/MainLayout.vue';
  import SidebarLayout from './sidebar/SidebarLayout.vue';

  const removeActions = {
    left: `${MODULE_NS}/${REMOVE_LEFT_WIDGET}`,
    right: `${MODULE_NS}/${REMOVE_RIGHT_WIDGET}`,
  };

  const addActions = {
    left: `${MODULE_NS}/${ADD_LEFT_WIDGET}`,
    right: `${MODULE_NS}/${ADD_RIGHT_WIDGET}`,
  };

  export default {
    components: { MainLayout, SidebarLayout },
    data() {
      return {
        editing: false,
        isEditable: true,
      };
    },
    methods: {
      onLeftToggle() {
        this.$emit('left-toggle');
        this.$store.dispatch(`${MODULE_NS}/${TOGGLE_LEFT_SIDEBAR}`);
      },
      onRightToggle() {
        this.$emit('right-toggle');
        this.$store.dispatch(`${MODULE_NS}/${TOGGLE_RIGHT_SIDEBAR}`);
      },
      addWidget(name, widget) {
        this.$emit('add-widget', name, widget);
        const action = addActions[name];
        if (action) {
          this.$store.dispatch(action, { widget });
        }
      },
      changeWidget(mainWidget) {
        this.$emit('change-widget', mainWidget);
        this.$store.dispatch(`${MODULE_NS}/${CHANGE_MAIN_WIDGET}`, {
          widget: mainWidget,
        });
      },
      removeWidget(name, index) {
        this.$emit('remove-widget', name, index);
        const action = removeActions[name];
        if (action) {
          this.$store.dispatch(action, { index });
        }
      },
    },
    watch: {
      title: {
        immediate: true,
        handler() {
          const { pageTitle } = this.$scaife.config;
          document.title =
            (pageTitle && pageTitle(this.title)) ||
            (this.title ? `Scaife Viewer | ${this.title}` : 'Scaife Viewer');
        },
      },
    },
    computed: {
      leftOpen() {
        return this.$store.state[MODULE_NS].leftOpen;
      },
      rightOpen() {
        return this.$store.state[MODULE_NS].rightOpen;
      },
      widgets() {
        return this.$store.state[MODULE_NS].widgets;
      },
      scaifeSkeleton() {
        return this.$scaife.skeleton;
      },
      leftWidgets() {
        return this.widgets.left.map(
          name => this.$scaife.skeleton.widgets[name],
        );
      },
      rightWidgets() {
        return this.widgets.right.map(
          name => this.$scaife.skeleton.widgets[name],
        );
      },
      mainWidget() {
        return (
          this.widgets.mainWidget &&
          this.$scaife.skeleton.widgets[this.widgets.mainWidget]
        );
      },
      sidebarClasses() {
        return [
          this.leftOpen ? 'sidebar-left--open' : 'sidebar-left--closed',
          this.rightOpen ? 'sidebar-right--open' : 'sidebar-right--closed',
        ];
      },
      mainWidgetOptions() {
        return this.$scaife.skeleton.widgetOptions(
          'main',
          this.mainWidget,
          this.leftWidgets,
          this.rightWidgets,
        );
      },
      sidebarWidgetOptions() {
        return this.$scaife.skeleton.widgetOptions(
          'sidebar',
          this.mainWidget,
          this.leftWidgets,
          this.rightWidgets,
        );
      },
      title() {
        const { scaife } = this.$store.state;
        return scaife.metadata && scaife.metadata.label;
      },
    },
  };
</script>

<style lang="scss" src="./skeleton.scss"></style>
