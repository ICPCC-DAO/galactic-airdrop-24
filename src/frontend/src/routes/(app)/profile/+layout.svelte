<script lang="ts">
  import FooterApp from '$components/layout/FooterApp.svelte';
  import Header from '$components/layout/Header.svelte';
</script>

<div class="layout">
  <Header />
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
