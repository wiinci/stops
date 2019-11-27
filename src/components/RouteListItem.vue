<template>
  <li class="route-details">
    <p class="badge">{{ routeDetails['route'] }}</p>
    <p class="headsign">{{ routeDetails['sign'] }}</p>
    <time
      :datetime="route.arrivalTime"
      class="arrivalTime"
    >{{
      getMinutes(route.arrivalTime)
    }}</time>
  </li>
</template>

<script>
export default {
  name: 'RouteListItem',
  props: {
    route: {
      type: Object,
      required: true,
    },
    routeDetails: {
      type: Object,
      required: true,
    }
  },
  methods: {
    getMinutes(timeStr) {
      const now = Date.now();
      const time = new Date();
      time.setHours(timeStr.split(':')[0]);
      time.setMinutes(timeStr.split(':')[1]);
      time.setSeconds(timeStr.split(':')[2]);
      const minutes = Math.floor((time - now) / (60 * 1000));
      return minutes <= 1
        ? 'Less than a minute'
        : minutes <= 0
          ? 'At the stop!'
          : `${minutes} min.`;
    },
  }
};
</script>

<style lang="less" scoped>
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';

.route-details {
  display: flex;
  padding: @base-unit * 2 0;
}

.badge {
  #type.small();
  border-radius: @base-unit * 2;
  border: 1px solid currentColor;
  letter-spacing: 0.03rem;
  margin-right: @base-unit * 2;
  padding: 0 @base-unit * 2;
}

.arrivalTime {
  margin-left: auto;
}
</style>
