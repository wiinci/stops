<template>
  <main>
    <p v-if="isLoading">
      Loading …
    </p>
    <Schedules
      v-else
      :fields="fields"
    />
  </main>
</template>

<script>
import api from '@/api';
import Schedules from '@/components/Schedules';

export default {
  name: 'Location',
  components: { Schedules },
  props: {
    zip: {
      default: '',
      required: false,
      type: String,
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
    },
  },
  watch: {
    zip: {
      handler: 'getCoords',
      immediate: true,
    },
  },
  methods: {
    async getCoords(zip) {
      const { name } = this.$route;
      if (name === 'Zip') {
        try {
          const res = await api.getLatLonfromZip({ q: zip });
          const fields = await res.records[0].fields;
          this.fields = Object.freeze(fields);
        } catch (err) {
          const { message, value } = err;
          throw new Error(`${value}: ${message}`);
        }
      } else if (name === 'Gps') {
        // Use Geolocation API
        const position = () => import('@/fn/position');
        const location = await position().then(func => func.default());
        const coords = await location;
        this.fields = Object.freeze({
          latitude: coords[0],
          longitude: coords[1],
        });
      }
    },
  },
};
</script>
