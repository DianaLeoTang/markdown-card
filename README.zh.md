[English](./README.md) | [中文](./README.zh.md)

# Markdown 知识卡片 

一款现代化Web应用，可将Markdown转换为精美的知识卡片和社交媒体图片

## 功能特性

- 将Markdown转换为视觉精美的知识卡片
- 多种主题可选（浅色/深色/多彩/极简/社交媒体/渐变/终端风格）
- 自定义卡片外观（宽度/高度/圆角/边框）
- 支持导出为PNG/JPEG/SVG格式
- 支持Frontmatter元数据（标题/描述/标签/日期）
- 响应式设计

## 技术栈

- Next.js 15
- React
- Tailwind CSS
- Shadcn UI
- TypeScript
- Bun

## 快速开始

本地运行项目：

```bash
# 克隆仓库
git clone https://github.com/DianaLeoTang/markdown-card.git
cd markdown-card
```

```bash
# 安装依赖（任选一个命令执行）
bun install
yarn install
npm install
pnpm install
```

```bash
# 启动开发服务器（任选一个命令执行）
bun run dev
yarn dev
npm run dev
pnpm run dev
```

## 使用指南

1. 在编辑器面板输入Markdown内容
2. 使用Frontmatter添加元数据（标题/描述/标签/日期）
3. 通过选项面板自定义卡片外观
4. 切换到预览标签查看渲染效果
5. 导出为PNG/JPEG/SVG格式

### Frontmatter格式

```markdown
---
title: 卡片标题
description: 卡片描述
tags: markdown, 知识卡片, 社交媒体
date: 2025-03-19
image: https://example.com/your-image.jpg
---

# 您的Markdown内容
```

## 开源协议

MIT
