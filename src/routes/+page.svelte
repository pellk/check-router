<script lang="ts">
	interface Data {
		downStream: number;
		snr: number;
	}

	const MINIMUM = 2.5;
	let snr: number;
	let downStream: number;
	let downAudio: HTMLAudioElement;
	let upAudio: HTMLAudioElement;
	let started = false;
	let down = false;

	async function getData() {
		const response = await fetch('/data');
		const result = (await response.json()) as Data;
		downStream = result.downStream;
		if (snr !== result.snr) {
			snr = result.snr;
			if (snr < MINIMUM) {
				if (!down) {
					down = true;
					downAudio?.play();
				}
			} else {
				if (down) {
					down = false;
					upAudio?.play();
				}
			}
		}
	}

	function start(ev: MouseEvent) {
		downAudio = new Audio('fail.ogg');
		upAudio = new Audio('positive.ogg');
		setInterval(getData, 4000);
		started = true;
	}
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/{down ? 'red' : 'green'}.png" />
	<title>{downStream} mbps</title>
</svelte:head>

{#if !started}
	<button on:click={start}>Start</button>
{/if}
<dl class:down>
	<dt>SNR Margin</dt>
	<dd>{snr ?? ''}</dd>
</dl>
<dl>
	<dt>Down Stream</dt>
	<dd>{downStream} mbps</dd>
</dl>

<style>
	.down {
		color: darkred;
	}
</style>
