import {createRouter, createWebHistory} from "vue-router";
import Movie from "@/pages/Movie.vue";
import NotFound from "@/pages/NotFound.vue";
import Home from "@/pages/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Profile from "@/pages/Profile.vue";
import {useAuthStore} from "@/stores/auth.js";
import Tv from "@/pages/Tv.vue";
import Person from "@/pages/Person.vue";

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
                path: '/movie/:id',
                name: 'movie',
                component: Movie
            },
            {
                path: '/person/:id',
                name: 'person',
                component: Person
            },
            /*
            {
                path: '/tv/:id',
                name: 'tv',
                component: Tv
            },
            */
            {
                path: "signin",
                name: 'signin',
                component: SignIn,
                meta: {requiresAuth: false},
            },
            {
                path: "signup",
                name: 'signup',
                component: SignUp,
                meta: {requiresAuth: false},
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

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {name: 'signin'}
    } else if (!to.meta.requiresAuth && authStore.isAuthenticated && (to.name === 'signin' || to.name === 'signup')) {
        return {name: 'profile'}
    }

    return true
})

export default router