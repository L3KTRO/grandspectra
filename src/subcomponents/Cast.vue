<script>
import CastPeople from "@/subcomponents/CastPeople.vue";

export default {
  name: "Cast",
  components: {CastPeople, CastPerson: CastPeople},
  props: {
    people: {
      type: Array,
      default: []
    }
  },
  computed: {
    cast() {
      return this.people.filter(person => person.occupation_id === 10 && person.person && person.person.name)
          .sort((a, b) => a.order - b.order)
    },
    crew() {
      return this.people.filter(person => person.occupation_id !== 10 && person.person && person.person.name)
          .sort((a, b) => a.order - b.order)
    }
  }
}
</script>

<template>
  <div id="cast" v-if="this.people.length > 0">
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
</template>

<style scoped>

#people {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

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