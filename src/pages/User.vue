<template>
  <q-page class="column items-center justify-center">
    <h4>You</h4>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user?.username }}</q-item-label>
          <q-item-label caption>
            {{ user?.tags.join(', ') }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section vertical>
        <q-card-section>
          <b>Followers:</b> {{ user?.followers.join(', ') }}
        </q-card-section>
        <q-card-section>
          <b>Following:</b> {{ user?.following.join(', ') }}
        </q-card-section>
      </q-card-section>
    </q-card>
    <!-- <pre><code>{{ JSON.stringify(user, null, 2)}}</code></pre> -->
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { defineComponent, computed, ref } from 'vue';
import { api, axios } from '../boot/axios';
import { useStore } from '../../src/store';
import { useQuasar } from 'quasar';
import { User } from 'src/domain/User';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const username = computed(() => store.getters['auth/username']);

    const user = ref<User>();

    async function fetchData() {
      try {
        await api.get(`/users/${username.value}`).then(
          (response) => (user.value = response.data.res),
          (error: unknown) => {
            if (axios.isAxiosError(error)) {
              $q.notify({
                message: error.response?.data.res ?? '',
                color: 'negative',
                position: 'bottom-right',
              });
            }
            console.error(error);
          }
        );
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();

    return { user };
  },
});
</script>

<style scoped>
.my-card {
  min-width: 600px;
}
</style>
