# Change Log

All notable changes to this project will be documented in this file.

## Unreleased

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
