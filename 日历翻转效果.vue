<template>
  <div class="flipper-box" :class="[props.flipType, { go: isFlipping }]">
    <div class="digital back">
      <div class="top">{{ oldNumber }}</div>
      <div class="bottom">{{ oldNumber }}</div>
    </div>
    <div class="digital front">
      <div class="top">{{ newNumber }}</div>
      <div class="bottom">{{ newNumber }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
interface Props {
  number: number;
  flipType: "up" | "down";
  duration: number;
}
const props = withDefaults(defineProps<Props>(), {
  number: 0,
  flipType: "down",
  duration: 800,
});

const isFlipping = ref(false);
const oldNumber = ref(String(props.number).padStart(2, "0"));
const newNumber = ref(String(props.number).padStart(2, "0"));

watch(
  () => props.number,
  (newVal) => {
    if (isFlipping.value) {
      return false;
    }
    const newValStr = String(newVal).padStart(2, "0");
    if (newValStr === oldNumber.value) {
      return false;
    }

    isFlipping.value = true;
    oldNumber.value = newNumber.value;
    newNumber.value = newValStr;

    setTimeout(() => {
      // 设置翻转状态为false
      isFlipping.value = false;
      oldNumber.value = newValStr;
    }, props.duration);
  }
);
</script>

<style lang="less" scoped>
@cardPerspective: perspective(24rem);
@cardWidth: 22rem;
@cardHeight: 16rem;
@fontSize: 16rem;
@borderRadius: 1.5rem;

.flipper-box {
  position: relative;
  height: @cardHeight;
  line-height: @cardHeight;
  font-size: @fontSize;
  width: fit-content;
  color: #fff;
  text-align: center;
  background-color: transparent;
  margin-right: 0.04rem;
  &:last-of-type {
    margin-right: 0;
  }
  .digital {
    position: relative;
    height: 50%;
    &.front {
      top: -50%;
    }
    .top,
    .bottom {
      position: absolute;
      left: 0;
      right: 0;
      background: #5d62e9;
      overflow: hidden;
      text-align: center;
      padding: 0;
    }
    .top {
      top: 0;
      bottom: 100%;
      border-radius: 1.5rem 1.5rem 0 0;
      border-bottom: solid 2px #666;
    }
    .bottom {
      top: 100%;
      bottom: 0;
      border-radius: 0 0 1.5rem 1.5rem;
      line-height: 0;
    }
  }
  /*向下翻*/
  &.down {
    .back {
      .top {
        z-index: 3;
        height: 100%;
      }
      .bottom {
        z-index: 1;
        position: relative;
        height: 100%;
      }
    }
    .front {
      .top {
        z-index: 1;
        height: 100%;
      }
      .bottom {
        z-index: 2;
        height: 100%;
        transform-origin: 50% 0%;
      }
    }
    &.go {
      .back {
        .top {
          transform-origin: 50% 100%;
          animation: oldFlipDown 0.6s ease-in-out both;
          box-shadow: 0 -2px 32px rgba(0, 0, 0, 0.3);
          backface-visibility: hidden;
        }
      }
      .front {
        .bottom {
          animation: newFlipDown 0.6s ease-in-out both;
        }
      }
    }
  }
  /*向上翻*/
  &.up {
    .back {
      .top {
        z-index: 1;
        height: 100%;
        position: relative;
      }
      .bottom {
        z-index: 3;
        height: 100%;
      }
    }
    .front {
      .top {
        z-index: 2;
        height: 100%;
        transform-origin: 50% 100%;
      }
      .bottom {
        z-index: 1;
        height: 100%;
      }
    }

    &.go {
      .back {
        .bottom {
          transform-origin: 50% 0;
          animation: oldFlipUp 0.6s ease-in-out both;
          box-shadow: 0 2px 32px rgba(0, 0, 0, 0.3);
          backface-visibility: hidden;
        }
      }
      .front {
        .top {
          animation: newFlipUp 0.6s ease-in-out both;
        }
      }
    }
  }
}

@keyframes oldFlipDown {
  0% {
    transform: @cardPerspective rotateX(0deg);
  }

  100% {
    transform: @cardPerspective rotateX(-180deg);
  }
}

@keyframes newFlipDown {
  0% {
    transform: @cardPerspective rotateX(180deg);
  }

  100% {
    transform: @cardPerspective rotateX(0deg);
  }
}

@keyframes oldFlipUp {
  0% {
    transform: @cardPerspective rotateX(0deg);
  }

  100% {
    transform: @cardPerspective rotateX(180deg);
  }
}

@keyframes newFlipUp {
  0% {
    transform: @cardPerspective rotateX(-180deg);
  }

  100% {
    transform: @cardPerspective rotateX(0deg);
  }
}
</style>
