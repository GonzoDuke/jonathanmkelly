// Kerouac is Chilling on My Couch — source extracted verbatim from
// Source Material/poems/Kerouac is Chilling on My Couch (2024).docx.
//
// Four numbered sections (I–IV). Stanzas within each section are split on
// blank lines. Leading whitespace is significant — preserved via
// white-space: pre-wrap at render time.

export const KEROUAC_RAW = `I.
Jack,
why are you here again?

Did flying across the universe
become tiresome after the mystery
was solved for you?

I’m tired, man.
It’s been a long week
and you just want
me to tell you stories,
stories of the old days,
when I was carefree
and depressed
and stoned.

And how you found me
and saved me
from what I was becoming,
whatever that could’ve been
if everything hadn’t gone right
   – the opposite of a cautionary tale –
(you’d love her, Jack)

Your turn, Jack.
Your turn to tell the stories
  to rattle the locks
     to wake the ghosts.

II.
I’m finished wishing
for you to talk.
You just sit there–
bodhisattva of silence
whose soul remains tortured.

We were young once
and lived hard,
pouring
smoking
sniffing–
1001 ways to lose your soul,
temporarily of course.

No one seeks the soulless
abyss
that waits, stalking in the ether,
haunted and haunting,
waiting for you to peer in.

For above the abyss,
above it all,
beyond where we shouldn’t go,
he sat waiting, like Orion in summer,
hunting and stalking his prey,
weakened and wounded.

What happened to him?
Where did he go,
Jack?

III.
Wake up, Jack.
Time to shine.
It’s early
but we have
places to be.

The world is too fast
and I just want
to watch, anyway.
From up here,
in this window.

Think of the possibilities
while I make coffee.
It’s good shit,
you’ll like it.

Where do I start?
Everyone is passing by,
they don’t get it,
doing what they have to
to keep the noises
at bay, if only for
long enough for that
one true thought–
it only takes one, Jack!
to get out
slip through the dreams,
and reawaken the mind of the world.

IV.
I won’t keep cleaning up your messes,
Jack.

You can’t just lay there,
stinking up the living room
with your cigarettes
and Catholicism,
waiting for the Great Beyond
to do the dishes.

I won’t tell her to go away,
Jack.

You fall in love too soon,
too hard for someone
with your delicate constitution,
always dreaming of forever
but never thinking of tomorrow.

I won’t keep pretending you’re the holy one,
Jack.

Sitting cross-legged, listening
to Aja on vinyl
and writing haikus
in the air
is not way for a holy man
to live.

I won’t do it again,
Jack.`;

// Parse into 4 sections keyed by Roman numeral. Each section has an array
// of stanzas, each stanza an array of raw lines (leading whitespace kept).
export function parseKerouac() {
  const chunks = KEROUAC_RAW.split(/^([IV]+)\.\n/m).filter(Boolean);
  const sections = [];
  for (let i = 0; i < chunks.length; i += 2) {
    const numeral = chunks[i];
    const body = chunks[i + 1] ?? '';
    const stanzas = body
      .trim()
      .split(/\n{2,}/)
      .map((block) => block.split('\n').filter((l) => l.length > 0));
    sections.push({ numeral, stanzas });
  }
  return sections;
}
