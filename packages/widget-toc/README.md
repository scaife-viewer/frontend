# `widget-toc`

The tables of contents (TOC) widget displays TOC entries.

Each entry has a label and a URI.

The URI can resolve to:

- Another TOC (e.g., a list of lists)
- The URN of a CTS passage

Possible implementations include:
- Browse folios from the Venetus A using the canonical book / line references (e.g. [urn:cite:scaife-viewer:toc.iliad-folio-ref-root](https://github.com/scaife-viewer/beyond-translation-site/blob/main/backend/data/tocs/toc.demo-root.json))
- Browse CTS versions using card / para milestones extracted from TEI XML (e.g. [PerseusDL](https://github.com/scaife-viewer/beyond-translation-site/tree/feature/antigone-toc/backend/data/annotations/tocs/PerseusDL))
- Navigate between a commentary and edition in differing text groups (e.g. [Eustathius’ Commentary on the Odyssey](https://scholarlyeditions.brill.com/eooc/) and [Odyssey](https://beyond-translation.perseus.org/reader/urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.1-1.10))
