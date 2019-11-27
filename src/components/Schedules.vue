<template>
  <div>
    <p v-if="isLoading">Loading …</p>
    <p v-if="isEmpty">
      Nothing scheduled in the next 20 minutes. Please try again later.
    </p>
    <ScheduleList :routes="routes" />
  </div>
</template>

<script>
import api from '@/api';
import ScheduleList from '@/components/ScheduleList';

export default {
  name: 'Schedules',
  components: {
    ScheduleList,
  },
  props: {
    fields: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isEmpty: false,
      isLoading: true,
      routes: {},
      stops: [],
    };
  },
  watch: {
    fields: {
      handler: 'getStops',
      immediate: true,
    },
    stops: {
      handler: 'getTimes',
    },
  },
  methods: {
    async getStops() {
      const { latitude, longitude } = this.fields;
      const features = await api.getStops({ lat: latitude, lon: longitude });
      const stops = await features.stops;
      this.stops = Object.freeze(stops);
      console.log(this.stops);
    },

    async getTimes() {
      const times = [];
      this.stops.map(stop => {
        const time = api
          .getTimes({
            operator_onestop_id:
              stop.operators_serving_stop[0].operator_onestop_id,
            origin_onestop_id: stop.onestop_id,
          })
          .catch(e => {
            console.log(`Error: ${e}`);
          });

        return times.push(time);
      });

      const allSchedules = await Promise.all(times);

      // Clean data
      const schedules = allSchedules
        // Remove stops for which an arrival is not scheduled in the next 10 mins
        .filter(x => x.schedule_stop_pairs.length > 0)
        // Ignore all fields except schedule_stop_pairs
        .reduce((x, el) => {
          x.push(el.schedule_stop_pairs);
          return x;
        }, [])
        // Flatten array since schedule_stop_pairs can have multiple arrival times
        .flat(Infinity)
        // Keep only required data
        .map(x => {
          const y = {};
          Object.assign(y, {
            // Arrival time at nearby stop
            arrivalTime: x.origin_arrival_time,
            // Destination stop name
            headsign: x.trip_headsign
              .split(/(\d+) -*/)
              .pop()
              .trim()
              .toUpperCase(),
            // Route name
            routeName: this.stops
              .filter(z => z.onestop_id === x.origin_onestop_id)
              .map(k => k.routes_serving_stop[0].route_name)
              .toString()
              .trim(),
            // Nearby stop name
            stopName: this.stops
              .filter(z => z.onestop_id === x.origin_onestop_id)
              .map(k => k.name)
              .toString()
              .replace('@', '&')
              .trim(),
          });
          return y;
        })
        // Create nested groups based on nearby stops
        .reduce((x, el) => {
          const y = x[el.stopName] || [];
          y.push(el);
          // eslint-disable-next-line no-param-reassign
          x[el.stopName] = y;
          return x;
        }, {});

      this.routes = Object.freeze(schedules);
      this.isLoading = false;
      this.isEmpty = Object.keys(this.routes).length < 1;
      console.log(this.routes);
    },
  },
};
</script>
