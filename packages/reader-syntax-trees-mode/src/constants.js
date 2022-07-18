export const MODE_EXPAND = 'expand';
export const MODE_COMPRESS = 'compress';

// TODO: Add keykey? 👀
const SHOW_TRANSLITERATION = 'showTransliteration';
const SHOW_LEMMA = 'showLemma';
const SHOW_RELATIONSHIP = 'showRelationship';
const SHOW_TAG = 'showTag';
const SHOW_GLOSS = 'showGloss';

export const TOGGLES = new Map([
  [SHOW_TRANSLITERATION, 'Transliteration'],
  [SHOW_LEMMA, 'Lemma'],
  [SHOW_RELATIONSHIP, 'Relationship'],
  [SHOW_TAG, 'Tag'],
  [SHOW_GLOSS, 'Gloss'],
]);
