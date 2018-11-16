<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col-12">
        <b-btn variant="danger" class="float-right" @click="onLogoutClicked">Logout</b-btn>
      </div>
    </div>
    <div class="row">
      <div class="col-12 card">
        <b-form class="card-body" @submit="onUsernameSubmit">
          <b-form-group label="New username">
            <b-input type="text" v-model="username" />
          </b-form-group>
          <b-btn type="submit" variant="primary" class="float-right">Submit</b-btn>
        </b-form>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 col-12 card">
        <b-form class="card-body" @submit="onEmailSubmit">
          <b-form-group label="New email" key="email1">
            <b-input type="email" v-model="email.email1" />
          </b-form-group>

          <b-form-group label="Confirm email" key="email2">
            <b-input type="email" v-model="email.email2" />
          </b-form-group>

          <b-btn type="submit" variant="primary" class="float-right">Submit</b-btn>
        </b-form>
      </div>

      <div class="col-md-6 col-12 card">
        <b-form class="card-body" @submit="onPasswordSubmit">
          <b-form-group label="Old password" key="oldPassword">
            <b-input type="password" v-model="password.oldPassword" />
          </b-form-group>

          <b-form-group label="New password" key="password1">
            <b-input type="password" v-model="password.password1" />
          </b-form-group>

          <b-form-group label="Confirm password" key="password2">
            <b-input type="password" v-model="password.password2" />
          </b-form-group>

          <b-btn type="submit" variant="primary" class="float-right">Submit</b-btn>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as api from '@/api';

@Component
export default class MyProfileView extends Vue {
  email = {
    email1: '',
    email2: '',
  };

  password = {
    oldPassword: '',
    password1: '',
    password2: '',
  };

  username = '';

  async onLogoutClicked() {
    await api.logout();
    this.$router.push('/');
  }

  async onUsernameSubmit(e: Event) {
    e.preventDefault();

    try {
      await api.editProfile(this.username);
    } catch {
      return;
    }

    this.username = '';
  }

  async onPasswordSubmit(e: Event) {
    e.preventDefault();
    if (this.password.password1 !== this.password.password2) {
      alert(`Passwords don't match`);
      return;
    }
    await api.editPassword(this.password.oldPassword, this.password.password1);

    this.password.password1 = '';
    this.password.password2 = '';
    this.password.oldPassword = '';
  }

  async onEmailSubmit(e: Event) {
    e.preventDefault();
    if (this.email.email1 !== this.email.email2) {
      alert(`Emails don't match`);
      return;
    }
    await api.editProfile(undefined, this.email.email1);
    this.email.email1 = '';
    this.email.email2 = '';
  }
}
</script>
