<script lang="ts">
  import IconX from '$components/icons/IconX.svelte';
  import IconTikTok from '$components/icons/IconTikTok.svelte';
  import IconInstagram from '$components/icons/IconInstagram.svelte';
  import IconYoutube from '$components/icons/IconYoutube.svelte';
  const white = '#ffffff';
</script>

<div class="footer" id="footer">
  <div class="content-wrapper">
    <div class="content-cs">
      An initiative powered by<a
        href="https://codeandstate.com/"
        target="_blank"
        rel="noreferrer"
        class="cs-link">Code & State</a
      >
    </div>
    <div class="content-disclaimer">
      <a href="/legal" target="_blank" rel="noreferrer" class="disclaimer-link"
        >Legal Disclaimer</a
      >
    </div>
    <div class="content-socials">
      <a
        href="https://twitter.com/icp_cc"
        target="_blank"
        aria-label="Follow us on Twitter"
        rel="noreferrer"><IconX color={white} width={26} /></a
      >
      <a
        href="https://www.tiktok.com/@codeandstate"
        target="_blank"
        aria-label="Follow us on TikTok"
        rel="noreferrer"><IconTikTok color={white} width={26} /></a
      >
      <a
        href="https://www.instagram.com/codeandstate/"
        target="_blank"
        aria-label="Follow us on Instagram"
        rel="noreferrer"><IconInstagram color={white} width={26} /></a
      >
      <a
        href="https://www.youtube.com/@codeandstate"
        target="_blank"
        aria-label="Follow us on YouTube"
        rel="noreferrer"
      >
        <IconYoutube color={white} width={26} /></a
      >
    </div>
  </div>
</div>

<style lang="scss">
  .footer {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    background-color: var(--color-black);
    color: var(--color-white);
    padding: var(--padding-4x) 0;

    @media screen and (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--padding-2x) var(--padding);
    }
  }

  .content-wrapper {
    grid-column: 2 / 12;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 768px) {
      width: 100%;
      flex-direction: column;
      align-items: center;
      gap: var(--padding);
    }
  }

  .cs-link {
    color: var(--color-yellow);
    font-weight: 600;
  }

  a {
    margin: 0 var(--padding);
  }

  .content-socials {
    display: flex;
    gap: var(--padding);
  }

  a {
    color: var(--color-white);
  }

  .content-disclaimer {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
  }
</style>
