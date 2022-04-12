# CryptoJS_file_hash_chunks
前端使用CryptoJS对文件分块加载并计算HASH

### MD5
```javascript
import CryptoJS from 'crypto-js';

const fileMD5 = async (file) => {
  const readSlice = async (file, start, size) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);
      // @ts-ignore
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
      // @ts-ignore
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
      // @ts-ignore
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
