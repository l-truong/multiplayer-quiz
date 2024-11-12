<template>  
  <div class="container">
    <router-view/>  
    <div class="languageSelector">
      <select v-model="$i18n.locale" >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: { }
}
</script>