import Vue from "vue";
import Router from "vue-router";
import Marta from "@/components/Marta";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Marta",
            component: Marta,
        },
    ],
});
