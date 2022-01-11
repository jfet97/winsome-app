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

        <q-input
          outlined
          v-model="tags"
          label="Tags*"
          hint="Separate tags with a space"
          placeholder="love music programming"
          clearable
          name="tags"
          aria-required
          :rules="[
            (val) => ((console.log(val.split(' ').length), val) && val.split(' ').length > 0) || 'Please insert at least one tag',
            (val) => (val && val.split(' ').length < 6) || 'Maximum 5 tags allowed',
          ]"
        />

        <div class="row justify-end">
          <q-btn
            label="Register"
            type="submit"
            name="register"
            color="primary"
          />
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
import { api, axios } from 'src/boot/axios';

export default defineComponent({
  name: 'Login',
  components: {},
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');
    const tags = ref('');



    const onSubmit = async (e: any) => {
      try {
        await api
          .post('/users', {
            username: username.value,
            password: password.value,
            tags: tags.value.split(' ')
          })
          .then(
            async (response) => {
              $q.notify({
                message: response?.data.res ?? '',
                color: 'positive',
                position: 'bottom-right',
              });
              await new Promise(res => setTimeout(res, 750));
              await router.push('/login');
            },
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
    };

    return {
      username,
      password,
      tags,
      onSubmit,
      console,
    };
  },
});
</script>
