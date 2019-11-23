<template>
  <article>
    <p v-if="isEmptySchedule">
      Nothing scheduled within the next 20 minutes. Please try again later.
    </p>
    <ul
      v-for="(headsign, index) in headsigns"
      :key="headsign"
    >
      <li>
        {{ getHeadsignWithRoute(headsign, index) }}
        <ul>
          <li
            v-for="stop in stopTimes[index]"
            :key="stop.stopId"
          >
            <p>arrival: {{ stop.arrivalTime }}</p>
            <p>arrival: {{ stop.routeName }}</p>
            <p>arrival: {{ stop.stopName }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </article>
</template>

<script>
export default {
  name: 'ScheduleList',
  props: {
    times: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isEmptySchedule() {
      return Object.keys(this.times).length === 0;
    },
    headsigns() {
      return Object.keys(this.times);
    },
    stopTimes() {
      return Object.values(this.times);
    },
  },
  methods: {
    getHeadsignWithRoute(destination, index) {
      const name = this.stopTimes[index][0].routeName;
      let sign = destination.toLowerCase();

      // Train
      if (sign.includes('bound')) {
        const [route, headsign] = sign.split('to');
        return `${route
          .split(' ')
          .map(n => n.charAt(0).toUpperCase() + n.slice(1))
          .join(' ')} → ${headsign.toUpperCase()}`;
      }

      // Bus
      if (sign.includes('route')) {
        sign = sign.split(/\w+\s\d+\s*-/g)[1].trim();
      }
      return `Route ${name} → ${sign.toUpperCase()}`;
    },
  },
};
</script>
