import {makePlan} from './cricket.mjs';
export const CHASE_LEVELS=[
 {name:'First Knock',tier:'ROOKIE',target:18,balls:12,wickets:3,pace:1},
 {name:'Find the Gaps',tier:'ROOKIE',target:24,balls:12,wickets:3,pace:1},
 {name:'Boundary Hunt',tier:'CLUB',target:32,balls:12,wickets:3,pace:1},
 {name:'Under Pressure',tier:'CLUB',target:40,balls:12,wickets:3,pace:1},
 {name:'Own the Gully',tier:'CLUB',target:48,balls:12,wickets:3,pace:1},
 {name:'Step Up',tier:'HARD',target:52,balls:12,wickets:3,pace:.94},
 {name:'Two Lives',tier:'HARD',target:56,balls:12,wickets:2,pace:.90},
 {name:'Sixty Chase',tier:'HARD',target:60,balls:12,wickets:2,pace:.88},
 {name:'Short Fuse',tier:'EXPERT',target:40,balls:8,wickets:2,pace:.86},
 {name:'One Life',tier:'EXPERT',target:44,balls:8,wickets:1,pace:.84},
 {name:'Eight Sixes',tier:'EXPERT',target:48,balls:8,wickets:1,pace:.82},
 {name:'Perfect Nine',tier:'FINAL',target:54,balls:9,wickets:1,pace:.80},
];
export function clampLevel(value){const n=Number(value);return Number.isFinite(n)?Math.min(CHASE_LEVELS.length-1,Math.max(0,Math.floor(n))):0}
export function chasePlan(level,random=Math.random){const c=CHASE_LEVELS[clampLevel(level)];return makePlan(random).slice(0,c.balls).map(d=>({...d,speed:Math.max(900,Math.round(d.speed*c.pace))}))}
export function chaseStars(config,runs,balls,wickets){if(runs<config.target)return 0;return wickets===0&&runs/Math.max(1,balls*6)>=.85?3:wickets===0?2:1}
export function chaseOver(config){return Math.floor(config.balls/6)+(config.balls%6?'.'+config.balls%6:'')}
