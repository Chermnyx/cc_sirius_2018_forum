import Vue from 'vue';

export default new class Store extends Vue {
  token?: string;
  profile?: IUser;

  get authorized() {
    return this.token !== undefined;
  }
}();
