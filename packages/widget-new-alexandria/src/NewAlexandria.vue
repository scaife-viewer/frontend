<template>
  <aside class="new-alexandria-container">
    <p v-if="!comments || comments.length === 0">No comments found.</p>
    <div v-else v-for="comment in comments" :key="comment._id" class="comment">
      <h4>{{ comment.latestRevision.title }}</h4>
      <h5 class="commenter-name" v-if="comment.commenters.length > 0">
        {{ comment.commenters[0].name }}
      </h5>
      <div class="comment-text" v-html="comment.latestRevision.text"></div>
    </div>
  </aside>
</template>

<script>
  export default {
    name: 'NewAlexandria',
    props: ['comments'],
  };
</script>

<style lang="scss" scoped>
  aside {
    flex-direction: column;
    h4,
    h5 {
      margin: 0.33em 0;
    }
  }
</style>
