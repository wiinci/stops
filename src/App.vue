<template>
  <main id="app">
    <router-view />
  </main>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="less">
@import (reference) './assets/styles/variables/global.less';
@import (reference) './assets/styles/bundles/typography.less';

html {
  box-sizing: border-box;
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  font-size: 62.5%;
}

* {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  &:before,
  &:after {
    box-sizing: inherit;
  }
}

body {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: @default-copy;
  background-color: @background;
  text-rendering: optimizeLegibility;
  #type.body();
}

body,
html {
  -webkit-overflow-scrolling: touch;
  min-height: 100vh;
  scroll-behavior: smooth;
}

main {
  max-width: 60ch;
  padding: 1vmax;
  margin: 0 auto;
}

::selection {
  background-color: @selection;
  color: @background;
}
</style>
