<template>  
  <router-view/>  
  <div class="languageSelector">
    <select v-model="$i18n.locale" >
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: { }
}
</script>

<style lang="scss" scoped>
#app {
  .languageSelector {
    display: flex;
    justify-content: right;
    padding: 0.5em 0em;
  }
}
</style>