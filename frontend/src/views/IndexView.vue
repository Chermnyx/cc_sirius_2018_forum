<template>
  <div class="container">
    <b-modal v-if="store.authorized" hide-header-close :no-close-on-esc="creatingThread" :no-close-on-backdrop="creatingThread" :busy="creatingThread" @hide="onModalHide" v-model="indexModalActive" @ok="onModalOK" title="Create new thread">
      <b-form-group label="Thread title">
        <b-form-input :disabled="creatingThread" ref="newThreadInput" type="text" v-model="newThreadTitle" />
      </b-form-group>
    </b-modal>

    <h1 class="float-left">Threads</h1>
    <b-btn v-if="store.authorized" @click="indexModalActive = !indexModalActive" variant="link" class="mt-1 float-right">
      New Thread
    </b-btn>

    <b-table :items="threads" :fields="threads_fields" :busy="pageLoading" small>
      <template slot="title" slot-scope="{ value: title, item }">
        <router-link :to="`/thread/${item._id}`">{{ title }}</router-link>
      </template>

      <template slot="creator" slot-scope="{ value: creator }">
        <span :to="`/user/${creator._id}`">@{{creator.username}}</span>
      </template>

      <template slot="rating" slot-scope="{ value: rating, item }">
        <span :class="`text-${item.vote===1 ? 'success' : item.vote === -1 ? 'danger': ''}`">{{ rating }}</span>
        <b-btn v-if="store.authorized" variant="link" size="sm" @click="() => ratingMinus(item._id)"><b class="text-danger mx-1">-</b></b-btn>
        <b-btn v-if="store.authorized" variant="link" size="sm" @click="() => ratingPlus(item._id)"><b class="text-success mx-1">+</b></b-btn>
      </template>
    </b-table>

    <b-pagination align="center" :total-rows="this.threadsCount" v-model="pageVModel" :per-page="this.perPage" :disabled="pageLoading" />
  </div>
</template>

<script lang="ts">
import * as api from '@/api';
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class IndexView extends Vue {
  store = store;

  page = 0;
  threadsCount = 0;
  perPage = 20;
  get threads() {
    return store.threads;
  }
  set threads(x: IThread[]) {
    store.threads = x;
  }
  threads_fields = [
    { key: 'title', label: 'Title' },
    { key: 'creator', label: 'Creator' },
    // {
    //   key: 'creationDate',
    //   label: 'Created',
    //   formatter: (x: string) => new Date(x).toLocaleString(),
    // },
    { key: 'rating', label: 'Rating' },
  ];
  pageLoading = true;
  indexModalActive = false;
  creatingThread = false;

  newThreadTitle = '';

  async onModalOK(e: Event) {
    e.preventDefault();
    this.creatingThread = true;
    const newThread = await api.newThread(this.newThreadTitle);
    this.creatingThread = false;
    this.$router.push(`/thread/${newThread._id}`);
  }
  onModalHide() {
    this.newThreadTitle = '';
  }

  get pageVModel() {
    return this.page + 1;
  }

  set pageVModel(x: number) {
    this.changePage(x - 1);
  }

  async ratingPlus(_id: string) {
    const status = await api.vote(_id, 1);
    const thread = this.threads.find((x) => x._id === _id);
    if (thread === undefined) return;
    if (status) {
      Vue.set(thread, 'rating', thread.rating + 1);
      Vue.set(thread, 'vote', (thread.vote || 0) + 1);
    }
  }
  async ratingMinus(_id: string) {
    const status = await api.vote(_id, -1);
    const thread = this.threads.find((x) => x._id === _id);
    if (thread === undefined) return;
    if (status) {
      Vue.set(thread, 'rating', thread.rating - 1);
      Vue.set(thread, 'vote', (thread.vote || 0) - 1);
    }
  }

  async changePage(page: number) {
    this.pageLoading = true;

    this.page = page;
    ({ threads: this.threads, total: this.threadsCount } = await api.getThreads(
      this.perPage,
      this.page * this.perPage,
    ));

    this.pageLoading = false;
  }

  created() {
    this.changePage(0);
  }
}
</script>
