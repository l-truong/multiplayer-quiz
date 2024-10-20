<template>  
  <router-view/>  
  <select v-model="$i18n.locale">
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select>
</template>

<script>
export default {
  name: 'App',
  components: { }
}
</script>

<style>
</style>