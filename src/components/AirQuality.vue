<template>
  <div>
    <pre>
      {{ aqi }}
    </pre>
    <pre>
      {{ category }}
    </pre>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'AirQuality',
  data() {
    return {
      aqi: null,
      category: null,
    };
  },
  watch: {
    aqi: {
      handler: 'getAqiIndex',
    },
  },
  mounted() {
    this.getAqi();
  },
  methods: {
    async getAqi() {
      const res = await api.getAqi();
      const data = await res.data;
      console.log(data);
      this.aqi = Object.freeze(data);
    },
    getAqiIndex() {
      const categories = [
        {
          color: 'green',
          condition: 'Good',
          rangeMax: 50,
          rangeMin: 0,
        },
        {
          color: 'yellow',
          condition: 'Moderate',
          rangeMax: 100,
          rangeMin: 51,
        },
        {
          color: 'orange',
          condition: 'Unhealty for sensitive groups',
          rangeMax: 150,
          rangeMin: 101,
        },
        {
          color: 'red',
          condition: 'Unhealthy',
          rangeMax: 200,
          rangeMin: 151,
        },
        {
          color: 'purple',
          condition: 'Very unhealthy',
          rangeMax: 300,
          rangeMin: 201,
        },
        {
          color: 'maroon',
          condition: 'Hazardous',
          rangeMax: Infinity,
          rangeMin: 301,
        },
      ];

      const aqi = this.aqi.current.pollution.aqius;
      this.category = categories.filter(
        category => aqi >= category.rangeMin && aqi < category.rangeMax
      );
    },
  },
};
</script>
