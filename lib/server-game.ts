export const playerId=(r:Request)=>r.headers.get('cookie')?.match(/(?:^|;\s*)street_player=([a-f0-9-]{36})(?:;|$)/)?.[1];
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin}
export async function readBody(r:Request){const bytes=await r.arrayBuffer();if(bytes.byteLength>4096)throw Error('Request too large');return JSON.parse(new TextDecoder().decode(bytes))}
export async function peerId(r:Request){const ip=r.headers.get('cf-connecting-ip');if(!ip)return null;const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new URL(r.url).origin+'|'+ip));return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('')}
export type GameSession={plan:string,started:number,submitted:number,progress:number,issued:number|null,receipts:string|null};
