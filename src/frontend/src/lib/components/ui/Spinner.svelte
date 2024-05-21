<script lang="ts">
  export let inline = false;
</script>

<div class="spinner" class:inline />

<style>
  .spinner {
    border: 4px solid white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border-top: 4px solid black;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
