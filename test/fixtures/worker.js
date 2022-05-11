'use strict';

const { canIUseWorkerThreads } = require('../../lib/worker_threads');
const fs = require('fs');
const path = require('path');
const binding = require(path.join(__dirname, '../../build/Release/profiler.node'));
const { cpu } = binding;

function main() {
  if (!canIUseWorkerThreads) {
    return;
  }

  const workerThreads = require('worker_threads');
  if (workerThreads.isMainThread) {
    const profiles = [];
    const w = new workerThreads.Worker(__filename, {
      env: process.env,
    });
    cpu.startProfiling('main', true);
    w.once('exit', code => {
      console.log('worker exited', code);
      const profile = cpu.stopProfiling('main');
      const mainProfile = path.join(__dirname, 'main.cpuprofile');
      fs.existsSync(mainProfile) && fs.unlinkSync(mainProfile);
      fs.writeFileSync(mainProfile, JSON.stringify(profile));
      console.log(JSON.stringify({ ok: true }));
      console.log('worker test done.');
    });
  } else {
    cpu.startProfiling('worker_threads', true);
    const start = Date.now();
    while (Date.now() - start < 2000) { }
    const profile = cpu.stopProfiling('worker_threads');
    const workerProfile = path.join(__dirname, 'worker_threads.cpuprofile');
    fs.existsSync(workerProfile) && fs.unlinkSync(workerProfile);
    fs.writeFileSync(workerProfile, JSON.stringify(profile));
  }
}

main();