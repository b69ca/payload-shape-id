#!/usr/bin/env node
import { readFile } from 'node:fs/promises'; import { shapeId,diffShapes } from './index.js';
const [command='id',...files]=process.argv.slice(2);
async function load(name){ const text=name==='-'?await new Promise((ok,no)=>{let s='';process.stdin.setEncoding('utf8').on('data',x=>s+=x).on('end',()=>ok(s)).on('error',no)}):await readFile(name,'utf8'); return JSON.parse(text); }
try {
  if(command==='id'&&files.length===1){const r=shapeId(await load(files[0])); console.log(`${r.id}  ${files[0]}`); if(process.argv.includes('--shape')) console.log(JSON.stringify(r.shape,null,2));}
  else if(command==='diff'&&files.length===2){const d=diffShapes(await load(files[0]),await load(files[1])); console.log(JSON.stringify(d,null,2)); process.exitCode=d.length?1:0;}
  else {console.log('Usage: payload-shape-id id FILE [--shape]\n       payload-shape-id diff BEFORE AFTER');process.exitCode=2;}
} catch(e){console.error(`payload-shape-id: ${e.message}`);process.exitCode=2;}
