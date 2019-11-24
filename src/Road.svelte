<script>
import { getContext, onMount } from 'svelte';
import { makePoints } from './coords.js'
import { tweened } from 'svelte/motion';
import { cubicInOut as easing } from 'svelte/easing';
import { fade } from 'svelte/transition';
export let start;
export let end;
export let dir = 'y';
export let pad = .3;
const tileSize = getContext('tileSize', tileSize);
const width = getContext('width', width);
const height = getContext('height', height);
const tileDimensions = getContext('tileDimensions', tileDimensions);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;

const points = makePoints(height, W, H);

const endTween = tweened(start, {duration: 400, easing});
$: endTween.set(end);

const st = points(...start)
const en = points(...end)
const toCoord = (a,b) => `
    ${a.lx + W * pad},${a.ly - H * pad / 2} 
    ${a.tx - W * pad},${a.ty + H * pad / 2} 
    ${b.rx - W * pad},${b.ry + H * pad / 2} 
    ${b.bx + W * pad},${b.by - H * pad / 2}`

const l = tweened({x: st.lx + W / 2, y: st.ty + H / 4}, { duration: 400, easing, delay: 400});

$: l.set({
    x:  en.rx - W / 2,
    y: en.by - H / 4
})

let mounted = false;
onMount(() => {
    mounted = true;
})

</script>

<g>
    <polygon points={toCoord(st, points(...$endTween))} fill=#6b4265 />
    {#if mounted}
        <line
            in:fade={{duration:400, delay: 400}}
            x1={st.lx + W / 2}
            x2={$l.x}
            y1={st.ty + H / 4}
            y2={$l.y}
            stroke=white
            stroke-opacity=.4
            stroke-dasharray=3,1
        />
    {/if}
</g>