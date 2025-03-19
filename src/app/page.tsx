import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorSection from "@/components/EditorSection";
import PreviewSection from "@/components/PreviewSection";
import { MarkdownProvider } from "@/contexts/MarkdownContext";

export default function Home() {
  return (
    <MarkdownProvider>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background">
          <div className="container flex h-14 items-center px-4 md:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z" />
                <path d="M9 13h6" />
                <path d="M9 17h3" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              </svg>
              <span className="text-xl hidden sm:inline-block">Markdown to Card</span>
              <span className="text-xl sm:hidden">MD2Card</span>
            </div>
            <div className="ml-auto flex gap-2">
              <a
                href="https://github.com/DianaLeoTang/markdown-card"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-sm font-medium hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="w-full max-w-md mx-auto mb-6 grid grid-cols-2">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="mt-0">
                <EditorSection />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <PreviewSection />
              </TabsContent>
            </Tabs>

            <footer className="mt-10 text-center text-sm text-muted-foreground">
              <p>Created with ❤️ for all Markdown lovers</p>
              <p className="mt-1">© {new Date().getFullYear()} Markdown to Card</p>
            </footer>
          </div>
        </div>
      </main>
    </MarkdownProvider>
  );
}
