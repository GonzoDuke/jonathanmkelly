// This Machine Kills Democracy — source extracted verbatim from
// Source Material/poems/This Machine Kills Democracy (2024_).docx.
//
// The poem applies off-register red-ink "overprint" to specific tokens:
//   genocide, fascism, tyranny, cage, corpse in a suit
// and to the title + the final standalone line.
// The page wraps matched tokens at render time; the raw text stays clean.

export const THIS_MACHINE_RAW = `They told us the system would hold.
That the “adults in the room” would stop the madness.
They fucking lied.

America isn’t in decline.
It’s a hollow empire,
puffing its chest
while its guts rot in the gutter.
The economy is a Ponzi scheme.
The media is a sedative.
The opposition party?
Cowards in suits.
The courts you thought were there to protect you?
They were built to protect power.

Billionaires loot the wreckage in daylight,
turning crisis into capital.
Every major institution either profits from collapse
or watches the fire spread.

At the center of this burning wreckage
stands a grotesque emperor,
grinning, power-drunk.

This is who runs America now:
a swollen, vengeful demagogue,
tearing democracy apart from within.

And the Democrats?
They don’t stop fascism.
They commodify it.
They don’t act.
They fundraise off of it.
They don’t resist.
They wait, staring at the clock.
They don’t fight Trump.
They need the fear.

So what now?

You can’t vote your way out of
a cage built to hold you.
You can’t argue with people who
debate your right to exist.
You can’t ask tyrants to make room at
a table they never asked you to.

Stop giving mouth-to-mouth
to a corpse in a suit.
They prop it up, repaint it,
wave its limp hand for the cameras,
pipe in prewritten lines—
and pray you mistake it for living.

Say the real things.
Loudly.
The Supreme Court
is not a check on tyranny.
It is tyranny.
Donald Trump’s rise
is not an anomaly.
It is the system without a mask.
Palestine
is not a conflict.
It is genocide, out in the open.
Fascism
isn’t coming.
It is here. It is working. It is winning.
History
is not somewhere else.
It is happening with you inside it.
You are not exempt.
You are not outside the story.

This machine kills democracy.`;

// Regex matching tokens that get the overprint treatment. Order matters —
// "corpse in a suit" must be tried before "corpse" would be.
// Case-insensitive whole-phrase/word matches; original casing is preserved.
const OVERPRINT_RX = /\b(corpse in a suit|genocide|fascism|tyranny|cage)\b/gi;

export function overprintTokens(line) {
  const parts = [];
  let last = 0;
  let m;
  OVERPRINT_RX.lastIndex = 0;
  while ((m = OVERPRINT_RX.exec(line)) !== null) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index), overprint: false });
    parts.push({ text: m[0], overprint: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push({ text: line.slice(last), overprint: false });
  return parts;
}

export function parseThisMachine() {
  return THIS_MACHINE_RAW.split(/\n{2,}/).map((block, i, arr) => {
    const lines = block.split('\n').filter((l) => l.length > 0);
    const isFinal = i === arr.length - 1;
    return { lines, isFinal };
  });
}
