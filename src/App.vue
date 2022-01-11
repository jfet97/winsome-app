<template>
  <router-view />
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */

import { defineComponent } from 'vue';
import { api } from 'boot/axios';
import { useStore } from '../src/store';
import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    const jwt = LocalStorage.getItem('winsome-jwt');
    if (jwt) {
      store.dispatch('auth/setAuth', jwt);
    }

    api.interceptors.response.use(void 0, async (err) => {
      if (err.response.status === 401) {
        await store.dispatch('auth/logout');
        router.push('/login');
      }
      throw err;
    });
  },
});
</script>
