#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple SVG icon generator
function generateIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1976d2"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">HW</text>
</svg>`;
}

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
sizes.forEach(size => {
  const svgContent = generateIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svgContent);
  // eslint-disable-next-line no-console
  console.log(`Generated ${filename}`);
});

// Create a simple PNG placeholder (base64 encoded 1x1 transparent pixel)
// eslint-disable-next-line no-unused-vars
const pngPlaceholder = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);

  // For now, we'll create a simple text file as placeholder
  // In a real project, you'd use a proper image generation library
  fs.writeFileSync(
    filepath,
    `Placeholder icon ${size}x${size}. Replace with actual PNG icon.`
  );
  // eslint-disable-next-line no-console
  console.log(`Generated placeholder ${filename}`);
});

// eslint-disable-next-line no-console
console.log('Icon generation complete!');
// eslint-disable-next-line no-console
console.log(
  'Note: Replace the placeholder files with actual PNG icons for production.'
);
