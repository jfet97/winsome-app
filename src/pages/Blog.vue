<template>
  <q-page class="column items-center justify-center">
    <h4>Your blog</h4>
    <winsome-post
      v-for="post in posts"
      :key="post.uuid"
      :post="post"
      @deletePost="onDeletePost"
      is-deletable
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showNewPostModal" />
    </q-page-sticky>

    <q-dialog v-model="isNewPostModalVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Title</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model.trim="newPostTitle"
            autofocus
            :rules="[
              (val) => (val && val.length > 0) || 'Title cannot be empty',
              (val) =>
                (val && val.length <= 20) || 'Please use maximum 20 characters',
            ]"
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Content</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            type="textarea"
            dense
            v-model.trim="newPostContent"
            autofocus
            :rules="[
              (val) => (val && val.length > 0) || 'Content cannot be empty',
              (val) =>
                (val && val.length <= 500) ||
                'Please use maximum 500 characters',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="clearPost" />
          <q-btn flat label="Post" v-close-popup @click="createPost" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { Post } from 'src/domain/Post';
import WinsomePost from 'src/components/WinsomePost.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { WinsomePost },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const username = computed(() => store.getters['auth/username']);

    const posts = ref<Post[]>([]);
    const sortedPostByTimestamp = computed(() => {
      const clone = [...posts.value];
      return clone.sort((p1, p2) => p1.timestamp > p2.timestamp ? -1 : 1);
    });

    async function fetchData() {
      try {
        await api.get(`/users/${username.value}/blog`).then(
          (response) => (posts.value = response.data.res),
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

    async function onDeletePost(post: Post) {
      try {
        await api.delete(`/users/${username.value}/posts/${post.uuid}`).then(
          () => {
            fetchData();
            $q.notify({
              message: 'Post deleted',
              color: 'positive',
              position: 'bottom-right',
            });
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
    }

    const isNewPostModalVisible = ref(false);
    const newPostTitle = ref('');
    const newPostContent = ref('');
    function showNewPostModal() {
      isNewPostModalVisible.value = true;
    }

    function clearPost() {
      newPostTitle.value = '';
      newPostContent.value = '';
    }

    fetchData();

    async function createPost() {
      try {
        await api
          .post(`/users/${username.value}/posts`, {
            title: newPostTitle.value,
            content: newPostContent.value,
          })
          .then(
            () => {
              fetchData();
              clearPost();
              $q.notify({
                message: 'Post created',
                color: 'positive',
                position: 'bottom-right',
              });
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
    }

    return {
      posts: sortedPostByTimestamp,
      onDeletePost,
      isNewPostModalVisible,
      showNewPostModal,
      newPostTitle,
      newPostContent,
      clearPost,
      createPost,
    };
  },
});
</script>

<style scoped>
.my-card {
  min-width: 600px;
}
</style>
