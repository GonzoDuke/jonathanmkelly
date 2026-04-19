// Briefcase Full of Rainbows — source extracted verbatim from
// Source Material/poems/Briefcase Full of Rainbows (2023).docx.

export const BRIEFCASE_RAW = `they called him Briefcase Mike
but it was an accordion folder—
details lost in the shorthand of drunks
who loved their labels
almost as much as their next fix.

he was older—old-old—
like, Woodstock-old
like, probably-dropped-acid-with-Joplin-old;
but in that church gymnasium
he was just another sorry sap
clutching the big book
like a drowning man with a broken oar.

and one day, between nicotine-stained wisdom
and coffee that could melt steel,
he said,

“having an attitude of gratitude is not just a platitude.”

somewhere, someone said it first,
but he made it stick—
buried it deep
in the marrow of my lost-boy bones.

because I didn’t want to be grateful.
I didn’t want to be there at all.
not in the folding chair hell
of 12-step suburbia—
affluent wreckage
dressed in button-down regret.

but Mike was there.
Mike, who became Rainbow Man,
who abandoned briefcases and folders
for Vermont ski slopes
and psychedelic hues,
Mike, who knew things
I couldn’t know yet—
things that lived past the slogans,
past the step work,
past the confessions made
to busted vending machines
in a shitty church basement.

Mike, who knew that gratitude
wasn’t some bullshit Hallmark moment—
but something you breathed,
something you did.

and now, years later,
I see it—
not in the steps,
not in the slogans,
but in the faces—
drunks, addicts, thieves,
hustlers and nobodies,
baring their goddamn souls
under fluorescent lights
just to keep the wheels from coming off.

I never became grateful for AA,
but I became grateful for them.
for him.
for the souls who showed up,
again and again,
for some cocky, half-sober kid
who thought he knew everything.

so here’s to you, Mike—
the Briefcase, the Rainbow,
the man who gave me a line
I can’t shake,
no matter how hard I try.

an attitude of gratitude is not just a platitude.

and goddamn it,
you were right.`;

// First-line markers for stanzas that carry special treatment.
const MANTRA_FIRST = '“having an attitude of gratitude is not just a platitude.”';
const MANTRA_LAST  = 'an attitude of gratitude is not just a platitude.';
const MIKE_LINE    = 'Mike, who became Rainbow Man,';

export function parseBriefcase() {
  return BRIEFCASE_RAW.split(/\n{2,}/).map((block) => {
    const lines = block.split('\n').filter((l) => l.length > 0);
    const first = lines[0] ?? '';
    let role = null;
    if (first === MANTRA_FIRST) role = 'mantra-first';
    else if (first === MANTRA_LAST) role = 'mantra-last';
    return { lines, role, hasMike: lines.includes(MIKE_LINE), mikeLine: MIKE_LINE };
  });
}
