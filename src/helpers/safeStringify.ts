/**
 * safeStringify
 *
 * Serializa objetos em JSON sem quebrar com erros de estruturas circulares.
 * Mantém a identação padrão igual ao JSON.stringify(obj, null, 2).
 */

function safeStringify(obj: any, space: number = 2): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    },
    space
  );
}

export default safeStringify;
