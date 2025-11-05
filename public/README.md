---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: Documentation for static assets in the Vulnerable Node application
last_changed: 2025-11-05
---

# Public Assets

This directory contains static files served directly to clients without processing. These assets include stylesheets, client-side JavaScript, images, and fonts.

## Directory Structure

```
public/
├── css/              # Stylesheets
│   └── *.css        # Bootstrap and custom styles
├── js/               # Client-side JavaScript
│   ├── jquery.js    # jQuery library
│   ├── bootstrap.js # Bootstrap framework
│   └── freewall.js  # Masonry layout library
├── images/           # Product and UI images
│   └── product_*.jpg # Product catalog images
└── fonts/            # Web fonts
    └── *.woff       # Font files for Bootstrap
```

## CSS Directory

Contains stylesheets for the application UI:

- **bootstrap.css** - Bootstrap CSS framework for responsive layout
- **bootstrap.min.css** - Minified version for production
- **Custom styles** - Application-specific styling

## JavaScript Directory

Client-side JavaScript libraries and scripts:

### jquery.js
- **Purpose:** DOM manipulation and AJAX functionality
- **Version:** Check file for specific version
- **Usage:** Required by Bootstrap and custom scripts

### bootstrap.js / bootstrap.min.js
- **Purpose:** Bootstrap framework components (modals, dropdowns, etc.)
- **Dependencies:** jQuery
- **Usage:** Provides interactive UI components

### freewall.js
- **Purpose:** Masonry-style grid layout for product display
- **Usage:** Creates responsive product grid on catalog pages

## Images Directory

Product images and UI assets:

- **product_1.jpg through product_8.jpg** - Product catalog images
- Images correspond to products defined in `dummy.js`
- Used in product listings, details, and purchase history

## Fonts Directory

Web fonts for consistent typography:

- **Bootstrap Glyphicons** - Icon fonts included with Bootstrap
- **Format:** WOFF, WOFF2, TTF, EOT for browser compatibility

## Static File Serving

Static files are served via Express middleware:

```javascript
// In app.js
app.use(express.static(path.join(__dirname, 'public')));
```

**URL Mapping:**
```
public/css/bootstrap.css    →  http://localhost:3000/css/bootstrap.css
public/js/jquery.js         →  http://localhost:3000/js/jquery.js
public/images/product_1.jpg →  http://localhost:3000/images/product_1.jpg
```

## Security Considerations

> [!NOTE]
> While this directory contains mostly benign static assets, keep these security considerations in mind:

### Potential Issues

1. **Outdated Libraries** - jQuery and Bootstrap versions may have known vulnerabilities
2. **No Integrity Checks** - Files served without Subresource Integrity (SRI) validation
3. **No CSP Headers** - Content Security Policy not enforced
4. **Directory Listing** - Ensure directory browsing is disabled

### Safe Practices (Not Implemented)

```javascript
// Use SRI for external libraries
<script src="/js/jquery.js" 
        integrity="sha384-..." 
        crossorigin="anonymous"></script>

// Implement Content Security Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"]
    }
}));
```

## Adding New Assets

When adding new static assets:

1. **Place in appropriate subdirectory** (css/, js/, images/, fonts/)
2. **Use descriptive filenames** (e.g., `login-page-styles.css`)
3. **Optimize files** - Minify CSS/JS, compress images
4. **Update documentation** - Document new assets and their purpose
5. **Check licenses** - Ensure third-party assets are properly licensed

## Performance Optimization

> [!TIP]
> For production deployments (not this vulnerable demo), consider:

- **CDN delivery** - Serve static assets from CDN
- **Compression** - Enable gzip/brotli compression
- **Caching headers** - Set appropriate Cache-Control headers
- **Minification** - Minify CSS and JavaScript
- **Image optimization** - Compress images without quality loss

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md) - Application architecture
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

---

> [!NOTE]
> This directory is served directly to clients and should only contain publicly accessible files.
