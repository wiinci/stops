<template>
  <li class="stop-details">
    <article>
      <h1 class="stop-name">
        {{ formatStop }}
      </h1>
      <ul class="routes">
        <RouteListItem
          v-for="route in routes[index]"
          :key="`${route.stopName}-${route.arrivalTime}`"
          :route="route"
          :route-details="getHeadsignWithRoute(route.headsign, route.routeName)"
        />
      </ul>
    </article>
  </li>
</template>

<script>
import RouteListItem from '@/components/RouteListItem';
import capitalize from '@/fn/capitalize';

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
  data() {
    return {
      formatStop: capitalize(this.stop)
    };
  },
  methods: {
    getHeadsignWithRoute(destination, routeName) {
      const name = routeName;
      let sign = destination.toLowerCase();

      // Train
      if (sign.includes('bound')) {
        // eslint-disable-next-line
        let [route, headsign] = sign.split('to');

        route = `${capitalize(route)}`;

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
          sign: `${capitalize(headsign)}`,
          type: 'train',
        };
      }

      // Bus
      if (sign.includes('route')) {
        sign = sign.split(/\w+\s\d+\s*-/g)[1].trim();
      }
      return {
        route: `Route ${name}`,
        sign: `${capitalize(sign)}`,
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

@text: #color.text();

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
  box-shadow: 0 1px fade(@text[light], 20%);
  margin-bottom: @base-unit * 2;
  padding: @base-unit * 2 0;
  position: sticky;
  top: 0;
}
</style>
