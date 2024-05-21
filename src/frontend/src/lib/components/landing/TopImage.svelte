<div class="top">
  <img src="/landing/top-pic.webp" alt="Airdrop top" class="header-landing" />
</div>

<style lang="scss">
  @use '../../styles/mixins/media' as *;

  .top {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .header-landing {
    max-width: 3740px;
    height: 100px;

    // Adjust the image height at different breakpoints to maintain aspect ratio
    @include min-width(xsmall) {
      height: 180px;
    }

    @include min-width(small) {
      height: 200px;
    }

    @include min-width(medium) {
      height: 250px;
    }

    @include min-width(large) {
      height: 300px;
    }

    @include min-width(xlarge) {
      height: 400px;
    }
  }
</style>
