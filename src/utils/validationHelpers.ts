
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('پسوورد باید حداقل 6 کاراکتر باشد');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('پسوورد باید حداقل یک حرف بزرگ داشته باشد');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('پسوورد باید حداقل یک حرف کوچک داشته باشد');
  }
  
  if (!/\d/.test(password)) {
    errors.push('پسوورد باید حداقل یک عدد داشته باشد');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};


export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};


export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};


export const sanitizeText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};


export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
