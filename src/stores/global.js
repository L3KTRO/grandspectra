import {defineStore} from 'pinia'

/**
 * Store para manejar los cambios PROPIOS, esto quiere decir, que cada vez que nosotros nos salimos de una página, es
 * entonces cuando se realiza la petición, pero al ser asíncrona, puede que se desincronice el estado de la aplicación
 *
 * EJEMPLO:
 * 1. Estamos en una pelicula, añadimos por ejemplo "marcada como vista"
 * 2. Nos vamos a nuestro perfil
 *
 * Si la request de la película no ha terminado, nuestra visión de nuestro perfil está desincronizada, es entonces donde
 * cobra sentido este store, ya que cada vez que se realiza una petición, se añade un cambio, y cada vez que se esté store
 * se actualiza, se vuelve a realizar la petición de nuestro perfil, para que esté siempre sincronizado (Esto es visible
 * en el componente Profile.vue)
 *
 * @type {StoreDefinition<"changes", {meSync: number}, {}, {addChange(): void}>}
 */
export const useChangesStore = defineStore('changes', {
    state: () => ({
        meSync: 0
    }),
    actions: {
        addChange() {
            this.meSync += 1
        }
    }
})
