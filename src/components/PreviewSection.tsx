"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import * as htmlToImage from "html-to-image";
import { useMarkdown } from "@/contexts/MarkdownContext";

export default function PreviewSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const cardRef = useRef<HTMLDivElement>(null);
  const { markdown, cardOptions } = useMarkdown();

  const getThemeStyles = () => {
    switch (cardOptions.theme) {
      case 'light':
        return 'bg-white text-slate-800';
      case 'dark':
        return 'bg-slate-900 text-white';
      case 'colorful':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'minimal':
        return 'bg-gray-50 text-gray-800';
      case 'social':
        return 'bg-pink-50 text-pink-900';
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-blue-900';
      case 'gradient-rose':
        return 'bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200 text-rose-900';
      case 'gradient-green':
        return 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 text-emerald-900';
      case 'terminal':
        return 'bg-black text-green-400 font-mono';
      default:
        return 'bg-white text-slate-800';
    }
  };

  const getBorderStyles = () => {
    if (!cardOptions.showBorder) return '';

    if (cardOptions.theme === 'terminal') {
      return 'border border-green-500';
    }

    return 'border border-gray-200 dark:border-gray-700';
  };

  const getCornerStyles = () => {
    if (!cardOptions.roundedCorners) return '';

    if (cardOptions.theme === 'social') {
      return 'rounded-2xl';
    }

    return 'rounded-lg';
  };

  const getProseStyles = () => {
    switch (cardOptions.theme) {
      case 'dark':
        return 'prose-invert';
      case 'colorful':
        return 'prose-invert';
      case 'terminal':
        return 'prose-invert prose-green';
      case 'social':
        return 'prose-pink';
      case 'gradient-blue':
        return 'prose-blue';
      case 'gradient-rose':
        return 'prose-pink';
      case 'gradient-green':
        return 'prose-emerald';
      default:
        return '';
    }
  };

  const getCardStyles = () => {
    const theme = getThemeStyles();
    const border = getBorderStyles();
    const corners = getCornerStyles();
    return `${theme} ${border} ${corners} p-8 shadow-md overflow-hidden transition-all`;
  };

  const exportAsImage = async (format: 'png' | 'jpeg' | 'svg' = exportFormat) => {
    if (!cardRef.current) return;

    setIsLoading(true);
    try {
      let dataUrl;

      switch (format) {
        case 'png':
          dataUrl = await htmlToImage.toPng(cardRef.current);
          break;
        case 'jpeg':
          dataUrl = await htmlToImage.toJpeg(cardRef.current);
          break;
        case 'svg':
          dataUrl = await htmlToImage.toSvg(cardRef.current);
          break;
        default:
          dataUrl = await htmlToImage.toPng(cardRef.current);
      }

      const link = document.createElement('a');
      link.download = `markdown-card.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const { frontmatter, content } = extractFrontmatter(markdown);

  const getTagStyles = () => {
    switch (cardOptions.theme) {
      case 'dark':
        return 'bg-gray-800 text-gray-200';
      case 'colorful':
        return 'bg-blue-600 text-white';
      case 'terminal':
        return 'bg-green-900 text-green-300';
      case 'social':
        return 'bg-pink-200 text-pink-800';
      case 'gradient-blue':
        return 'bg-blue-200 text-blue-800';
      case 'gradient-rose':
        return 'bg-rose-200 text-rose-800';
      case 'gradient-green':
        return 'bg-emerald-200 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    if (format === 'png' || format === 'jpeg' || format === 'svg') {
      setExportFormat(format);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-auto pb-4">
        <div
          ref={cardRef}
          className={getCardStyles()}
          style={{
            width: `${cardOptions.imageWidth}px`,
            maxWidth: '100%',
            margin: '0 auto'
          }}
        >
          {frontmatter.title && (
            <div className="mb-4">
              <h1 className={`text-2xl font-bold ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
                {frontmatter.title}
              </h1>
              {frontmatter.description && (
                <p className={`text-sm opacity-80 mt-1 ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
                  {frontmatter.description}
                </p>
              )}
            </div>
          )}

          <div className={`prose prose-sm md:prose-base ${getProseStyles()} max-w-none`}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>

          {frontmatter.tags && (
            <div className="mt-4 flex flex-wrap gap-1">
              {frontmatter.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  className={`${getTagStyles()} text-xs px-2 py-1 rounded`}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {frontmatter.date && (
            <div className={`mt-4 text-sm opacity-70 ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
              {frontmatter.date}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Export format selection on mobile */}
        <div className="md:hidden">
          <select
            className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            value={exportFormat}
            onChange={handleFormatChange}
          >
            <option value="png">PNG Format</option>
            <option value="jpeg">JPEG Format</option>
            <option value="svg">SVG Format</option>
          </select>
          <Button
            onClick={() => exportAsImage()}
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </div>

        {/* Desktop export buttons */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => exportAsImage('png')}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading && exportFormat === 'png' ? 'Exporting...' : 'Export as PNG'}
          </Button>
          <Button
            onClick={() => exportAsImage('jpeg')}
            disabled={isLoading}
            variant="outline"
            className="min-w-[120px]"
          >
            {isLoading && exportFormat === 'jpeg' ? 'Exporting...' : 'Export as JPEG'}
          </Button>
          <Button
            onClick={() => exportAsImage('svg')}
            disabled={isLoading}
            variant="outline"
            className="min-w-[120px]"
          >
            {isLoading && exportFormat === 'svg' ? 'Exporting...' : 'Export as SVG'}
          </Button>
        </div>
      </div>
    </div>
  );
}
