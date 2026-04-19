// And the Living is Easy — source extracted verbatim from
// Source Material/poems/And the Living is Easy (2015).docx.
//
// The "bounding from / rock       to       rock" stanza uses significant
// whitespace. Preserve exactly; the page renders with white-space: pre-wrap.
// Summit stanzas ("I can see it", "I have arrived.") are flagged so the
// elevation-gain effect can anchor them near the top of their viewport.

export const LIVING_RAW = `A boardwalk
provides my passage
over the swampy grassland.

I walk forward,
slightly elevated,
seeing a Seussian tree
in the distance.

Ahead of me
is a bridge.
I will cross it when I get to it.

Mindlessly I walk.
I’m lost in thought again.

The rigid geometry of the bridge
rebels
against the placid abstractness
of the nature around it.
Something about the intersecting lines
draws me in and I stop.

Walking under a canopy of arched trees,
it’s like a tunnel drawing me closer.
I know not what awaits me further along the trail:
too many twists and turns remain
before my destination.

There are snakes here apparently.
The warning sign is a moment too late.
I jump back and he slithers off.
We both go about our days,
unchanged by our encounter.

The mountain appears,
seemingly out of nowhere.
I can see it over the railroad crossing.
It’s taller than I expected.

The sun is shining down on me
as I break through the canopy
into another clearing.
I’m getting closer to the bottom now.

Naked trees stand over
a disordered & leaf-strewn forest floor.
The trail cuts cleanly through it,
only subtly breaking
the muted grey-brown palette
left behind when autumn faded.

I reach a small stream.
Life abounds here.
I stop & look & feel,
absorbing it all.

I walk up the hill,
rocks cover everything.
I climb over them—
            bounding from
rock       to       rock
with a childlike playfulness.

I stop and look out,
the view is amazing.

I’m nearing the top now,
almost there.
The light becomes brighter,
the heat pushes against me.
I can’t stop now,
not even for a break.
I can see it.

There’s one more small climb
and a little turn before the top.

I see
a graffiti-covered mailbox
nailed to a tree,
letting me know
I can stop and rest now.

I have arrived.`;

export function parseLiving() {
  const stanzas = LIVING_RAW.split(/\n{2,}/).map((block) => {
    const lines = block.split('\n');
    const firstLine = lines[0] ?? '';
    const lastLine = lines[lines.length - 1] ?? '';
    const isSummit = firstLine === 'I have arrived.' || lastLine === 'I have arrived.';
    return { lines, isSummit };
  });
  return stanzas;
}
