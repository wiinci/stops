<template>
  <div>
    <p v-if="isEmptySchedule">Nothing scheduled within the next 20 minutes. Please try again later.</p>
    <ul
      v-for="(headsign, index) in headsigns"
      :key="headsign"
    >
      <li>{{ stopTimes[index][0].routeName }} {{ headsign }}
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
  </div>
</template>

<script>
export default {
  name: 'ScheduleList',
  props: {
    times: {
      type: Object,
      required: true,
    }
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
    }
  },
};
</script>
