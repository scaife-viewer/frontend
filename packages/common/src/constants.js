// TODO: Determine if we need to decouple these constants further
import {
  SHOW_TRANSLITERATION,
  SHOW_LEMMA,
  SHOW_RELATIONSHIP,
  SHOW_MORPH_TAG,
  SHOW_GRAMMATICAL_TAGS,
  SHOW_GLOSS,
} from '@scaife-viewer/store';

// eslint-disable-next-line import/prefer-default-export
export const TOKEN_ANNOTATION_TOGGLES = new Map([
  [SHOW_TRANSLITERATION, 'Transliteration'],
  [SHOW_LEMMA, 'Lemma'],
  [SHOW_RELATIONSHIP, 'Relationship'],
  [SHOW_MORPH_TAG, 'Morph. Tag'],
  [SHOW_GRAMMATICAL_TAGS, 'Gram. Tags'],
  [SHOW_GLOSS, 'Gloss'],
]);

export const SCHOLIA_KIND_MAIN = 'scholia-kind-main';
export const SCHOLIA_KIND_EXTERIOR = 'scholia-kind-exterior';
export const SCHOLIA_KIND_INTERLINEAR = 'scholia-kind-interlinear';
export const SCHOLIA_KIND_INTERMARGINAL = 'scholia-kind-intermarginal';
export const SCHOLIA_KIND_INTERIOR = 'scholia-kind-interior';
export const SCHOLIA_KIND_MISC = 'scholia-kind-misc';
export const SCHOLIA_KIND_CHOICES = new Map([
  [SCHOLIA_KIND_MAIN, 'Main'],
  [SCHOLIA_KIND_EXTERIOR, 'Exterior'],
  [SCHOLIA_KIND_INTERLINEAR, 'Interlinear'],
  [SCHOLIA_KIND_INTERMARGINAL, 'Intermarginal'],
  [SCHOLIA_KIND_INTERIOR, 'Interior'],
  [SCHOLIA_KIND_MISC, 'Miscellaneous'],
])

export const SCHOLIA_URN_MAIN = 'urn:cts:greekLit:tlg5026.msA.hmt:';
export const SCHOLIA_URN_EXTERIOR = 'urn:cts:greekLit:tlg5026.msAext.hmt:';
export const SCHOLIA_URN_INTERLINEAR = 'urn:cts:greekLit:tlg5026.msAil.hmt:';
export const SCHOLIA_URN_INTERMARGINAL = 'urn:cts:greekLit:tlg5026.msAim.hmt:';
export const SCHOLIA_URN_INTERIOR = 'urn:cts:greekLit:tlg5026.msAint.hmt:';
