# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 📷 Adding Images to Your Blog

This project supports two approaches for handling images:

### Static Images (Simple)
Place images in `/public/images/` and reference them directly:

```markdown
![Alt text](/images/your-image.jpg)
```

Or with HTML for more control:
```html
<img src="/images/your-image.jpg" alt="Description" width="600" height="300" loading="lazy">
```

### Optimized Images (Recommended)
Place images in `/src/assets/` and use the `OptimizedImage` component for automatic optimization:

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import myImage from '../assets/photo.jpg';
---

<OptimizedImage 
  src={myImage} 
  alt="Photo description"
  width={800}
  height={400}
/>
```

The `OptimizedImage` component provides:
- Automatic WebP format conversion
- Responsive image sizes
- Lazy loading
- Proper aspect ratios

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
