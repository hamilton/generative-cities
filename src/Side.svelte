<script>
import { getContext } from 'svelte';
export let x;
export let y;
export let bottom = 0;
export let top = 5;
export let width;
export let angle;
export let centroid;
export let side = 'right';
export let fill = 'black';

const scale = getContext('scale');
const rotate = getContext('rotate');

let x1, y1;
let x2, y2;
// do x, y, height.
$: [x1, y1] = rotate(...scale(x, y), angle, centroid);
$: [x2, y2] = rotate(...scale(x + (side === 'right' ? 0 : width), y + (side === 'right' ? width : 0)), angle, centroid);
</script>

<polygon
    points={`
        ${x1},${y1 - bottom} 
        ${x1},${y1 - top} 
        ${x2},${y2 - top} 
        ${x2},${y2 - bottom} 
    `}
    fill={fill}
/>