<script>
import { getContext } from 'svelte';

export let x;
export let y;
export let z = 0;
export let r = 1;
export let fill = 'black';
export let opacity = 1;
const placeXY = getContext('placeXY');
const tileSize = getContext('tileSize');

let px;
let py;
let pr;
$: [px, py] = placeXY(x, y, z);
$: pr = r * tileSize * (Math.PI / 5);

</script>

<ellipse 
    cx={px} cy={py} 
    rx={pr} 
    ry={pr / 2} 
    fill={fill}
    opacity={opacity}
/>