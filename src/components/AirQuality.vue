<template>
  <article>
    <address v-if="aqi">
      {{ aqi.city }}, {{ aqi.state }}
    </address>
    <dl>
      <div class="dl-row">
        <dt>Current weather</dt>
        <dd>{{ weather.sky }}</dd>
      </div>
      <div class="dl-row">
        <dt>Air quality</dt>
        <dd
          v-if="aqiIndex"
          class="aqi-badge"
          :class="aqiIndex.color"
          :title="'PM2.5 = ' + aqi.current.pollution.aqius"
        >
          {{ aqiIndex.condition }}
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
</template>

<script>
import api from '@/api';
import aqiIndex from '@/fn/aqiIndex';
import cToF from '@/fn/cToF';
import mpsToMph from '@/fn/mpsToMph';
import skyCondition from '@/fn/skyCondition';
import windDirection from '@/fn/windDirection';

export default {
  name: 'AirQuality',
  props: {
    latlon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      aqi: null,
      aqiIndex: null,
      weather: {},
    };
  },
  watch: {
    aqi: {
      handler: 'getAirAndWeather',
    },
  },
  mounted() {
    this.getAqi();
  },
  methods: {
    async getAqi() {
      const { latitude, longitude } = this.latlon;
      const res = await api.getAqifromLatLon({ lat: latitude, lon: longitude });
      const data = await res.data;
      this.aqi = Object.freeze(data);
    },
    getAirAndWeather() {
      const { current } = this.aqi;
      this.aqiIndex = aqiIndex(current.pollution.aqius);
      this.weather = {
        celsius: current.weather.tp,
        farenheit: cToF(current.weather.tp),
        humidity: current.weather.hu,
        sky: skyCondition(current.weather.ic),
        winddirection: windDirection(current.weather.wd),
        windspeed: mpsToMph(current.weather.ws),
      };
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/bundles/colors.less';
@import (reference) '../assets/styles/bundles/typography.less';
@import (reference) '../assets/styles/variables/global.less';

@aqi: #color.aqi();
@text: #color.text();

address {
  font-style: normal;
  margin-bottom: @base-unit * 4;
}

.dl-row {
  align-items: center;
  display: flex;
  padding: @base-unit 0;

  + .dl-row {
    border-top: 1px solid fade(@text[light], 20%);
  }
}

dd {
  margin-left: auto;
  text-align: right;
}

.aqi-badge {
  border-radius: @base-unit;
  padding: 0 @base-unit;
}

.green {
  color: contrast(@aqi[green], @text[dark], @text[light]);
  background-color: @aqi[green];
}

.yellow {
  color: contrast(@aqi[yellow], @text[dark], @text[light]);
  background-color: @aqi[yellow];
}

.orange {
  color: contrast(@aqi[orange], @text[dark], @text[light]);
  background-color: @aqi[orange];
}

.red {
  color: contrast(@aqi[red], @text[dark], @text[light]);
  background-color: @aqi[red];
}

.purple {
  color: contrast(@aqi[purple], @text[dark], @text[light]);
  background-color: @aqi[purple];
}

.maroon {
  color: contrast(@aqi[maroon], @text[dark], @text[light]);
  background-color: @aqi[maroon];
}
</style>
