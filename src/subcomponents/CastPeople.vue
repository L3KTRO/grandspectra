<script>
export default {
  name: "CastPeople",
  props: {
    person: {
      type: Object,
      default: {}
    }
  }
}
</script>

<template>
  <div class="person">
    <img :src="person.person.still ?? 'https://placehold.co/150x225'" alt="person.person.name" class="poster"/>
    <div class="info">
      <h2 class="person-name"><a :href="'/person/'+person.person.id">{{ person.person.name }}</a> <span>as</span>
        {{ person.occupation.name }}</h2>
      <h2 v-if="person.character">Playing <span>{{ person.character }}</span></h2>
    </div>
  </div>
</template>

<style scoped>
.person-name {
  font-size: 1.5rem;

  a {
    font-weight: bold;
  }
}

.poster {
  width: 4.5rem;
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
</style>