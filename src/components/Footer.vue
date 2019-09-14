<template>
  <footer>
    <p>
      Created by <a href="https://twitter.com/_vinci">@_vinci</a> •
      <a href="https://vuejs.org/">Built with Vue</a> •
      <a href="https://zeit.co/">Deployed on Zeit</a> •
      <a href="https://transit.land/">Powered by Transitland</a>
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/bundles/colors.less';
@import (reference) '../assets/styles/bundles/typography.less';

footer {
  #type.small();
  background: #color.extended[yellow];
  color: #color.text[dark];
  font-weight: 600;
  opacity: 0.7;
  padding: 0.5rem;
  text-align: center;

  a {
    color: #color.text[dark];
  }
}
</style>
