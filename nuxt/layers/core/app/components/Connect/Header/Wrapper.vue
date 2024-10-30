<template>
  <header
    id="connect-header-wrapper"
    data-testid="connect-header-wrapper"
    class="relative border-b-2 border-bcGovColor-navDivider bg-bcGovColor-header py-2 dark:border-b dark:bg-bcGovColor-darkGray"
  >
    <nav
      class="app-inner-container"
      :aria-label="$t('ConnectHeader.navLabel')"
    >
      <slot />
    </nav>
  </header>
</template>
