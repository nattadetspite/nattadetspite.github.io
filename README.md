# nattadet.dev — personal landing page

Static personal landing page and selected-work portfolio.
No build step, no dependencies — plain HTML, CSS and JavaScript.

## Structure

```
index.html          Markup and copy
css/styles.css      Tokens, aurora background, layout
js/data.js          Work items + rotating job titles (edit content here)
js/main.js          Card rendering, video playback, title rotator
assets/video/       Project preview clips (11 files, ~11 MB)
.nojekyll           Stops GitHub Pages running content through Jekyll
```

## Editing content

- **Projects** — `js/data.js`, the `workData` array. Order there is the order on the page.
- **Bio, links, location** — `index.html`, inside `<header class="hero">`.
- **Colors and spacing** — the `:root` block at the top of `css/styles.css`.

## Running locally

Any static server works:

```bash
npx serve -l 4321 .
```

## Notes on implementation

- **Aurora background** uses fixed, blurred gradient blobs animated with
  `transform` only. It deliberately avoids `backdrop-filter` on scrolling
  elements, which causes visible stutter on mid-range devices.
- **Video thumbnails** come from the `#t=0.1` media fragment, which makes the
  browser seek to the first frame and render it. No poster images to generate
  or keep in sync.
- **Playback** is on hover for pointer devices and via `IntersectionObserver`
  on touch, so eleven clips never decode at once.
- **Paths are relative**, so the site works both at a domain root and under a
  GitHub Pages project path (`user.github.io/repo/`).
- `prefers-reduced-motion` disables the aurora drift, the title rotator and
  card transitions.

## Deploying to GitHub Pages

Push to GitHub, then in **Settings → Pages** set the source to the `main`
branch, root folder. To serve at `nattadetspite.github.io` rather than
`nattadetspite.github.io/profile/`, name the repository
`nattadetspite.github.io`.
