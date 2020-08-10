<template>
  <div class="named-entity" :class="{ selected }">
    <div class="named-entity-title" @click.prevent="$emit('select', entity)">
      <span>
        <icon class="icon" v-if="iconName" :name="iconName" />
        {{ entity.title }}
      </span>
      <span v-if="selected">x</span>
    </div>
    <div class="named-entity-body" v-if="selected">
      <div class="named-entity-description">{{ entity.description }}</div>
      <a :href="entity.url" target="_blank">Read More</a>
      <div class="map" v-if="place && hasCoordinates">
        <EntityMap :coordinates-list="[center]" />
      </div>
    </div>
  </div>
</template>

<script>
  import EntityMap from '@scaife-viewer/entity-map';
  import { MODULE_NS } from '@scaife-viewer/store';

  const iconMap = {
    PERSON: 'user',
    PLACE: 'map-marker-alt',
  };

  export default {
    props: {
      entity: {
        type: Object,
        required: true,
      },
    },
    components: { EntityMap },
    computed: {
      hasCoordinates() {
        return this.center && this.center[0] !== undefined;
      },
      place() {
        return this.entity.kind === 'PLACE';
      },
      center() {
        return (
          this.entity.data &&
          this.entity.data.coordinates &&
          this.entity.data.coordinates.split(', ').map(c => parseFloat(c))
        );
      },
      iconName() {
        return iconMap[this.entity.kind];
      },
      selected() {
        return (
          this.$store.state[MODULE_NS].selectedNamedEntities.filter(
            id => this.entity.id === id,
          ).length > 0
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .map {
    height: 250px;
  }
  .named-entity.selected {
    background: var(--sv-widget-named-entities-selected-background-color, #f8f9fa);
    margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid var(--sv-widget-named-entities-selected-border-color, #343a40);
    .named-entity-description {
      color: var(--sv-widget-named-entities-selected-description-text-color, #495057);
    }
    .icon {
      color: var(--sv-widget-named-entities-selected-icon-text-color, #343a40);
    }
  }
  .icon {
    color: var(--sv-widget-named-entities-icon-text-color, #868e96);
  }
  .named-entity {
    margin: 0.375rem 0;
  }
  .named-entity-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--sv-widget-named-entities-title-text-color, #343a40);
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
