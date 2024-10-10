<template>
  <nav>
    <router-link to="/">Home</router-link><br>
    <router-link to="/student">Student</router-link><br>
  </nav>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  components: { }
}
</script>

<style>
</style>