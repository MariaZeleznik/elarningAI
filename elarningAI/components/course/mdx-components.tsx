'use client';

// Exporting mdx components from a 'use client' file ensures Next.js includes
// these client components in the browser bundle even when used inside RSC-rendered MDX.
export { CodeExercise } from './code-exercise';
