// TODO: Determine if we need to decouple these constants further
import {
  SHOW_TRANSLITERATION,
  SHOW_LEMMA,
  SHOW_RELATIONSHIP,
  SHOW_TAG,
  SHOW_GLOSS,
} from '@scaife-viewer/store';

// eslint-disable-next-line import/prefer-default-export
export const TOKEN_ANNOTATION_TOGGLES = new Map([
  [SHOW_TRANSLITERATION, 'Transliteration'],
  [SHOW_LEMMA, 'Lemma'],
  [SHOW_RELATIONSHIP, 'Relationship'],
  [SHOW_TAG, 'Tag'],
  [SHOW_GLOSS, 'Gloss'],
]);