import {
  CellCoordinates,
  Matrix15x15,
  PuzzleDirection,
  Direction,
} from "@/components/crossword";
import { useCallback, useMemo } from "react";

export type Word = {
  startingCoordinates: CellCoordinates;
  direction: PuzzleDirection;
  length: number;
};

// note: this type can't handle danglers (super rare edge case)
type CellWords = {
  across: Word;
  down: Word;
};

type AllCells = {
  [k: string]: CellWords;
};

export const useWord = (
  // userSolution: Matrix15x15<string | null>,
  shape: Matrix15x15<boolean>
) => {
  const calculateWordLength = useCallback(
    (array: boolean[], cellIdx: number): number => {
      const nextBlack = array.indexOf(false, cellIdx);
      const wordEnd = nextBlack != -1 ? nextBlack : shape.length;
      return wordEnd - cellIdx;
    },
    []
  );

  const wordCells = (word: Word): CellCoordinates[] => {
    const [rowIdx, columnIdx] = word.startingCoordinates;
    if (word.direction === "across") {
      const columnIdxs = [...Array(word.length).keys()].map(
        (i) => i + columnIdx
      );

      return columnIdxs.map((idx) => [rowIdx, idx] as CellCoordinates);
    } else {
      const rowIdxs = [...Array(word.length).keys()].map((i) => i + rowIdx);
      return rowIdxs.map((idx) => [idx, columnIdx] as CellCoordinates);
    }
  };

  const wordsAreEqual = (word1: Word, word2: Word): boolean => {
    const [word1Row, word1Column] = word1.startingCoordinates;
    const [word2Row, word2Column] = word2.startingCoordinates;
    return (
      word1Row === word2Row &&
      word1Column === word2Column &&
      word1.direction == word2.direction &&
      word1.length == word2.length
    );
  };

  const cellIsInWord = (coordinates: CellCoordinates, word: Word) => {
    const coordinatesStringified = JSON.stringify(coordinates);
    const cellsInWordStringified = JSON.stringify(wordCells(word));
    const inArray = cellsInWordStringified.indexOf(coordinatesStringified);
    return inArray != -1;
  };

  const acrossWords: Word[] = [];
  const downWords: Word[] = [];

  const allCells = useMemo(() => {
    const allCellsLocal: AllCells = {};

    acrossWords.length = 0;
    downWords.length = 0;

    shape.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (!cell) return;
        if (cIdx === 0 || !row[cIdx - 1]) {
          const acrossLength = calculateWordLength(row, cIdx);
          acrossWords.push({
            startingCoordinates: [rIdx, cIdx],
            direction: Direction.Across,
            length: acrossLength,
          });
        }

        const column = shape.map((row) => row[cIdx]);
        if (rIdx === 0 || !column[rIdx - 1]) {
          const downLength = calculateWordLength(column, rIdx);
          downWords.push({
            startingCoordinates: [rIdx, cIdx],
            direction: Direction.Down,
            length: downLength,
          });
        }
        allCellsLocal[`${rIdx},${cIdx}`] = {
          across: acrossWords[acrossWords.length - 1],
          down: downWords.find((word) =>
            cellIsInWord([rIdx, cIdx], word)
          ) as Word,
        };
      });
    });
    return allCellsLocal;
  }, [shape]);

  const nextWord = () => {};

  const previousWord = () => {};

  const nextIncompleteWord = () => {};

  const previousIncompleteWord = () => {};

  return {
    nextWord,
    previousWord,
    nextIncompleteWord,
    previousIncompleteWord,
    allCells,
    wordsAreEqual,
    cellIsInWord,
    wordCells,
    acrossWords,
    downWords,
    allWords: [...acrossWords, ...downWords],
  };
};
