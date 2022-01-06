<template>
  <q-page class="column items-center justify-center">
    <h4>Your feed</h4>
    <winsome-post
      v-for="post in posts"
      :key="post.uuid"
      :post="post"
      :is-shareable="canSharePost(post)"
      is-commentable
      @ratePost="onRatePost"
      @sharePost="onSharePost"
      @commentPost="onCommentPost"
    />
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
      return clone.sort((p1, p2) => (p1.timestamp > p2.timestamp ? -1 : 1));
    });

    async function fetchData() {
      try {
        await api.get(`/users/${username.value}/feed`).then(
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

    async function onRatePost(post: Post, isUpvote: boolean) {
      try {
        await api
          .post(`/users/${post.author}/posts/${post.uuid}/reactions`, {
            isUpvote,
          })
          .then(
            () => {
              fetchData();
              $q.notify({
                message: isUpvote ? 'Upvote added' : 'Downvote added',
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

    async function onCommentPost(post: Post, text: string) {
      try {
        await api
          .post(`/users/${post.author}/posts/${post.uuid}/comments`, {
            text,
          })
          .then(
            (response) => {
              fetchData();
              $q.notify({
                message: 'Comment added',
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

    async function onSharePost(post: Post) {
      try {
        await api
          .post(`/users/${username.value}/posts?rewinPost=${post.uuid}`)
          .then(
            (response) => {
              fetchData();
              $q.notify({
                message: 'Post rewined',
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

    function canSharePost(post: Post) {
      return post.rewins.every((r) => r.author != username.value);
    }

    fetchData();

    return {
      posts: sortedPostByTimestamp,
      canSharePost,
      onRatePost,
      onCommentPost,
      onSharePost,
    };
  },
});
</script>

<style scoped>
.my-card {
  min-width: 600px;
}
</style>
