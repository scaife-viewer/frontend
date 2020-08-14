<template>
  <div id="app">
    <div class="menu" v-if="$route.name === 'home'">
      <h1>Scaife Viewer Demos</h1>
      <router-link :to="{ name: 'reader' }">Explore Homer</router-link>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<style lang="scss">
  @import url(https://fonts.googleapis.com/css?family=Noto+Serif:400,400i,700,700i&subset=greek,greek-ext,latin-ext);
  @import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);

  html,
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .body {
    display: flex;
    justify-content: center;
  }

  .menu {
    font-family: 'Noto Serif';
    margin: 30px auto;
    max-width: 100%;
    width: 500px;

    h1 {
      font-weight: 700;
    }
    a {
      color: #B45141;
      font-size: 1.5rem;
    }
  }
</style>
