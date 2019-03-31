<template>
  <article v-if="hasError">
    <h1 class="error">{{ errorMsg }}</h1>
  </article>

  <article v-else>
    <section v-if="isLoading">Loading …</section>

    <section
      v-else
      class="table-root"
    >
      <table v-if="hasTime">
        <tr>
          <th class="route-name">Route</th>
          <th>Intersection</th>
          <th>Sign</th>
          <th>Arriving</th>
        </tr>
        <template
          v-for="(stop, index) in stops"
        >
          <tr
            v-if="times[index].data.schedule_stop_pairs.length"
            :key="stop.id"
          >
            <td class="route-name">{{ stop.route_name }}</td>
            <td>{{ stop.name }}</td>
            <td>{{ times[index].data.schedule_stop_pairs[0].trip_headsign }}</td>
            <td>
              <time :datetime="times[index].data.schedule_stop_pairs[0].origin_arrival_time">{{ times[index].data.schedule_stop_pairs[0].origin_arrival_time }}</time>
            </td>
          </tr>
        </template>
      </table>
    </section>
  </article>
</template>

<script>
import axios from "axios";

export default {
  name: "Transit",
  data() {
    return {
      coords: [],
      errorMsg: "",
      features: [],
      hasError: false,
      stops: [],
      times: []
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
    }
  },

  watch: {
    features() {
      this.getTimes();
    }
  },

  created() {
    this.getStops();
  },

  methods: {
    getCurrentLocation() {
      const options = {
        enableHighAccuracy: false,
        timeout: 9 * 1000, // ms
        maximumAge: 2 * 60 * 1000 // ms
      };

      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject("Geolocation is not supported in your browser.");
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
        this.features = await axios.get(
          "https://transit.land/api/v1/stops.geojson",
          {
            params: {
              lon: this.lon,
              lat: this.lat,
              r: 400
            }
          }
        );

        // Stop name and ID
        this.stops = await this.features.data.features.map(f => {
          const s = {
            coordinates: f.geometry.coordinates,
            id: f.id,
            name: f.properties.name,
            route_name: f.properties.routes_serving_stop[0].route_name,
            route_onestop_id:
              f.properties.routes_serving_stop[0].route_onestop_id
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
      this.features.data.features.map(f => {
        const a = axios
          .get("https://transit.land/api/v1/schedule_stop_pairs", {
            params: {
              date: "today",
              operator_onestop_id: this.features.data.features[0].properties
                .operators_serving_stop[0].operator_onestop_id,
              origin_departure_between: "now,now+1200",
              origin_onestop_id: f.properties.title
            }
          })
          .catch(e => {
            this.hasError = true;
            this.errorMsg = `Error: ${e}`;
          });
        return times.push(a);
      });

      this.times = await Promise.all(times);
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../assets/styles/variables/global.less";
@import (reference) "../assets/styles/bundles/typography.less";

table {
  table-layout: auto;
  border-collapse: collapse;
  width: 100%;
}

th { text-align: left; }

th,
td {
  white-space: nowrap;
  padding: 12px;
  border: 1px solid currentColor;
}

.table-root {
  position: relative;
  overflow-x: auto;
}

.route-name { text-align: center; }

td:first-child,
th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}

td:last-child,
th:last-child {
  text-align: right;
}

article {
  padding: (@base-unit * 4);
}

.error {
  color: @error;
}

.h2 {
  #type.h3();
}
</style>
