<script lang="ts">
  import { userStore } from '$lib/stores/user.store';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const currentLevel = $userStore.user?.currentLevel ?? 0;

  let selectedPage: string = 'Home';
  let showTrainingDropdown = false;

  function isTrainingCompleted(): boolean {
    // Training is considered completed when Level 5 is completed
    return currentLevel > 5;
  }

  function handleLevelClick(page: string) {
    let levelNumber = getLevelNumberFromLevelName(page);
    if (!isLevelAccessible(levelNumber)) return; // Prevent action on locked levels

    selectedPage = page;
    if (page === 'Training') {
      showTrainingDropdown = !showTrainingDropdown;
    }
    dispatch('changePage', page);
  }

  function handleLevelKeyDown(event: KeyboardEvent, level: string) {
    if (event.key === 'Enter') {
      handleLevelClick(level);
    }
  }

  function getLevelNumberFromLevelName(level: string): number {
    if (level === 'Home') return -1;
    if (level === 'Initiation') return 0;
    if (level === 'Training') return 1;
    if (level === 'Graduation') return 6;
    return parseInt(level.split(' ')[1]);
  }

  function isLevelAccessible(levelNumber: number): boolean {
    return levelNumber <= currentLevel;
  }

  function isLevelCompleted(levelNumber: number): boolean {
    return levelNumber < currentLevel;
  }
</script>

<div class="sidebar">
  <div
    class:active={selectedPage === 'Home'}
    class:completed={-1 < currentLevel}
    class="level"
    on:click={() => handleLevelClick('Home')}
    on:keydown={(e) => handleLevelKeyDown(e, 'Home')}
  >
    Main
  </div>
  <div
    class:active={selectedPage === 'Initiation'}
    class:completed={0 < currentLevel}
    class:locked={!isLevelAccessible(0)}
    class="level"
    on:click={() => handleLevelClick('Initiation')}
    on:keydown={(e) => handleLevelKeyDown(e, 'Initiation')}
  >
    Initiation {isLevelCompleted(0) ? '✔️' : ''}
    {isLevelAccessible(0) ? '' : '🔒'}
  </div>
  <div
    class:active={selectedPage === 'Training'}
    class:completed={isTrainingCompleted()}
    class:locked={!isLevelAccessible(1)}
    class="level"
    on:click={() => handleLevelClick('Training')}
    on:keydown={(e) => handleLevelKeyDown(e, 'Training')}
  >
    Training {isTrainingCompleted() ? '✔️' : ''}
    {isLevelAccessible(1) ? '' : '🔒'}
  </div>
  {#if showTrainingDropdown}
    {#each [1, 2, 3, 4, 5] as levelNumber}
      <div
        class:active={selectedPage === `Project ${levelNumber}`}
        class:completed={levelNumber < currentLevel}
        class:locked={!isLevelAccessible(levelNumber)}
        class="level"
        on:click={() => handleLevelClick(`Project ${levelNumber}`)}
        on:keydown={(e) => handleLevelKeyDown(e, `Project ${levelNumber}`)}
      >
        Project {levelNumber}
        {isLevelCompleted(levelNumber) ? '✔️' : ''}
        {isLevelAccessible(levelNumber) ? '' : '🔒'}
      </div>
    {/each}
  {/if}
  <div
    class:active={selectedPage === 'Graduation'}
    class:completed={6 <= currentLevel}
    class:locked={!isLevelAccessible(6)}
    class="level"
    on:click={() => handleLevelClick('Graduation')}
    on:keydown={(e) => handleLevelKeyDown(e, 'Graduation')}
  >
    Graduation {isLevelCompleted(6) ? '✔️' : ''}
    {isLevelAccessible(6) ? '' : '🔒'}
  </div>
</div>

<style lang="scss">
  .sidebar {
    width: 200px;
    background-color: var(--color-white);
    border-right: 1px solid var(--color-black);
    height: 100%;
  }

  .level {
    padding: 10px;
    border-bottom: 1px solid var(--color-black);
    display: flex;
    justify-content: center;
    cursor: pointer;
    outline: none;

    &:hover {
      background-color: var(--color-black);
      color: var(--color-white);
    }
  }

  .active {
    background-color: var(--color-primary);
  }

  .locked {
    color: var(--color-grey);
    cursor: not-allowed;
  }

  .completed {
    color: var(--color-completed); // Define this color in your CSS variables
  }

  .level:not(.locked):hover {
    background-color: var(--color-black);
    color: var(--color-white);
  }

  .locked:hover {
    // Overrides the hover effect for locked levels
    background-color: var(--color-white);
    color: var(--color-grey);
  }
</style>
