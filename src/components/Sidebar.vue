<template>
  <aside>
    <p>{{ today }}</p>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    today() {
      const today = new Date();
      const options = {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      };
      return today.toLocaleTimeString('default', options);
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';

aside {
  #type.small();
}
</style>
