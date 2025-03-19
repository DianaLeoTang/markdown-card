/*
 * @Author: Diana Tang
 * @Date: 2025-03-19 13:09:58
 * @LastEditors: Diana Tang
 * @Description: some descriptio
 * @FilePath: /markdown-card/src/contexts/MarkdownContext.tsx
 */
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Sample markdown content
const DEFAULT_MARKDOWN = `---
# Markdown to Card
一个简单的工具，将markdown转换为漂亮的卡片
# #特性

1. 将降价转换为卡片
2. 自定义卡片外观
3. 导出为图像
4. 多个主题可用
5. 简单易用`;

type CardOptions = {
  theme: string;
  imageWidth: number;
  imageHeight: number;
  roundedCorners: boolean;
  showBorder: boolean;
};

type MarkdownContextType = {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  cardOptions: CardOptions;
  setCardOptions: (options: Partial<CardOptions>) => void;
  resetToDefault: () => void;
};

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

export function MarkdownProvider({ children }: { children: ReactNode }) {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [cardOptions, setCardOptionsState] = useState<CardOptions>({
    theme: "default",
    imageWidth: 500,
    imageHeight: 800,
    roundedCorners: true,
    showBorder: true,
  });

  const setCardOptions = (options: Partial<CardOptions>) => {
    setCardOptionsState((prev) => ({ ...prev, ...options }));
  };

  const resetToDefault = () => {
    setMarkdown(DEFAULT_MARKDOWN);
    setCardOptionsState({
      theme: "default",
      imageWidth: 500,
      imageHeight: 800,
      roundedCorners: true,
      showBorder: true,
    });
  };

  return (
    <MarkdownContext.Provider
      value={{
        markdown,
        setMarkdown,
        cardOptions,
        setCardOptions,
        resetToDefault,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
}

export function useMarkdown() {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error("useMarkdown must be used within a MarkdownProvider");
  }
  return context;
}
