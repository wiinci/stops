<template>
    <main>
        <template>
            <article
                v-for="stop in stopsNearby"
                :key="stop.stop_id"
            >
                <h1>
                    <div
                        class="major-st"
                        aria-describedby="route"
                    >
                        {{ stop.route_number }}
                    </div>
                    <div
                        class="minor-st"
                        aria-describedby="headsign"
                    >
                        {{ stop.trip_headsign }}
                    </div>
                </h1>
                <section class="slat">
                    <p class="stop area1">
                        <span class="caption">{{ stop.stop_name[0] }} &amp;</span>
                        <span class="body">{{ stop.stop_name[1] }}</span>
                    </p>
                    <p class="stop area2">
                        <span
                            id="arriving"
                            class="caption"
                        >
                            <time :datetime="$moment('09:05', 'hh:mm').format()">Arriving @ {{ $moment(stop.arrival_time, "HH:mm:ss").format("hh:mm A") }} in</time>
                        </span>

                        <span
                            class="body"
                            aria-describedby="arriving"
                        >
                            <time :datetime="$moment('09:05', 'hh:mm').format()">{{ $moment(stop.arrival_time, "HH:mm:ss").fromNow(true) }}</time>
                        </span>
                    </p>
                </section>
            </article>
        </template>
    </main>
</template>

<script>
import axios from "axios";

export default {
    name: "Marta",

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
        const stops = [{ stop_id: 106190, stop_name: "GLENWOOD AVE SE@PARKER AVE", stop_lat: 33.739791, stop_lon: -84.300463, stop_dist: 0.21 },
            { stop_id: 106186, stop_name: "GLENWOOD AVE SE@CARTER AVE SE", stop_lat: 33.73989, stop_lon: -84.304919, stop_dist: 0.17 },
            { stop_id: 106188, stop_name: "GLENWOOD AVE SE@CARTER AVE SE", stop_lat: 33.740093, stop_lon: -84.305435, stop_dist: 0.2 }];
        this.stopsNearby = stops;
        this.getArrivalTimes(stops);
        console.log(process.env.NODE_ENV);

        // this.getPosition()
        //     .then(this.getStops)
        //     .then(this.getStopsInsideSearchRadius)
        //     .then(this.getArrivalTimes);
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

        async getStops(coords) {
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

            const query = `select *
                from stops
                where stop_lon between ${this.position.lowerBoundLongitude} and ${this.position.upperBoundLongitude} and stop_lat between ${this.position.lowerBoundLatitude} and ${this.position.upperBoundLatitude}
                order by stop_lat`;

            const res = await this.fetchQuery(query);
            return res;
        },

        async getStopsInsideSearchRadius(stops) {
            this.stops = stops;
            this.stopsNearby = stops.reduce((filteredStops, stop) => {
                const isNear = this.isInsideSearchRadius(stop[3], stop[4]);
                if (isNear) {
                    filteredStops.push({
                        stop_id: stop[0],
                        stop_name: this.stopName(stop[2]),
                        stop_lat: stop[3],
                        stop_lon: stop[4],
                        stop_dist: this.stopDistance(stop[3], stop[4])
                    });
                }
                return filteredStops;
            }, []);
            const res = await Promise.all(this.stopsNearby);
            return res;
        },

        async getArrivalTimes(stops) {
            await stops.map((stop, index) => {
                const query = `select distinct stop_times.stop_id, stop_times.arrival_time, stops.stop_name, stops.stop_lat, stops.stop_lon, trips.trip_headsign, routes.route_short_name, routes.route_long_name, routes.route_type
                    from stop_times
                    natural join stops
                    natural join trips
                    natural join routes
                    where stop_times.stop_id = ${stop.stop_id}
                    and stop_times.arrival_time > strftime('%H:%M:%S', 'now', 'localtime')
                    order by stop_times.arrival_time
                    limit 1`;

                this.fetchQuery(query)
                    .then(result => {
                        this.$set(this.stopsNearby[index], "arrival_time", result[0][1]);
                        this.$set(this.stopsNearby[index], "stop_name", this.stopName(result[0][2]));
                        this.$set(this.stopsNearby[index], "trip_headsign", this.headSign(result[0][5]));
                        this.$set(this.stopsNearby[index], "route_number", result[0][6]);
                        this.$set(this.stopsNearby[index], "route_type", result[0][8]);
                    });

                return stop;
            });
        },

        fetchQuery(query) {
            const q = query.replace(/\s\s+/g, " ");
            return new Promise((resolve, reject) => {
                axios.get("/api", {
                    params: {
                        sql: q
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
        },

        headSign(sign) {
            return sign.split(" ").splice(2).filter(str => str !== "-").join(" ");
        },

        stopName(name) {
            return name.split(/[@-]/).map(n => n.trim());
        }
    },
};
</script>

<style lang="less" scoped>
@base-unit: 0.4rem;
.line-height(@fs, @lh: 1, @r: 0.4rem) {
  line-height: ceil((@fs * @lh) / @r) * @r;
}

.major-st {
  font-size: 2.6rem;
  font-weight: 800;
  .line-height(2.6rem);
  text-align: center;
  background: red;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
}
.minor-st {
  font-size: 3.4rem;
  font-weight: 800;
  .line-height(3.4rem);

  @media only screen and (min-width: 501px) {
    font-size: 4.2rem;
    .line-height(4.2rem);
  }
}
.caption {
  font-size: 1.6rem;
  font-weight: 400;
  text-transform: uppercase;
  .line-height(1.6rem);
}
.body {
  font-size: 2.6rem;
  font-weight: 800;
  text-transform: uppercase;
  .line-height(2.6rem);
}
section {
  list-style: none;
  list-style-position: outside;
  margin: 0;
  padding: 0.8rem 0;
  display: grid;
  grid-template-areas:
    "area1"
    "area2";
  grid-column-gap: (@base-unit * 4);

  &:last-child {
    border-bottom: 2px solid;
  }

  + section {
    padding-top: (@base-unit * 2);
    margin-top: @base-unit;
    border-top: 1px solid;
  }

  @media only screen and (min-width: 501px) {
    grid-template-areas: "area1 area2";
  }
}
article {
  + article {
    margin-top: (@base-unit * 13);
  }
}
.stop {
  + .stop {
    margin-top: (@base-unit * 3);
  }
  @media only screen and (min-width: 501px) {
    + .stop {
      margin-top: 0;
    }
  }
}
.area1 {
  grid-area: area1;
}
.area2 {
  grid-area: area2;
  @media only screen and (min-width: 501px) {
    text-align: right;
  }
}
span {
  display: block;
}
h1 {
  padding-bottom: (@base-unit * 2);
  border-bottom: 1px solid;
  display: grid;
  align-items: center;
  grid-template-columns: 6rem 1fr;
  grid-column-gap: (@base-unit * 3);
}
</style>

