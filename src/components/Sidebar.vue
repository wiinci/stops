<template>
  <aside>
    <Today :timezone="timezone" />
    <AirQuality :latlon="latlon" />
  </aside>
</template>

<script>
import AirQuality from '@/components/AirQuality';
import Today from '@/components/Today';

export default {
  name: 'Sidebar',
  components: { AirQuality, Today },
  props: {
    latlon: {
      type: Object,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    }
  },
};
</script>
