<template>
  <main v-if="hasError">
    <p>{{ errorMsg }}</p>
  </main>

  <main v-else>
    <section v-if="isLoading">Loading …</section>

    <article v-else>
      <!-- <section>
        <h1>Route number — Headsign</h1>
        <p>{{ coords }}</p>
        <pre v-if="hasTime">
          {{ features }}
          {{ times }}
        </pre>
      </section> -->

      <section>
        <ul v-if="hasTime">
          <li
            v-for="(stop, index) in stops"
            v-if="times[index].data.schedule_stop_pairs.length"
            :key="stop.id"
          >
            <p>Route: {{ stop.route_name }}</p>
            <p>Name: {{ stop.name }}</p>
            <p>Coordinates: Lat: {{ stop.coordinates[1] }}, Lon: {{ stop.coordinates[0] }}</p>
            <p>Arriving at {{ times[index].data.schedule_stop_pairs[0].origin_arrival_time }}</p>
            <p>Sign: {{ times[index].data.schedule_stop_pairs[0].trip_headsign }}</p>
          </li>
        </ul>
      </section>
    </article>
  </main>

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
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0
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
        this.features = await axios.get("https://transit.land/api/v1/stops.geojson", {
          params: {
            lon: this.lon,
            lat: this.lat,
            r: 400
          }
        });

        // Stop name and ID
        this.stops = await this.features.data.features.map(f => {
          const s = {
            coordinates: f.geometry.coordinates,
            id: f.id,
            name: f.properties.name,
            route_name: f.properties.routes_serving_stop[0].route_name,
            route_onestop_id: f.properties.routes_serving_stop[0].route_onestop_id
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
        const a = axios.get("https://transit.land/api/v1/schedule_stop_pairs", {
          params: {
            date: "today",
            operator_onestop_id: this.features.data.features[0].properties.operators_serving_stop[0].operator_onestop_id,
            origin_departure_between: "now,now+1200",
            origin_onestop_id: f.properties.title
          }
        }).catch(e => {
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

