<template>
  <div>
    <h1>Items</h1>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }} - {{ item.description }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    axios.get('http://127.0.0.1:8000/api/items/')
      .then(response => {
        this.items = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>