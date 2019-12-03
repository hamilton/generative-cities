<script>
import { getContext } from 'svelte';

export let map = getContext('mapToScene');
export let angle = 0;
export let centroid = [0.5, 0.5];
export let opacity = 1;
export let points;
export let fill = 'gray';
const m = (p) => p.join(',');

</script>

<polygon
    points="
        {points.map((p) => m(map(...p, angle, centroid))).join(' ')}
    "
    fill={fill}
    opacity={opacity}
/>