// list of clues - static
// matrix of solution - static
// matrix of entries - user interaction

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cell } from "./cell";
import { Grid } from "./grid";
import { Row } from "./row";
import {
  CursorDirection,
  Matrix15x15,
  CellContents,
  CellCoordinates,
  PuzzleDirection,
  // Clues
} from "./types";
// import { clues } from "./constants";
import { solution } from "./constants";

const shape = solution.map((row) =>
  row.map((cell) => !!cell)
) as Matrix15x15<boolean>;

const emptySolution = solution.map((row) =>
  row.map((cell) => (!!cell ? ("" as string) : null))
) as Matrix15x15<string | null>;

class Word {
  startingCoordinate: CellCoordinates;
  direction: PuzzleDirection;
  length: number;

  constructor(
    startingCoordinate: CellCoordinates,
    direction: PuzzleDirection,
    length: number
  ) {
    this.startingCoordinate = startingCoordinate;
    this.direction = direction;
    this.length = length;
  }

  get cells() {
    const [rowIdx, columnIdx] = this.startingCoordinate;
    if (this.direction === "across") {
      const columnIdxs = [...Array(this.length).keys()].map(
        (i) => i + columnIdx
      );

      return columnIdxs.map((idx) => [rowIdx, idx] as CellCoordinates);
    } else {
      const rowIdxs = [...Array(this.length).keys()].map((i) => i + rowIdx);
      return rowIdxs.map((idx) => [idx, columnIdx] as CellCoordinates);
    }
  }

  equals = (word: Word) => {
    const [thisRow, thisColumn] = this.startingCoordinate;
    const [wordRow, wordColumn] = word.startingCoordinate;
    return (
      thisRow === wordRow &&
      thisColumn === wordColumn &&
      this.direction == word.direction &&
      this.length == word.length
    );
  };
}

const acrossWords: Word[] = [];
const downWords: Word[] = [];

// note: this type can't handle danglers (super rare edge case)
type CellWords = {
  across: Word;
  down: Word;
};

type AllCells = {
  [k: string]: CellWords;
};

const isInWord = (coordinates: CellCoordinates, word: Word) => {
  const coordinatesStringified = JSON.stringify(coordinates);
  const cellsInWordStringified = JSON.stringify(word.cells);
  const inArray = cellsInWordStringified.indexOf(coordinatesStringified);
  return inArray != -1;
};

const allCells: AllCells = {};

const calculateLength = (array: boolean[], cellIdx: number): number => {
  const nextBlack = array.indexOf(false, cellIdx);
  const wordEnd = nextBlack != -1 ? nextBlack : shape.length;
  return wordEnd - cellIdx;
};

shape.forEach((row, rIdx) => {
  row.forEach((cell, cIdx) => {
    if (!cell) return;
    if (cIdx === 0 || !row[cIdx - 1]) {
      const acrossLength = calculateLength(row, cIdx);
      acrossWords.push(new Word([rIdx, cIdx], "across", acrossLength));
    }

    const column = shape.map((row) => row[cIdx]);
    if (rIdx === 0 || !column[rIdx - 1]) {
      const downLength = calculateLength(column, rIdx);
      downWords.push(new Word([rIdx, cIdx], "down", downLength));
    }
    allCells[`${rIdx},${cIdx}`] = {
      across: acrossWords[acrossWords.length - 1],
      down: downWords.find((word) => isInWord([rIdx, cIdx], word)) as Word,
    };
  });
});

const allWords = [...acrossWords, ...downWords];

const allStartingCoordinates = allWords.map((word) => word.startingCoordinate);

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

/*
square is numbered if it is:
beginning of row
after (to the right of) a null (black)
first column
below (same index as) a null (black)
*/

// export const Crossword = (
//   clues: Clues,
//   solution: Matrix15x15<Cell>
// ) => {
export const Crossword = () => {
  const [focusedCell, setFocusedCell] = useState<CellCoordinates>([0, 0]);
  const [focusedWord, setFocusedWord] = useState<Word>(acrossWords[0]);
  const [clueDirection, setClueDirection] = useState<PuzzleDirection>("across");
  const [userSolution, setUserSolution] =
    useState<Matrix15x15<CellContents>>(emptySolution);

  useEffect(() => {
    // console.log(focusedCell);
    const word = allCells[`${focusedCell}`][clueDirection];
    if (!word.equals(focusedWord)) {
      setFocusedWord(word);
    }
  }, [clueDirection, focusedCell]);

  useEffect(() => {
    // todo: make this handle backspace
    setFocusedCell(
      clueDirection === "across" ? nextEmptyCellAcross() : nextEmptyCellDown()
    );
  }, [userSolution]);

  const flipDirection = (direction: PuzzleDirection) => {
    if (clueDirection === "down") return "across";
    else return "down";
  };

  const changeDirection = () => {
    setClueDirection(flipDirection);
  };

  const moveCursor = (
    direction: CursorDirection,
    cellCoordinates: CellCoordinates
  ) => {
    const matches = {
      across: ["Right", "Left"],
      down: ["Up", "Down"],
    };

    const [rowIdx, columnIdx] = cellCoordinates;

    if (matches[clueDirection].includes(direction)) {
      const row = shape[rowIdx];
      const column = shape.map((row) => row[columnIdx]);
      switch (direction) {
        case "Right":
          const colr = row.indexOf(true, columnIdx + 1);
          setFocusedCell([rowIdx, colr > -1 ? colr : row.length - 1]);
          break;
        case "Left":
          const coll = row.lastIndexOf(true, columnIdx - 1);
          setFocusedCell([rowIdx, coll < row.length - 1 ? coll : 0]);
          break;
        case "Up":
          const rowu = column.lastIndexOf(true, rowIdx - 1);
          setFocusedCell([rowu < column.length - 1 ? rowu : 0, columnIdx]);
          break;
        case "Down":
          const rowd = column.indexOf(true, rowIdx + 1);
          setFocusedCell([rowd > -1 ? rowd : column.length - 1, columnIdx]);
          break;
      }
    } else {
      changeDirection();
    }
  };

  const cellIsFocused = (coordinates: CellCoordinates): boolean => {
    const [row, column] = coordinates;
    const [focusedRow, focusedColumn] = focusedCell;
    return row === focusedRow && column === focusedColumn;
  };

  const isInFocusedWord = (coordinates: CellCoordinates): boolean => {
    return isInWord(coordinates, focusedWord);
  };

  // may be reusable for across if given a direction param
  const findInDownWord = (word: Word): CellCoordinates | undefined => {
    const cells = word.cells;
    const [focusedRIdx, focusedCIdx] = focusedCell;

    // const focusedCellIndexInWord = cells.findIndex((cell, idx) => {
    //   const [rIdx, cIdx] = cell;
    //   return rIdx === focusedRIdx && cIdx === focusedCIdx;
    // });

    const rowLetters = cells.reduce<Record<string, string>>((acc, cell) => {
      const [rIdx, cIdx] = cell;
      acc[rIdx] = userSolution[rIdx][cIdx] as string;
      return acc;
    }, {});

    const emptyCellAfterFocusedCell = Object.entries(rowLetters).find(
      ([rIdx, userValue]) => {
        return userValue === "" && parseInt(rIdx) > focusedRIdx;
      }
    );

    const firstEmptyCellBeforeFocusedCell = Object.entries(rowLetters).find(
      ([rIdx, userValue]) => {
        return userValue === "" && parseInt(rIdx) < focusedRIdx;
      }
    );

    if (emptyCellAfterFocusedCell) {
      return [parseInt(emptyCellAfterFocusedCell[0]), focusedCIdx];
    }

    if (firstEmptyCellBeforeFocusedCell) {
      return [parseInt(firstEmptyCellBeforeFocusedCell[0]), focusedCIdx];
    }
  };

  const firstEmptyAcrossCell = (): CellCoordinates => {
    const firstEmptyIndexByRow = userSolution.map((row) =>
      row.findIndex((cell) => cell === "")
    );

    const row = firstEmptyIndexByRow.findIndex((row) => row > -1);
    const column = firstEmptyIndexByRow.find((row) => row > -1);

    if (row > -1 && typeof column === "number" && column > -1) {
      return [row, column];
    }

    return focusedCell;
  };

  const firstEmptyDownCell = (): CellCoordinates => {
    const firstWord = downWords.find((word) => {
      const hasEmpties = word.cells.some((cell) => {
        const [rIdx, cIdx] = cell;
        return userSolution[rIdx][cIdx] === "";
      });

      if (hasEmpties) return word;
    });

    if (!firstWord) return focusedCell;

    return firstEmptyCellInWord(firstWord) as CellCoordinates;
  };

  // maybe reusable with "before/after" param
  const nextWordWithEmpties = (): Word | undefined => {
    const currentWordIndex = downWords.indexOf(focusedWord);

    return downWords.find((word, idx) => {
      const hasEmpties = word.cells.some((cell) => {
        const [rIdx, cIdx] = cell;
        return userSolution[rIdx][cIdx] === "";
      });
      if (idx > currentWordIndex && hasEmpties) return word;
    });
  };

  const firstEmptyCellInWord = (word: Word): CellCoordinates | undefined => {
    return word.cells.find((cell) => {
      const [rIdx, cIdx] = cell;

      return userSolution[rIdx][cIdx] === "";
    });
  };

  const nextEmptyCellDown = (): CellCoordinates => {
    const [rIdx, cIdx] = focusedCell;
    if (userSolution[rIdx][cIdx] === "") {
      return focusedCell;
    }

    const cellInWord = findInDownWord(focusedWord);

    if (cellInWord) return cellInWord;

    const nextWordWithEmptiesAfterCurrent = nextWordWithEmpties();

    if (nextWordWithEmptiesAfterCurrent) {
      return firstEmptyCellInWord(
        nextWordWithEmptiesAfterCurrent
      ) as CellCoordinates;
    }

    changeDirection();
    return firstEmptyAcrossCell();
    // // nextWordBeforeCurrent
    // // const currentWordIndex = downWords.indexOf(focusedWord);

    // // const nextWordWithEmptiesBeforeCurrent = downWords.find((word, idx) => {
    // //   const hasEmpties = word.cells.some((cell) => {
    // //     const [rIdx, cIdx] = cell;
    // //     return userSolution[rIdx][cIdx] === "";
    // //   });
    // //   if (idx < currentWordIndex && hasEmpties) return word;
    // // });

    // // if (nextWordWithEmptiesBeforeCurrent) {
    // //   return firstEmptyCellInWord(
    // //     nextWordWithEmptiesBeforeCurrent
    // //   ) as CellCoordinates;
    // // }

    // // debugger;

    // return focusedCell;
  };

  // only works for across
  // todo: always go back to beginning of current word first
  const nextEmptyCellAcross = (): CellCoordinates => {
    const [rIdx, cIdx] = focusedCell;
    if (userSolution[rIdx][cIdx] === "") {
      return focusedCell;
    }

    const [currentRow, currentColumn] = focusedCell;

    const nextEmptyInRow = userSolution[currentRow].indexOf("", currentColumn);

    if (nextEmptyInRow > -1) return [currentRow, nextEmptyInRow];

    const firstEmptyIndexByRow = userSolution.map((row) =>
      row.findIndex((cell) => cell === "")
    );

    const laterRowWithEmpty = firstEmptyIndexByRow.findIndex(
      (emptyIndex, idx) => idx > currentRow && emptyIndex > -1
    );

    if (laterRowWithEmpty > -1) {
      return [laterRowWithEmpty, firstEmptyIndexByRow[laterRowWithEmpty]];
    }

    changeDirection();
    return firstEmptyDownCell();

    // const earlierRowWithEmpty = firstEmptyIndexByRow.findIndex(
    //   (emptyIndex, idx) => idx < currentRow && emptyIndex > -1
    // );

    // if (earlierRowWithEmpty > -1) {
    //   return [earlierRowWithEmpty, firstEmptyIndexByRow[earlierRowWithEmpty]];
    // }

    // if (firstEmptyIndexByRow[currentRow] > -1) {
    //   return [currentRow, firstEmptyIndexByRow[currentRow]];
    // }

    return focusedCell;
  };

  // const isWordFull = (word: Word): boolean => {};

  /*
onKeyUp,
-- if backspace, clear cell contents
if tab, go to first empty cell of next clue
if shift-tab, go to the first of empty cell of previous clue
if single character (letters),
  input letter to cell
  if current word not finished, goto next empty cell in current direction
  else
    if not last cell of word go to next cell of word
    else goto next empty cell in current direction
-- if direction (left, right, up, down arrow),
    if word in same plane, move cursor one in that direction
    else change direction
-- if non-letter, ignore
if single character in last empty space, change direction and go to first empty character in new direction
-- if space, change direction
 */
  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      const code = event.code;

      const [row, column] = focusedCell;

      switch (code) {
        case "Space":
          event.preventDefault();

          changeDirection();
          break;
        case code.match(/^Arrow/)?.input:
          const direction = code.replace("Arrow", "") as CursorDirection;
          moveCursor(direction, [row, column]);
          break;
        case "Tab":
          event.preventDefault();

          if (!event.shiftKey) {
            const nextEmptyWordIdx = allWords.findIndex((word, wIndex) => {
              const cells = word.cells;
              if (wIndex <= allWords.indexOf(focusedWord)) return false;
              const emptyCells = cells.some((cell) => {
                const [rIdx, cIdx] = cell;
                return userSolution[rIdx][cIdx] === "";
              });
              return emptyCells;
            });

            const nextEmptyWord = allWords[nextEmptyWordIdx];

            const focusedCell =
              nextEmptyWord.cells.find((cell) => {
                const [rIdx, cIdx] = cell;
                return userSolution[rIdx][cIdx] === "";
              }) || nextEmptyWord.cells[0];

            // debugger;
            // console.log(word);
            setFocusedWord(nextEmptyWord);
            setFocusedCell(focusedCell);
          } else {
            // handlePreviousWord (or maybe handleNextWord(-1) or something)
          }
          break;
        case "Backspace":
          event.preventDefault();

          const backspaceCopy: Matrix15x15<CellContents> = JSON.parse(
            JSON.stringify(userSolution)
          );
          backspaceCopy[row][column] = "";
          setUserSolution(backspaceCopy);
          // todo: also go back a space
          break;
        case `Key${key.toUpperCase()}`:
          event.preventDefault();

          if (event.altKey || event.metaKey) return;
          const letterCopy: Matrix15x15<CellContents> = JSON.parse(
            JSON.stringify(userSolution)
          );
          letterCopy[row][column] = key.toUpperCase();
          setUserSolution(letterCopy);
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focusedCell, clueDirection, focusedWord]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown);
    };
  }, [handleOnKeyDown]);

  const cellNumber = (cell: CellCoordinates) => {
    const [rIdx, cIdx] = cell;
    // const inThere = sortedUniqueStartingCoordinates.find(nCell => {
    //   const [nRIdx, nCIdx] = cell;
    //   return rIdx === nRIdx && cIdx === nCIdx;
    // });

    // if (inThere) {
    const index = sortedUniqueStartingCoordinates.findIndex((nCell) => {
      const [nRIdx, nCIdx] = nCell;
      return rIdx === nRIdx && cIdx === nCIdx;
    });

    if (index > -1) {
      return index + 1;
    }
    // }
  };

  return (
    <>
      <Grid>
        {userSolution.map((row, rIdx) => (
          <Row key={rIdx}>
            {row.map((cell, cIdx) => (
              <Cell
                key={`${rIdx}, ${cIdx}`}
                row={rIdx}
                column={cIdx}
                contents={cell}
                userSolution={userSolution}
                setFocusedCell={setFocusedCell}
                changeDirection={changeDirection}
                isFocused={cellIsFocused([rIdx, cIdx])}
                isInFocusedWord={isInFocusedWord([rIdx, cIdx])}
                number={cellNumber([rIdx, cIdx])}
              />
            ))}
          </Row>
        ))}
      </Grid>
      {/* <Clues /> */}
    </>
  );
};

// const clues: Matrix15x15<Clue | [Clue, Clue] | null> = [["Inactively", null, null, null, null, "Urges", "___ Baron Cohen"]];
