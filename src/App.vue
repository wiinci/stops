<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
html {
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 62.5%;
  box-sizing: border-box;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: inherit;
  &:before,
  &:after {
    box-sizing: inherit;
  }
}
body {
  font-size: 1.6rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 16px;
  color: #453e45;
  background: url("assets/images/1.png") #fafafa;
}
body,
html {
  min-height: 100vh;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
::selection {
  background-color: rgba(250, 179, 0, 0.3);
}
</style>
