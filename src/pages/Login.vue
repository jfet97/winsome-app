<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="min-width: 600px">
      <q-form class="q-gutter-md" @submit="onSubmit" autofocus>
        <q-input
          outlined
          v-model.trim="username"
          label="Username*"
          placeholder="johndoe"
          hint="Your Winsome username"
          clearable
          name="username"
          aria-required
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Username cannot be empty',
          ]"
        />

        <q-input
          outlined
          v-model="password"
          label="Password*"
          hint="Your Winsome secret password"
          clearable
          type="password"
          name="password"
          aria-required
          :rules="[
            (val) => (val && val.length > 0) || 'Password cannot be empty',
          ]"
        />

        <div class="row justify-end">
          <q-btn label="Login" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from '../../src/store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'Login',
  components: {},
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');

    const error = computed(() => store.state.auth.error);
    const isLoading = computed(() => store.state.auth.isLoading);
    const jwt = computed(() => store.state.auth.jwt);

    watch(error, () => {
      if (error.value != '') {
        $q.dialog({
          title: 'Error',
          message: error.value,
        });
      }
    });

    watch(isLoading, () => {
      if (isLoading.value) {
        $q.loading.show({
          delay: 100, // ms
        });
      } else {
        $q.loading.hide();
      }
    });

    watch(jwt, () => {
      if (jwt.value != '') {
        void router.push('/');
      }
    });

    const onSubmit = async () => {
      await store.dispatch('auth/login', {
        username: username.value,
        password: password.value,
      });
    };

    return {
      username,
      password,
      onSubmit,
    };
  },
});
</script>
