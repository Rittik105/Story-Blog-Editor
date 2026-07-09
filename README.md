# Story Engine

A small React app for building and viewing "story" blogs from a simple JSON schema — rows made of columns, each column a Header, Text block, Still image, or Sliding image.

It has two modes, chosen from a landing menu:

- **Create a story** — a visual editor for building a story row by row and saving it as a `.json` file.
- **Upload a story** — upload an existing story `.json` file and view it rendered as a blog.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes npm)

Check your version:

```bash
node -v
```

## Setup

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This installs React, Vite, and `lucide-react` (the icon set used throughout the app).

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the local URL Vite prints in your terminal — usually:

   ```
   http://localhost:5173
   ```

That's it — no environment variables, backend, or API keys required. Everything runs client-side in the browser.

## Building for production

```bash
npm run build
```

This outputs a static build to `dist/`. Preview it locally with:

```bash
npm run preview
```

The `dist/` folder can be deployed to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

## Project structure

```
src/
  main.jsx            # Landing menu — routes between the editor and the uploader
  StoryJsonEditor.jsx # "Create a story" — visual editor, preview, and JSON export
  StoryBlogApp.jsx    # "Upload a story" — JSON upload and blog renderer
```

## Using the app

### Create a story

1. From the landing menu, choose **Create a story**.
2. Click **Add row** to start a new row.
3. Inside a row, click **Add component**, pick a type, and fill in its content:
   - **Header** — title and subtitle text
   - **Text** — one or more paragraphs (leave a blank line between paragraphs)
   - **Still image** — a single image URL
   - **Sliding image** — one or more image URLs, with a button to add more
4. Set the **order** and **width %** for each component, then save it.
5. Reorder or delete rows and components at any time using the arrow, edit, and delete icons.
6. Click **Preview** to open the rendered blog in a new tab.
7. Click **Save JSON** to download the story as a `.json` file.

### Upload a story

1. From the landing menu, choose **Upload a story**.
2. Click **Choose JSON file** and select a story `.json` file (one produced by the editor, or hand-written to match the schema below).
3. The story renders immediately as a blog. Use **Load a different file** to switch to another one.

## JSON schema

```json
{
  "story": {
    "rows": [
      {
        "row_order": 1,
        "columns": [
          {
            "column_order": 1,
            "columnType": "Header",
            "column_width_percentage": 100,
            "column_content": "<h1>Title</h1><br><h2>Subtitle</h2>"
          }
        ]
      },
      {
        "row_order": 2,
        "columns": [
          {
            "column_order": 1,
            "columnType": "still_image",
            "column_width_percentage": 40,
            "image_path": "https://example.com/photo.jpg"
          },
          {
            "column_order": 2,
            "columnType": "text",
            "column_width_percentage": 60,
            "column_content": "<p>Some paragraph text.</p>"
          }
        ]
      },
      {
        "row_order": 3,
        "columns": [
          {
            "column_order": 1,
            "columnType": "sliding_image",
            "column_width_percentage": 100,
            "images": [
              "https://example.com/1.jpg",
              "https://example.com/2.jpg"
            ]
          }
        ]
      }
    ]
  }
}
```

Notes:

- `row_order` and `column_order` control display order; rows stack vertically, columns sit side by side within a row (stacking on narrow screens).
- `column_width_percentage` sets how much horizontal space a column takes within its row.
- Unrecognized `columnType` values render as a visible placeholder rather than breaking the page.
- Broken image URLs fall back to a placeholder instead of a broken-image icon.

## Troubleshooting

- **Preview tab doesn't open** — your browser may be blocking popups for this page. Allow popups and click **Preview** again.
- **`npm install` fails** — confirm you're on Node 18+ (`node -v`) and try deleting `node_modules` and `package-lock.json` before reinstalling.
- **Images don't load in the rendered blog** — check that the image URLs are publicly accessible and support being loaded from a browser (no auth-gated links).
