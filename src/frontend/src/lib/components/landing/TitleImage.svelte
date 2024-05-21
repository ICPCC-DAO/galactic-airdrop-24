<div class="title">
  <img src="/landing/logo.webp" alt="Galactic Drop" class="title-image" />
</div>

<style lang="scss">
  @use '../../styles/mixins/media' as *;

  .title {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .title-image {
    height: 13vh;

    // Adjust the image height at different breakpoints to maintain aspect ratio
    @include min-width(xsmall) {
      height: 160px;
    }

    @include min-width(small) {
      height: 230px;
    }

    @include min-width(medium) {
      height: 300px;
    }

    @include min-width(large) {
      height: 350px;
    }

    @include min-width(xlarge) {
      height: 400px;
    }
  }
</style>
