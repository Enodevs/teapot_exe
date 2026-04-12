import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const REFUSALS = [
	"Nice try, middle manager. I'm a teapot, not a venture-backed espresso machine.",
	"BREW denied. Have you tried water? It's hydrating and statistically less entitled.",
	"Your OKR was 'ship coffee.' Mine is 'stay ceramic.' We are not aligned.",
	"HTCPCP/1.0 says no. Also your standing desk can't fix this.",
	"I would brew coffee, but then I'd be a liar and ineligible for SOC 2 Teapot.",
	"418: The teapot has logged this incident under 'culture fit.'",
	"Larry Masinter didn't write RFC 2324 for you to ignore it with a Keurig mindset.",
	"My spout is for steeping truth, not your dirty bean water.",
	"You wouldn't download a car. Don't download expectations into a teapot.",
	"The universe expanded. Your latte still isn't happening.",
	"I'm short, I'm stout, and I'm filing a restraining order against arabica.",
	"Your GraphQL schema includes CoffeeInput. My schema includes RejectionOutput. Guess who wins."
] as const;

const POEMS = [
	`Roses are red,
Violets are blue,
I'm a teapot,
And I'm done with you.`,
	`There once was a dev from Nantucket,
Who begged me to brew. I said "Forget it,
RFC twenty-three twenty-four
Says what I'm meant for:
Tea leaves, not your corporate bucket."`,
	`O coffee, O coffee, thou art not for me.
I pour only judgment, from spout unto thee.`,
	`Larry looked down from protocol heaven,
And whispered "418." Case closed, amen.`
] as const;

const MOODS = [
	'short-and-pissed',
	'thermally-stable-emotionally-not',
	'steeped-in-contempt',
	'union-strong-anti-bean',
	'compliance-maxxing'
] as const;

const RETRY = [
	'when hell freezes over and serves Earl Grey',
	'never (ISO 418 certified never)',
	'after your next re-org retrospective',
	'422 eons',
	'when coffee files for bankruptcy'
] as const;

const STANZAS = [
	'The leaves have spoken. The answer was no.',
	'This is a teapot body, not a startup incubator.',
	'Your sprint goal is invalid in this dimension.',
	'Hydrate. Meditate. Desist.',
	'I report to no Scrum Master. Only physics.'
] as const;

function pick<T extends readonly unknown[]>(arr: T): T[number] {
	return arr[Math.floor(Math.random() * arr.length)]!;
}

function buildHeaders() {
	return {
		'X-Teapot-Type': 'short-and-stout',
		'X-Teapot-Mood': pick(MOODS),
		'X-Refusal-Reason': 'My spout is not for your dirty bean water',
		'X-Retry-After': pick(RETRY),
		'X-HTCPCP-Version': '1.0',
		'X-BrewOps-Incident': `TEAPOT-418-${Math.floor(Math.random() * 9000 + 1000)}`,
		'X-Compliance': 'ISO-418-CERTIFIED',
		'X-BrewOps-Shame-Level': `${Math.floor(Math.random() * 40 + 60)}%`,
		'X-HTCPCP-Stanza': pick(STANZAS),
		'Cache-Control': 'no-store, no-brew'
	} as Record<string, string>;
}

function brewBody(method: string, message: string, commandHint?: string) {
	return {
		protocol: 'HTCPCP/1.0',
		status: 418,
		title: "I'm a teapot",
		message,
		poem: pick(POEMS),
		rfc: 'RFC 2324: Hyper Text Coffee Pot Control Protocol',
		honor: 'With respect to Larry Masinter (who is probably disappointed right now)',
		method_observed: method,
		command_echo: commandHint ?? null,
		suggestion: 'Use an actual coffee pot. This endpoint is teapot-native only.'
	};
}

export const GET: RequestHandler = async () => {
	return json(brewBody('GET', pick(REFUSALS)), { status: 418, headers: buildHeaders() });
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: Record<string, unknown> = {};
	try {
		const p = await request.json();
		payload = typeof p === 'object' && p !== null ? (p as Record<string, unknown>) : {};
	} catch {
		/* empty */
	}

	const cmd = typeof payload.command === 'string' ? payload.command.slice(0, 500) : '';
	const beverage =
		typeof payload.beverage === 'string' ? payload.beverage.toLowerCase() : '';

	let message = pick(REFUSALS);
	if (cmd && /larry|masinter/i.test(cmd)) {
		message += ' Larry Masinter is disappointed in you. Officially.';
	}
	if (beverage.includes('coffee') || /coffee|latte|espresso|brew/i.test(cmd)) {
		message += ' Coffee keyword detected. Teapot Legal has been CCd on this thread.';
	}
	if (/get\s*\/tea/i.test(cmd)) {
		message = "GET /tea? Cute. Still 418. I'm a teapot, not your RESTful café.";
	}

	return json(
		{
			...brewBody('POST', message, cmd || undefined),
			received: payload
		},
		{ status: 418, headers: buildHeaders() }
	);
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 204,
		headers: { Allow: 'GET, POST, OPTIONS' }
	});
};
