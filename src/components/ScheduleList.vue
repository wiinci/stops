<template>
  <ul class="stops">
    <li
      v-for="(stop, index) in stops"
      :key="stop"
      class="stop-details"
    >
      <article>
        <h1 class="stop-name">{{ toSentenceCase(stop) }}</h1>
        <ul class="route">
          <li
            v-for="route in stopTimes[index]"
            :key="route.arrivalTime"
            class="route-details"
          >
            <p class="type">
              {{
                getHeadsignWithRoute(route.headsign, route.routeName)['type']
              }}
            </p>
            <p class="badge">
              {{
                getHeadsignWithRoute(route.headsign, route.routeName)['route']
              }}
            </p>
            <p class="headsign">
              {{
                getHeadsignWithRoute(route.headsign, route.routeName)['sign']
              }}
            </p>
            <time
              :datetime="route.arrivalTime"
              class="arrivalTime"
            >{{
              getMinutes(route.arrivalTime)
            }}</time>
          </li>
        </ul>
      </article>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ScheduleList',
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
    toSentenceCase() {
      return str =>
        str
          .trim()
          .split(' ')
          .map(n => n.charAt(0).toUpperCase() + n.slice(1))
          .join(' ');
    },
    getMinutes() {
      return timeStr => {
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
      };
    },
  },
  methods: {
    getHeadsignWithRoute(destination, routeName) {
      const name = routeName;
      let sign = destination.toLowerCase();

      // Train
      if (sign.includes('bound')) {
        // eslint-disable-next-line
        let [route, headsign] = sign.split('to');

        route = `${this.toSentenceCase(route)}`;

        if (route.includes('East')) {
          route = route.replace(' ', ' → ');
        } else if (route.includes('West')) {
          route = route.replace(' ', ' ← ');
        } else if (route.includes('North')) {
          route = route.replace(' ', ' ↑ ');
        } else if (route.includes('South')) {
          route = route.replace(' ', ' ↓ ');
        }

        return {
          route: `${route}`,
          sign: `${this.toSentenceCase(headsign)}`,
          type: 'train',
        };
      }

      // Bus
      if (sign.includes('route')) {
        sign = sign.split(/\w+\s\d+\s*-/g)[1].trim();
      }
      return {
        route: `Route ${name}`,
        sign: `${this.toSentenceCase(sign)}`,
        type: 'bus',
      };
    },
  },
};
</script>

<style lang="less">
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';
</style>
