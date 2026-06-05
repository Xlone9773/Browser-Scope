function generateData(size: number) {
    const arr = new Uint8Array(size);
    for(let i=0; i<size; i+=1024) arr[i] = i % 255;
    return new Blob([arr]);
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('BrowserScopeBench', 1);
        req.onupgradeneeded = (e: any) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('store')) {
                db.createObjectStore('store', { keyPath: ['id', 'chunk'] });
            }
        };
        req.onsuccess = (e: any) => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });
}

async function cleanup(filename: string, tgt: string) {
    try {
        if (tgt === 'idb') {
            await new Promise<void>((resolve) => {
                const req = indexedDB.deleteDatabase('BrowserScopeBench');
                req.onsuccess = () => resolve();
                req.onerror = () => resolve(); 
                req.onblocked = () => resolve(); 
            });
        } else if (tgt === 'cache') {
            if (typeof caches !== 'undefined') {
                await caches.delete('bench-cache');
            }
        } else if (tgt === 'opfs') {
            if (navigator.storage && navigator.storage.getDirectory) {
                const root = await navigator.storage.getDirectory();
                try {
                    // Modern way to iterate over directory
                    // @ts-ignore
                    for await (const [name, handle] of root) {
                        if (name.startsWith('bench_')) {
                            await root.removeEntry(name, { recursive: true }).catch(() => {});
                        }
                    }
                } catch(e) {
                    // Fallback if async iterator fails
                    try {
                        await root.removeEntry(filename).catch(()=> {});
                    } catch(err) {}
                }
            }
        }
    } catch (e) {
        // Ignore overall error
        console.error("Cleanup error:", e);
    }
}

let isStopping = false;

self.onmessage = async function(e: MessageEvent) {
    if (e.data.type === 'stop') {
        isStopping = true;
        return;
    }
    isStopping = false;
    const { target, sizeMB, chunkSizeKB, origin } = e.data;
    const totalBytes = sizeMB * 1024 * 1024;
    const CHUNK_SIZE = chunkSizeKB * 1024;
    const chunks = Math.ceil(totalBytes / CHUNK_SIZE);
    const filename = 'bench_' + Date.now() + '.bin';

    const writeLatencies: number[] = [];
    const readLatencies: number[] = [];

    try {
        // --- WRITE PHASE ---
        const startWrite = performance.now();
        
        let writeDb: IDBDatabase | null = null;
        if (target === 'idb') {
            writeDb = await openDB();
            for(let i=0; i<chunks; i++) {
                if (isStopping) break;
                const chunk = generateData(CHUNK_SIZE); 
                const txStart = performance.now();
                const tx = writeDb.transaction('store', 'readwrite');
                const store = tx.objectStore('store');

                await new Promise<void>((resolve, reject) => {
                    const req = store.put({ id: filename, chunk: i, data: chunk });
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
                writeLatencies.push(performance.now() - txStart);
                
                const now = performance.now();
                const elapsed = (now - startWrite) / 1000;
                const written = (i + 1) * CHUNK_SIZE;
                self.postMessage({
                    type: 'progress',
                    phase: 'writing',
                    speed: (written / 1024 / 1024) / elapsed,
                    progress: Math.floor(((i + 1) / chunks) * 50)
                });
            }
            writeDb.close();
        } 
        else if (target === 'cache') {
            if (typeof caches === 'undefined') {
                throw new Error("Cache API not supported inside worker");
            }
            const cache = await caches.open('bench-cache');
            const data = generateData(totalBytes); 
            const response = new Response(data);
            
            // To avoid blob scheme issues, always use absolute URL with http(s)
            const cacheUrl = new URL(filename, origin || self.location.origin).toString();

            const txStart = performance.now();
            await cache.put(cacheUrl, response);
            writeLatencies.push(performance.now() - txStart);
            
            const now = performance.now();
            const elapsed = (now - startWrite) / 1000;
            self.postMessage({
                type: 'progress',
                phase: 'writing',
                speed: (totalBytes / 1024 / 1024) / elapsed,
                progress: 50
            });
        } 
        else if (target === 'opfs') {
            if (!navigator.storage || !navigator.storage.getDirectory) {
                throw new Error("OPFS is not supported inside worker context");
            }
            const root = await navigator.storage.getDirectory();
            const handle = await root.getFileHandle(filename, { create: true });
            
            let writable: any;
            let isSync = false;
            if ((handle as any).createSyncAccessHandle) {
                try {
                    writable = await (handle as any).createSyncAccessHandle();
                    isSync = true;
                } catch(e) {
                    writable = await handle.createWritable();
                }
            } else {
                writable = await handle.createWritable();
            }
            
            let offset = 0;
            for(let i=0; i<chunks; i++) {
                if (isStopping) break;
                const chunk = generateData(CHUNK_SIZE);
                const arrayBuffer = await chunk.arrayBuffer();
                
                const txStart = performance.now();
                if (isSync) {
                    writable.write(new Uint8Array(arrayBuffer), { at: offset });
                    offset += arrayBuffer.byteLength;
                } else {
                    await writable.write(chunk);
                }
                writeLatencies.push(performance.now() - txStart);
                
                const now = performance.now();
                const elapsed = (now - startWrite) / 1000;
                const written = (i + 1) * CHUNK_SIZE;
                
                self.postMessage({
                    type: 'progress',
                    phase: 'writing',
                    speed: (written / 1024 / 1024) / elapsed,
                    progress: Math.floor(((i + 1) / chunks) * 50)
                });
            }
            if (isSync) {
                writable.flush();
                writable.close();
            } else {
                await writable.close();
            }
        }

        if (isStopping) {
            await cleanup(filename, target);
            self.postMessage({ type: 'stopped' });
            return;
        }

        const endWrite = performance.now();
        const writeDuration = endWrite - startWrite;
        const writeSpeed = (totalBytes / 1024 / 1024) / (writeDuration / 1000);
        
        const avgWriteLat = writeLatencies.length > 0 ? writeLatencies.reduce((a,b)=>a+b,0)/writeLatencies.length : 0;
        const peakWriteLat = writeLatencies.length > 0 ? Math.max(...writeLatencies) : 0;

        self.postMessage({
            type: 'result',
            op: 'Write',
            throughput: writeSpeed,
            avgLatency: avgWriteLat,
            peakLatency: peakWriteLat,
            duration: writeDuration
        });

        // --- READ PHASE ---
        const startRead = performance.now();

        let readDb: IDBDatabase | null = null;
        if (target === 'idb') {
            readDb = await openDB();
            for(let i=0; i<chunks; i++) {
                if (isStopping) break;
                const txStart = performance.now();
                const tx = readDb.transaction('store', 'readonly');
                const store = tx.objectStore('store');

                await new Promise<void>((resolve, reject) => {
                    const req = store.get([filename, i]);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
                readLatencies.push(performance.now() - txStart);

                const now = performance.now();
                const elapsed = (now - startRead) / 1000;
                const read = (i + 1) * CHUNK_SIZE;
                
                self.postMessage({
                    type: 'progress',
                    phase: 'reading',
                    speed: (read / 1024 / 1024) / elapsed,
                    progress: 50 + Math.floor(((i + 1) / chunks) * 50)
                });
            }
            readDb.close();
        }
        else if (target === 'cache') {
            const cacheUrl = new URL(filename, origin || self.location.origin).toString();
            const cache = await caches.open('bench-cache');
            const txStart = performance.now();
            const res = await cache.match(cacheUrl);
            if (res) {
                await res.blob();
            }
            readLatencies.push(performance.now() - txStart);
            
            const now = performance.now();
            const elapsed = (now - startRead) / 1000;
            self.postMessage({
                type: 'progress',
                phase: 'reading',
                speed: (totalBytes / 1024 / 1024) / elapsed,
                progress: 100
            });
        }
        else if (target === 'opfs') {
            const root = await navigator.storage.getDirectory();
            const handle = await root.getFileHandle(filename);
            
            if ((handle as any).createSyncAccessHandle) {
                const accessHandle = await (handle as any).createSyncAccessHandle();
                const fileLength = accessHandle.getSize();
                const buffer = new Uint8Array(CHUNK_SIZE);
                let readBytes = 0;
                
                while (readBytes < fileLength) {
                    if (isStopping) break;
                    const chunkStart = performance.now();
                    const n = accessHandle.read(buffer, { at: readBytes });
                    if (n === 0) break;
                    readLatencies.push(performance.now() - chunkStart);
                    readBytes += n;
                    
                    const now = performance.now();
                    const elapsed = (now - startRead) / 1000;
                    
                    self.postMessage({
                        type: 'progress',
                        phase: 'reading',
                        speed: (readBytes / 1024 / 1024) / elapsed,
                        progress: 50 + Math.floor((readBytes / fileLength) * 50)
                    });
                }
                accessHandle.close();
            } else {
                const file = await handle.getFile();
                const reader = file.stream().getReader();
                let readBytes = 0;
                while(true) {
                    if (isStopping) break;
                    const chunkStart = performance.now();
                    const { done, value } = await reader.read();
                    if (done) break;
                    readLatencies.push(performance.now() - chunkStart);
                    readBytes += (value as any).length;
                    
                    const now = performance.now();
                    const elapsed = (now - startRead) / 1000;
                    
                    self.postMessage({
                        type: 'progress',
                        phase: 'reading',
                        speed: (readBytes / 1024 / 1024) / elapsed,
                        progress: 50 + Math.floor((readBytes / totalBytes) * 50)
                    });
                }
            }
        }

        if (isStopping) {
            await cleanup(filename, target);
            self.postMessage({ type: 'stopped' });
            return;
        }

        const endRead = performance.now();
        const readDuration = endRead - startRead;
        const readSpeed = (totalBytes / 1024 / 1024) / (readDuration / 1000);

        const avgReadLat = readLatencies.length > 0 ? readLatencies.reduce((a,b)=>a+b,0)/readLatencies.length : 0;
        const peakReadLat = readLatencies.length > 0 ? Math.max(...readLatencies) : 0;

        self.postMessage({
            type: 'result',
            op: 'Read',
            throughput: readSpeed,
            avgLatency: avgReadLat,
            peakLatency: peakReadLat,
            duration: readDuration
        });

        await cleanup(filename, target);
        self.postMessage({ type: 'done' });

    } catch (err: any) {
        await cleanup(filename, target);
        self.postMessage({ type: 'error', message: err.message || "Unknown error inside Web Worker" });
    }
};
