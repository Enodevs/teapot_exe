<script lang="ts">
	import { untrack } from 'svelte';

	let { raging = $bindable(false) }: { raging?: boolean } = $props();

	let rageKey = $state(0);

	// Only depend on `raging`. `rageKey += 1` must run inside untrack — otherwise
	// reading/writing rageKey re-triggers this effect → infinite loop.
	$effect(() => {
		if (!raging) return;
		untrack(() => {
			rageKey += 1;
		});
		const t = setTimeout(() => {
			raging = false;
		}, 480);
		return () => clearTimeout(t);
	});
</script>

<div
	class="relative mx-auto flex w-full max-w-[min(100%,320px)] flex-col items-center justify-end"
	aria-hidden="true"
>
	<!-- Steam -->
	<div class="pointer-events-none absolute -top-10 flex justify-center gap-3">
		<span
			class="h-14 w-2 rounded-full bg-gradient-to-t from-white/25 to-transparent blur-[2px] animate-steam"
		></span>
		<span
			class="h-16 w-2.5 rounded-full bg-gradient-to-t from-emerald-300/35 to-transparent blur-[3px] animate-steam-delayed"
		></span>
		<span
			class="h-12 w-2 rounded-full bg-gradient-to-t from-white/20 to-transparent blur-[2px] animate-steam-delayed-2"
		></span>
	</div>

	<!-- Teapot SVG -->
	<div class="drop-shadow-[0_20px_40px_oklch(0.2_0.08_170/0.45)] transition-transform duration-300">
		{#key rageKey}
			<svg
				class="h-auto w-full text-emerald-500 {raging ? 'animate-teapot-rage' : ''}"
				viewBox="0 0 200 160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
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
				<!-- Spout -->
				<path
					d="M20 88 Q8 78 6 64 Q6 52 18 50 L38 58 Q28 68 28 82 Q28 94 38 100 Z"
					fill="url(#pot)"
					stroke="oklch(0.45 0.08 172)"
					stroke-width="1.2"
				/>
				<!-- Body -->
				<ellipse cx="100" cy="102" rx="62" ry="48" fill="url(#pot)" stroke="oklch(0.4 0.07 175)" />
				<ellipse cx="100" cy="102" rx="48" ry="36" fill="oklch(0.28 0.05 175 / 0.35)" />
				<!-- Handle -->
				<path
					d="M162 72 C188 72 188 118 162 118"
					stroke="url(#pot)"
					stroke-width="10"
					stroke-linecap="round"
					fill="none"
				/>
				<!-- Lid -->
				<ellipse cx="100" cy="58" rx="34" ry="12" fill="url(#lid)" stroke="oklch(0.35 0.06 172)" />
				<rect x="94" y="36" width="12" height="28" rx="3" fill="oklch(0.5 0.08 170)" />
				<!-- Shine -->
				<ellipse cx="78" cy="96" rx="10" ry="18" fill="oklch(1 0 0 / 0.12)" />
			</svg>
		{/key}
	</div>

	<p
		class="font-mono mt-4 text-center text-xs uppercase tracking-[0.3em] text-emerald-200/75 sm:text-sm"
	>
		Teapot-native · Coffee-hostile
	</p>
</div>
