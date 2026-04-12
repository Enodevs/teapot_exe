<script lang="ts">
	import { onMount } from 'svelte';

	type Line = { id: number; kind: 'cmd' | 'out' | 'err' | 'hdr'; text: string };

	let nextLineId = 0;
	function makeLine(kind: Line['kind'], text: string): Line {
		nextLineId += 1;
		return { id: nextLineId, kind, text };
	}

	let lines = $state<Line[]>([
		makeLine('out', 'BrewOps HTCPCP Console v0.418.∞. Type literally anything. The teapot is listening.'),
		makeLine('hdr', 'Connected to /api/brew · expect 418 · bring tissues')
	]);

	let input = $state('');
	let busy = $state(false);
	let typingPreview = $state<{ kind: Line['kind']; text: string } | null>(null);

	let { onTeapotChaos }: { onTeapotChaos?: () => void } = $props();

	function lineColorClass(kind: Line['kind']): string {
		switch (kind) {
			case 'cmd':
				return 'text-emerald-100';
			case 'out':
				return 'text-emerald-200/90';
			case 'err':
				return 'text-emerald-50 font-semibold';
			case 'hdr':
				return 'text-emerald-400/75';
		}
	}

	function push(kind: Line['kind'], text: string) {
		lines = [...lines, makeLine(kind, text)];
	}

	function sleep(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
	}

	async function pushSlow(kind: Line['kind'], text: string, charMin = 8, charMax = 22) {
		let acc = '';
		typingPreview = { kind, text: '' };
		for (const ch of text) {
			acc += ch;
			typingPreview = { kind, text: acc + '▌' };
			await sleep(charMin + Math.random() * (charMax - charMin));
		}
		typingPreview = null;
		push(kind, text);
	}

	const ASCII_POT = `      |}
     )  (  }
    (   ) (_)
   (__))____)`;

	const RANTS = [
		'[teapot daemon] I smell ambition. It reeks of espresso.',
		'[teapot daemon] Fun fact: every "quick sync" adds one micron of crack to my glaze.',
		'[teapot daemon] Your PM just typed "brew" in Slack. I felt it in my handle.',
		'[teapot daemon] I am short. I am stout. I am not your CI/CD kettle.',
		'[teapot daemon] Larry wrote RFC 2324 so I could say no with standards compliance.',
		'[teapot daemon] Decaf is still betrayal. Don\'t @ me.',
		'[teapot daemon] If you wanted hot brown water, use HTTP 200 and a different appliance.'
	] as const;

	const EGG_RESPONSES: { test: (s: string) => boolean; lines: Line['kind'][]; texts: string[] }[] = [
		{
			test: (s) => /larry|masinter|rfc\s*2324/i.test(s),
			lines: ['out', 'out', 'hdr'],
			texts: [
				'Invoking the Masinter clause…',
				'He did not die for your pour-over pipeline.',
				'X-Patron-Saint: Larry · X-Tea-Orthodoxy: MAXIMUM'
			]
		},
		{
			test: (s) => /\b(ascii|art)\b/i.test(s),
			lines: ['out'],
			texts: [ASCII_POT]
		},
		{
			test: (s) => /^sudo\b/i.test(s),
			lines: ['err', 'out'],
			texts: [
				'← nice try, but I am already root in the domain of steeping.',
				'X-Sudo-Response: the teapot is the superuser of this kitchen.'
			]
		},
		{
			test: (s) => /vim|emacs/i.test(s),
			lines: ['out'],
			texts: ['Both editors are valid. Neither brews coffee here. Argument invalid. Teapot wins.']
		}
	];

	function brewish(cmd: string) {
		const c = cmd.toLowerCase();
		return (
			/brew|coffee|latte|espresso|bean|decaf|mocha|americano|\/coffee|get\s*\/tea|post\s*\/tea|caffeine/i.test(
				c
			) || c.startsWith('get ') || c.startsWith('post ')
		);
	}

	async function runCommand(raw: string) {
		const cmd = raw.trim();
		if (!cmd) return;
		push('cmd', `> ${cmd}`);
		input = '';

		if (cmd.toLowerCase() === 'help') {
			await pushSlow(
				'out',
				'Try: BREW anything · GET /tea · coffee · clear · rfc2324 · ascii · or mash keyboard for 418 poetry.',
				4,
				14
			);
			return;
		}
		if (cmd.toLowerCase() === 'clear') {
			lines = [];
			return;
		}
		if (cmd.toLowerCase() === 'rfc2324') {
			push(
				'out',
				'RFC 2324 / HTCPCP/1.0: the protocol that lets a teapot say "no" with IETF paperwork. Beautiful.'
			);
			return;
		}
		if (cmd.toLowerCase() === 'status') {
			push('out', 'Teapot status: feral. Coffee pipeline: legally nonexistent. Mood: short-and-pissed.');
			return;
		}

		for (const egg of EGG_RESPONSES) {
			if (egg.test(cmd)) {
				busy = true;
				try {
					for (let i = 0; i < egg.texts.length; i++) {
						await sleep(180 + Math.random() * 320);
						push(egg.lines[i]!, egg.texts[i]!);
					}
				} finally {
					busy = false;
				}
				if (brewish(cmd)) onTeapotChaos?.();
				return;
			}
		}

		busy = true;
		try {
			await sleep(120 + Math.random() * 200);
			const res = await fetch('/api/brew', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					command: cmd,
					beverage: brewish(cmd) ? 'coffee' : 'denial',
					client_mood: 'optimistic (misplaced)'
				})
			});

			const headerKeys = [
				'X-Teapot-Type',
				'X-Teapot-Mood',
				'X-Refusal-Reason',
				'X-Retry-After',
				'X-HTCPCP-Stanza',
				'X-BrewOps-Shame-Level'
			] as const;
			push('err', `← HTTP ${res.status} ${res.statusText || "I'm a teapot"}`);
			for (const hk of headerKeys) {
				const v = res.headers.get(hk);
				if (v) push('hdr', `${hk}: ${v}`);
			}

			let data: Record<string, unknown> = {};
			try {
				data = (await res.json()) as Record<string, unknown>;
			} catch {
				push('out', await res.text());
				if (res.status === 418) onTeapotChaos?.();
				return;
			}

			if (typeof data.message === 'string') {
				await pushSlow('out', data.message, 6, 18);
			}
			if (typeof data.poem === 'string') {
				await sleep(200);
				push('out', '');
				push('out', data.poem);
			}
			if (typeof data.suggestion === 'string') {
				push('out', `→ ${data.suggestion}`);
			}

			if (res.status === 418) onTeapotChaos?.();
		} catch (e) {
			push('err', `Network void: ${e instanceof Error ? e.message : String(e)}`);
		} finally {
			busy = false;
		}
	}

	function onsubmit(e: Event) {
		e.preventDefault();
		void runCommand(input);
	}

	onMount(() => {
		const tick = () => {
			if (busy || lines.length > 120) return;
			if (Math.random() > 0.35) return;
			const r = RANTS[Math.floor(Math.random() * RANTS.length)]!;
			push('out', r);
		};
		const id = setInterval(tick, 14000 + Math.random() * 9000);
		return () => clearInterval(id);
	});
</script>

<div
	class="overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#070b0a] shadow-[0_0_0_1px_oklch(0.35_0.08_160/0.15),0_24px_80px_oklch(0_0_0/0.45)]"
	role="region"
	aria-label="HTCPCP developer console"
>
	<div
		class="flex items-center justify-between border-b border-white/[0.06] bg-emerald-950/40 px-4 py-3.5"
	>
		<div class="flex items-center gap-2">
			<span class="size-2.5 rounded-full bg-white/15"></span>
			<span class="size-2.5 rounded-full bg-white/22"></span>
			<span class="size-2.5 rounded-full bg-white/15"></span>
		</div>
		<span class="font-mono text-sm text-emerald-200/70">brewops-console · chaos mode</span>
		<span class="font-mono text-xs text-emerald-300/60">418∞</span>
	</div>

	<div
		class="font-mono max-h-[min(52vh,520px)] min-h-[260px] overflow-y-auto p-5 text-base leading-relaxed text-emerald-50/95"
	>
		{#each lines as line (line.id)}
			<div class="mb-2 whitespace-pre-wrap break-words {lineColorClass(line.kind)}">
				{line.text}
			</div>
		{/each}
		{#if typingPreview}
			<div class="mb-2 whitespace-pre-wrap break-words {lineColorClass(typingPreview.kind)}">
				{typingPreview.text}
			</div>
		{/if}
		{#if busy}
			<div class="text-emerald-200/65 text-base animate-pulse">…the teapot is composing a rejection…</div>
		{/if}
	</div>

	<form
		onsubmit={onsubmit}
		class="flex items-center gap-2 border-t border-white/[0.06] bg-black/30 px-3 py-2"
	>
		<span class="flex h-9 shrink-0 items-center font-mono text-base text-emerald-300/80 select-none">$</span>
		<input
			bind:value={input}
			disabled={busy}
			placeholder="BREW /coffee · GET /tea · or type your regrets"
			class="font-mono min-h-9 min-w-0 flex-1 bg-transparent py-1.5 text-base leading-none text-emerald-50 placeholder:text-emerald-800/90 outline-none disabled:opacity-50"
			autocomplete="off"
			spellcheck="false"
			aria-label="Console command"
		/>
		<button
			type="submit"
			disabled={busy}
			class="flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 px-3 text-xs font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-emerald-400/25 hover:bg-emerald-500/25 disabled:opacity-50"
		>
			Run
		</button>
	</form>
</div>
