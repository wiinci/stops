<template>
  <p>{{ day }}</p>
</template>

<script>
export default {
  name: 'Today',
  props: {
    timezone: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      day: '',
    };
  },
  watch: {
    timezone: {
      handler: 'today',
    },
  },
  methods: {
    async today() {
      const today = new Date();
      const options = {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        timeZone: this.timezone,
        weekday: 'long',
        year: 'numeric',
      };
      this.day = await today.toLocaleTimeString('default', options);
    },
  },
};
</script>
