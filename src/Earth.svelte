<script>
import { getContext } from 'svelte';

export let coords = getContext('coords');
export let tileDimensions = getContext('tileDimensions');
export let margin = getContext('margin');

const toString = (l,t,r,b) => `
${l.lx},${l.ly} 
${t.tx},${t.ty} 
${r.rx},${r.ry} 
${b.bx},${b.by}`

const left = coords(0,0);
const top = coords(0, tileDimensions-1);
const right = coords(tileDimensions-1, tileDimensions-1);
const bottom = coords(tileDimensions-1, 0);

</script>

<g>
    
    <defs>
        <linearGradient id="earth" x1="0" x2="1" y1="0" y2="1">
            <stop class="stop1" offset="0%" stop-color=#705f7e />
            <stop class="stop3" offset="20%" stop-color=#5a5e84 />
            <stop class="stop1" offset="40%" stop-color=#705f7e />
            <stop class="stop3" offset="60%" stop-color=#5a5e84 />
        </linearGradient>
        <!-- define the shadow / ground clipping -->
        <clipPath id="shadow-clip">
            <polygon points={toString(left, top, right, bottom)}  />
        </clipPath>
    </defs>


    <polygon points={toString(left, top, right, bottom)} fill=url(#earth) opacity=.4  />
    <polygon points={toString(
        left, 
        {tx: left.lx, ty: left.ly + margin},
        {rx: bottom.bx, ry: bottom.by + margin},
        bottom, 
        )} fill=darkgray opacity=.3
    />
    <polygon points={toString(
        {lx: right.rx, ly: right.ry}, 
        {tx: right.rx, ty: right.ry + margin},
        {rx: bottom.bx, ry: bottom.by + margin},
        bottom, 
        )} fill=url(#right) opacity=.3
    />
</g>