# Isomap

This is a Thanksgiving-2019-break experiment to see if I could build a library that converts xyz coordinates to an isometric plane using just Svelte, SVG and math.

Well, it works. Naturally, it starts to break down pretty quickly with enough svg objects, especially if you animate them (which, OF COURSE we want to animate them)

I suppose one nice aspect of this experiment is that I can easily copy the outer HTML of the svg, paste those results to a new file, then open them in  llustrator / an illustrator-like program.

This repository has primitives (Scene, Polygon, Circle), composites (Earth, Box), and three small scenes in it:

- Hamlet – a small town of boxy homes. The boxes rotate, and they cast shadows. Some care was taken to keeping the shadows from looking weird, but I didn't really spend the time to have shadows cast on the buildings.
- Heights – the big city floating high above all the hamlets. The render starts to get pretty heavy.
- Bouncing – bouncing flat disks. Shows how the xyz components map to isometric space.

I will not be pursuing this approach any further, since it seems clear that it's time to go WebGL. PRs welcome if they improve performance in a Svelte-y way.