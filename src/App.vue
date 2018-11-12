<template>
  <main id="app">
    <router-view/>
  </main>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
html {
  box-sizing: border-box;
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
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
  color: #453e45;
  font-size: 1.6rem;
}
body,
html,
main,
article {
  -webkit-overflow-scrolling: touch;
  min-height: 100vh;
  scroll-behavior: smooth;
}
::selection {
  background-color: rgba(250, 179, 0, 0.3);
  color: #453e45;
}
</style>
