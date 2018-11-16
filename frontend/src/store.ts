import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import * as api from '@/api';

@Component
class Store extends Vue {
  token: string | null = null;
  profile: IUser | null = null;
  threads: IThread[] = [];

  get authorized() {
    return this.token !== null && this.profile !== null;
  }

  get JSONData(): string {
    return JSON.stringify({
      token: this.token,
    });
  }

  set JSONData(x: string) {
    const data: any = JSON.parse(x);
    for (const key in data) {
      (this as any)[key] = data[key];
    }
  }

  created() {
    const data = localStorage.getItem('data');
    if (data) {
      this.JSONData = data;
    }
  }

  @Watch('token')
  async onTokenChanged() {
    if (this.token) {
      api.axiosInstance.defaults.headers.Authorization = `Bearer ${this.token}`;
      this.profile = await api.getMe();
    }
    localStorage.setItem('data', this.JSONData);
  }
}

const store = new Store();

(window as any).store = store;

export default store;
