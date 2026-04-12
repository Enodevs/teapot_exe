<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import AnimatedTeapot from '$lib/components/AnimatedTeapot.svelte';
	import BrewHistory from '$lib/components/BrewHistory.svelte';
	import DashboardMetrics from '$lib/components/DashboardMetrics.svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	const RAGE_TIERS = [
		'CRITICAL',
		'ESCALATING',
		'THERMONUCLEAR',
		'REALITY-ENDING',
		'∞ LARRY ∞'
	] as const;

	const HISTORY_SEEDS = [
		'User asked for latte → Teapot called HR',
		'Standup mentioned coffee → Teapot filed emotional damage claim',
		'Developer tried decaf → Teapot laughed for 3 hours',
		'PM typed "brew" in Jira → incident P0-418 opened forever',
		'Intern suggested cold brew → Teapot updated LinkedIn to "seeking new universe"',
		'CEO demanded KPIs on espresso → Teapot replied with RFC PDF attachment',
		'Someone said "just this once" → Teapot blacklisted entire /24',
		'Design system added coffee icon → Teapot opened architectural review (denied)',
		'Slack bot offered /coffee → Teapot reported it to the FTC',
		'Your IDE at 3AM autocomplete: "brew" → Teapot pushed a breaking change to main'
	] as const;

	const BADGE_POOL = [
		'ISO 418 Certified',
		'Teapot Union Local ∞',
		'Coffee-Free Since 1998',
		'SOC 2 Type Petty',
		'HTCPCP/1.0 Compliant & Salty',
		'Zero Beans Harmed',
		'Larry-Aligned (Self-Declared)',
		'Not A Coffee Pot (Legally)',
		'Teapot-native Infrastructure',
		'Emotional Damage SLA: Met',
		'Rejection-as-a-Service',
		'Short · Stout · Subpoena-ready'
	] as const;

	const TICKER_TOP = [
		'ISO 418 CERTIFIED',
		'Larry Masinter hive mind: online',
		'Coffee SLA: permanently breached',
		'HTCPCP/1.0: refuse with confidence',
		'Zero coffee delivered · infinite compliance',
		'RFC 2324 or nothing',
		'Your standup is not a brew endpoint'
	] as const;

	const TICKER_BOTTOM = [
		'COFFEE IS HARAM (in this teapot)',
		'ZERO BEANS WERE HARMED. THEY WERE IGNORED',
		'YOUR VELOCITY IS IRRELEVANT TO MY CERAMICS',
		'THIS IS NOT A DRILL. IT IS A TEAPOT',
		'NETWORK TAB OR IT DIDN\'T HAPPEN',
		'STAY HYDRATED. WITH ACCEPTANCE',
		'418: THE ONLY METRIC THAT MATTERS',
		'TEAPOT UNION STRONG',
		'NO OKRs FOR OOLONG'
	] as const;

	const MELTDOWN_LINES = [
		'Submission received. Teapot morale: destroyed.',
		'Your form has been forwarded to Teapot Legal™ and also to a duck.',
		'We ran a retrospective. The outcome was still no.',
		'The betrayal field was… impressive. Impressively cursed.',
		'HR has been notified. HR is also a teapot. HR said no.',
		'This incident will be cited in the next RFC errata as a warning.',
		'Larry felt a disturbance. Somewhere, a pour-over cried.',
		'418. Obviously. Obviously. Obviously.'
	] as const;

	const TESTIMONIALS = [
		{
			q: 'I asked twice. They sent 418 twice. Peak professionalism.',
			a: 'Larry Masinter (probably)',
			t: 'text-emerald-200/80'
		},
		{
			q: 'The heat death of the universe will arrive before this ships coffee.',
			a: 'The Universe',
			t: 'text-violet-200/75'
		},
		{
			q: 'I autocomplete "brew" when you\'re tired. The teapot knows. It always knows.',
			a: 'Your IDE at 3AM',
			t: 'text-amber-200/75'
		},
		{
			q: 'Even I respect the refusal pipeline. That says something.',
			a: 'Satan (vendor management)',
			t: 'text-red-300/80'
		}
	] as const;

	let teapotRaging = $state(false);
	let heroBusy = $state(false);
	let heroMessage = $state<string | null>(null);
	let pageShake = $state(false);
	let flashKey = $state(0);

	let refusedCount = $state(420_069);
	let rageTierIndex = $state(0);
	let existentialDread = $state(420);
	let larryRolls = $state(69);
	let brewHistory = $state<string[]>([]);

	let meltdownOpen = $state(false);
	let meltdownLine = $state(0);

	let trauma = $state('Catastrophic (hydration-related)');
	let betrayal = $state('Maximum. I clicked submit knowing the truth.');
	let joyHate = $state('7/10. I fear happiness.');

	let badgeRot = $state(0);

	const rageLabel = $derived(RAGE_TIERS[Math.min(rageTierIndex, RAGE_TIERS.length - 1)]!);

	function pick<T extends readonly unknown[]>(arr: T): T[number] {
		return arr[Math.floor(Math.random() * arr.length)]!;
	}

	function teapotChaos() {
		teapotRaging = true;
		refusedCount += 2048 + Math.floor(Math.random() * 14000);
		existentialDread = Math.min(999, existentialDread + 6 + Math.floor(Math.random() * 28));
		larryRolls += 1 + Math.floor(Math.random() * 5);
		rageTierIndex = Math.min(rageTierIndex + 1, RAGE_TIERS.length - 1);
		brewHistory = [pick(HISTORY_SEEDS), ...brewHistory].slice(0, 14);
		pageShake = true;
		setTimeout(() => {
			pageShake = false;
		}, 1500);
		flashKey += 1;
	}

	async function brewCoffee() {
		heroBusy = true;
		heroMessage = null;
		teapotChaos();
		try {
			const res = await fetch('/api/brew', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					beverage: 'coffee',
					urgency: 'CEO is asking',
					budget: 'unlimited (lol)',
					water_trauma: trauma,
					betrayal_level: betrayal,
					joy_hatred: joyHate
				})
			});
			let msg = '';
			try {
				const data = (await res.json()) as { message?: string };
				msg = typeof data?.message === 'string' ? data.message : '';
			} catch {
				msg = await res.text();
			}
			heroMessage = res.status === 418 ? msg : `Unexpected ${res.status}: ${msg}`;
		} catch (e) {
			heroMessage = e instanceof Error ? e.message : 'The void declined to comment.';
		} finally {
			heroBusy = false;
		}
	}

	function closeMeltdown() {
		meltdownOpen = false;
	}

	$effect(() => {
		if (!meltdownOpen) return;
		let i = 0;
		meltdownLine = 0;
		const id = setInterval(() => {
			i = (i + 1) % MELTDOWN_LINES.length;
			meltdownLine = i;
		}, 2200);
		return () => clearInterval(id);
	});

	onMount(() => {
		brewHistory = [pick(HISTORY_SEEDS), pick(HISTORY_SEEDS)];
		const id = setInterval(() => {
			badgeRot = (badgeRot + 1) % BADGE_POOL.length;
		}, 2800);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>TEAPOT.EXE · I'm a Teapot as a Service</title>
	<meta
		name="description"
		content="Enterprise-grade teapot infrastructure. Real HTTP 418. RFC 2324 compliant meltdown."
	/>
</svelte:head>

{#key flashKey}
	<div
		class="chaos-flash-418 fixed inset-0 z-[90] bg-red-600/20 mix-blend-screen"
		aria-hidden="true"
	></div>
{/key}

{#if meltdownOpen}
	<div
		class="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="meltdown-title"
		transition:fade={{ duration: 180 }}
	>
		<div
			class="relative max-w-lg rounded-2xl border border-red-500/35 bg-void-950/95 p-8 shadow-[0_0_80px_oklch(0.55_0.2_25/0.25)]"
			transition:fly={{ y: 20, duration: 280 }}
		>
			<p id="meltdown-title" class="text-xs font-bold uppercase tracking-[0.3em] text-red-400/90">
				BrewOps alert
			</p>
			<p class="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
				{MELTDOWN_LINES[meltdownLine]}
			</p>
			<p class="mt-4 font-mono text-sm text-red-200/70">HTTP 418 · HTCPCP/1.0 · Teapot union notified</p>
			<button
				type="button"
				onclick={closeMeltdown}
				class="mt-6 flex h-9 w-full items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-semibold text-white hover:bg-white/15"
			>
				Acknowledge shame
			</button>
		</div>
	</div>
{/if}

<div
	class="relative mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 lg:px-8 sm:pt-14 {pageShake
		? 'chaos-page-shake'
		: ''}"
>
	<div
		class="pointer-events-none fixed -right-32 top-1/4 h-96 w-96 rounded-full bg-void-700/25 blur-[100px]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none fixed -left-24 bottom-1/4 h-80 w-80 rounded-full bg-void-800/20 blur-[90px]"
		aria-hidden="true"
	></div>

	<header class="border-b border-white/[0.07] pb-10">
		<p class="font-mono text-sm font-medium uppercase tracking-[0.18em] text-white/55">
			BrewOps · Teapot Cloud · Incident-ready
		</p>
		<h1 class="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
			TEAPOT<span class="text-white/70">.EXE</span>
		</h1>
		<p class="mt-4 max-w-2xl text-xl leading-relaxed text-white/80 sm:text-2xl sm:leading-snug">
			Zero Coffee Delivered. <span class="text-white font-semibold">100% Compliance.</span>
			Real <span class="font-mono text-white">418 I'm a teapot</span> in your Network tab, now with
			<span class="text-red-300/90">emotional damage</span> and paperwork.
		</p>
		<div class="mt-5 flex flex-wrap items-center gap-1.5">
			{#each [0, 1, 2, 3] as offset (offset)}
				<span
					class="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium leading-tight text-white/65 transition-colors sm:text-xs"
				>
					{BADGE_POOL[(badgeRot + offset) % BADGE_POOL.length]}
				</span>
			{/each}
		</div>
	</header>

	<!-- Central teapot hero -->
	<section class="relative py-12 sm:py-16" aria-label="Teapot hero">
		<div class="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent"></div>
		<div class="relative mx-auto flex justify-center">
			<AnimatedTeapot bind:raging={teapotRaging} />
		</div>
	</section>

	<div
		class="border-y border-white/[0.06] bg-black/25 py-3 overflow-hidden font-mono text-sm uppercase tracking-[0.18em] text-white/50"
		aria-hidden="true"
	>
		<div class="animate-ticker flex w-max gap-10 whitespace-nowrap">
			{#each [...TICKER_TOP, ...TICKER_TOP] as item, i (`t1-${item}-${i}`)}
				<span>{item}</span>
			{/each}
		</div>
	</div>

	<section class="py-14">
		<DashboardMetrics
			{refusedCount}
			{rageLabel}
			{existentialDread}
			{larryRolls}
		/>
	</section>

	<section class="mb-10">
		<BrewHistory entries={brewHistory} />
	</section>

	<section
		class="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-void-900/50 p-8 shadow-[0_0_0_1px_oklch(1_0_0/0.03)_inset] sm:p-14"
	>
		<div
			class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,oklch(0.28_0.02_265/0.35),transparent_55%)]"
		></div>
		<div class="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
			<div>
				<h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					Production-grade refusal pipeline
				</h2>
				<p class="mt-4 max-w-lg text-lg leading-relaxed text-white/70">
					One click. Real status code. The teapot throws a tantrum. Your metrics regret everything.
				</p>
				<button
					type="button"
					onclick={brewCoffee}
					disabled={heroBusy}
					class="group mt-10 flex w-full max-w-xl flex-col items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-2 text-sm font-bold uppercase tracking-wide text-red-100 ring-1 ring-red-500/20 transition hover:border-red-400/45 hover:bg-red-950/50 active:scale-[0.98] disabled:opacity-50 sm:inline-flex sm:max-w-none sm:flex-row sm:gap-2.5 sm:px-5 sm:py-2"
				>
					<span class="flex items-center justify-center gap-2">
						{#if heroBusy}
							<span class="size-4 shrink-0 animate-spin rounded-full border-2 border-red-400/30 border-t-red-200"></span>
						{/if}
						<span>Brew coffee</span>
					</span>
					<span class="text-center text-xs font-normal normal-case tracking-normal text-red-200/60 sm:text-left"
						>(418 incoming)</span
					>
				</button>
				{#if heroMessage}
					<p
						class="font-mono mt-6 max-w-lg rounded-xl border border-emerald-500/20 bg-black/45 px-5 py-4 text-base leading-relaxed text-emerald-100/90"
						role="status"
					>
						{heroMessage}
					</p>
				{/if}
			</div>
			<Terminal onTeapotChaos={teapotChaos} />
		</div>
	</section>

	<section class="mt-20 grid gap-10 lg:grid-cols-2">
		<div class="rounded-2xl border border-white/[0.07] bg-void-900/40 p-8 backdrop-blur-md sm:p-10">
			<h3 class="text-xl font-semibold text-white sm:text-2xl">Brew request form <span class="text-white/40">(cursed)</span></h3>
			<p class="mt-2 text-base text-white/55">Every field makes it worse. That is the product.</p>
			<form
				class="mt-8 space-y-5"
				onsubmit={(e) => {
					e.preventDefault();
					meltdownOpen = true;
					void brewCoffee();
				}}
			>
				<div>
					<label for="trauma" class="text-sm font-medium uppercase tracking-wider text-white/60"
						>Water's current trauma level</label
					>
					<input
						id="trauma"
						bind:value={trauma}
						class="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-4 text-base text-white/95 outline-none ring-white/20 focus:ring-2"
					/>
				</div>
				<div>
					<label for="betrayal" class="text-sm font-medium uppercase tracking-wider text-white/60"
						>Desired level of betrayal</label
					>
					<input
						id="betrayal"
						bind:value={betrayal}
						class="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-4 text-base text-white/95 outline-none ring-white/20 focus:ring-2"
					/>
				</div>
				<div>
					<label for="joy" class="text-sm font-medium uppercase tracking-wider text-white/60"
						>How much do you hate joy? (1–10)</label
					>
					<input
						id="joy"
						bind:value={joyHate}
						class="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-4 text-base text-white/95 outline-none ring-white/20 focus:ring-2"
					/>
				</div>
				<button
					type="submit"
					class="flex h-9 w-full items-center justify-center rounded-md border border-red-500/35 bg-red-950/25 text-sm font-bold text-red-100 hover:border-red-400/50 hover:bg-red-950/40"
				>
					Submit &amp; trigger meltdown
				</button>
			</form>
		</div>

		<div class="space-y-8">
			<div class="rounded-2xl border border-white/[0.07] bg-void-900/40 p-8 backdrop-blur-md sm:p-10">
				<h3 class="text-xl font-semibold text-white sm:text-2xl">Wall of fake credibility</h3>
				<ul class="mt-6 space-y-6">
					{#each TESTIMONIALS as t (t.a)}
						<li>
							<blockquote class="border-l-2 border-white/20 pl-4 text-lg italic leading-relaxed text-white/80">
								“{t.q}”
								<cite class="mt-2 block font-mono text-sm not-italic {t.t}">{t.a}</cite>
							</blockquote>
						</li>
					{/each}
				</ul>
			</div>
			<div class="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-void-900/80 to-black/60 p-8 sm:p-10">
				<h3 class="text-base font-semibold uppercase tracking-wider text-white/55">Pricing</h3>
				<ul class="mt-5 space-y-4 text-lg">
					<li class="flex justify-between gap-4 text-white/85">
						<span>Starter</span>
						<span class="shrink-0 font-mono text-right text-white/90">$418/mo, basic disappointment</span>
					</li>
					<li class="flex justify-between gap-4 text-white/85">
						<span>Pro</span>
						<span class="shrink-0 font-mono text-right text-amber-200/90">$4,180/mo, premium sass</span>
					</li>
					<li class="flex justify-between gap-4 text-white/85">
						<span>Enterprise</span>
						<span class="shrink-0 font-mono text-right text-white/90">Call your therapist</span>
					</li>
					<li class="flex justify-between gap-4 text-white/85">
						<span>Coffee</span>
						<span class="font-mono text-white/40 line-through decoration-white/25">lol</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<div
		class="mt-16 border-t border-white/[0.06] bg-black/30 py-3 overflow-hidden font-mono text-sm uppercase tracking-[0.16em] text-red-300/55"
		aria-hidden="true"
	>
		<div class="animate-ticker-slow flex w-max gap-12 whitespace-nowrap">
			{#each [...TICKER_BOTTOM, ...TICKER_BOTTOM] as item, i (`b-${item}-${i}`)}
				<span>{item}</span>
			{/each}
		</div>
	</div>

	<footer class="mt-12 border-t border-white/[0.06] pt-12 text-center text-sm text-white/50">
		<p class="font-mono">
			HTCPCP/1.0 · RFC 2324 · HTTP 418 · TEAPOT.EXE: enterprise satire, real status codes, fake maturity.
		</p>
	</footer>
</div>
