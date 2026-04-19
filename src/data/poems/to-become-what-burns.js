// To Become What Burns — source extracted verbatim from
// Source Material/poems/To Become What Burns (2025).docx.
//
// Strip the title/year header and Word U+200B zero-width-space prefixes
// before pasting a refreshed extraction in.

export const BURNS_RAW = `It began as a hunger,
and when it became a god,
I dove deep into the abyss.
Into collapse. Into the hollow.
Into Nothing.

And when I crawled out,
I bore fire in my bones.

Not warmth—
flame.
Not healing—
heat.

The kind that sears what’s false
and leaves only scars in the ash.

Fire was mercy against silence.
Against silence, always.`;

export function parseBurns() {
  const stanzas = BURNS_RAW.split(/\n{2,}/).map((block, idx, arr) => {
    const lines = block.split('\n').filter((l) => l.length > 0);
    const isFinal = idx === arr.length - 1;
    return { lines, isFinal };
  });
  return stanzas;
}
