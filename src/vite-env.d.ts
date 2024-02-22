/// <reference types="vite/client" />

declare module 'kor-string-similarity' {
  export const compareTwoStrings: (target: string, comparedStr: string) => number
  export const findBestMatch: (target: string, comparedArr: string[]) => { _text: string; similarity: number } | undefined
  export const arrangeBySimilarity: (target: string, comparedArr: string[]) => Array<{ _text: string; similarity: number }>
}
