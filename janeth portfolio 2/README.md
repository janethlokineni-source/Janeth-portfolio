# JANETH. — Personal Portfolio
## "The Red Room — Digital Universe"

A premium, dark-themed personal portfolio for **Lokineni Sai Sri Janeth** — B.Tech student, web developer, and story writer. Built with pure HTML5, CSS3, and Vanilla JavaScript.

---

## 📁 Project Structure

```
janeth portfolio 2/
│
├── index.html          ← Main HTML structure
├── style.css           ← All styling, animations, responsive layout
├── script.js           ← All interactions and behavior
├── README.md           ← This file
│
└── assets/
    └── janeth-figurine.png   ← ⚠️ PLACE YOUR FIGURINE IMAGE HERE
```

---

## 🚀 How to Run Locally

1. **Copy your figurine image** into the `assets/` folder and name it `janeth-figurine.png`
   - Alternatively, update the `src` path in `index.html` (search for `assets/janeth-figurine.png`)

2. **Open `index.html`** directly in a browser — no build step required.
   - Double-click the file in File Explorer, OR
   - Drag it into Chrome / Edge / Firefox

3. **Optional — local dev server** (eliminates any browser CORS quirks):
   ```
   # If you have VS Code, install the "Live Server" extension and click "Go Live"
   # OR if you have Python:
   python -m http.server 8080
   # Then visit http://localhost:8080
   ```

---

## 🖼️ Replacing the Figurine Image

1. Place your image at: `assets/janeth-figurine.png`
2. For best results: use a PNG with a transparent background, portrait orientation
3. If you use a different filename, update line ~165 in `index.html`:
   ```html
   <img src="assets/YOUR-IMAGE-NAME.png" ... />
   ```
4. The image uses `object-fit: contain` — it will not be cropped or stretched.

---

## 🔗 Adding Real URLs (GitHub, LinkedIn, Projects, Certificate)

Search `index.html` for comment blocks like:

### GitHub Profile
```html
<!-- Add GitHub link below when available -->
<!-- <a href="YOUR_GITHUB_URL" ... > -->
```
Remove the `<!-- -->` comment tags and replace `YOUR_GITHUB_URL`.

### LinkedIn Profile
```html
<!-- LinkedIn placeholder — add URL when available -->
<!-- <a href="YOUR_LINKEDIN_URL" ... > -->
```

### Project Demo / Repository URLs
In each project card modal (`#modal-epic-think`, `#modal-brandshield`, `#modal-hostel-care`):
```html
<!-- Add project link below when available -->
<!-- <a href="YOUR_PROJECT_URL" class="btn btn--primary" ...>View Live Project</a> -->
```

### Microsoft Certificate
In `#recognition` section:
```html
<!-- <a href="YOUR_CERTIFICATE_URL" class="btn btn--ghost cert__btn" ...>View Certificate</a> -->
```
Remove the comment tags and add the file path or hosted URL.

---

## 🎨 Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-main` | `#080809` | Page background |
| `--bg-secondary` | `#111114` | Section backgrounds |
| `--bg-elevated` | `#17171C` | Cards, elevated elements |
| `--accent` | `#F02D3A` | Primary red — key actions, highlights |
| `--accent-hover` | `#FF5260` | Hover state red |
| `--text-primary` | `#F5F5F7` | Headlines, important text |
| `--text-secondary` | `#A5A5AF` | Body copy, descriptions |
| `--border` | `rgba(255,255,255,0.10)` | Subtle borders |
| `--font-display` | `Outfit` | Headlines, wordmark |
| `--font-body` | `Inter` | Body copy, descriptions |
| `--font-mono` | `JetBrains Mono` | Labels, code, metadata |

---

## ✏️ Adding Story Writing Content

In the `#writing` section, replace the placeholder with real story excerpts:
```html
<p class="writing__story-text">
  "Your story excerpt here..."
</p>
```
Add more story cards by duplicating `.writing__story-preview` blocks.

---

## 📱 Responsive Breakpoints

| Width | Layout |
|-------|--------|
| 1440px | Full asymmetric desktop layout |
| 1024px | Stacked hero, single-column about |
| 768px | Mobile nav, single-column grids |
| 375px | Compact mobile — all buttons full-width |

---

## ♿ Accessibility Notes

- All interactive elements have visible focus states (red outline)
- Modals trap focus and close with `Escape`
- Images have meaningful `alt` text
- Form fields have labels and ARIA error descriptions
- Animations respect `prefers-reduced-motion`
- Semantic HTML landmarks throughout (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Figurine image not showing | Check the file is at `assets/janeth-figurine.png` (exact name) |
| Fonts not loading | Ensure you have an internet connection (Google Fonts) |
| Parallax not working | Works only with mouse on desktop; touch/gyro auto-fallback on mobile |
| Contact form not sending | The form uses `mailto:` — your system email client must be configured |
| Animations not playing | Check browser console for errors; try a different browser |

---

*Built with HTML · CSS · JavaScript — no frameworks required.*
