import { useMemo, useState } from "react";
import { Matrix15x15, CellContents, Clues } from "../components/crossword";

export const usePuzzle = (solution: Matrix15x15<CellContents>) => {
  const shape: Matrix15x15<boolean> = solution.map((row) =>
    row.map((cell) => !!cell)
  ) as Matrix15x15<boolean>;

  const emptySolution = useMemo(
    () =>
      solution.map((row) =>
        row.map((cell) => (!!cell ? ("" as string) : null))
      ) as Matrix15x15<string | null>,
    []
  );

  return { shape, emptySolution };
};
