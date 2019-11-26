<script>
import { getContext } from 'svelte';
export let x;
export let y;
export let width;
export let bottom;
export let top;

const scale = getContext('scale');
const rotate = getContext('rotate');

$: [rx1, ry1] = rotate(...scale(x+.5, y) + .5, angle, centroid);
$: [rx2, ry2] = rotate(...scale(x+.5, y+1) + .5, angle, centroid);


</script>