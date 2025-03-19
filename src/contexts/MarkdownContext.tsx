"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Sample markdown content
const DEFAULT_MARKDOWN = `---
title: Markdown Card Creator
description: Convert your Markdown to beautiful social media cards
tags: markdown, cards, social
date: ${new Date().toISOString().split('T')[0]}
image: https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80
---

# Markdown Card Creator

> A simple tool to convert markdown to beautiful cards

![](https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80)

## Features

1. Convert markdown to cards
2. Customize card appearance
3. Export as images

---

# Multiple Cards Support

> Split your content into multiple cards using dividers (---)

![](https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80)

## More Features

4. Multiple themes available
5. Simple and easy to use
6. Download all cards at once`;

type CardOptions = {
  theme: string;
  imageWidth: number;
  imageHeight: number;
  roundedCorners: boolean;
  showBorder: boolean;
};

type MarkdownCard = {
  content: string;
  frontmatter: Record<string, string>;
};

type MarkdownContextType = {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  cardOptions: CardOptions;
  setCardOptions: (options: Partial<CardOptions>) => void;
  resetToDefault: () => void;
  cards: MarkdownCard[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  totalCards: number;
};

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

// Parse frontmatter from markdown (basic implementation)
const extractFrontmatter = (markdownText: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = markdownText.match(frontmatterRegex);

  if (match && match[1]) {
    const frontmatter: Record<string, string> = {};
    const lines = match[1].split('\n');

    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    return {
      frontmatter,
      content: markdownText.replace(frontmatterRegex, '')
    };
  }

  return {
    frontmatter: {},
    content: markdownText
  };
};

// Split markdown content into multiple cards based on horizontal rules
const splitIntoCards = (markdownText: string): MarkdownCard[] => {
  // First extract the frontmatter
  const { frontmatter, content } = extractFrontmatter(markdownText);

  // Split by horizontal rule (---) but not frontmatter delimiters
  // Use negative lookbehind to avoid matching frontmatter delimiter at the beginning
  const cardContents = content.split(/(?<!^)(?:\n|\r\n?)---(?:\n|\r\n?)/);

  // Create cards
  return cardContents.map((cardContent, index) => {
    // For the first card, we use the original frontmatter
    if (index === 0) {
      return { content: cardContent.trim(), frontmatter };
    }
    // For subsequent cards, see if they have their own frontmatter
    else {
      const cardData = extractFrontmatter(cardContent);

      // If no frontmatter found, use the original frontmatter
      if (Object.keys(cardData.frontmatter).length === 0) {
        // But update title to reflect it's part of a series
        const updatedFrontmatter = { ...frontmatter };
        if (updatedFrontmatter.title) {
          updatedFrontmatter.title = `${updatedFrontmatter.title} (Part ${index + 1})`;
        }
        return { content: cardContent.trim(), frontmatter: updatedFrontmatter };
      }

      return { content: cardData.content, frontmatter: cardData.frontmatter };
    }
  });
};

export function MarkdownProvider({ children }: { children: ReactNode }) {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [cards, setCards] = useState<MarkdownCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardOptions, setCardOptionsState] = useState<CardOptions>({
    theme: "default",
    imageWidth: 500,
    imageHeight: 800,
    roundedCorners: true,
    showBorder: true,
  });

  // Update cards whenever markdown changes
  useEffect(() => {
    const newCards = splitIntoCards(markdown);
    setCards(newCards);

    // Reset current card index if it's out of bounds
    if (currentCardIndex >= newCards.length) {
      setCurrentCardIndex(Math.max(0, newCards.length - 1));
    }
  }, [markdown, currentCardIndex]);

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
    setCurrentCardIndex(0);
  };

  return (
    <MarkdownContext.Provider
      value={{
        markdown,
        setMarkdown,
        cardOptions,
        setCardOptions,
        resetToDefault,
        cards,
        currentCardIndex,
        setCurrentCardIndex,
        totalCards: cards.length,
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
