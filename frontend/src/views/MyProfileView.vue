<template>
  <div class="container">
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

  async onPasswordSubmit(e: Event) {
    e.preventDefault();
  }
  async onEmailSubmit(e: Event) {
    e.preventDefault();
  }
}
</script>
