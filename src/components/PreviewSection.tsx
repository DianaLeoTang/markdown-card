"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useMarkdown } from "@/contexts/MarkdownContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";

export default function PreviewSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
  const cardRef = useRef<HTMLDivElement>(null);
  const { 
    markdown,
    cardOptions, 
    cards,
    currentCardIndex,
    setCurrentCardIndex,
    totalCards
  } = useMarkdown();

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

  const getCardStyles = () => {
    const theme = getThemeStyles();
    const border = getBorderStyles();
    const corners = getCornerStyles();
    return `${theme} ${border} ${corners} p-8 shadow-md overflow-auto transition-all`;
  };

  // Direct export using dom-to-image
  const exportCurrentCardAsImage = async (format: 'png' | 'jpeg' | 'svg' = exportFormat) => {
    if (!cardRef.current) return;
    
    setIsLoading(true);
    try {
      let dataUrl;
      const scale = 2; // 2x for better quality
      
      const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: cardRef.current.offsetWidth + "px",
        height: cardRef.current.offsetHeight + "px"
      };
      
      const param = {
        height: cardRef.current.offsetHeight * scale,
        width: cardRef.current.offsetWidth * scale,
        quality: 1.0,
        style
      };
      
      switch (format) {
        case 'png':
          dataUrl = await domtoimage.toPng(cardRef.current, param);
          break;
        case 'jpeg':
          dataUrl = await domtoimage.toJpeg(cardRef.current, param);
          break;
        case 'svg':
          dataUrl = await domtoimage.toSvg(cardRef.current);
          break;
        default:
          dataUrl = await domtoimage.toPng(cardRef.current, param);
      }
      
      // Download the image
      const link = document.createElement('a');
      link.download = `markdown-card-${currentCardIndex + 1}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      window.alert("There was a problem exporting the image. Try a different format or smaller dimensions.");
    } finally {
      setIsLoading(false);
    }
  };

  // Export all cards as a zip file
  const exportAllCards = async (format: 'png' | 'jpeg' | 'svg' = exportFormat) => {
    if (!cardRef.current || cards.length === 0) return;
    
    setIsLoading(true);
    const originalIndex = currentCardIndex;
    
    try {
      const zip = new JSZip();
      const folder = zip.folder("markdown-cards");
      
      // Process each card
      for (let i = 0; i < cards.length; i++) {
        // Switch to the current card
        setCurrentCardIndex(i);
        
        // Wait for the UI to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!cardRef.current) continue;
        
        // Generate the image with scaling for higher quality
        let dataUrl;
        const scale = 2;
        
        const style = {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left',
          width: cardRef.current.offsetWidth + "px",
          height: cardRef.current.offsetHeight + "px"
        };
        
        const param = {
          height: cardRef.current.offsetHeight * scale,
          width: cardRef.current.offsetWidth * scale,
          quality: 1.0,
          style
        };
        
        switch (format) {
          case 'png':
            dataUrl = await domtoimage.toPng(cardRef.current, param);
            break;
          case 'jpeg':
            dataUrl = await domtoimage.toJpeg(cardRef.current, param);
            break;
          case 'svg':
            dataUrl = await domtoimage.toSvg(cardRef.current);
            break;
          default:
            dataUrl = await domtoimage.toPng(cardRef.current, param);
        }
        
        // Add to zip
        if (dataUrl) {
          const base64Data = dataUrl.split(',')[1];
          folder?.file(`card-${i + 1}.${format}`, base64Data, {base64: true});
        }
      }
      
      // Restore original card
      setCurrentCardIndex(originalIndex);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate and download the zip
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, `markdown-cards.zip`);
      
    } catch (error) {
      console.error('Error exporting all cards:', error);
      window.alert("There was a problem exporting all cards. Try a different format or smaller dimensions.");
      // Make sure to restore original state even on error
      setCurrentCardIndex(originalIndex);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    if (format === 'png' || format === 'jpeg' || format === 'svg') {
      setExportFormat(format);
    }
  };

  // Get the current card data
  const currentCard = cards[currentCardIndex] || { content: '', frontmatter: {} };

  return (
    <div className="space-y-6">
      {/* Card navigation if there are multiple cards */}
      {totalCards > 1 && (
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            disabled={currentCardIndex === 0}
          >
            Previous Card
          </Button>
          <span className="text-sm">
            Card {currentCardIndex + 1} of {totalCards}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentCardIndex(Math.min(totalCards - 1, currentCardIndex + 1))}
            disabled={currentCardIndex === totalCards - 1}
          >
            Next Card
          </Button>
        </div>
      )}

      <div className="pb-4 overflow-auto">
        <div
          ref={cardRef}
          className={getCardStyles()}
          style={{
            width: `${cardOptions.imageWidth}px`,
            maxWidth: '100%',
            margin: '0 auto'
          }}
        >
          {currentCard.frontmatter.title && (
            <div className="mb-4">
              <h1 className={`text-2xl font-bold ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
                {currentCard.frontmatter.title}
              </h1>
              {currentCard.frontmatter.description && (
                <p className={`text-sm opacity-80 mt-1 ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
                  {currentCard.frontmatter.description}
                </p>
              )}
            </div>
          )}

          <div className={`prose prose-sm md:prose-base ${getProseStyles()} max-w-none`}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {currentCard.content}
            </ReactMarkdown>
          </div>

          {currentCard.frontmatter.tags && (
            <div className="flex flex-wrap gap-1 mt-4">
              {currentCard.frontmatter.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  className={`${getTagStyles()} text-xs px-2 py-1 rounded`}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {currentCard.frontmatter.date && (
            <div className={`mt-4 text-sm opacity-70 ${cardOptions.theme === 'terminal' ? 'font-mono' : ''}`}>
              {currentCard.frontmatter.date}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Export format selection on mobile */}
        <div className="space-y-2 md:hidden">
          <select 
            className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input"
            value={exportFormat}
            onChange={handleFormatChange}
          >
            <option value="png">PNG Format</option>
            <option value="jpeg">JPEG Format</option>
            <option value="svg">SVG Format</option>
          </select>
          <Button
            onClick={() => exportCurrentCardAsImage()}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Exporting...' : `Export Current Card`}
          </Button>
          {totalCards > 1 && (
            <Button
              onClick={() => exportAllCards()}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Exporting...' : `Export All ${totalCards} Cards`}
            </Button>
          )}
        </div>

        {/* Desktop export buttons */}
        <div className="flex-wrap justify-center hidden gap-3 md:flex">
          <Button
            onClick={() => exportCurrentCardAsImage('png')}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Exporting...' : 'Export Current as PNG'}
          </Button>
          <Button
            onClick={() => exportCurrentCardAsImage('jpeg')}
            disabled={isLoading}
            variant="outline"
            className="min-w-[120px]"
          >
            Export as JPEG
          </Button>
          <Button
            onClick={() => exportCurrentCardAsImage('svg')}
            disabled={isLoading}
            variant="outline"
            className="min-w-[120px]"
          >
            Export as SVG
          </Button>
          
          {totalCards > 1 && (
            <Button
              onClick={() => exportAllCards(exportFormat)}
              disabled={isLoading}
              variant="default"
              className="min-w-[120px] mt-2 ml-auto mr-auto"
            >
              {isLoading ? 'Creating Zip...' : `Export All ${totalCards} Cards`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}