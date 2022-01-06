<template>
  <q-layout view="lHh lpr lFr">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Winsome
          <q-btn
            v-if="isSignedIn"
            label="Profile"
            flat
            text-color="white"
            @click="goToProfile"
          />
          <q-btn
            v-if="isSignedIn"
            label="Blog"
            flat
            text-color="white"
            @click="goToBlog"
          />
          <q-btn
            v-if="isSignedIn"
            label="Feed"
            flat
            text-color="white"
            @click="goToFeed"
          />
        </q-toolbar-title>
        <q-space />
        <q-btn
          v-if="isSignedIn"
          label="Logout"
          color="white"
          text-color="primary"
          @click="onLogoutClick"
        />
        <q-btn
          v-if="!isSignedIn && !isRouteRegister"
          label="Register"
          color="white"
          text-color="primary"
          @click="goToRegister"
        />
        <q-btn
          v-if="!isSignedIn && !isRouteLogin"
          label="Login"
          color="white"
          text-color="primary"
          @click="goToLogin"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { defineComponent, computed } from 'vue';
import { useStore } from '../../src/store';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'LeftToolbarLayout',

  components: {},

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const isSignedIn = computed(() => store.getters['auth/isSignedIn']);

    const onLogoutClick = () => {
      store.dispatch('auth/logout');
      router.push('/login');
    };

    const goToFeed = () => {
      router.push('/feed');
    };

    const goToBlog = () => {
      router.push('/blog');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    const goToRegister = () => {
      router.push('/register');
    };

    const goToLogin = () => {
      router.push('/login');
    };

    const isRouteLogin = computed(() => route.fullPath === '/login');
    const isRouteRegister = computed(() => route.fullPath === '/register');

    return {
      isSignedIn,
      onLogoutClick,
      goToFeed,
      goToBlog,
      goToProfile,
      goToRegister,
      goToLogin,
      isRouteLogin,
      isRouteRegister,
    };
  },
});
</script>
