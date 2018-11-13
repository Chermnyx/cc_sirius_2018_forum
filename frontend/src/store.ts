import Vue from 'vue';
import Component from 'vue-class-component';

@Component
class Store extends Vue {
  token: string | null = null;
  profile: IUser | null = null;

  get authorized() {
    return this.token !== null;
  }
}

const store = new Store();

(window as any).store = store;

export default store;
