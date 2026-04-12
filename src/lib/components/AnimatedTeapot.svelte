<script lang="ts">
	import { untrack } from 'svelte';

	let { raging = $bindable(false) }: { raging?: boolean } = $props();

	let rageKey = $state(0);
	let screamText = $state('');
	let flyBits = $state<
		{ id: number; emoji: string; tx: number; ty: number; rot: number; left: number; top: number }[]
	>([]);
	let steamBursts = $state<{ id: number; px: number; py: number; left: string; top: string }[]>([]);

	let nextBurstId = 0;

	const SCREAMS = [
		'I AM A TEAPOT, YOU MONSTER!',
		'COFFEE? IN MY HOUSE? NEVER.',
		'RFC 2324 CALLED. IT SAID NO.',
		'YOUR BEAN WATER IS NOT WELCOME HERE.',
		'SHORT. STOUT. LEGALLY DISTINCT FROM A COFFEE POT.',
		'LARRY MASINTER DID NOT WRITE THIS RFC FOR *THIS*.',
		'HTCPCP/1.0: PERMISSION DENIED FOREVER.'
	] as const;

	const TEA_EMOJIS = ['🍵', '🫖', '☕', '😤', '✨'] as const;

	function randomScream() {
		return SCREAMS[Math.floor(Math.random() * SCREAMS.length)]!;
	}

	$effect(() => {
		if (!raging) return;
		untrack(() => {
			rageKey += 1;
			screamText = randomScream();
			const idBase = Date.now();
			const bits: typeof flyBits = [];
			for (let i = 0; i < 14; i++) {
				bits.push({
					id: idBase + i,
					emoji: TEA_EMOJIS[i % TEA_EMOJIS.length]!,
					tx: (Math.random() - 0.5) * 220,
					ty: -80 - Math.random() * 160,
					rot: (Math.random() - 0.5) * 200,
					left: 35 + Math.random() * 30,
					top: 40 + Math.random() * 25
				});
			}
			for (let i = 0; i < 5; i++) {
				bits.push({
					id: idBase + 100 + i,
					emoji: '🟤',
					tx: (Math.random() - 0.5) * 180,
					ty: 60 + Math.random() * 100,
					rot: Math.random() * 360,
					left: 30 + Math.random() * 40,
					top: 55 + Math.random() * 20
				});
			}
			for (let i = 0; i < 4; i++) {
				bits.push({
					id: idBase + 200 + i,
					emoji: '😭',
					tx: (Math.random() - 0.5) * 200,
					ty: 40 + Math.random() * 90,
					rot: (Math.random() - 0.5) * 90,
					left: 25 + Math.random() * 50,
					top: 50 + Math.random() * 30
				});
			}
			flyBits = bits;
			const bursts: typeof steamBursts = [];
			for (let i = 0; i < 16; i++) {
				nextBurstId += 1;
				bursts.push({
					id: nextBurstId,
					px: (Math.random() - 0.5) * 100,
					py: -40 - Math.random() * 80,
					left: `${20 + Math.random() * 60}%`,
					top: `${10 + Math.random() * 30}%`
				});
			}
			steamBursts = bursts;
		});
		const clearFly = setTimeout(() => {
			flyBits = [];
		}, 2400);
		const clearSteam = setTimeout(() => {
			steamBursts = [];
		}, 1600);
		const t = setTimeout(() => {
			raging = false;
			screamText = '';
		}, 2800);
		return () => {
			clearTimeout(t);
			clearTimeout(clearFly);
			clearTimeout(clearSteam);
		};
	});
</script>

<div
	class="relative mx-auto flex w-full max-w-[min(100%,min(90vw,420px))] flex-col items-center justify-end"
	aria-hidden="true"
>
	<!-- Steam (idle) -->
	<div class="pointer-events-none absolute -top-12 flex justify-center gap-3">
		<span
			class="h-16 w-2 rounded-full bg-gradient-to-t from-white/30 to-transparent blur-[2px] animate-steam"
		></span>
		<span
			class="h-[4.5rem] w-2.5 rounded-full bg-gradient-to-t from-emerald-300/40 to-transparent blur-[3px] animate-steam-delayed"
		></span>
		<span
			class="h-14 w-2 rounded-full bg-gradient-to-t from-white/25 to-transparent blur-[2px] animate-steam-delayed-2"
		></span>
	</div>

	<!-- Burst steam particles -->
	{#each steamBursts as p (p.id)}
		<span
			class="steam-particle pointer-events-none absolute size-2 rounded-full bg-white/40 blur-[1px]"
			style="left: {p.left}; top: {p.top}; --px: {p.px}px; --py: {p.py}px;"
		></span>
	{/each}

	<!-- Scream banner -->
	{#if screamText}
		<div
			class="scream-banner pointer-events-none absolute -top-4 left-1/2 z-20 w-[min(100%,340px)] -translate-x-1/2 px-2 text-center"
		>
			<p
				class="rounded-xl border border-red-500/40 bg-red-950/90 px-3 py-2 text-sm font-black uppercase leading-tight tracking-tight text-red-100 shadow-[0_0_40px_oklch(0.55_0.22_25/0.35)] sm:text-base"
			>
				{screamText}
			</p>
		</div>
	{/if}

	<!-- Flying chaos -->
	<div class="pointer-events-none absolute inset-0 z-10 overflow-visible">
		{#each flyBits as bit (bit.id)}
			<span
				class="fly-tea-emoji absolute text-2xl sm:text-3xl"
				style="left: {bit.left}%; top: {bit.top}%; --tx: {bit.tx}px; --ty: {bit.ty}px; --rot: {bit.rot}deg;"
				>{bit.emoji}</span
			>
		{/each}
	</div>

	<!-- Teapot SVG -->
	<div
		class="relative z-[5] drop-shadow-[0_24px_48px_oklch(0.2_0.08_170/0.5)] transition-transform duration-300"
	>
		{#key rageKey}
			<div class={raging ? 'animate-teapot-meltdown' : ''}>
				<svg
					class="h-auto w-full text-emerald-500 {raging ? '' : ''}"
					viewBox="0 0 200 160"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<!-- Angry brows -->
					{#if raging}
						<path
							d="M58 52 L72 58 M142 52 L128 58"
							stroke="oklch(0.25 0.05 25)"
							stroke-width="3"
							stroke-linecap="round"
						/>
					{/if}
					<defs>
						<linearGradient id="pot" x1="40" y1="20" x2="160" y2="140" gradientUnits="userSpaceOnUse">
							<stop stop-color="oklch(0.55 0.1 172)" />
							<stop offset="1" stop-color="oklch(0.32 0.07 175)" />
						</linearGradient>
						<linearGradient id="lid" x1="70" y1="8" x2="130" y2="36" gradientUnits="userSpaceOnUse">
							<stop stop-color="oklch(0.62 0.09 170)" />
							<stop offset="1" stop-color="oklch(0.4 0.08 172)" />
						</linearGradient>
					</defs>
					<path
						d="M20 88 Q8 78 6 64 Q6 52 18 50 L38 58 Q28 68 28 82 Q28 94 38 100 Z"
						fill="url(#pot)"
						stroke="oklch(0.45 0.08 172)"
						stroke-width="1.2"
					/>
					<ellipse cx="100" cy="102" rx="62" ry="48" fill="url(#pot)" stroke="oklch(0.4 0.07 175)" />
					<ellipse cx="100" cy="102" rx="48" ry="36" fill="oklch(0.28 0.05 175 / 0.35)" />
					<path
						d="M162 72 C188 72 188 118 162 118"
						stroke="url(#pot)"
						stroke-width="10"
						stroke-linecap="round"
						fill="none"
					/>
					<ellipse cx="100" cy="58" rx="34" ry="12" fill="url(#lid)" stroke="oklch(0.35 0.06 172)" />
					<rect x="94" y="36" width="12" height="28" rx="3" fill="oklch(0.5 0.08 170)" />
					<ellipse cx="78" cy="96" rx="10" ry="18" fill="oklch(1 0 0 / 0.12)" />
					<!-- Face -->
					<circle cx="78" cy="88" r="5" fill="oklch(0.2 0.02 175)" />
					<circle cx="122" cy="88" r="5" fill="oklch(0.2 0.02 175)" />
					{#if raging}
						<ellipse cx="100" cy="102" rx="18" ry="10" fill="oklch(0.35 0.12 25 / 0.5)" />
						<path
							d="M88 108 Q100 118 112 108"
							stroke="oklch(0.25 0.05 175)"
							stroke-width="2"
							fill="none"
						/>
					{:else}
						<path
							d="M88 104 Q100 98 112 104"
							stroke="oklch(0.25 0.04 175)"
							stroke-width="2"
							fill="none"
						/>
					{/if}
				</svg>
			</div>
		{/key}
	</div>

	<p
		class="font-mono relative z-[6] mt-5 text-center text-xs uppercase tracking-[0.28em] text-emerald-200/80 sm:text-sm"
	>
		{raging ? '⚠ MELTDOWN PROTOCOL ⚠' : 'Teapot-native · Coffee-hostile'}
	</p>
</div>
