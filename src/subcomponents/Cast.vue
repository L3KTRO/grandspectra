<script>
export default {
  name: "Cast",
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
    <div id="people">
      <div class="people">
        <div class="title">
          <h1 class="light-neon-effect-text">Casting</h1>
        </div>
        <div class="person"
             v-if="this.cast.length > 0"
             v-for="person in this.cast"
             :key="person.id"
        >
          <img :src="person.person.still ?? 'https://placehold.co/150x225'" alt="person.person.name" class="poster"/>
          <div class="info">
            <h2 class="person-name"><a>{{ person.person.name }}</a> <span>as</span> {{ person.occupation.name }}</h2>
            <h2 v-if="person.character">Playing <span>{{ person.character }}</span></h2>
          </div>
        </div>
      </div>
      <div class="people">
        <div class="title">
          <h1 class="light-neon-effect-text">Crew</h1>
        </div>
        <div class="person"
             v-if="this.crew.length > 0"
             v-for="person in this.crew"
             :key="person.id">
          <img :src="person.person.still ?? 'https://placehold.co/150x225'" alt="person.person.name" class="poster"/>
          <div class="info">
            <h2 class="person-name"><a>{{ person.person.name }}</a> <span>as</span> {{ person.occupation.name }}</h2>
            <h2 v-if="person.character">Playing <span>{{ person.character }}</span></h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#people {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.people {
  display: flex;
  flex-direction: column;
  width: 50%;
}

#cast {
  display: flex;
  flex-direction: column;
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

.person-name {
  font-size: 1.5rem;

  a {
    font-weight: bold;
  }
}

.person {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  margin: 1rem;
  padding: 2rem;
  background-color: var(--background-contrast-mid);

  img {
    margin-right: 2rem;
  }

  span {
    font-style: italic
  }
}

.poster {
  width: 4.5rem;
}
</style>