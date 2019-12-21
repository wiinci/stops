<template>
  <li class="route-details">
    <p class="badge">
      {{ routeDetails['route'] }}
    </p>
    <p class="headsign">
      {{ routeDetails['sign'] }}
    </p>
    <time
      :datetime="route.arrivalTime"
      class="arrivalTime"
      :title="
        getMinutes(route.arrivalTime, route.timeZone) === '< 1 min.' ? 'Less than a minute.' : `${getMinutes(route.arrivalTime)}`
      "
    >{{ getMinutes(route.arrivalTime, route.timeZone) }}</time>
  </li>
</template>

<script>
import minutes from '@/fn/minutes';

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
    },
  },
  methods: {
    getMinutes(timeStr, timeZone) {
      const mins = minutes(timeStr, timeZone);
      return mins <= 1 ? '< 1 min.' : `${mins} min.`;
    },
  },
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
  text-align: right;
}
</style>
