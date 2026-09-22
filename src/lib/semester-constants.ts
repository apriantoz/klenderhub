export const SEMESTER = [1, 2, 3, 4, 5, 6, 7] as const;

export type Semester = typeof SEMESTER[number];