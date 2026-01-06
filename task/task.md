returncode: 1
stdout:

> supunlakmal@0.1.0 start
> next start

▲ Next.js 15.5.4

- Local: http://localhost:3000
- Network: http://198.54.126.104:3000

✓ Starting...
stderr:
⚠ You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env
node:internal/deps/undici/undici:8718
return await WebAssembly.instantiate(mod, {
^

RangeError: WebAssembly.instantiate(): Out of memory: wasm memory
at lazyllhttp (node:internal/deps/undici/undici:8718:32)

Node.js v18.20.8

Out of memory error may be caused by hitting LVE limits
or "Max data size", "Max address space" or "Max resident set" process limits
Please check LVE limits and process limits. Readjust them if necessary
More info: https://docs.cloudlinux.com/shared/cloudlinux_os_components/#known-restrictions-and-issues

process limits "/proc/688132/limits":
Limit Soft Limit Hard Limit Units  
Max cpu time unlimited unlimited seconds  
Max file size unlimited unlimited bytes  
Max data size unlimited unlimited bytes  
Max stack size 8388608 unlimited bytes  
Max core file size 0 0 bytes  
Max resident set 4294967296 4294967296 bytes  
Max processes unlimited unlimited processes
Max open files 1048576 1048576 files  
Max locked memory unlimited unlimited bytes  
Max address space 4294967296 4294967296 bytes  
Max file locks unlimited unlimited locks  
Max pending signals unlimited unlimited signals  
Max msgqueue size unlimited unlimited bytes  
Max nice priority unlimited unlimited  
Max realtime priority unlimited unlimited  
Max realtime timeout unlimited unlimited us
