<!--
  Closing slide: same bare frame as the cover, centred.
-->
<template>
  <div class="slidev-layout sheet-layout end">
    <Sheet />
    <main class="stage"><slot /></main>
  </div>
</template>

<style scoped>
.stage {
  position: absolute;
  left: 112px;
  right: 112px;
  top: 66px;
  bottom: 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.end :deep(h1) {
  font-size: 84px;
  font-weight: 800;
  letter-spacing: -0.035em;
}
</style>
