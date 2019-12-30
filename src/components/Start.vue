<template>
  <main>
    <h1>Stops near me</h1>
    <form>
      <fieldset>
        <legend id="findZip">
          Find using zip code
        </legend>
        <div class="controls">
          <input
            id="zip"
            v-model="zip"
            aria-labelledby="findZip"
            name="zip"
            type="number"
          />
          <button
            type="submit"
            @click.stop.prevent="submit"
          >
            Search
          </button>
        </div>
      </fieldset>
      <p class="or">
        or
      </p>
      <fieldset>
        <legend>Find using location</legend>
        <div class="controls">
          <button
            type="button"
            @click.stop.prevent="gps"
          >
            Search
          </button>
        </div>
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
      isZipEmpty: false,
    };
  },
  methods: {
    submit() {
      if (!this.zip) {
        this.isZipEmpty = true;
        return;
      }
      this.isZipEmpty = false;
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

form {
  width: 40ch;
}

h1 {
  #type.h3();
  margin-bottom: @base-unit * 7;
}

fieldset {
  border: 0 none;

  + fieldset {
    margin-top: @base-unit * 10;
  }

  [type="number"] {
    #type.h3();
    #type.monospace();
    background: transparent;
    border-radius: @base-unit;
    border: 0 none;
    box-shadow: 0 0 0 @base-unit #color.brand[blue];
    color: #color.text[light];
    font-weight: 300;
    margin-bottom: @base-unit * 5;
    outline: 0;
    padding: (@base-unit * 2);
    width: 100%;

    &:focus,
    &:hover {
      box-shadow: 0 0 0 @base-unit darken(#color.brand[blue], 5%);
    }
  }
}

legend {
  margin-bottom: @base-unit * 2;
}

.controls {
  display: flex;
  flex-flow: column;
}

button {
  #type.body();
  #type.monospace();
  background: #color.brand[blue];
  border-radius: @base-unit;
  border: 0 none;
  box-shadow: 0 0 0 @base-unit #color.brand[blue];
  color: contrast(#color.brand[blue], #color.text[dark], #color.text[light]);
  padding: (@base-unit * 2) 0;

  &:active,
  &:focus,
  &:hover {
    background: darken(#color.brand[blue], 5%);
    box-shadow: 0 0 0 @base-unit darken(#color.brand[blue], 5%);
  }
}

h1,
.or {
  text-align: center;
}

.or {
  #type.h3();
  margin: (@base-unit * 7) auto;
}
</style>
