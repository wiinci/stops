<template>
    <main>
        <h1>Marta</h1>
        <h2 v-show="position.longitude !== 0">{{ position.longitude }}</h2>
        <h2 v-show="position.latitude !== 0">{{ position.latitude }}</h2>
        <h2 v-show="position.lowerBoundLatitude !== 0">{{ position.lowerBoundLatitude }}</h2>
        <h2 v-show="position.lowerBoundLongitude !== 0">{{ position.lowerBoundLongitude }}</h2>
        <h2 v-show="position.upperBoundLatitude !== 0">{{ position.upperBoundLatitude }}</h2>
        <h2 v-show="position.upperBoundLongitude !== 0">{{ position.upperBoundLongitude }}</h2>
        <ul v-show="stopsNearby.length">
            <li
                v-for="stop in stopsNearby"
                :key="stop.stop_id"
            >
                {{ stop.stop_name }}<br>
                {{ stop.departure_time }}
            </li>
        </ul>
        <Bus/>
        <Train/>
    </main>
</template>

<script>
import axios from "axios";
import Bus from "@/components/Bus";
import Train from "@/components/Train";

export default {
    name: "Marta",

    components: {
        Bus,
        Train
    },

    data() {
        return {
            searchRadius: 0.21,
            stops: [],
            stopsNearby: [],
            position: {
                latitude: 0,
                longitude: 0,
                lowerBoundLatitude: 0,
                upperBoundLatitude: 0,
                lowerBoundLongitude: 0,
                upperBoundLongitude: 0
            }
        };
    },

    created() {
        this.getPosition()
            .then(this.getStops)
            .then(this.getStopsInsideSearchRadius)
            .then(this.getDepartureTimes);
    },

    methods: {
        getPosition() {
            const options = {
                enableHighAccuracy: true,
                timeout: 9000,
                maximumAge: 0
            };

            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject("Geolocation is not supported in your browser.");
                } else {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            resolve([position.coords.latitude, position.coords.longitude]);
                        },
                        error => {
                            reject(`${error.message}: Unable to retrieve your location`);
                        },
                        options
                    );
                }
            });
        },

        getStops(coords) {
            // http://www.arubin.org/files/geo_search.pdf
            // Create a search area with center as user's position coordinates
            // and radius equal to search radius within a bounding rectangle
            // defined by latitudes and longitudes around the user's position
            this.position.latitude = coords[0];
            this.position.longitude = coords[1];
            this.position.lowerBoundLatitude = coords[0] - this.searchRadius / 69;
            this.position.upperBoundLatitude = coords[0] + this.searchRadius / 69;
            this.position.lowerBoundLongitude = coords[1] - this.searchRadius / Math.abs(Math.cos(Math.PI / 180 * coords[0]) * 69);
            this.position.upperBoundLongitude = coords[1] + this.searchRadius / Math.abs(Math.cos(Math.PI / 180 * coords[0]) * 69);

            const query = `select * from stops where stop_lon between ${this.position.lowerBoundLongitude} and ${this.position.upperBoundLongitude} and stop_lat between ${this.position.lowerBoundLatitude} and ${this.position.upperBoundLatitude} order by stop_lat`;

            return this.fetchQuery(query);
        },

        getStopsInsideSearchRadius(stops) {
            this.stops = stops;
            this.stopsNearby = stops.reduce((filteredStops, stop) => {
                const isNear = this.isInsideSearchRadius(stop[3], stop[4]);
                if (isNear) {
                    filteredStops.push({
                        stop_id: stop[0],
                        stop_name: stop[2],
                        stop_lat: stop[3],
                        stop_lon: stop[4],
                        stop_dist: this.stopDistance(stop[3], stop[4])
                    });
                }
                return filteredStops;
            }, []);
            return Promise.all(this.stopsNearby);
        },

        getDepartureTimes(stops) {
            stops.map((stop, index) => {
                const query = `select * from stop_times where stop_id = ${stop.stop_id} and departure_time > strftime("%H:%M:%S","now", "localtime") order by departure_time limit 1`;

                this.fetchQuery(query)
                    .then(result => {
                        this.$set(this.stopsNearby[index], "departure_time", result[0][2]);
                    });

                return stop;
            });
        },

        fetchQuery(query) {
            return new Promise((resolve, reject) => {
                axios.get("/api", {
                    params: {
                        sql: query
                    }
                }).then(response => {
                    if (response.status === 200) {
                        console.log(response.data.rows);
                        resolve(response.data.rows);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },

        isInsideSearchRadius(lat, lon) {
            return (this.stopDistance(lat, lon) <= this.searchRadius);
        },

        stopDistance(lat, lon) {
            return +(3956 * 2 * Math.asin(Math.sqrt(Math.sin((this.position.latitude - Math.abs(lat)) * Math.PI / 180 / 2) ** 2 + Math.cos(this.position.latitude * Math.PI / 180) * Math.cos(Math.abs(lat) * Math.PI / 180) * Math.sin((this.position.longitude - lon) * Math.PI / 180 / 2) ** 2))).toFixed(2);
        }
    }
};
</script>

