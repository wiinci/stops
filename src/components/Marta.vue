<template>
    <main>
        <h1>Marta</h1>
        <h2 v-show="position.lon !== 0">{{ position.lon }}</h2>
        <h2 v-show="position.lat !== 0">{{ position.lat }}</h2>
        <h2 v-show="position.lowerBoundLatitude !== 0">{{ position.lowerBoundLatitude }}</h2>
        <h2 v-show="position.lowerBoundLongitude !== 0">{{ position.lowerBoundLongitude }}</h2>
        <h2 v-show="position.upperBoundLatitude !== 0">{{ position.upperBoundLatitude }}</h2>
        <h2 v-show="position.upperBoundLongitude !== 0">{{ position.upperBoundLongitude }}</h2>
        <ul v-show="stationsNearby.length">
            <li
                v-for="station in stationsNearby"
                :key="station.stop_id"
            >
                {{ station.stop_name }}
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
            searchRadius: 0.2,
            stations: [],
            stationsNearby: [],
            position: {
                lat: 0,
                lon: 0,
                lowerBoundLatitude: 0,
                upperBoundLatitude: 0,
                lowerBoundLongitude: 0,
                upperBoundLongitude: 0
            }
        };
    },
    watch: {
        position: {
            handler: "getStations",
            deep: true
        },
        stations: {
            handler: "getNearbyStations",
            deep: true
        }
    },
    created() {
        this.getPosition()
            .then(user => {
                console.log(user);
                this.position.lat = user.lat;
                this.position.lon = user.lon;

                // http://www.arubin.org/files/geo_search.pdf
                // Create a search area with center as user's position coordinates
                // and radius equal to search radius within a bounding rectangle
                // defined by latitudes and longitudes around the user's position
                this.position.lowerBoundLatitude = user.lat - this.searchRadius / 69;
                this.position.upperBoundLatitude = user.lat + this.searchRadius / 69;
                this.position.lowerBoundLongitude = user.lon - this.searchRadius / Math.abs(Math.cos(Math.PI / 180 * user.lat) * 69);
                this.position.upperBoundLongitude = user.lon + this.searchRadius / Math.abs(Math.cos(Math.PI / 180 * user.lat) * 69);
            }).catch(error => {
                throw error;
            });
    },
    methods: {
        getPosition() {
            return new Promise(function (resolve, reject) {
                if (!navigator.geolocation) {
                    reject("Geolocation is not supported in your browser.");
                } else {
                    navigator.geolocation.getCurrentPosition(
                        // success
                        position => {
                            resolve({
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            });
                        },

                        // error
                        error => {
                            reject(`${error.message} [error code: ${error.code}]`);
                        },

                        // options
                        {
                            enableHighAccuracy: true,
                            timeout: 10000
                        }
                    );
                }
            });
        },

        getStations(position) {
            const query = `select * from stops where stop_lon between ${position.lowerBoundLongitude} and ${position.upperBoundLongitude} and stop_lat between ${position.lowerBoundLatitude} and ${position.upperBoundLatitude} order by stop_lat`;

            axios.get("/api", {
                params: {
                    sql: query
                }
            }).then(response => {
                console.log(response);
                if (response.status === 200) {
                    this.stations = response.data.rows;
                }
            }).catch(error => {
                throw error;
            });
        },

        getNearbyStations(stations) {
            this.stationsNearby = stations.reduce((filteredStations, station) => {
                const isNear = this.withinReach(station[3], station[4]);
                if (isNear) {
                    filteredStations.push({
                        stop_id: station[0],
                        stop_name: station[2],
                        stop_lat: station[3],
                        stop_lon: station[4]
                    });
                }
                return filteredStations;
            }, []);
        },

        withinReach(lat, lon) {
            return (3956 * 2 * Math.asin(Math.sqrt(Math.sin((this.position.lat - Math.abs(lat)) * Math.PI / 180 / 2) ** 2 + Math.cos(this.position.lat * Math.PI / 180) * Math.cos(Math.abs(lat) * Math.PI / 180) * Math.sin((this.position.lon - lon) * Math.PI / 180 / 2) ** 2)) <= this.searchRadius);
        }
    }
};
</script>

