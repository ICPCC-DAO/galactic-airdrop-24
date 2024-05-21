<div class="bottom">
  <img
    src="/landing/bottom-pic.webp"
    alt="Airdrop top"
    class="airdrop-bottom"
  />
</div>

<style lang="scss">
  @use '../../styles/mixins/media' as *;

  .bottom {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .airdrop-bottom {
    max-width: 3740px;
    height: 100px;

    // Adjust the image height at different breakpoints to maintain aspect ratio
    @include min-width(xsmall) {
      height: 150px;
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
