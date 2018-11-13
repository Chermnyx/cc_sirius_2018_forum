<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="danger" class="mb-3">
      <b-navbar-brand to="/">Cyber2ch</b-navbar-brand>
      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/my_profile" v-if="store.authorized">
            <strong>@{{ store.profile.username }}</strong>
          </b-nav-item>

          <b-nav-item to="/login" v-else>
            login
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import store from '@/store';

@Component
export default class App extends Vue {
  store = store;
}
</script>

<style>
</style>
