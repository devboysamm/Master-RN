# Website assets

## App screenshots (landing page gallery)

Drop your real phone screenshots here, named exactly:

- `screenshot-1.png`
- `screenshot-2.png`
- `screenshot-3.png`
- `screenshot-4.png`

**Recommended:** portrait PNG, ~1080 × 2280 px (9:19), under ~500 KB each.

Then open [`../index.html`](../index.html), find the **screenshots** section
(`<section class="shots">`), and in each `.phone` block replace the
`<div class="placeholder">…</div>` with the matching image, e.g.:

```html
<div class="phone">
  <img src="assets/screenshot-1.png" alt="Master RN — lessons screen" />
</div>
```

The grey placeholder boxes are shown until you swap in real images.
