<template>
  <aside class="new-alexandria-container">
    <p v-if="!comments || comments.length === 0">
      No comments found.
    </p>
    <div
      v-else
      v-for="(comment, index) in comments"
      :key="index"
      class="comment"
    >
      <h4>{{ comment.latestRevision.title }}</h4>
      <h5 class="commenter-name" v-if="comment.commenters.length > 0">
        {{ comment.commenters[0].fullName }}
      </h5>
      <div
        class="comment-text"
        v-html="revisionContent(comment.latestRevision)"
      ></div>
    </div>
  </aside>
</template>

<script>
  export default {
    name: 'NewAlexandria',
    props: ['comments'],
    methods: {
      revisionContent(revision) {
        if (!(revision.text[0] === '{')) {
          return revision.text;
        }
        const data = JSON.parse(revision.text);
        const content = [];
        content.push(
          data.blocks.map(block => `<p>${block.text}</p>`).join('\n'),
        );
        const images = Object.values(data.entityMap)
          .filter(entity => entity.type === 'IMAGE')
          .map(
            image =>
              `<img alt="${image.data.alt}" src="${image.data.src}"</img>`,
          )
          .join('\n');
        content.push(images);
        return content.join();
      },
    },
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
