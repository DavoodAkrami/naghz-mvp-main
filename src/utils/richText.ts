
export const renderRichText = (text: string): string => {
  if (!text) return '';
  
  let html = text
    .replace(/\[([^\]]+)\]\(([^)]+)(?:\|([^)]+))?\)/g, (match, linkText, url, target) => {
      const targetAttr = target ? ` target="${target}"` : ' target="_blank"';
      return `<a href="${url}"${targetAttr} class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" rel="noopener noreferrer">${linkText}</a>`;
    })
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<u>$1</u>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    .replace(/\n/g, '<br />');

  return html;
};


export const isRTLText = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text || '');
};


export const getLineDuration = (length: number): number => {
  return Math.min(2.0, Math.max(0.6, length / 35));
};


export const calculateLineDelays = (lineDurations: number[]): number[] => {
  const delays: number[] = [];
  let acc = 0;
  for (let i = 0; i < lineDurations.length; i++) {
    delays.push(acc);
    acc += lineDurations[i] + 0.05;
  }
  return delays;
};
