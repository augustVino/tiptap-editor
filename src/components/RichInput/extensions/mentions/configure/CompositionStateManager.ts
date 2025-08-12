/**
 * 自定义 Composition 状态管理器
 * 用于解决中文输入法在 compositionend 后仍然显示 composing=true 的问题
 */
export class CompositionStateManager {
  private isComposing = false;
  private targetElement: HTMLElement | null = null;
  private boundHandlers: {
    onCompositionStart: (event: CompositionEvent) => void;
    onCompositionEnd: (event: CompositionEvent) => void;
  } | null = null;

  constructor() {
    this.bindEventHandlers();
  }

  /**
   * 绑定事件处理器
   */
  private bindEventHandlers() {
    this.boundHandlers = {
      onCompositionStart: this.handleCompositionStart.bind(this),
      onCompositionEnd: this.handleCompositionEnd.bind(this)
    };
  }

  /**
   * 处理 compositionstart 事件
   */
  private handleCompositionStart(event: CompositionEvent) {
    this.isComposing = true;
    console.log('CompositionStateManager: composition started', event);
  }

  /**
   * 处理 compositionend 事件
   */
  private handleCompositionEnd(event: CompositionEvent) {
    this.isComposing = false;
    // 使用微任务确保在当前事件循环结束后更新状态
    // 这样可以确保所有相关的DOM更新都已完成
    Promise.resolve().then(() => {
      this.isComposing = false;
      console.log('CompositionStateManager: composition ended', event);
    });
    setTimeout(() => {
      // event.target?.dispatchEvent(new Event('click'));
      (event.target as HTMLElement).click();
      console.log('CompositionStateManager: composition ended (fallback)', event);
    }, 30);
  }

  /**
   * 开始监听指定元素的 composition 事件
   */
  public startListening(element: HTMLElement) {
    if (this.targetElement === element) {
      return; // 已经在监听同一个元素
    }

    // 先停止之前的监听
    this.stopListening();

    this.targetElement = element;
    if (this.boundHandlers) {
      element.addEventListener('compositionstart', this.boundHandlers.onCompositionStart);
      element.addEventListener('compositionend', this.boundHandlers.onCompositionEnd);
    }
  }

  /**
   * 停止监听 composition 事件
   */
  public stopListening() {
    if (this.targetElement && this.boundHandlers) {
      this.targetElement.removeEventListener(
        'compositionstart',
        this.boundHandlers.onCompositionStart
      );
      this.targetElement.removeEventListener('compositionend', this.boundHandlers.onCompositionEnd);
    }
    this.targetElement = null;
    this.isComposing = false;
  }

  /**
   * 获取当前的 composition 状态
   */
  public getComposingState(): boolean {
    return this.isComposing;
  }

  /**
   * 销毁管理器，清理所有资源
   */
  public destroy() {
    this.stopListening();
    this.boundHandlers = null;
  }
}
