/**
 * Utilidades y funciones helper
 */

/**
 * Convierte un nombre de modelo a formato plural para endpoints
 */
export function pluralize(word: string): string {
  const pluralRules: Record<string, string> = {
    'Obra': 'obras',
    'Capitulo': 'capitulos',
    'Arco': 'arcos',
    'Noticia': 'noticias',
    'Usuario': 'usuarios',
    'PersonajeFicticio': 'personajes-ficticios'
  };
  
  return pluralRules[word] || word.toLowerCase() + 's';
}

/**
 * Humaniza un nombre de campo (camelCase a Title Case)
 */
export function humanize(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * Formatea una fecha
 */
export function formatDate(date: Date | string | undefined, format = 'short'): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return d.toLocaleDateString('es-ES');
  } else if (format === 'long') {
    return d.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } else if (format === 'datetime') {
    return d.toLocaleString('es-ES');
  }
  
  return d.toLocaleDateString('es-ES');
}

/**
 * Debounce para optimizar búsquedas y filtros
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Descarga un archivo
 */
export function downloadFile(data: Blob, filename: string): void {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Convierte objeto a query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      params.append(key, obj[key].toString());
    }
  });
  
  return params.toString();
}

/**
 * Validación de email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validación de URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
