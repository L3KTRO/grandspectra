<script>
import CastPeople from "@/subcomponents/CastPeople.vue";

// Usado para mostrar el casting de una pelicula, divido entre casting y equipo

export default {
  name: "Cast",
  components: {CastPeople, CastPerson: CastPeople},
  props: {
    people: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth

    }
  },
  methods: {
    sortPerson(a, b) { // Ordena por orden de aparicion en la pelicula, si no tiene orden, por popularidad
      if (a.order === null && b.order === null) {
        return parseInt(b.person.popularity) - parseInt(a.person.popularity);
      }
      if (a.order === null) {
        return 1;
      }
      if (b.order === null) {
        return -1;
      }
      return a.order - b.order;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  computed: {
    cast() { // Filtra por casting
      return this.people.filter(person => person.occupation_id === 10 && person.person && person.person.name)
          .sort(this.sortPerson)
    },
    crew() { // Filtra por equipo
      return this.people.filter(person => person.occupation_id !== 10 && person.person && person.person.name)
          .sort(this.sortPerson)
    },
    mobile() {
      return this.windowWidth < 875;
    }
    ,
    hiperMobile() {
      return this.windowWidth < 750;
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize);
  }
}
</script>

<template>
  <div id="cast" v-if="this.people.length > 0" :style="mobile ? 'flex-direction: column;' : 'flex-direction: row;'">
    <div class="people" v-if="this.cast.length > 0">
      <div class="title">
        <h1 class="light-neon-effect-text">Casting</h1>
      </div>
      <CastPeople :person="person"
                  v-for="person in this.cast"
                  :key="person.id"
      />
    </div>
    <div class="people" v-if="this.crew.length > 0">
      <div class="title">
        <h1 class="light-neon-effect-text">Crew</h1>
      </div>
      <CastPeople :person="person"
                  v-for="person in this.crew"
                  :key="person.id"
      />
    </div>
  </div>
  <div v-else style="display: flex; justify-content: center; align-items: center; ">
    <h1 class="light-neon-effect-text">No cast or crew found</h1>
  </div>
</template>

<style scoped>

.people {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#cast {
  display: flex;
  flex-direction: row;
  margin: 3rem 0;
  flex-basis: 75%;

  .title {
    font-family: 'CharisSIL', "GTVCS", serif;
    font-size: 1.75rem;
    border-bottom: 1px solid var(--shadow-darker);
    background: linear-gradient(to top, rgba(251, 43, 43, 0.15), var(--background) 80%);
    margin: 0 1rem;
    padding: 1rem;

    * {
      text-align: center;
      text-transform: uppercase;
    }
  }
}


</style>