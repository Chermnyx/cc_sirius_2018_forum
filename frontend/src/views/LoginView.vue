<template>
  <div class="container">
    <b-form-radio-group button-variant="outline-primary" buttons v-model="mode" :options="options" />
    <hr>
    <b-form @submit="onSubmit">
      <b-form-group horizontal label="Email" key="email">
        <b-input type="email" v-model="form.email" />
      </b-form-group>

      <b-form-group v-if="mode === 'reg'" horizontal label="Username" key="username">
        <b-input type="text" v-model="form.username" />
      </b-form-group>

      <b-form-group horizontal label="Password" key="password">
        <b-input type="password" v-model="form.password" />
      </b-form-group>

      <b-btn type="submit" variant="primary" class="float-right">Submit</b-btn>
    </b-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import store from '@/store';
import * as api from '@/api';
import { Prop } from 'vue-property-decorator';

@Component
export default class LoginView extends Vue {
  @Prop({ default: () => '/' })
  nextRoute!: string;

  store = store;
  mode: 'login' | 'reg' = 'login';
  options = [{ text: 'Login', value: 'login' }, { text: 'Create account', value: 'reg' }];

  form = {
    email: '',
    username: '',
    password: '',
  };

  async onSubmit(e: Event) {
    e.preventDefault();
    if (!this.form.email || !this.form.password || (this.mode === 'reg' && !this.form.username)) {
      alert('Please fill all fields');
      return;
    }

    if (this.mode === 'login') await api.login(this.form.email, this.form.password);
    else await api.register(this.form.email, this.form.username, this.form.password);

    this.$router.push(this.nextRoute);
  }
}
</script>
