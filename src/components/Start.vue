<template>
  <main>
    <h1>Stops near me</h1>
    <form>
      <fieldset>
        <legend>Find using zip code</legend>
        <label for="zip">Enter zip code</label>
        <input
          id="zip"
          v-model="zip"
          name="zip"
          type="number"
        />
        <button
          type="submit"
          @click.stop.prevent="submit"
        >
          Search
        </button>
      </fieldset>
      <fieldset>
        <legend>Find using location</legend>
        <button
          type="button"
          @click.stop.prevent="gps"
        >
          Search
        </button>
      </fieldset>
    </form>
  </main>
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
    gps() {
      this.$router.push('/gps');
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';
@import (reference) '../assets/styles/bundles/colors.less';

h1 {
  #type.h3();
  margin-bottom: @base-unit * 3;
}

fieldset {
  border: 0 none;

  + fieldset {
    margin-top: @base-unit * 5;
  }

  [type="number"] {
    #type.h2();
    #type.monospace();
    background: transparent;
    border: 0 none;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
    color: #color.text[light];
    font-weight: 600;
    height: @base-unit * 10;
    outline: 0;
    padding: @base-unit;
    width: 10ch;

    &:focus,
    &:hover {
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
