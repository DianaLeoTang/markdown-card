[English](./README.md) | [中文](./README.zh.md)

# Markdown Card 

A modern web application that converts Markdown to beautiful knowledge cards and social media images.

## Features

- Convert Markdown to visually appealing cards
- Multiple theme options (light, dark, colorful, minimal, social, gradient variants, and terminal)
- Customize card appearance (width, height, rounded corners, border)
- Export cards as PNG, JPEG, or SVG
- Frontmatter support for titles, descriptions, tags, and dates
- Responsive design

## Technologies Used

- Next.js 15
- React
- Tailwind CSS
- Shadcn UI
- TypeScript
- Bun

## Getting Started

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/DianaLeoTang/markdown-card.git
cd markdown-card
```
```bash
# Install dependencies选一个命令执行即可
bun install
yarn install
npm install
pnpm install
```

```bash
# Start development server选一个命令执行即可
bun run dev
yarn dev
npm run dev
pnpm run dev
```

## Usage

1. Enter your Markdown content in the editor panel
2. Use frontmatter for additional metadata (title, description, tags, date)
3. Customize the card appearance using the options panel
4. Switch to the preview tab to see the rendered card
5. Export the card as PNG, JPEG, or SVG

### Frontmatter Format

```markdown
---
title: Your Card Title
description: A brief description of your card
tags: markdown, cards, social
date: 2025-03-19
image: https://example.com/your-image.jpg
---

# Your Markdown Content
```

## License

MIT
