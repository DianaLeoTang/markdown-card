"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useMarkdown } from "@/contexts/MarkdownContext";

export default function EditorSection() {
  const {
    markdown,
    setMarkdown,
    cardOptions,
    setCardOptions,
    resetToDefault,
    totalCards
  } = useMarkdown();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyMarkdown = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      // Alternatively for modern browsers:
      // navigator.clipboard.writeText(markdown);

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Editor Panel */}
      <div>
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="markdown-editor">Markdown Content</Label>
                {totalCards > 1 && (
                  <span className="text-sm font-medium text-primary">
                    {totalCards} cards detected
                  </span>
                )}
              </div>
              <Textarea
                id="markdown-editor"
                ref={textareaRef}
                className="font-mono min-h-[300px] md:min-h-[400px] mt-2"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter your markdown here..."
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={resetToDefault}
                size="sm"
                className="text-xs md:text-sm"
              >
                Reset to Sample
              </Button>
              <div className="flex items-center gap-2">
                {totalCards > 1 ? (
                  <div className="text-sm text-muted-foreground">
                    Use <code>---</code> to split content into multiple cards
                  </div>
                ) : (
                  <div className="hidden text-sm text-muted-foreground md:block">
                    Add <code>---</code> to create multiple cards
                  </div>
                )}
                <Button
                  onClick={handleCopyMarkdown}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  {copySuccess ? "Copied!" : "Copy Markdown"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options Panel */}
      <div>
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-4 text-lg font-semibold">Card Options</h3>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={cardOptions.theme}
                  onChange={(e) => setCardOptions({ theme: e.target.value })}
                >
                  <option value="default">Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="colorful">Colorful</option>
                  <option value="minimal">Minimal</option>
                  <option value="social">Social Media</option>
                  <option value="gradient-blue">Gradient Blue</option>
                  <option value="gradient-rose">Gradient Rose</option>
                  <option value="gradient-green">Gradient Green</option>
                  <option value="terminal">Terminal</option>
                </select>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="image-width">Image Width</Label>
                  <span className="text-sm text-muted-foreground">{cardOptions.imageWidth}px</span>
                </div>
                <Slider
                  id="image-width"
                  min={300}
                  max={1200}
                  step={10}
                  value={[cardOptions.imageWidth]}
                  onValueChange={(value) => setCardOptions({ imageWidth: value[0] })}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="image-height">Image Height</Label>
                  <span className="text-sm text-muted-foreground">{cardOptions.imageHeight}px</span>
                </div>
                <Slider
                  id="image-height"
                  min={400}
                  max={1200}
                  step={10}
                  value={[cardOptions.imageHeight]}
                  onValueChange={(value) => setCardOptions({ imageHeight: value[0] })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="rounded-corners">Rounded Corners</Label>
                <Switch
                  id="rounded-corners"
                  checked={cardOptions.roundedCorners}
                  onCheckedChange={(checked) => setCardOptions({ roundedCorners: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-border">Show Border</Label>
                <Switch
                  id="show-border"
                  checked={cardOptions.showBorder}
                  onCheckedChange={(checked) => setCardOptions({ showBorder: checked })}
                />
              </div>

              {totalCards > 1 && (
                <div className="p-3 mt-4 rounded-md bg-muted/50">
                  <h4 className="mb-1 text-sm font-medium">Multiple Cards Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Your markdown contains {totalCards} cards separated by <code>---</code> dividers.
                    Use the navigation in the Preview tab to view each card.
                    All cards can be exported together with the "Export All Cards" button.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
