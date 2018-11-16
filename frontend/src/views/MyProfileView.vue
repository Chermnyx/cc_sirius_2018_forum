<template>
  <div class="container">
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
        <b-form class="card-body">
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
        <b-form class="card-body">
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
import { UserExistError } from '@/errors';

@Component
export default class MyProfileView extends Vue {
  email = {
    email1: '',
    email2: '',
  };

  password = {
    password1: '',
    password2: '',
  };

  username = '';

  async onUsernameSubmit(e: Event) {
    try {
      await api.editProfile(this.username);
    } catch (e) {
      if (e.error === 'UserExistError') {
        alert('Not unique username');
      } else {
        throw e;
      }
    }
    e.preventDefault();
  }

  async onPasswordSubmit(e: Event) {
    if (this.password.password1 !== this.password.password2) {
      alert(`Passwords don't match`);
      return;
    }
    await api.editProfile(undefined, undefined, this.password.password1);
    e.preventDefault();
  }

  async onEmailSubmit(e: Event) {
    if (this.email.email1 !== this.email.email1) {
      alert(`Emails don't match`);
      return;
    }
    await api.editProfile(undefined, this.email.email1);
    e.preventDefault();
  }
}
</script>
