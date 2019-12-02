<template>
  <div>
    <p v-if="isLoading">
      Loading …
    </p>
    <Schedules
      v-else
      :fields="fields"
    />
  </div>
</template>

<script>
import api from '@/api';
import Schedules from '@/components/Schedules';

export default {
  name: 'Location',
  components: { Schedules },
  props: {
    zip: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fields: null,
    };
  },
  computed: {
    isLoading() {
      return this.fields == null;
    }
  },
  watch: {
    zip: {
      handler: 'getCoords',
      immediate: true,
    }
  },
  methods: {
    async getCoords(zip) {
      try {
        const res = await api.getLatLonfromZip({ q: zip });
        const fields = await res.records[0].fields;
        this.fields = Object.freeze(fields);
      } catch (err) {
        const { message, name } = err;
        throw new Error(`${name}: ${message}`);
      }
    }
  }
};
</script>
