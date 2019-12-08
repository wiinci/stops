<template>
  <div>
    <address v-if="aqi">
      {{ aqi.city }}, {{ aqi.state }}
    </address>
    <article>
      <h1>Current weather <span class="primary-value">{{ weather.sky }}</span></h1>
      <dl>
        <div class="dl-row">
          <dt>Air quality</dt>
          <dd
            v-if="category"
            class="aqi-badge"
            :class="category[0].color"
            :title="'PM2.5 = ' + aqi.current.pollution.aqius"
          >
            {{ category[0].condition }}
          </dd>
        </div>
        <div class="dl-row">
          <dt>Temperature</dt>
          <dd>{{ weather.farenheit }}&deg;F / {{ weather.celsius }}&deg;C</dd>
        </div>
        <div class="dl-row">
          <dt>Humidity</dt>
          <dd>{{ weather.humidity }}%</dd>
        </div>
        <div class="dl-row">
          <dt>Wind</dt>
          <dd>{{ weather.winddirection }} {{ weather.windspeed }} mph</dd>
        </div>
      </dl>
    </article>
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
      weather: {},
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
      this.aqi = Object.freeze(data);
    },
    getCtoF(celsius) {
      return Math.round((celsius * 9) / 5 + 32);
    },
    getDirection(angle, directions) {
      switch (angle) {
      case 0:
      case 360:
        return 'N';
      case 90:
        return 'E';
      case 180:
        return 'S';
      case 270:
        return 'W';
      default:
        return directions.filter(
          d => angle > d.angleMin && angle < d.angleMax
        )[0].direction;
      }
    },
    getMph(mps) {
      return Math.round(mps * 2.237);
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

      const skies = [
        { identifier: '01d', condition: 'Clear' },
        { identifier: '01n', condition: 'Clear' },
        { identifier: '02d', condition: 'Partly cloudy' },
        { identifier: '02n', condition: 'Partly cloudy' },
        { identifier: '03d', condition: 'Cloudy' },
        { identifier: '04d', condition: 'Mostly cloudy' },
        { identifier: '09d', condition: 'Showers' },
        { identifier: '10d', condition: 'Showers' },
        { identifier: '10n', condition: 'Showers' },
        { identifier: '11d', condition: 'Thunderstorms' },
        { identifier: '13d', condition: 'Snow' },
        { identifier: '50d', condition: 'Mist' },
      ];

      const directions = [
        {
          angleMin: 0,
          angleMax: 90,
          direction: 'NE',
        },
        {
          angleMin: 90,
          angleMax: 180,
          direction: 'SE',
        },
        {
          angleMin: 180,
          angleMax: 270,
          direction: 'SW',
        },
        {
          angleMin: 270,
          angleMax: 360,
          direction: 'NW',
        },
      ];

      const aqi = this.aqi.current;
      const pollution = aqi.pollution.aqius;
      this.weather.celsius = aqi.weather.tp;
      this.weather.farenheit = this.getCtoF(aqi.weather.tp);
      this.weather.humidity = aqi.weather.hu;
      this.weather.windspeed = this.getMph(aqi.weather.ws);
      this.weather.winddirection = this.getDirection(
        aqi.weather.wd,
        directions
      );
      this.weather.sky = skies.filter(
        sky => aqi.weather.ic === sky.identifier
      )[0].condition;
      this.category = categories.filter(
        category => pollution >= category.rangeMin && pollution < category.rangeMax
      );
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/bundles/colors.less';
@import (reference) '../assets/styles/bundles/typography.less';
@import (reference) '../assets/styles/variables/global.less';

address {
  font-style: normal;
}

h1 {
  #type.small();
  font-weight: normal;
  margin: (@base-unit * 3) 0 @base-unit;
  border-bottom: 1px solid fade(#color.text[light], 20%);
}

dl {
  #type.small();
}

.dl-row,
h1 {
  align-items: center;
  display: flex;
}

.primary-value,
dd {
  margin-left: auto;
  text-align: right;
}

.aqi-badge {
  border-radius: @base-unit;
  padding: 0 @base-unit;
}

.green {
  color: contrast(#color.aqi[green], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[green];
}

.yellow {
  color: contrast(#color.aqi[yellow], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[yellow];
}

.orange {
  color: contrast(#color.aqi[orange], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[orange];
}

.red {
  color: contrast(#color.aqi[red], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[red];
}

.purple {
  color: contrast(#color.aqi[purple], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[purple];
}

.maroon {
  color: contrast(#color.aqi[maroon], #color.text[dark], #color.text[light]);
  background-color: #color.aqi[maroon];
}
</style>
