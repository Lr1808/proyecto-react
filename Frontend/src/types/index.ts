export type Role = 'STUDENT' | 'TEACHER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    streakDays: number;
    score: number;
    badges: string[];
}

export interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

export interface Exercise {
    id: string;
    title: string;
    description: string;
    language: 'javascript' | 'python' | 'typescript' | 'java' | 'cpp';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    initialCode: string;
    testCases: TestCase[];
}

export interface SubmissionResult {
    passed: boolean;
    output: string;
    executionTime: number;
    testCaseId: string;
}

export interface Message {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
}