import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Marta",
            component: () => import("@/components/Marta"),
        },
        {
            path: "/bus/:route",
            name: "Bus",
            component: () => import("@/components/Bus"),
        },
        {
            path: "/train/:line",
            name: "Train",
            component: () => import("@/components/Train"),
        },
    ],
});
