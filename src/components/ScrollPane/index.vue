<template>
  <div
    class="scroll-container"
    ref="scrollContainer"
    @wheel.prevent="handleScroll"
  >
    <div
      class="scroll-wrapper"
      ref="scrollWrapper"
      :style="{ left: left + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
const padding = 15; // tag's padding

export default {
  name: "ScrollPane",
  data() {
    return {
      left: 0,
    };
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3;
      const $container = this.$refs.scrollContainer;
      const $containerWidth = $container.offsetWidth;
      const $wrapper = this.$refs.scrollWrapper;
      const $wrapperWidth = $wrapper.offsetWidth;

      if (eventDelta > 0) {
        this.$set(this, "left", Math.min(0, this.left + eventDelta));
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.$set(this, "left", this.left);
          } else {
            this.$set(
              this,
              "left",
              Math.max(
                this.left + eventDelta,
                $containerWidth - $wrapperWidth - padding
              )
            );
          }
        } else {
          this.left = 0;
        }
      }
    },
    moveToTarget($target) {
      const $container = this.$refs.scrollContainer;
      const $containerWidth = $container.offsetWidth;
      const $targetLeft = $target.offsetLeft;
      const $targetWidth = $target.offsetWidth;

      if ($targetLeft < -this.left) {
        // tag in the left
        this.$set(this, "left", -$targetLeft + padding);
      } else if (
        $targetLeft + padding > -this.left &&
        $targetLeft + $targetWidth < -this.left + $containerWidth - padding
      ) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.$set(
          this,
          "left",
          -($targetLeft - ($containerWidth - $targetWidth) + padding)
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
  }
}
</style>
