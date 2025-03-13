import {defineStore} from 'pinia'

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
