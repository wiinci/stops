<template>
  <p>{{ today }}</p>
</template>

<script>
export default {
  name: 'Today',
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
