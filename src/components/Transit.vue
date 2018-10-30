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
        <ul>
          <li
            v-for="stop in stops"
            :key="stop.id"
          >
            <ul>
              <li
                v-for="route in stop.properties.routes_serving_stop"
                :key="route.route_onestop_id"
              >
                {{ route.route_name }}
                {{ stop.properties.name }}
              </li>
            </ul>
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
    this.getLocation();
  },

  mounted() {
    // this.$nextTick(() => {
    //   this.getLocation();
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

    async getLocation() {
      try {
        this.coords = await this.getCurrentLocation();
        this.features = await axios.get("https://transit.land/api/v1/stops.geojson", {
          params: {
            lon: this.lon,
            lat: this.lat,
            r: 350
          }
        });
      } catch (e) {
        this.errmsg = e;
      }
    }
  }
};
</script>

