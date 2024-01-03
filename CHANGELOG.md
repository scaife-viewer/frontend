# Change Log

All notable changes to this project will be documented in this file.

## Unreleased

## 0.6.2 (2024-1-3)

### Features
- `reader-syntax-trees-mode`
  - Expose fields from syntax trees collection (#80)
- `reader-widget`
  - Improve RTL display for Arabic passages (#80)
- `common`
  - Backport `URN.upTo` from `scaife-viewer/scafie-viewer` (#85)
- `widget-tocs`
  - Fetch TOCs from GraphQL / ATLAS (#85)

## 0.6.1 (2023-12-2)

### Fixes
- `vue-treant`
  - Tweak tree container styles [#84](https://github.com/scaife-viewer/frontend/pull/84)

## 0.6.0 (2023-11-18)

NOTE: Please see [Beyond Translation releases](https://github.com/scaife-viewer/beyond-translation-site/releases) for additional context / information.

Changes in the `0.6.0` release were developed to support features on [scaife.perseus.org](https://scaife.perseus.org), [Beyond Translation](https://beyond-translation.perseus.org) and [Brill's Scholarly Editions](https://scholarlyeditions.brill.com/).

### Fixes
- `common`
  - fix style collision with bootstrap in `CustomSelect` component

### Features

- `common`
  - Parse text group from URNs

- `reader-alignments-mode`
  - Add metadata / attributions to alignments
  - Improve "regrouped" alignments display

- `reader-commentaries-mode`
  - Adds a new display mode widget that highlights tokens with commentary annotations (useful for app crit or commentary annotations)

- `reader-dictionary-entries-mode`
  - Adds a new display mode widget that highlights tokens to show where their lemmas exist as headwords in one or more lexicons, as well as if a particular passage is cited within a lexicon

- `reader-grammatical-entries-mode`
  - Adds a display-mode widget that highlights tokens based based on an active grammar entry

- `reader-image-mode`
  - Updates the image mode to integrate region of interest data and integrate selections of ROIs with the Scholia widget

- `reader-interlinear-mode`
  - Adds toggles to token annotations in the interlinear display mode

- `reader-syntax-trees-mode`
  - Integrate transliteration, grammatical entries and glosses

- `reader-tei-fallback-mode`
  - Adds a "fallback" reader used to display TEI from Bellum Alexandrinum.  [CETEIcean](https://github.com/TEIC/CETEIcean) is used to display the TEI.  The content of the TEI documents are **not** made available to the `ReaderToken` components, so highlighting / selection functionality is not available.

- `vue-treant`
  - Adds pan / zoom support

- `widget-commentary`
  - Shows commentary content and integrates with `reader-commentary-mode`

- `widget-dictionary-entries`
  - Improve resolution of clicks on tokens to dictionary headwords
  - Improves formatting on entries using [CETEIcean](https://github.com/TEIC/CETEIcean)

- `widget-display-mode`
  - Filters available display modes based on annotations for a given CTS Version in ATLAS

- `widget-embed`
  - Adds a widget that generates a URL suitable for embedding the SV reader in an iframe.

- `widget-grammatical-entries`
  - Shows grammar content and integrates with `reader-grammatical-entries-mode`

- `widget-library`
  - Adds alphanumeric sorting and typeahead filtering

- `widget-metadata`
  - Add configuration options to show the editor and data repository for a given CTS Version (implemented to credit the Digital Latin Library for [Bellum Alexandrinum](https://catalog.digitallatin.org/dll-work/w4394))

- `widget-morphology`
  - Backport of the Morphology widget from scaife.perseus.org

- `widget-passage-lemma-traversal`
  - Adds a widget that shows other instances of a given lemma within a CTS Version

- `widget-reader-sv1`
  - Backport the `CompiledToken` component from scaife.perseus.org

- `widget-reader`
  - Refactor whitespace handling using `spaceAfter` attr (allows for non-whitespace tokenization)
  - Integration with `widget-scholia` and `widget-grammatical-entries`

- `widget-scholia`
  - Improved interoperability with `reader-image-mode`
  - Adds a legend to highlight scholia by kind

- `widget-toc`
  - Fix issues from port from scaife-widgets

- `widget-token-annotations`
  - Backport of WidgetTokenList from scaife.perseus.org

## 0.5.0-beta (2021-11-16)

### Fixes
- `entity-map`
  - Fixes an issue with coordinates X / Y values being flipped

### Features

- `reader-aligments-mode`
  - adds a configuration option to highlight unaligned tokens
  - add a new "regrouped" token display mode (for Hafez)
- `reader-syntax-trees-mode`
  - adds toggles to show / hide word attributes
  - improves layout of sentences
  - show metadata / attributions
- `widget-named-entities`
  - adds attributions support
- `widget-reader`
  - adds a configuration option to set RTL languages and CSS variable for Amiri font


## 0.4.1 (2021-03-29)

### Fixes
- Force dep updates for widgets introduced in v0.3.0 and v0.4.0

## 0.4.0 (2021-03-29)

### Features
- Add [Dictionary Entries Widget](packages/widget-dictionary-entries)

### Fixes
- Fix fallback value for `--sv-widget-repo-metadata-sha-font-family`

## 0.3.0 (2021-03-27)

### Features

- Add an [Attributions Widget](/packages/widget-attributions)
- Add [Passage Citation Table of Contents Widget](packages/widget-passage-citation-toc)
- Add [Repo Metadata Widget](packages/widget-repo-metadata)

## 0.2.0 (2020-11-11)

### Features
- Switch to unified package versioning.  All `@scaife-viewer` packages now share a unified version number.
- Add CHANGELOG.md to track changes

## Previous Releases
View Pull Requests from previous releases [here](https://github.com/scaife-viewer/frontend/pulls?q=is%3Apr+is%3Aclosed+created%3A%3C2020-11-11)
