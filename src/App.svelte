<script>
import Bouncing from './scenes/Bouncing.svelte';
import Heights from './scenes/Heights.svelte';
import Hamlet from './scenes/Hamlet.svelte';

let which = 0;
const scenes = [
  { name: 'Hamlet', component: Hamlet },
  { name: 'Heights', component: Heights },
  { name: 'Bouncing', component: Bouncing },

];

</script>

<style>

h1 {
	margin: 0;
	margin-bottom: var(--space-2x);
	font-family: 'Seraphs Var';
	font-variation-settings: 'wght' 100, 'SRFS' 6;
	line-height:1;
}

h1 sub {
	color: tomato;
	font-size:.6em;
	font-variation-settings: 'wght' 200, 'SRFS' 6;
}
</style>

{#each scenes as {name, component}, i}
	{#if i === which}
		<svelte:component this={scenes[which].component} />
	{/if}
{/each}


<div class='scene-selection'>
	<h1>isometric map</h1>
	{#each scenes as {name, component}, i}
	<label>
		<input type=radio bind:group={which} value={i}>
		{name}
	</label>
	{/each}
</div>