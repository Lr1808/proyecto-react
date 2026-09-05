import type { Exercise } from '../types';

export const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Suma de Arreglos',
    description: 'Recibe un arreglo de números y retorna la suma de todos sus elementos.',
    language: 'javascript',
    difficulty: 'easy',
    points: 50,
    initialCode: 'function solve(numbers) {\n  // Tu código aquí\n}',
    testCases: [
      { id: '1-1', input: '[1, 2, 3, 4, 5]', expectedOutput: '15', isHidden: false },
      { id: '1-2', input: '[-2, 5, 7]', expectedOutput: '10', isHidden: false },
      { id: '1-3', input: '[10, 0, -10, 4]', expectedOutput: '4', isHidden: true },
    ],
  },
  {
    id: '2',
    title: 'Contador de Vocales',
    description: 'Cuenta cuántas vocales aparecen en una frase, ignorando mayúsculas y minúsculas.',
    language: 'python',
    difficulty: 'easy',
    points: 60,
    initialCode: 'def solve(text):\n    # Tu código aquí\n    pass',
    testCases: [
      { id: '2-1', input: 'Hola mundo', expectedOutput: '4', isHidden: false },
      { id: '2-2', input: 'PROGRAMAR', expectedOutput: '3', isHidden: false },
      { id: '2-3', input: 'xyz', expectedOutput: '0', isHidden: true },
    ],
  },
  {
    id: '3',
    title: 'Palíndromo',
    description: 'Determina si una palabra se lee igual de izquierda a derecha y de derecha a izquierda.',
    language: 'typescript',
    difficulty: 'medium',
    points: 80,
    initialCode: 'function solve(word: string): boolean {\n  // Tu código aquí\n  return false;\n}',
    testCases: [
      { id: '3-1', input: 'reconocer', expectedOutput: 'true', isHidden: false },
      { id: '3-2', input: 'casa', expectedOutput: 'false', isHidden: false },
      { id: '3-3', input: 'neuquen', expectedOutput: 'true', isHidden: true },
    ],
  },
  {
    id: '4',
    title: 'Número Primo',
    description: 'Indica si un número entero mayor que uno es primo.',
    language: 'java',
    difficulty: 'medium',
    points: 90,
    initialCode: 'public static boolean solve(int number) {\n    // Tu código aquí\n    return false;\n}',
    testCases: [
      { id: '4-1', input: '17', expectedOutput: 'true', isHidden: false },
      { id: '4-2', input: '21', expectedOutput: 'false', isHidden: false },
      { id: '4-3', input: '2', expectedOutput: 'true', isHidden: true },
    ],
  },
  {
    id: '5',
    title: 'Máximo Común Divisor',
    description: 'Calcula el máximo común divisor de dos números positivos.',
    language: 'cpp',
    difficulty: 'hard',
    points: 120,
    initialCode: 'int solve(int a, int b) {\n    // Tu código aquí\n    return 0;\n}',
    testCases: [
      { id: '5-1', input: '48 18', expectedOutput: '6', isHidden: false },
      { id: '5-2', input: '25 15', expectedOutput: '5', isHidden: false },
      { id: '5-3', input: '1071 462', expectedOutput: '21', isHidden: true },
    ],
  },
];

export const languageLabels: Record<Exercise['language'], string> = {
  javascript: 'JavaScript',
  python: 'Python',
  typescript: 'TypeScript',
  java: 'Java',
  cpp: 'C++',
};

export const difficultyLabels: Record<Exercise['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};