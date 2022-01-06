<template>
  <q-card flat bordered class="my-card q-pa-md q-ma-md">
    <q-card-section class="q-pt-none">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ post.title }}</div>
          <div class="text-subtitle2">by {{ post.author }}</div>
          <div class="text-subtitle3">
            <i>{{ prettyDate(post.timestamp) }}</i>
          </div>
        </div>

        <div v-if="isDeletable" class="col-auto">
          <q-btn
            color="grey-7"
            round
            flat
            icon="delete"
            @click="$emit('deletePost', post)"
          >
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section> {{ post.content }} </q-card-section>

    <q-card-actions>
      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />

      <q-space />

      {{ post.upvotes }}
      <q-btn
        flat
        round
        color="green"
        icon="thumb_up"
        class="q-ma-xs"
        @click="$emit('ratePost', post, true)"
      />
      {{ post.downvotes }}
      <q-btn
        flat
        round
        color="red"
        icon="thumb_down"
        @click="$emit('ratePost', post, false)"
      />
      <q-btn
        flat
        round
        color="primary"
        icon="share"
        v-if="isShareable"
        @click="$emit('sharePost', post)"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          <div v-for="(comment, i) in post.comments" :key="i" class="q-ma-md">
            {{ comment.text }} <i>by {{ comment.author }}</i>
          </div>
          <q-input
            v-if="isCommentable"
            outlined
            v-model.trim="comment"
            placeholder="Add a comment..."
            class="q-ma-md"
            v-on:keypress.enter="onEnterComment"
            dense
          />
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { defineComponent, ref, PropType, toRef } from 'vue';
import { Post } from 'src/domain/Post';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  emits: ['sharePost', 'ratePost', 'commentPost', 'deletePost'],
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
    isShareable: {
      type: Boolean,
      default: false,
    },
    isCommentable: {
      type: Boolean,
      default: false,
    },
    isDeletable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const expanded = ref(false);
    const comment = ref('');

    const post = toRef(props, 'post');

    function onEnterComment() {
      emit('commentPost', post.value, comment.value);
      comment.value = '';
    }

    function prettyDate(timestamp: number) {
      var date = new Date(timestamp);
      var options = { hour: 'numeric', minute: 'numeric' } as const;
      return new Intl.DateTimeFormat('en-US').format(date);
    }

    return { expanded, comment, onEnterComment, prettyDate };
  },
});
</script>

<style scoped>
.my-card {
  min-width: 600px;
  max-width: 600px;
}
</style>
