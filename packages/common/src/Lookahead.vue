<template>
  <div class="form-group">
    <div class="input-group">
      <input
        class="form-control"
        v-model="query"
        :placeholder="placeholder"
        @input="onInput"
      />
      <!-- TODO: Add an affordance for clearing query -->
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';

  export default {
    props: ['placeholder', 'reducer', 'data'],
    data() {
      return {
        query: '',
        results: null,
        reduce: true,
      };
    },
    watch: {
      $route: 'resetQuery',
      query: 'updateData',
    },
    methods: {
      updateData() {
        // Prevents intermediate flash reload of stale data on query reset.
        if (this.reduce) {
          this.results = this.reducer(this.data, this.query);
          this.$emit('filter-data', this.results, this.query);
        }
        this.reduce = true;
      },
      resetQuery() {
        this.query = '';
        this.reduce = false;
      },
      onInput() {
        debounce(e => {
          this.query = e.target.value;
        }, 500);
      },
    },
  };
</script>
