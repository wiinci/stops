<template>
  <ul class="stops">
    <ScheduleListItem
      v-for="(stop, index) in stops"
      :key="stop"
      :index="index"
      :routes="stopTimes"
      :stop="stop"
    />
  </ul>
</template>

<script>
import ScheduleListItem from '@/components/ScheduleListItem';

export default {
  name: 'ScheduleList',
  components: { ScheduleListItem },
  props: {
    routes: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stops() {
      return Object.keys(this.routes);
    },
    stopTimes() {
      return Object.values(this.routes);
    },
  },
};
</script>

<style lang="less">
.stops {
  list-style-type: none;
}
</style>
