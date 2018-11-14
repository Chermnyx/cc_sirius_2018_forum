<template>
  <div class="container">
    <h1>{{thread && thread.title}}</h1>
    Rating: {{ thread && thread.rating }}
    <b-btn variant="link" size="sm" @click="ratingMinus"><b class="text-danger mx-1">-</b></b-btn>
    <b-btn variant="link" size="sm" @click="ratingPlus"><b class="text-success mx-1">+</b></b-btn>

    <div class="card my-3" v-for="post of posts" :key="post._id">
      <span class="card-header">
        <router-link :to="`/user/${post.author._id}`">@{{ post.author.username }}</router-link>
        <small class="float-right mt-1">{{ new Date(post.creationDate).toLocaleString() }}</small>
      </span>
      <div class="card-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12" :class="{ 'col-md-2': post.pic && post.text }" v-if="post.pic">
              <img :src="post.pic" class="img-fluid" />
            </div>
            <div class="col-12" :class="{ 'col-md-10': post.pic && post.text }" v-if="post.text">
              <span class="post-text">{{ post.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-pagination align="center" :total-rows="this.postsCount" v-model="pageVModel" :per-page="this.perPage" :disabled="pageLoading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import * as api from '@/api';
import store from '@/store';

@Component
export default class ThreadView extends Vue {
  pageLoading = true;

  @Prop()
  _id!: string;
  thread: IThread | null = null;

  page = 0;
  postsCount = 0;
  perPage = 20;

  posts: IPost[] = [];

  get pageVModel() {
    return this.page + 1;
  }

  set pageVModel(x: number) {
    this.changePage(x - 1);
  }

  async changePage(page: number) {
    this.pageLoading = true;

    this.page = page;
    ({ posts: this.posts, total: this.postsCount } = await api.getPosts(
      this._id,
      this.perPage,
      this.perPage * this.page,
    ));

    this.pageLoading = false;
  }

  async ratingPlus() {
    const status = await api.vote(this._id, 1);
    const thread = this.thread!;
    if (status) {
      Vue.set(thread, 'rating', thread.rating + 1);
    }
  }
  async ratingMinus() {
    const status = await api.vote(this._id, -1);
    const thread = this.thread!;
    if (status) {
      Vue.set(thread, 'rating', thread.rating - 1);
    }
  }

  async created() {
    this.thread = await api.getThread(this._id);
    this.changePage(0);
  }
}
</script>

<style scoped>
.post-text {
  white-space: pre-wrap;
}

img {
  max-width: 50vh;
}
</style>
