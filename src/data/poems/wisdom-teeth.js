// Wisdom Teeth — source extracted from docx. Do not edit by hand — re-run
// scripts/extract_docx.py on the source docx and update this file if the
// author revises the poem.
//
// Conventions preserved from source:
//   ✽ marks a section header; the italic subtitle follows on the same line.
//   Parentheticals span one or more lines; rendered as marginalia.
//   Leading whitespace is significant (indented cascades).
//   Blank lines separate stanzas within a section.
//   The final "Appendix" section renders as an endnote.

export const WISDOM_TEETH_RAW = `✽ *The Gospel According to Napkin #7*
A metaphysical desperado,
chasing truth like smoke through rafters.
(as if truth were something you could catch
like a butterfly in a poem-stained net)
I watch him now across decades,
a holy fool wrapped in thrift store prophecy,
wearing enlightenment like a secondhand hat.

O, you beautiful, pretentious idiot—
with your backpack full of borrowed wisdom
and your lungs full of borrowed light—
          did you really think Nirvana lived
          at the bottom of a coffee cup
          or in the pages of some dog-eared Salinger
          you carried like a passport to profundity?

I see you there,
scribbling manifestos on coffee shop napkins,
each word an existential hiccup,
thinking you’re Kerouac reborn in Jersey
because you learned to spell satori
and could quote Ginsberg while stoned.

✽ *Acts of the Mad Prophet, Vol. I*
The mad ones found you, didn’t they?
Just like you wanted,
just like you prayed for,
never realizing “mad” meant exactly that:
not the romantic kind of crazy
that gets you into poetry anthologies,
but the real deal, the genuine article,
the kind that leaves you wondering
if your teeth are government spy devices
(and yes, that really happened:
Tuesday night, Summer 1998,
outside the gas station on Main Street in Madison—
I haven’t forgotten).

And those women—Christ, those women—
who saw right through your paper-thin philosophy,
your dime store mysticism,
your "I’m so deep I can’t even see myself” act.
I remember how you loved them
with all the selfish grace of a broken teacup
trying to hold the sea,
thinking every girl who read Anaïs Nin
was your soulmate in waiting.

✽ *Stations of the Lost Cross*
They knew, didn’t they?
Each one a prophet warning you
about the boy you were,
the man you weren’t ready to be.
Their laughter still rattles in my ribs
like loose change in dead men’s pockets.

(Remember *****, who told you
“Being deep doesn’t mean you have to drown”?
You wrote three bad poems about that,
then proved her right anyway.)

Look at you there in your spiritual mosh pit,
thinking every neuron you burned
was a sacrifice to some higher truth.

We were soldiers in a war,
eventually fought with borrowed fire,
every battle lost before it began—
generals in an army of one,
fighting for a kingdom
that existed only in our heads
(and maybe in that weird coffee shop
where they let you pay in haikus
until they realized you couldn’t count syllables).

✽ *On Enlightenment*
I want to reach across time,
grab you by your nicotine-stained collar,
shake some sense into that dharma-addled brain.
I want to tell you
that TV dinner philosophy
and midnight parking lot epiphanies
won’t add up to wisdom,
no matter how many times
you reorganize your vinyl collection
to mirror the I Ching.
But you wouldn’t listen—

✽ *Dharma & Dreadlocks*
Remember how we prayed
in the temple of Sweet Dreams?
Burning clove cigarettes like incense,
chanting Ginsberg between sips
of lukewarm enlightenment,
every barista a bodhisattva.
You wore revolution like a secondhand coat,
too big in the shoulders,
frayed at the edges with someone else’s glory,
accessorized with buttons that read
“QUESTION REALITY”
(but never questioned
why you thought wisdom came with a price tag
and cosmic consciousness could be achieved
through the right combination
of black turtlenecks and bongo drums).

✽ *Ordinary Revelations*
Jersey parking lots became Dharma halls,
every streetlight a bodhi tree,
every all-night diner a station of the cross
where you’d genuflect before jukeboxes,
praying to Bowie for redemption.

Now, years deep in the ordinary world
I look back at you—my mad prophet self—
with something between love and horror,
like finding an old yearbook photo
where you thought sideburns and corduroy
were the height of spiritual fashion.

The scars have faded from our arms,
but the map remains:
          every wrong turn taken,
          every beautiful mistake,
          every moment we thought
          transcendence could be bought
          for the price of a hit
          or a handful of pills
          (plus tax and next-day regret).

The world has changed:
the mad ones all got jobs or died,
and connection comes in gigabytes,
not shared cigarettes or stolen kisses.

But something in me still honors you,
you beautiful, desperate fool,
writing your soul across the night
in ink that would never dry,
convinced that every poem
was a lockpick for the universe.

You were wrong about so much,
but maybe you were right about this:

the sacred lives in the profane,
meaning hides in empty spaces,
and sometimes you have to break yourself completely
before you can learn how to be whole.

Sleep well, mad prophet.
Your words still echo,
your fire still burns,
but I’m glad I’m not you anymore—
glad to know that real enlightenment
tastes less like revelation
and more like morning coffee,
ordinary and warm
and somehow,
finally,
enough.

✽ *Appendix*
(P.S. - I kept your journals,
those midnight manifestos,
not because they’re good—
trust me, they’re not—
but because they remind me
how beautiful it is
to be young and certain
of absolutely everything
while knowing
absolutely nothing at all.)`;

// Parse the raw poem body into structured sections at build time.
// Each section has a subtitle, an array of stanza blocks, and a flag for
// the appendix (which renders as an endnote).
//
// A stanza is an array of "line tokens"; each token is either a plain
// string line or an object { aside: string } for a parenthetical line.
// Parentheticals that span multiple lines are represented as consecutive
// aside tokens. The render layer decides the HTML structure.
export function parseWisdomTeeth() {
  const rawSections = WISDOM_TEETH_RAW.split(/^✽ /m).filter(Boolean);
  return rawSections.map((section) => {
    const [headerLine, ...bodyLines] = section.split('\n');
    const subtitle = headerLine.replace(/^\*|\*$/g, '').trim();
    const body = bodyLines.join('\n');
    const stanzas = body.split(/\n{2,}/).map((stanzaBlock) => {
      const lines = stanzaBlock.split('\n');
      let insideParen = false;
      return lines.map((line) => {
        const trimmed = line.trimStart();
        const leadingWs = line.slice(0, line.length - trimmed.length);
        // Detect parenthetical state: any '(' starts, first ')' ends.
        const opens = (trimmed.match(/\(/g) || []).length;
        const closes = (trimmed.match(/\)/g) || []).length;
        const startsAside = trimmed.startsWith('(');
        const endsAside = /\)\.?$/.test(trimmed);
        let aside = insideParen;
        if (startsAside) aside = true;
        if (insideParen || startsAside) {
          if (opens === closes && !insideParen) {
            // self-contained single-line aside
            insideParen = false;
          } else if (endsAside && insideParen) {
            // closing line of a multi-line aside
            insideParen = false;
          } else {
            insideParen = true;
          }
          return { aside: true, text: line, leadingWs };
        }
        return { aside: false, text: line, leadingWs };
      });
    });
    const isAppendix = /appendix/i.test(subtitle);
    return { subtitle, stanzas, isAppendix };
  });
}
