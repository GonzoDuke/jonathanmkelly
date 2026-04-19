// Brake Check This, Motherfucker — source extracted verbatim from
// Source Material/poems/Brake Check This, Motherfucker (2025).docx.
//
// Re-run scripts/extract_docx.py if the author revises the poem. Strip the
// title/year line at the top and the Word zero-width-space (U+200B)
// stanza-prefix characters before pasting in.

export const BRAKE_CHECK_RAW = `When I left the house this morning,
I had hope.
I had purpose.
I had a plan.

And then a Tesla driver
decided we all needed
to slow down—
tires barely spinning,
speed limit signs
laughing in disbelief.

You.
You are the target of my rage.
Feel my righteous indignation.
Understand:
you are the problem.

Society suffers
when you get behind the wheel.

Stay the fuck out of this stanza.
This is for people
who want to move forward.

But oh, you don’t just drive slow.
No, no—
that would be human,
forgivable.

You brake for shadows.
You swerve for leaves.
You tap the brakes at green lights
as if time needs buffering
before you dare to continue.

I watch from behind—
hands tightening,
pulse pounding
like a countdown to detonation.

And I wonder:
What went wrong in your life?
Who hurt you?
Do you feel joy?
Have you ever arrived on time?

And then—
you pull into the left lane.

The left lane.

As if you're entitled
to the space where dreams are chased,
where destinies are met.

You are the dream killer.
The destiny thief.
A sentient roadblock.
A moving violation
against progress itself.

And yet—
in the simmering rage,
a thought creeps in:

What if you're right?
What if I’m the problem?
What if I need
to slow down,
to breathe,
to stop chasing time
like it owes me something?

Maybe you are my lesson.
Maybe I should—

No.
Fuck that.

Move.

I lay on the horn
like a battle cry.
You flinch.
You speed up.

Hope is restored.

Then—
red light.

We meet again.
I exhale through gritted teeth.

You stare straight ahead,
pretending not to feel
the weight of my glare.

Light turns green.
You hesitate.

I do not.

I launch forward,
peeling away,
leaving you
and your slow, hesitant existence
in the dust.

A victory,
small but necessary.`;

// First-line markers for stanzas that get special treatment on the page.
const CALLOUT = 'Stay the fuck out of this stanza.';
const DESATURATE = "What if you're right?";
const RESATURATE = 'No.';

export function parseBrakeCheck() {
  return BRAKE_CHECK_RAW.split(/\n{2,}/).map((block) => {
    const lines = block.split('\n').filter((l) => l.length > 0);
    const first = lines[0] ?? '';
    let role = null;
    if (first === CALLOUT) role = 'callout';
    else if (first === DESATURATE) role = 'desaturate';
    else if (first === RESATURATE) role = 'resaturate';
    return { lines, role };
  });
}
