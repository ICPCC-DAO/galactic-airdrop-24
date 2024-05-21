<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Airdrop Date
  const airdropDate = new Date('2024-05-10T17:00:00Z').getTime();

  // Utility function to ensure double digits
  const ensureDoubleDigits = (num: any) => num.toString().padStart(2, '0');

  // Countdown stores
  const days = writable('00');
  const hours = writable('00');
  const minutes = writable('00');

  // Function to update countdown
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = airdropDate - now;

    if (distance < 0) {
      days.set('00');
      hours.set('00');
      minutes.set('00');
      return false; // Indicate countdown ended
    }

    const d = ensureDoubleDigits(Math.floor(distance / (1000 * 60 * 60 * 24)));
    const h = ensureDoubleDigits(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    const m = ensureDoubleDigits(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    );

    days.set(d);
    hours.set(h);
    minutes.set(m);
    return true; // Indicate countdown continues
  }

  // Update the countdown every second
  onMount(() => {
    // Initialize countdown immediately to avoid seeing 0s
    updateCountdown();

    const interval = setInterval(() => {
      if (!updateCountdown()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="countdown">
  <div class="countdown-wrapper">
    <div class="countdown-item">
      <div class="text-original">{$days}</div>
      <div class="text-shadow">{$days}</div>
    </div>
    <div class="countdown-label">Days</div>
  </div>
  <div class="countdown-wrapper">
    <div class="countdown-item">
      <div class="text-original">:</div>
      <div class="text-shadow">:</div>
    </div>
  </div>
  <div class="countdown-wrapper">
    <div class="countdown-item">
      <div class="text-original">{$hours}</div>
      <div class="text-shadow">{$hours}</div>
    </div>
    <div class="countdown-label">Hours</div>
  </div>
  <div class="countdown-wrapper">
    <div class="countdown-item">
      <div class="text-original">:</div>
      <div class="text-shadow">:</div>
    </div>
  </div>
  <div class="countdown-wrapper">
    <div class="countdown-item">
      <div class="text-original">{$minutes}</div>
      <div class="text-shadow">{$minutes}</div>
    </div>
    <div class="countdown-label">Min</div>
  </div>
</div>
```

<style lang="scss">
  @use '../../styles/mixins/media' as media;

  .countdown {
    display: flex;
    gap: 1rem;
    color: white;
  }

  .countdown-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .countdown-item {
    position: relative;
  }

  .text-original,
  .text-shadow {
    -webkit-text-stroke: 1px black;
    color: white;
    font-size: 2rem;
    position: relative;
    z-index: 3;
  }

  .text-shadow {
    color: black;
    -webkit-text-stroke: 1px white;
    position: absolute;
    top: 1px;
    left: -3px;
    z-index: 2;
  }

  .countdown-label {
    margin-top: -10px;
    font-size: 1rem;
  }

  // Responsive adjustments using media queries
  @include media.min-width(xsmall) {
    .text-original,
    .text-shadow {
      font-size: 3rem;
    }

    .text-shadow {
      top: 2px;
      left: -5px;
    }

    .countdown-label {
      font-size: 1.25rem;
      margin-top: -15px;
    }
  }

  @include media.min-width(small) {
    .text-original,
    .text-shadow {
      font-size: 5rem;
    }

    .text-shadow {
      top: 3px;
      left: -7px;
    }

    .countdown-label {
      font-size: 1.5rem;
      margin-top: -20px;
    }
  }

  @include media.min-width(medium) {
    .text-original,
    .text-shadow {
      font-size: 7rem;
    }

    .text-shadow {
      top: 4px;
      left: -9px;
    }

    .countdown-label {
      font-size: 1.75rem;
      margin-top: -25px;
    }
  }

  @include media.min-width(large) {
    .text-original,
    .text-shadow {
      font-size: 8rem;
    }

    .text-shadow {
      top: 5px;
      left: -11px;
    }

    .countdown-label {
      font-size: 2rem;
      margin-top: -30px;
    }
  }

  @include media.min-width(xlarge) {
    .text-original,
    .text-shadow {
      font-size: 10rem;
    }

    .text-shadow {
      top: 5px;
      left: -10px;
    }

    .countdown-label {
      font-size: 2.5rem;
      margin-top: -40px;
    }
  }
</style>
