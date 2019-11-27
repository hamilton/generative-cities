<script>
    import { getContext } from 'svelte';
    export let x;
    export let y;
    export let h;
    export let r = 5;
    export let fill = 'blue';
    const scale = getContext('scale');
    
    let shadow = scale(x+.5,y+.5);
    let location;
    $: location = scale(x+.5, y+.5, h);
    // place an orb 
    
    </script>
    
    <ellipse 
        cx={shadow[0]} cy={shadow[1]}
        rx={r} ry={r / 2}
        fill=url(#shadow) clip-path="url(#shadow-clip)"
    />
    <ellipse 
        cx={location[0]} cy={location[1]} 
        rx={r} ry={r / 2} fill={fill}
    />