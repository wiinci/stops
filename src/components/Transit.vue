<template>
  <main v-if="errmsg">
    <p>{{ errmsg }}</p>
  </main>

  <main v-else>
    <p>{{ coords }}</p>
    <pre>{{ features }}</pre>
    <section v-if="loading">Loading …</section>

    <article v-else>
      <section>
        <h1>Route number — Headsign</h1>
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
      stops: [],
      coords: [],
      features: [],
      errmsg: ""
    };
  },

  computed: {
    lat() {
      return this.coords[0];
    },

    lon() {
      return this.coords[1];
    },

    loading() {
      return this.coords.length < 1;
    }
  },

  created() {
    this.getStops();
  },

  mounted() {
    // this.$nextTick(() => {
    //   this.getStops();
    // });
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
        this.errmsg = e;
      }
    }


  }
};
</script>

