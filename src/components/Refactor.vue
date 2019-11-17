<template>
  <form>
    <input
      v-model="zip"
      name="zip"
      type="text"
    />
    <button
      type="submit"
      @click.stop.prevent="submit"
    >
      Search by Zip
    </button>
  </form>
</template>

<script>
export default {
  name: 'Refactor',
  data() {
    return {
      zip: null,
    };
  },
  methods: {
    submit() {
      this.$router.push(`/zip/${this.zip}`);
    },
  },
};
</script>
