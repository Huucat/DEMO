type EventCallback<T = any> = (...args: T[]) => void;

const createEventBus = <T extends Record<string, (...args: any[]) => void>>() => {
  const events = new Map<keyof T, EventCallback[]>();

  return {
    // 监听事件
    on<K extends keyof T>(event: K, callback: T[K]) {
      if (!events.has(event)) {
        events.set(event, []);
      }
      events.get(event)!.push(callback as EventCallback);
    },

    // 移除事件
    off<K extends keyof T>(event: K, callback: T[K]) {
      if (!events.has(event)) return;
      const callbacks = events.get(event)!.filter((cb) => cb !== callback);
      if (callbacks.length > 0) {
        events.set(event, callbacks as EventCallback[]);
      } else {
        events.delete(event);
      }
    },

    // 触发事件
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
      console.log("emit", event, events.has(event));
      if (!events.has(event)) return;
      events.get(event)!.forEach((callback) => callback(...args));
    },
  };
};

// 创建全局的 EventBus 实例
const useEventBus = createEventBus();

export default useEventBus;
