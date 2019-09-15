<template>
  <footer>
    <nav>
      <ul>
        <li>
          Created by&nbsp;<a href="https://twitter.com/_vinci">@_vinci</a>
        </li>
        <li>Powered by&nbsp;<a href="https://transit.land/">Transitland</a></li>
        <li>Built with&nbsp;<a href="https://vuejs.org/">Vue</a></li>
        <li>Deployed with&nbsp;<a href="https://zeit.co/">Zeit</a></li>
      </ul>
    </nav>
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
  opacity: 0.7;
  padding: 0.5rem;
  text-align: center;

  a {
    color: #color.text[dark];
  }
}

ul {
  display: flex;
  flex-flow: row wrap;
  flex: 1;
  justify-content: space-around;
  list-style-type: none;
}
</style>
