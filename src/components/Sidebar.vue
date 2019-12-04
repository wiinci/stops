<template>
  <aside>
    <Today />
    <AirQuality />
  </aside>
</template>

<script>
import AirQuality from '@/components/AirQuality';
import Today from '@/components/Today';

export default {
  name: 'Sidebar',
  components: { AirQuality, Today },
};
</script>
