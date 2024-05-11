export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
    let timeoutId: NodeJS.Timeout;
  
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this;
  
      clearTimeout(timeoutId);
  
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
  