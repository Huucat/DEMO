## CryptoJS_file_hash_chunks
前端使用CryptoJS对文件分块加载并计算HASH

### MD5
```javascript
import CryptoJS from 'crypto-js';

const fileMD5 = async (file) => {
  const readSlice = async (file, start, size) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);

      fileReader.onload = (e) => resolve(new Uint8Array(e.target.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(slice);
    });
  }

  const CHUNK_SIZE = 2 * 1024 * 1024;
  let MD5 = CryptoJS.algo.MD5.create();
  let chunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < chunks; i++) {
    let slice = await readSlice(file, i * CHUNK_SIZE, CHUNK_SIZE);
    let wordArray = CryptoJS.lib.WordArray.create(slice);
    MD5 = MD5.update(wordArray);
    console.log('read chunk', i + 1, '/', chunks);
  }

  return MD5.finalize().toString();
}
```

### SHA-1
```javascript
import CryptoJS from 'crypto-js';

const fileSHA1 = async (file) => {
  const readSlice = async (file, start, size) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);

      fileReader.onload = (e) => resolve(new Uint8Array(e.target.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(slice);
    });
  }

  const CHUNK_SIZE = 2 * 1024 * 1024;
  let SHA1 = CryptoJS.algo.SHA1.create();
  let chunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < chunks; i++) {
    let slice = await readSlice(file, i * CHUNK_SIZE, CHUNK_SIZE);
    let wordArray = CryptoJS.lib.WordArray.create(slice);
    SHA1 = SHA1.update(wordArray);
    console.log('read chunk', i + 1, '/', chunks);
  }

  return SHA1.finalize().toString();
}
```

### SHA-256
```javascript
import CryptoJS from 'crypto-js';

const fileSHA256 = async (file) => {
  const readSlice = async (file, start, size) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);

      fileReader.onload = (e) => resolve(new Uint8Array(e.target.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(slice);
    });
  }

  const CHUNK_SIZE = 2 * 1024 * 1024;
  let SHA256 = CryptoJS.algo.SHA256.create();
  let chunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < chunks; i++) {
    let slice = await readSlice(file, i * CHUNK_SIZE, CHUNK_SIZE);
    let wordArray = CryptoJS.lib.WordArray.create(slice);
    SHA256 = SHA256.update(wordArray);
    console.log('read chunk', i + 1, '/', chunks);
  }

  return SHA256.finalize().toString();
}
```

## create_exec_list
创建可链式调用函数。通过add()添加函数，run()顺次执行所有添加的函数
```typescript
interface ExecList {
  add(func: (() => Promise<any>) | (() => any), callback: FuncCallback): this;
  run(): Promise<void>;
}
interface FuncCallback {
  (result: any, next: () => void): void;
}
function createExecList(): ExecList {
  const queue: { func: () => Promise<any>; callback: FuncCallback }[] = [];

  return {
    add(func: (() => Promise<any>) | (() => any), callback: FuncCallback) {
      queue.push({
        func: () => (func instanceof Promise ? func : Promise.resolve(func())),
        callback,
      });
      return this;
    },
    async run(): Promise<void> {
      if (queue.length) {
        const { func, callback } = queue.shift()!;
        const result = await func();
        callback(result, () => {
          this.run();
        });
      }
    },
  };
}
```

## 翻页卡片效果
```vue
<template>
  <div class="flipper-box" :class="[props.flipType, { go: isFlipping }]">
    <div class="digital old" :data-number="oldNumber"></div>
    <div class="digital new" :data-number="newNumber"></div>
  </div>
</template>

<script setup lang="ts">
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
const oldNumber = ref(props.number);
const newNumber = ref(props.number);

watch(
  () => props.number,
  (newVal) => {
    if (isFlipping.value) {
      return false;
    }
    if (newVal === oldNumber.value) {
      return false;
    }

    isFlipping.value = true;
    oldNumber.value = newNumber.value;
    newNumber.value = newVal;

    setTimeout(() => {
      // 设置翻转状态为false
      isFlipping.value = false;
      oldNumber.value = newVal;
    }, props.duration);
  }
);
</script>

<style lang="less" scoped>
@cardPerspective: perspective(24rem);
@cardWidth: 12rem;
@cardHeight: 16rem;
@fontSize: 16rem;
@borderRadius: 1.5rem;
.flipper-box {
  position: relative;
  width: @cardWidth;
  height: @cardHeight;
  line-height: @cardHeight;
  font-size: @fontSize;
  color: #fff;
  text-align: center;
  background-color: transparent;
  margin-right: 0.04rem;
  &:last-of-type {
    margin-right: 0;
  }
  .digital {
    &:before,
    &:after {
      content: attr(data-number);
      position: absolute;
      left: 0;
      right: 0;
      background: #5d62e9;
      overflow: hidden;
    }
    &:before {
      top: 0;
      bottom: 50%;
      border-radius: 1.5rem 1.5rem 0 0;
      border-bottom: solid 2px #666;
    }
    &:after {
      top: 50%;
      bottom: 0;
      border-radius: 0 0 1.5rem 1.5rem;
      line-height: 0;
    }
  }
  /*向下翻*/
  &.down {
    .old {
      &:before {
        z-index: 3;
      }
      &:after {
        z-index: 1;
      }
    }
    .new {
      &:before {
        z-index: 1;
      }
      &:after {
        z-index: 2;
        transform-origin: 50% 0%;
      }
    }

    &.go {
      .old {
        &:before {
          transform-origin: 50% 100%;
          animation: oldFlipDown 0.6s ease-in-out both;
          box-shadow: 0 -2px 32px rgba(0, 0, 0, 0.3);
          backface-visibility: hidden;
        }
      }
      .new {
        &:after {
          animation: newFlipDown 0.6s ease-in-out both;
        }
      }
    }
  }
  /*向上翻*/
  &.up {
    .old {
      &:before {
        z-index: 1;
      }
      &:after {
        z-index: 3;
      }
    }
    .new {
      &:before {
        z-index: 2;
        transform-origin: 50% 100%;
      }
      &:after {
        z-index: 1;
      }
    }

    &.go {
      .old {
        &:after {
          transform-origin: 50% 0;
          animation: oldFlipUp 0.6s ease-in-out both;
          box-shadow: 0 2px 32px rgba(0, 0, 0, 0.3);
          backface-visibility: hidden;
        }
      }
      .new {
        &:before {
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
```
