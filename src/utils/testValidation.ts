
export type TestType = 'Default' | 'Multiple' | 'Sequential' | 'Pluggable' | 'Input';

export interface TestValidationResult {
  isCorrect: boolean;
  userAnswer: any;
  expectedAnswer: any;
}

export const validateDefaultTest = (
  userAnswer: number | null,
  correctAnswer: number | number[]
): TestValidationResult => {
  const expected = typeof correctAnswer === 'number' 
    ? correctAnswer 
    : Array.isArray(correctAnswer) && typeof correctAnswer[0] === 'number'
      ? correctAnswer[0]
      : null;
  
  const isCorrect = userAnswer !== null && userAnswer === expected;
  
  return {
    isCorrect,
    userAnswer,
    expectedAnswer: expected
  };
};

export const validateMultipleTest = (
  userSelections: number[],
  correctAnswer: number[]
): TestValidationResult => {
  const isCorrect = userSelections.length === correctAnswer.length &&
    correctAnswer.every(id => userSelections.includes(id));
  
  return {
    isCorrect,
    userAnswer: userSelections,
    expectedAnswer: correctAnswer
  };
};


export const validateSequentialTest = (
  userSelections: number[],
  correctAnswer: number[]
): TestValidationResult => {
  const isCorrect = userSelections.length === correctAnswer.length &&
    correctAnswer.every((id, idx) => userSelections[idx] === id);
  
  return {
    isCorrect,
    userAnswer: userSelections,
    expectedAnswer: correctAnswer
  };
};


export const normalizePluggablePairs = (correctAnswer: any): [number, number][] => {
  if (Array.isArray(correctAnswer)) {
    if (correctAnswer.length > 0 && Array.isArray(correctAnswer[0])) {
      const out: [number, number][] = [];
      for (const p of correctAnswer) {
        if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') {
          const x = Math.min(p[0], p[1]);
          const y = Math.max(p[0], p[1]);
          out.push([x, y]);
        }
      }
      return out.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
    }
    
    const nums = correctAnswer as number[];
    const out: [number, number][] = [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = Math.min(nums[i], nums[i + 1]);
      const y = Math.max(nums[i], nums[i + 1]);
      out.push([x, y]);
    }
    return out.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
  }
  return [];
};


export const buildUserPluggablePairs = (pluggablePairs: Record<number, number>): [number, number][] => {
  const userPairs: [number, number][] = [];
  const seen = new Set<number>();
  
  Object.keys(pluggablePairs).forEach(k => {
    const a = parseInt(k);
    const b = pluggablePairs[a];
    if (typeof b !== 'number') return;
    if (seen.has(a) || seen.has(b)) return;
    const x = Math.min(a, b), y = Math.max(a, b);
    seen.add(x); seen.add(y);
    userPairs.push([x, y]);
  });
  
  return userPairs.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
};


export const validatePluggableTest = (
  pluggablePairs: Record<number, number>,
  correctAnswer: any
): TestValidationResult => {
  const userPairs = buildUserPluggablePairs(pluggablePairs);
  const expectedPairs = normalizePluggablePairs(correctAnswer);
  
  const isCorrect = userPairs.length === expectedPairs.length &&
    userPairs.every((p, i) => p[0] === expectedPairs[i][0] && p[1] === expectedPairs[i][1]);
  
  return {
    isCorrect,
    userAnswer: userPairs,
    expectedAnswer: expectedPairs
  };
};


export const validateTest = (
  testType: TestType,
  userAnswer: any,
  correctAnswer: any
): TestValidationResult => {
  switch (testType) {
    case 'Default':
      return validateDefaultTest(userAnswer, correctAnswer);
    case 'Multiple':
      return validateMultipleTest(userAnswer, correctAnswer);
    case 'Sequential':
      return validateSequentialTest(userAnswer, correctAnswer);
    case 'Pluggable':
      return validatePluggableTest(userAnswer, correctAnswer);
    case 'Input':
      return {
        isCorrect: userAnswer === correctAnswer,
        userAnswer,
        expectedAnswer: correctAnswer
      };
    default:
      return {
        isCorrect: false,
        userAnswer,
        expectedAnswer: correctAnswer
      };
  }
};
