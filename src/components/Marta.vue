<template>
    <main>
        <h1>Marta</h1>
        <h2>{{ position.lon }}</h2>
        <h2>{{ position.lat }}</h2>
        <Bus/>
        <Train/>
    </main>
</template>

<script>
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
            position: {
                lat: 0,
                lon: 0
            }
        };
    },
    created() {
        this.getPosition()
            .then(result => {
                console.log(result);
                this.position.lat = result.lat;
                this.position.lon = result.lon;
            });
    },
    methods: {
        getPosition() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject("Geolocation is not supported in your browser");
                } else {
                    window.navigator.geolocation.getCurrentPosition(
                        // success
                        position => {
                            resolve({
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            });
                        },

                        // error
                        error => {
                            reject(`User declined position access. ${error}`);
                        },

                        // options
                        {
                            enableHighAccuracy: false,
                            timeout: 5000,
                            maximumAge: 30000
                        }
                    );
                }
            });
        }
    }
};
</script>

