<script lang="ts">
  import { openPage } from '$lib/utils/ui.utils';
  import { signIn } from '$lib/services/auth.services';
</script>

<div class="buttons">
  <img
    src="/landing/chara-left.webp"
    alt="Alien left"
    class="alien-left alien"
  />
  <div class="buttons-wrapper">
    <div
      class="button-registration"
      on:click={(e) =>
        openPage(
          e,
          'https://www.eventbrite.com/e/icpcc24-tickets-836323334607',
        )}
    >
      Register
    </div>
    <div
      class="button-sponsor"
      on:click={(e) => openPage(e, 'https://forms.gle/8XmvEa9QtUNxCwREA')}
    >
      Sponsor
    </div>
    <div class="button-login" on:click={async () => await signIn({})}>
      Login
    </div>
  </div>
  <img
    src="/landing/chara-right.webp"
    alt="Alien right"
    class="alien-right alien"
  />
</div>

<style lang="scss">
  @use '../../styles/mixins/media' as *;

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 15px;

    @include min-width(small) {
      gap: 25px;
    }

    // Change to column layout below 576px
    @media (max-width: 576px) {
      flex-direction: column;
    }

    // Change to row layout for screens larger than 576px
    @include min-width(medium) {
      flex-direction: row;
      justify-content: space-around; // Adjust for symmetrical image placement
    }

    img {
      position: absolute;
    }
  }

  .alien-left {
    height: 0px;

    @include min-width(xsmall) {
      left: -200px;
      height: 200px;
      width: auto;
    }

    @include min-width(small) {
      left: -210px;
      height: 200px;
      top: 0px;
      width: auto;
    }

    @include min-width(medium) {
      left: -240px;
      height: 240px;
      width: auto;
    }

    @include min-width(large) {
      left: -320px;
      height: 300px;
      width: auto;
    }

    @include min-width(xlarge) {
      left: -450px;
      height: 400px;
      width: auto;
    }
  }

  .alien-right {
    height: 0px;

    @include min-width(xsmall) {
      right: -200px;
      height: 200px;
      width: auto;
    }

    @include min-width(small) {
      right: -210px;
      height: 200px;
      width: auto;
    }

    @include min-width(medium) {
      right: -240px;
      height: 240px;
      width: auto;
    }

    @include min-width(large) {
      right: -320px;
      height: 300px;
      width: auto;
    }

    @include min-width(xlarge) {
      right: -450px;
      height: 400px;
      width: auto;
    }
  }

  .alien {
    @include min-width(xsmall) {
      top: -20px;
    }

    @include min-width(small) {
      top: -30px;
    }

    @include min-width(medium) {
      top: -40px;
    }

    @include min-width(large) {
      top: -80px;
    }

    @include min-width(xlarge) {
      top: -130px;
    }
  }

  .buttons-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;

    @include min-width(medium) {
      flex-direction: row;
      gap: 25px;
    }
  }

  .button-registration,
  .button-sponsor {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    padding: 0.75rem 2rem;
    font-size: 1rem; // Default font size
    cursor: pointer;
    text-align: center;
    flex-grow: 1; // Ensures buttons grow to fill the container
    width: 100%; // Make buttons have the same width

    // Set a fixed width for buttons on larger screens to ensure same width
    @include min-width(medium) {
      width: auto; // Auto width for flexible layout, adjust as needed
      flex: 1; // This ensures that both buttons always have the same width
    }

    &:hover {
      background-color: white;
      color: black;
    }
  }

  // Additional customization for button-sponsor if needed
  .button-sponsor {
    background-color: black;
    color: white;
  }

  .button-login {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    padding: 0.75rem 2rem;
    font-size: 1rem; // Default font size
    cursor: pointer;
    text-align: center;
    flex-grow: 1; // Ensures buttons grow to fill the container
    width: 100%; // Make buttons have the same width

    // Set a fixed width for buttons on larger screens to ensure same width
    @include min-width(medium) {
      width: auto; // Auto width for flexible layout, adjust as needed
      flex: 1; // This ensures that both buttons always have the same width
    }

    &:hover {
      background-color: white;
      color: black;
    }
  }
</style>
