<script>
import { getContext } from 'svelte';
export let x;
export let y;
export let h;
export let r = 5;
const scale = getContext('scale');

let shadow = scale(x,y);
let location;
$: location = scale(x, y, h)
// place an orb 

</script>

<ellipse 
    cx={shadow[0]} cy={shadow[1]}
    rx={r} ry={r / 2}
    fill=url(#shadow) clip-path="url(#shadow-clip)"
/>
<circle 
    cx={location[0]} cy={location[1]} 
    r={r}
/>