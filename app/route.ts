import {GAME_HTML} from '../game-content';
export function GET(){return new Response(GAME_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache'}})}
