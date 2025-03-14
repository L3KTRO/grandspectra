<script>import useApi from "@/helpers/api.js";

const {request} = useApi()

export default {
  props: {
    contentId: String
  },
  name: "ContentActions",
  data() {
    return {
      propertyName: this.$route.name === 'movie' ? 'movie_id' : 'tv_id',
      disabledRate: false,
      originalRateId: null,
      originalWatchedId: null,
      originalWatchlistId: null,
      rate: "0",
      watched: false,
      watchlisted: false,
      isLoading: true,
      loggedIn: false,
    }
  },
  computed: {
    switchRate() { // Si el usuario ya ha valorado la película, no puede volver a hacerlo
      return this.disabledRate || this.rate === '0';
    },
    switchRemoveRate() { // Si el usuario no ha valorado la película, no puede eliminar la valoración
      return !this.disabledRate;
    }
  },
  methods: {
    addRate() { // Añadir valoración
      if (this.switchRate) return;
      this.watched = true; // Si se valora, se marca como visto automáticamente
      this.watchlisted = false; // Si se valora, se elimina de la watchlist automáticamente
      this.disabledRate = true; // No se puede volver a valorar
    },

    removeRate() { // Eliminar valoración
      if (this.switchRemoveRate) return; // Si no se ha valorado, no se puede eliminar
      this.rate = "0"; // Se elimina la valoración
      this.disabledRate = false; // Se puede volver a valorar
    },
    moveRate() { // Slider de la valoración
      if (this.rate !== "0")
        this.disabledRate = false;
    },

    toggleWatched() { // Marcar como visto
      this.watched = !this.watched
      this.watchlisted = false; // Si se marca como visto, se elimina de la watchlist automáticamente
    },

    toggleWatchlist() { // Añadir a la watchlist
      this.watchlisted = !this.watchlisted
    },

    checker(item) { // Para cuando obtenemos todos los ratings, watchlist y watched, comprobamos si el contenido está en ellos
      return item[this.propertyName] === parseInt(this.$route.params.id)
    },

    async updateToDb() {
      const contentType = this.propertyName === "movie_id" ? "movie" : "tv";

      // Manejo de ratings
      if (this.rate !== "0" && this.originalRateId === null) {
        // No existía y hay datos nuevos: POST
        await request(`/me/ratings?qualification=${parseInt(this.rate)}&${contentType}_id=${this.contentId}`, {
          method: 'POST',
        });
      } else if (this.rate !== "0" && this.rate !== this.originalRateId) {
        // Existía y hay datos nuevos: PUT
        await request(`/me/ratings/${this.originalRateId}?qualification=${parseInt(this.rate)}&${contentType}_id=${this.contentId}`, {
          method: 'PUT',
        });
      } else if (this.rate === "0" && this.originalRateId !== null) {
        // Existía y se ha eliminado: DELETE
        await request(`/me/ratings/${this.originalRateId}`, {
          method: 'DELETE'
        });
      }

      // Manejo de watched
      if (this.watched && this.originalWatchedId === null) {
        // No existía y ha sido marcado como visto: POST
        await request(`/me/watched?${contentType}_id=${this.contentId}`, {
          method: 'POST',
        });
      } else if (!this.watched && this.originalWatchedId !== null) {
        // Existía y ha sido desmarcado: DELETE
        await request(`/me/watched/${this.originalWatchedId}`, {
          method: 'DELETE'
        });
      }

      // Manejo de watchlist
      if (this.watchlisted && this.originalWatchlistId === null) {
        // No existía y ha sido agregado a watchlist: POST
        await request(`/me/watchlist?${contentType}_id=${this.contentId}`, {
          method: 'POST',
        });
      } else if (!this.watchlisted && this.originalWatchlistId !== null) {
        // Existía y ha sido eliminado de watchlist: DELETE
        await request(`/me/watchlist/${this.originalWatchlistId}`, {
          method: 'DELETE'
        });
      }
    }
  },

  async beforeMount() {
    this.isLoading = true
    const res = await request('/me')
    if (res.status === 401) return this.loggedIn = false // No está logueado
    if (res.status !== 200) return; // Error
    this.loggedIn = true // Está logueado

    res.data.watched.forEach((watched) => { // Comprobamos si está marcado como visto
      if (this.checker(watched)) {
        this.watched = true
        this.originalWatchedId = watched.id
      }
    })

    res.data.watchlist.forEach((watchlist) => { // Comprobamos si está en la watchlist
      if (this.checker(watchlist)) {
        this.watchlisted = true
        this.originalWatchlistId = watchlist.id
      }
    })

    res.data.ratings.forEach((rate) => { // Comprobamos si está valorado
      if (this.checker(rate)) {
        this.rate = rate.qualification
        this.disabledRate = true
        this.originalRateId = rate.id
      }
    })

    this.isLoading = false
  },
  async beforeUnmount() {
    await this.updateToDb()
  }
}
</script>

<template>
  <div id="actions">
    <ul id="list" v-if="!isLoading && loggedIn">
      <li @click="toggleWatched">Mark as <span>{{ watched ? 'unwatched' : "watched" }}</span></li>
      <li @click="toggleWatchlist">{{ watchlisted ? 'Remove from ' : "Add to " }}<span>watchlist</span></li>
      <li style="display: flex; flex-direction: column;">
        <h3><span>{{ rate }}</span></h3>
        <input
            v-model="rate"
            @change="moveRate"
            type="range"
            :min="1"
            :max="10"
            :step="1"
            style="margin: 0 2rem"
        />
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div class="button action-button" :class="switchRate ? 'disabled-button' : ''">
            <h2 @click="addRate">RATE</h2>
          </div>
          <div class="button action-button"
               :class="switchRemoveRate ? 'disabled-button' : ''">
            <h2 @click="removeRate">REMOVE</h2>
          </div>
        </div>
      </li>
    </ul>
    <ul id="list" v-else>
      <li v-if="isLoading && loggedIn">Loading...</li>
      <li v-else>Add to watchlist or rate it!
        <router-link to="/signup">
          <div class="button light-neon-effect-text" id="join">Join Us</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>

#join {
  font-family: 'CharisSIL', "GTVCS", serif;
  text-transform: uppercase;
  margin: auto;
  width: 150px;
}

.disabled-button {
  background-color: var(--background-contrast-mid);
  color: var(--text-contrast);
  cursor: not-allowed;

  h2 {
    text-shadow: none;
  }
}

.action-button {
  margin: 0.5rem;
  padding: 0 1rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  font-weight: 900;
  border-radius: 5px;
  transition: ease-in-out 0.3s;
}

span {
  font-weight: bold;
}

#list {
  li {
    background-color: var(--background-contrast);
    border-bottom: 1px solid var(--background-contrast-mid);
    padding: 0.5rem 0;
    font-size: 1.25rem;
  }
}

#actions {
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
  background-color: var(--background-contrast);
  flex-basis: 20%;
  height: fit-content;
}
</style>