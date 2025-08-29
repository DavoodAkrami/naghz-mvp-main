

export interface PageFormData {
  id?: string;
  page_number: number;
  page_type: 'text' | 'test' | 'testNext';
  title: string;
  content: string;
  question: string;
  test_type: 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input';
  test_grid: 'col' | 'grid-2' | 'grid-row';
  correct_answer: number[];
  page_length: number;
  order_index: number;
  image?: string;
  why?: string | null;
  name?: string;
  ai_enabled?: boolean;
  give_feedback?: boolean;
  give_point?: boolean;
  give_point_by_ai?: boolean;
  score_threshold: number;
  low_score_page_id?: string | null;
  high_score_page_id?: string | null;
  tip?: string;
  system_prompt?: string;
}

export type TestType = 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input';


export const toDbCorrectAnswer = (
  testType: TestType,
  values: number[]
): number | number[] | [number, number][] | null => {
  switch (testType) {
    case 'Default':
      return typeof values?.[0] === 'number' ? values[0] : null;
    case 'Multiple':
    case 'Sequential':
    case 'Input':
      return Array.isArray(values) ? values : [];
    case 'Pluggable': {
      const pairs: [number, number][] = [];
      for (let i = 0; i < values.length; i += 2) {
        if (typeof values[i] === 'number' && typeof values[i + 1] === 'number') {
          pairs.push([values[i], values[i + 1]]);
        }
      }
      return pairs;
    }
    default:
      return Array.isArray(values) ? values : [];
  }
};


export const fromDbCorrectAnswer = (val: unknown): number[] => {
  if (typeof val === 'number') return [val];
  if (Array.isArray(val)) {
    if (val.length > 0 && Array.isArray(val[0])) {
      const flat: number[] = [];
      for (const pair of val as unknown[]) {
        if (Array.isArray(pair) && typeof pair[0] === 'number' && typeof pair[1] === 'number') {
          flat.push(pair[0], pair[1]);
        }
      }
      return flat;
    }
    return val as number[];
  }
  return [];
};


export const getPageDisplayText = (page: PageFormData): string => {
  if (page.name && page.name.trim()) {
    return page.name;
  }
  if (page.title && page.title.trim()) {
    return page.title;
  }
  if (page.question && page.question.trim()) {
    return page.question;
  }
  return `صفحه ${page.page_number}`;
};


export const swapArrayItems = <T,>(arr: T[], i: number, j: number): T[] => {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};


export const swapObjKeys = <T extends Record<number, any>>(obj: T, i: number, j: number): T => {
  const copy: T = { ...obj };
  const ti = copy[i];
  const tj = copy[j];
  copy[i] = tj;
  copy[j] = ti;
  return copy;
};


export const renumberPagesInPlace = (list: PageFormData[]): void => {
  list.forEach((p, idx) => {
    p.page_number = idx + 1;
    p.order_index = idx;
  });
};


export const movePageUp = (
  pages: PageFormData[],
  pageIndex: number,
  optionsByPage: Record<number, any[]>,
  imagesByPage: Record<number, File | null>
): {
  newPages: PageFormData[];
  newOptionsByPage: Record<number, any[]>;
  newImagesByPage: Record<number, File | null>;
} => {
  if (pageIndex === 0) {
    return { newPages: pages, newOptionsByPage: optionsByPage, newImagesByPage: imagesByPage };
  }

  const newPages = swapArrayItems(pages, pageIndex, pageIndex - 1);
  const newOptionsByPage = swapObjKeys(optionsByPage, pageIndex, pageIndex - 1);
  const newImagesByPage = swapObjKeys(imagesByPage, pageIndex, pageIndex - 1);

  renumberPagesInPlace(newPages);
  
  return { newPages, newOptionsByPage, newImagesByPage };
};


export const movePageDown = (
  pages: PageFormData[],
  pageIndex: number,
  optionsByPage: Record<number, any[]>,
  imagesByPage: Record<number, File | null>
): {
  newPages: PageFormData[];
  newOptionsByPage: Record<number, any[]>;
  newImagesByPage: Record<number, File | null>;
} => {
  if (pageIndex === pages.length - 1) {
    return { newPages: pages, newOptionsByPage: optionsByPage, newImagesByPage: imagesByPage };
  }

  const newPages = swapArrayItems(pages, pageIndex, pageIndex + 1);
  const newOptionsByPage = swapObjKeys(optionsByPage, pageIndex, pageIndex + 1);
  const newImagesByPage = swapObjKeys(imagesByPage, pageIndex, pageIndex + 1);

  renumberPagesInPlace(newPages);
  
  return { newPages, newOptionsByPage, newImagesByPage };
};
