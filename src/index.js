import { createHash } from 'node:crypto';
const primitive=v=>v===null?'null':Array.isArray(v)?'array':typeof v;

export function shapeOf(value) {
  const type=primitive(value);
  if (type==='array') {
    const items=[...new Map(value.map(v=>{const s=shapeOf(v);return [canonical(s),s]})).values()].sort((a,b)=>canonical(a).localeCompare(canonical(b)));
    return {type:'array',items};
  }
  if (type==='object') return {type:'object',properties:Object.fromEntries(Object.keys(value).sort().map(k=>[k,shapeOf(value[k])]))};
  return {type};
}

export function canonical(shape) { return JSON.stringify(shape); }
export function shapeId(value,{length=16}={}) { const shape=shapeOf(value); return {id:createHash('sha256').update(canonical(shape)).digest('hex').slice(0,length),shape}; }

export function diffShapes(before,after,path='$') {
  const a=before.type?before:shapeOf(before), b=after.type?after:shapeOf(after), changes=[];
  if (a.type!==b.type) return [{path,kind:'type',before:a.type,after:b.type}];
  if (a.type==='object') {
    const keys=new Set([...Object.keys(a.properties),...Object.keys(b.properties)]);
    for (const key of [...keys].sort()) {
      if (!(key in a.properties)) changes.push({path:`${path}.${key}`,kind:'added',after:b.properties[key]});
      else if (!(key in b.properties)) changes.push({path:`${path}.${key}`,kind:'removed',before:a.properties[key]});
      else changes.push(...diffShapes(a.properties[key],b.properties[key],`${path}.${key}`));
    }
  } else if (a.type==='array') {
    const aa=new Map(a.items.map(x=>[canonical(x),x])), bb=new Map(b.items.map(x=>[canonical(x),x]));
    for (const [k,v] of aa) if(!bb.has(k)) changes.push({path:`${path}[]`,kind:'item-shape-removed',before:v});
    for (const [k,v] of bb) if(!aa.has(k)) changes.push({path:`${path}[]`,kind:'item-shape-added',after:v});
  }
  return changes;
}
