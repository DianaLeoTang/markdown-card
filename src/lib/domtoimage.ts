/**
 * DOM转图片工具 (TypeScript版)
 * 支持将DOM元素转换为PNG、JPEG和SVG格式
 */

// 定义类型接口
interface DomToImageOptions {
    width?: number;
    height?: number;
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  }
  
  interface Html2CanvasOptions extends DomToImageOptions {
    canvas?: HTMLCanvasElement;
  }
  
  // 主类：DOM元素转换为各种图片格式
  class DomToImage {
    /**
     * 将DOM元素转换为PNG图片
     * @param element - 要转换的DOM元素
     * @param options - 配置选项
     * @returns 返回包含PNG图片的data URL
     */
    public toPng(element: HTMLElement, options: DomToImageOptions = {}): Promise<string> {
      return this.toCanvas(element, options)
        .then((canvas: HTMLCanvasElement) => {
          return canvas.toDataURL('image/png', options.quality || 1.0);
        });
    }
  
    /**
     * 将DOM元素转换为JPEG图片
     * @param element - 要转换的DOM元素
     * @param options - 配置选项
     * @returns 返回包含JPEG图片的data URL
     */
    public toJpeg(element: HTMLElement, options: DomToImageOptions = {}): Promise<string> {
      return this.toCanvas(element, options)
        .then((canvas: HTMLCanvasElement) => {
          return canvas.toDataURL('image/jpeg', options.quality || 0.8);
        });
    }
  
    /**
     * 将DOM元素转换为SVG图片
     * @param element - 要转换的DOM元素
     * @param options - 配置选项
     * @returns 返回包含SVG图片的data URL
     */
    public toSvg(element: HTMLElement, options: DomToImageOptions = {}): Promise<string> {
      const width: number = options.width || element.offsetWidth;
      const height: number = options.height || element.offsetHeight;
      
      return this.inlineAll(element)
        .then((clone: HTMLElement) => {
          return this.makeSvgDataUri(clone, width, height);
        });
    }
  
    /**
     * 将DOM元素转换为Canvas
     * @param element - 要转换的DOM元素
     * @param options - 配置选项
     * @returns 返回Canvas元素
     */
    public toCanvas(element: HTMLElement, options: DomToImageOptions = {}): Promise<HTMLCanvasElement> {
      return this.inlineAll(element)
        .then((clone: HTMLElement) => {
          const width: number = options.width || element.offsetWidth;
          const height: number = options.height || element.offsetHeight;
          const scale: number = options.scale || 1;
          
          const canvas: HTMLCanvasElement = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;
          
          const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
          if (context && options.backgroundColor) {
            context.fillStyle = options.backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          if (context) {
            context.scale(scale, scale);
          }
          
          return html2canvas(clone, {
            canvas: canvas,
            backgroundColor: null,
            scale: 1,
            width: width,
            height: height
          });
        });
    }
  
    /**
     * 内联所有外部资源
     * @param element - 要处理的DOM元素
     * @returns 返回处理后的元素克隆
     */
    private inlineAll(element: HTMLElement): Promise<HTMLElement> {
      // 克隆节点，以避免修改原始元素
      const clone: HTMLElement = element.cloneNode(true) as HTMLElement;
      
      // 收集所有需要内联的元素
      const inlinePromises: Promise<void>[] = [];
      
      // 处理图片
      const images: HTMLCollectionOf<HTMLImageElement> = clone.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        inlinePromises.push(this.inlineImage(images[i]));
      }
      
      // 处理样式表
      const stylesheets: HTMLCollectionOf<HTMLLinkElement> = clone.getElementsByTagName('link');
      for (let i = 0; i < stylesheets.length; i++) {
        if (stylesheets[i].rel === 'stylesheet') {
          inlinePromises.push(this.inlineStylesheet(stylesheets[i]));
        }
      }
      
      // 处理内联样式
      const styles: HTMLCollectionOf<HTMLStyleElement> = clone.getElementsByTagName('style');
      for (let i = 0; i < styles.length; i++) {
        inlinePromises.push(this.inlineStyle(styles[i]));
      }
      
      return Promise.all(inlinePromises).then(() => clone);
    }
  
    /**
     * 内联图片
     * @param image - 图片元素
     * @returns Promise
     */
    private inlineImage(image: HTMLImageElement): Promise<void> {
      const src: string | null = image.getAttribute('src');
      if (!src) return Promise.resolve();
      
      // 如果已经是Data URL，不需要处理
      if (src.startsWith('data:')) return Promise.resolve();
      
      return new Promise<void>((resolve, reject) => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onload = function() {
          const reader: FileReader = new FileReader();
          reader.onloadend = function() {
            image.setAttribute('src', reader.result as string);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', src);
        xhr.responseType = 'blob';
        xhr.send();
      });
    }
  
    /**
     * 内联样式表
     * @param link - 链接元素
     * @returns Promise
     */
    private inlineStylesheet(link: HTMLLinkElement): Promise<void> {
      const href: string | null = link.getAttribute('href');
      if (!href) return Promise.resolve();
      
      return new Promise<void>((resolve, reject) => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onload = function() {
          const style: HTMLStyleElement = document.createElement('style');
          style.textContent = xhr.responseText;
          if (link.parentNode) {
            link.parentNode.replaceChild(style, link);
          }
          resolve();
        };
        xhr.onerror = reject;
        xhr.open('GET', href);
        xhr.send();
      });
    }
  
    /**
     * 处理内联样式
     * @param style - 样式元素
     * @returns Promise
     */
    private inlineStyle(style: HTMLStyleElement): Promise<void> {
      if (!style.textContent) return Promise.resolve();
      
      // 替换CSS中的URL引用为Data URL
      const promises: Promise<void>[] = [];
      const css: string = style.textContent;
      const urlRegex: RegExp = /url\(['"]?([^'"()]+)['"]?\)/g;
      let match: RegExpExecArray | null;
      
      while ((match = urlRegex.exec(css)) !== null) {
        const url: string = match[1];
        if (!url.startsWith('data:')) {
          promises.push(
            this.toDataURL(url).then((dataUrl: string) => {
              if (style.textContent) {
                style.textContent = style.textContent.replace(url, dataUrl);
              }
            })
          );
        }
      }
      
      return Promise.all(promises).then(() => {});
    }
  
    /**
     * 将URL转换为Data URL
     * @param url - 要转换的URL
     * @returns 返回Data URL
     */
    private toDataURL(url: string): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onload = function() {
          const reader: FileReader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      });
    }
  
    /**
     * 创建SVG Data URI
     * @param node - DOM节点
     * @param width - 宽度
     * @param height - 高度
     * @returns 返回SVG Data URI
     */
    private makeSvgDataUri(node: HTMLElement, width: number, height: number): string {
      const xmlSerializer: XMLSerializer = new XMLSerializer();
      const xhtml: string = xmlSerializer.serializeToString(node);
      
      // 创建SVG包装器
      const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      
      // 创建外国对象元素
      const foreignObject: SVGForeignObjectElement = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('width', '100%');
      foreignObject.setAttribute('height', '100%');
      foreignObject.setAttribute('x', '0');
      foreignObject.setAttribute('y', '0');
      
      // 添加XHTML内容
      const divWrapper: HTMLDivElement = document.createElement('div');
      divWrapper.innerHTML = xhtml;
      foreignObject.appendChild(divWrapper);
      svg.appendChild(foreignObject);
      
      // 序列化SVG
      const svgString: string = xmlSerializer.serializeToString(svg);
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    }
  }
  
  /**
   * html2canvas简化版实现
   * 实际应用中建议使用完整的html2canvas库
   * @param element - 要绘制的元素
   * @param options - 配置选项
   * @returns 返回Canvas元素
   */
  function html2canvas(element: HTMLElement, options: Html2CanvasOptions = {}): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve) => {
      const canvas: HTMLCanvasElement = options.canvas || document.createElement('canvas');
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
      
      // 创建一个新的Image对象
      const image: HTMLImageElement = new Image();
      image.crossOrigin = "anonymous";
      
      // 使用SVG作为中间格式
      const domToImageInstance = new DomToImage();
      domToImageInstance.toSvg(element)
        .then((svgDataUrl: string) => {
          image.onload = function() {
            if (context) {
              context.drawImage(image, 0, 0);
            }
            resolve(canvas);
          };
          image.src = svgDataUrl;
        });
    });
  }
  
  /**
   * 使用示例
   */
  function domToImageExample(): void {
    // 获取要转换的DOM元素
    const element: HTMLElement | null = document.getElementById('my-element');
    if (!element) return;
    
    const domToImage = new DomToImage();
    
    // 转换为PNG
    domToImage.toPng(element)
      .then((dataUrl: string) => {
        // 使用生成的PNG图片
        const img: HTMLImageElement = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
        
        // 或者下载图片
        const link: HTMLAnchorElement = document.createElement('a');
        link.download = 'my-element.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error: Error) => {
        console.error('生成PNG图片时出错:', error);
      });
    
    // 转换为JPEG
    domToImage.toJpeg(element, { quality: 0.95 })
      .then((dataUrl: string) => {
        const link: HTMLAnchorElement = document.createElement('a');
        link.download = 'my-element.jpg';
        link.href = dataUrl;
        link.click();
      });
    
    // 转换为SVG
    domToImage.toSvg(element)
      .then((dataUrl: string) => {
        const link: HTMLAnchorElement = document.createElement('a');
        link.download = 'my-element.svg';
        link.href = dataUrl;
        link.click();
      });
  }
  
  // 导出
  export { DomToImage, html2canvas };
// export dufault DomToImage;