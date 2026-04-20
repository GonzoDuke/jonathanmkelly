// Metrolined — source extracted verbatim from
// Source Material/poems/Metrolined (1999).docx.
//
// Multi-stanza structure; leading whitespace on "(Does he have / a name..."
// preserved via white-space: pre-wrap. The final stanza ("And this is the
// wild sea...") is split out so an IntersectionObserver can stop the
// drifting cabin lights when the train arrives.

export const METROLINED_STANZAS = [
  [
    'Feebled old blues dig—',
    'and we all hear the',
    'clickety-clack of some',
    'offland time. Hell, it’s too long,',
    'the whole rolling',
    'and up and down, it’s all fast.',
  ],
  [
    'And yet,',
    'here in Aberdeen,',
    'the churches are all the same,',
    '& so are the women and men—',
    'lowly, I,',
    'stand—WAIT—sit on',
    'an NYC bound train,',
    'no better or worse because',
    'of the reckless abandon',
    'in the realms of last night.',
  ],
  [
    'Fled now,',
    'or fleeing at least',
    '(as we speak, further away)',
    'from the world at last.',
  ],
  [
    'Not the last stop,',
    'but the attainable',
    'is now closer than I thought—',
    'Buddha is becoming',
    'ENLIGHTENED!',
  ],
  [
    'And the sing-songs',
    'of all enlightened thought can’t help me—',
    'I saw him:',
    'shot! and then fell',
    'dead! there in front of my own eyes.',
  ],
  [
    'Marathon up—',
    'too crazy to follow',
    'that tango downtown:',
    'head up then,',
    'I’ve followed the path',
    'this far—',
    'just as well should finish it now.',
  ],
  [
    'But if I’d thought of it all,',
    'done again,',
    'that guy (dead) wouldn’t have died',
    'if we (I) wasn’t there…',
    'no one understands.',
  ],
  [
    'Now, and seldom again ever,',
    'I have to write this travel—',
    'Art : Life ratio must be equal,',
    'no matter of the numbers',
    'because they’re only digits,',
    'dig it?',
  ],
  [
    'No worries.',
    'All is well,',
    'and if not now,',
    'soon.',
  ],
  [
    'This eternal train ride,',
    'forever entrenched in a shroud',
    'of mystery now,',
    'is too long.',
    'My stomach burns,',
    'for what,',
    'I don’t know.',
  ],
  [
    'Everything is blue',
    'not sad,',
    'just blue.',
  ],
  [
    'No one’s sad,',
    'there’s no reason for it—',
    'Newark, Delaware is just too happy…',
    'but I don’t know why.',
  ],
  [
    'I don’t think',
    'we’re not in DC, or Jersey for',
    'that matter—',
    'Wilmington, Delaware',
    'no place,',
    'no location,',
    'only name.',
  ],
  [
    '(Does he have',
    ' a name',
    'or does he live somewhere',
    'other than here?',
    'Does he know',
    'there is nothing?',
    'Not now I add regretfully.)',
  ],
  [
    'The train tracks',
    'of this town',
    'are old and rusty',
    'iron ore, and all dug up',
    'from somewhere west of Philly,',
    'and north,',
    'right?',
  ],
  [
    'Because at this point',
    'there is no point, or,',
    'I haven’t found it yet.',
  ],
  [
    'So I could find it yet,',
    'on the shores of the land at hand.',
  ],
];

export const METROLINED_FINAL = [
  'And this is the wild sea,',
  'on land, this transport—',
  'so how could it be,',
  'no revelations',
  'while in DC?',
];

export function parseMetrolined() {
  return { stanzas: METROLINED_STANZAS, final: METROLINED_FINAL };
}
