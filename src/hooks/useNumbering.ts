import { CellCoordinates, Matrix15x15 } from "@/components/crossword";
import { Word } from "./useWord";

export const useNumbering = (allWords: Word[]) => {
  const allStartingCoordinates = allWords.map(
    (word) => word.startingCoordinates
  );

  let uniqueStartingCoordinates: CellCoordinates[] = [];

  allStartingCoordinates.forEach((cell) => {
    const [rIdx, cIdx] = cell;

    const alreadyInThere = uniqueStartingCoordinates.some((existingCell) => {
      const [eRIdx, eCIdx] = existingCell;
      return rIdx === eRIdx && cIdx === eCIdx;
    });

    if (!alreadyInThere) {
      uniqueStartingCoordinates.push(cell);
    }
  });

  const sortedUniqueStartingCoordinates = uniqueStartingCoordinates.toSorted(
    (a, b) => {
      const [aRIdx, aCIdx] = a;
      const [bRIdx, bCIdx] = b;

      return aRIdx - bRIdx || aCIdx - bCIdx;
    }
  );
  const cellNumber = (cell: CellCoordinates) => {
    const [rIdx, cIdx] = cell;
    const index = sortedUniqueStartingCoordinates.findIndex((nCell) => {
      const [nRIdx, nCIdx] = nCell;
      return rIdx === nRIdx && cIdx === nCIdx;
    });

    if (index > -1) {
      return index + 1;
    }
  };

  return { cellNumber };
};
