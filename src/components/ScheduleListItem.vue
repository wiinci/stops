<template>
  <li class="stop-details">
    <article>
      <h1 class="stop-name">
        {{ toSentenceCase(stop) }}
      </h1>
      <ul class="routes">
        <RouteListItem
          v-for="route in routes[index]"
          :key="route.arrivalTime"
          :route="route"
          :route-details="getHeadsignWithRoute(route.headsign, route.routeName)"
        />
      </ul>
    </article>
  </li>
</template>

<script>
import RouteListItem from '@/components/RouteListItem';

export default {
  name: 'ScheduleListItem',
  components: { RouteListItem },
  props: {
    index: {
      type: Number,
      required: true,
    },
    routes: {
      type: Array,
      required: true,
    },
    stop: {
      type: String,
      required: true,
    },
  },
  methods: {
    toSentenceCase(str) {
      return str
        .trim()
        .split(' ')
        .map(n => n.charAt(0).toUpperCase() + n.slice(1))
        .join(' ');
    },
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

<style lang="less" scoped>
@import (reference) '../assets/styles/bundles/colors.less';
@import (reference) '../assets/styles/variables/global.less';
@import (reference) '../assets/styles/bundles/typography.less';

.stops {
  list-style-type: none;
}

.stop-details {
  + .stop-details {
    margin-top: @base-unit * 6;
  }
}

.stop-name {
  #type.h3();
  background-color: @background;
  box-shadow: 0 2px fade(#color.text[light], 20%);
  margin-bottom: @base-unit * 2;
  padding: @base-unit * 2 0;
  position: sticky;
  top: 0;
}
</style>
