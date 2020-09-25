<template>
  <div class="skeleton">
    <SidebarLayout v-if="leftVisible" class="left" :class="sidebarClasses" :widgets="leftWidgets">
      <div slot="button-container" class="button-container">
        <button class="toggle-open" v-if="leftOpen" @click="onLeftToggle">
          <Icon name="arrow-left" />
        </button>
        <button class="toggle-open" v-else @click="onLeftToggle">
          <Icon name="arrow-right" />
        </button>
      </div>
    </SidebarLayout>

    <MainLayout :widget="mainWidget" :isEditable="isEditable" />

    <SidebarLayout v-if="rightVisible" class="right" :class="sidebarClasses" :widgets="rightWidgets">
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
  import { MODULE_NS, TOGGLE_LEFT_SIDEBAR, TOGGLE_RIGHT_SIDEBAR } from '@scaife-viewer/store';

  import MainLayout from './main/MainLayout.vue';
  import SidebarLayout from './sidebar/SidebarLayout.vue';

  export default {
    props: ['mainWidget', 'leftWidgets', 'rightWidgets'],
    components: { MainLayout, SidebarLayout },
    data() {
      return {
        editing: false,
        isEditable: false,
      };
    },
    methods: {
      onLeftToggle() {
        this.$emit('leftToggle');
        this.$store.dispatch(`${MODULE_NS}/${TOGGLE_LEFT_SIDEBAR}`);
      },
      onRightToggle() {
        this.$emit('rightToggle');
        this.$store.dispatch(`${MODULE_NS}/${TOGGLE_RIGHT_SIDEBAR}`);
      },
    },
    watch: {
      title: {
        immediate: true,
        handler() {
          const { pageTitle } = this.$scaife.config;
          document.title = (pageTitle && pageTitle(this.title)) || 'Scaife Viewer';
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
      leftVisible() {
        return this.$store.state[MODULE_NS].leftVisible;
      },
      rightVisible() {
        return this.$store.state[MODULE_NS].rightVisible;
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
      }
    },
  };
</script>

<style lang="scss" src="./skeleton.scss"></style>
