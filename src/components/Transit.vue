<template>
  <article v-if="hasError">
    <h1 class="error">{{ errorMsg }}</h1>
  </article>

  <section v-else>
    <div v-if="isLoading">Loading …</div>
    <template v-else>
      <template v-if="hasTime">
        <template v-for="(stop, index) in stops">
          <article
            v-if="times[index].schedule_stop_pairs.length"
            :key="stop.name + index"
            class="row"
          >
            <div>
              <p class="small-meta">
                Route {{ stop.route_name }} &rarr;
                {{
                  titleCase(
                    times[index].schedule_stop_pairs[0].trip_headsign
                      .split(/(\d+) -*/)
                      .pop()
                      .trim()
                      .toUpperCase()
                  )
                }}
              </p>
              <address class="caption station">
                {{
                  stop.name
                    .split('@')
                    .join(' & ')
                    .trim()
                }}
              </address>
            </div>
            <div class="arriving">
              <p class="small-meta">Arriving</p>
              <time
                :datetime="
                  times[index].schedule_stop_pairs[0].origin_arrival_time
                "
                class="caption"
              >
                {{
                  getMinutes(
                    times[index].schedule_stop_pairs[0].origin_arrival_time
                  )
                }}
              </time>
            </div>
          </article>
        </template>
      </template>
    </template>
    <Footer />
  </section>
</template>

<script>
import api from '@/api';

export default {
  name: 'Transit',
  data() {
    return {
      coords: [],
      errorMsg: '',
      features: [],
      hasError: false,
      stops: [],
      times: [],
    };
  },

  computed: {
    lat() {
      return this.coords[0];
    },

    lon() {
      return this.coords[1];
    },

    isLoading() {
      return this.coords.length < 1;
    },

    hasTime() {
      return this.times.length > 1;
    },

    getMinutes() {
      return timeStr => {
        const now = Date.now();
        const time = new Date();
        time.setHours(timeStr.split(':')[0]);
        time.setMinutes(timeStr.split(':')[1]);
        time.setSeconds(timeStr.split(':')[2]);
        const minutes = Math.floor((time - now) / (60 * 1000));
        return minutes <= 1
          ? 'Any minute now'
          : minutes <= 0
            ? 'At the stop!'
            : `${minutes} minutes`;
      };
    },
  },

  watch: {
    features() {
      this.getTimes();
    },
  },

  created() {
    this.getStops();
  },

  methods: {
    titleCase(text) {
      return text
        .toLowerCase()
        .split(' ')
        .map(t =>
          t.length > 2
            ? t.includes('/')
              ? t
                .split('/')
                .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                .join('/')
              : t.charAt(0).toUpperCase() + t.slice(1)
            : t.toUpperCase()
        )
        .join(' ');
    },

    getCurrentLocation() {
      const options = {
        enableHighAccuracy: false,
        timeout: 9 * 1000, // ms
        maximumAge: 2 * 60 * 1000, // ms
      };

      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject('Geolocation is not supported in your browser.');
        } else {
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve([position.coords.latitude, position.coords.longitude]);
            },
            error => {
              reject(`${error.message}: Unable to retrieve your location`);
            },
            options
          );
        }
      });
    },

    async getStops() {
      try {
        // Current location
        this.coords = await this.getCurrentLocation();

        // Features
        const features = await api.getStops({
          lat: this.lat,
          lon: this.lon,
          // operated_by: "f-dnh-marta"
        });

        this.features = Object.freeze(features);

        // Stop name and ID
        this.stops = await this.features.stops.map(f => {
          const s = {
            coordinates: f.geometry.coordinates,
            name: f.name,
            route_name: f.routes_serving_stop[0].route_name,
            route_onestop_id: f.routes_serving_stop[0].route_onestop_id,
          };
          return s;
        });
      } catch (e) {
        this.hasError = true;
        this.errorMsg = `Error: ${e}`;
      }
    },

    async getTimes() {
      const times = [];
      this.features.stops.map(f => {
        const a = api
          .getTimes({
            operator_onestop_id: this.features.stops[0]
              .operators_serving_stop[0].operator_onestop_id,
            origin_onestop_id: f.onestop_id,
          })
          .catch(e => {
            this.hasError = true;
            this.errorMsg = `Error: ${e}`;
          });
        return times.push(a);
      });

      this.times = Object.freeze(await Promise.all(times));
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';

.row {
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;

  + .row {
    border-top: 2px solid lighten(@background, 10%);
  }
}

.slat {
  + .slat {
    margin: 0 0 0 2rem;
  }
}

.caption {
  #type.h3();
  #type.monospace();
  font-style: normal;

  @media only screen and (max-width: 510px) {
    #type.body();
  }
}

.small-meta {
  #type.body();
  #type.monospace();
  display: block;
  font-weight: 600;
  letter-spacing: 0.02rem;
}

.arriving {
  text-align: right;
}
</style>
