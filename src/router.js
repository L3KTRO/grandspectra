import {createRouter, createWebHistory} from "vue-router";
import Content from "@/pages/Content.vue";
import NotFound from "@/pages/NotFound.vue";
import Home from "@/pages/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: Home
            },
            {
                path: '/content/:id',
                name: 'content',
                component: Content
            },
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: NotFound
            }
        ],
    },

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router