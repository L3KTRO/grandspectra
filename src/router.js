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
import Hub from "@/pages/Hub.vue";
import Members from "@/pages/Members.vue";

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
            {
                path: '/tv/:id',
                name: 'tv',
                component: Tv
            },
            {
                path: "/members",
                name: "members",
                component: Members
            },
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
                path: "/:username",
                name: 'profile',
                component: Profile,
                meta: {requiresAuth: true},
            },
            {
                path: "hub",
                name: 'hub',
                component: Hub,
            },
            {
                path: '/notfound',
                name: 'NotFound',
                component: NotFound
            }
        ],
    },

]


/**
 * Router para la aplicación
 * @type {Router}
 */
const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * Middleware para la autenticación
 */
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