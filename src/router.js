import {createRouter, createWebHistory} from "vue-router";
import Content from "@/pages/Content.vue";
import NotFound from "@/pages/NotFound.vue";
import Home from "@/pages/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Profile from "@/pages/Profile.vue";

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
                path: "signin",
                name: 'signin',
                component: SignIn
            },
            {
                path: "signup",
                name: 'signup',
                component: SignUp
            },
            {
                path: "profile",
                name: 'profile',
                component: Profile,
                meta: {requiresAuth: true},
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