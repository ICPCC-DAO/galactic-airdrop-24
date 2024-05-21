<script lang="ts">
  import FooterApp from '$components/layout/FooterApp.svelte';
  import HeaderSignUp from '$components/layout/HeaderSignUp.svelte';
</script>

<div class="layout">
  <HeaderSignUp />
  <slot />
  <FooterApp />
</div>

<style>
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-white);
  }
</style>
