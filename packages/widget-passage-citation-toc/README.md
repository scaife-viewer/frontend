# widget-passage-citation-toc

A widget that shows the highest citable nodes for the current passage.

## Configuration options

`$scaife.config.citationSchemeMap`:

Maps `PassageTextPart.kind` as returned from ATLAS to a human-friendly label.

e.g.

```
# default
book --> Book List

# with map
citationSchemeMap: {
    book: 'Books'
}
book --> Books
```
