// list of clues - static
// matrix of solution - static
// matrix of entries - user interaction

import { useCallback, useEffect, useMemo, useState } from "react";
import { Cell } from "./cell";
import { Grid } from "./grid/grid";
import { Row } from "./row";
import {
  CursorDirection,
  Matrix15x15,
  CellContents,
  CellCoordinates,
  PuzzleDirection,
  Direction,
  // Clues
} from "./types";
// import { clues } from "./constants";
import { solution } from "./constants";
// import { Word } from "./utils";
import { useWord, Word } from "@/hooks/useWord";
import { useNumbering } from "@/hooks/useNumbering";
import { usePuzzle } from "@/hooks/usePuzzle";

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
  const [clueDirection, setClueDirection] = useState<PuzzleDirection>(
    Direction.Across
  );

  const { shape, emptySolution } = usePuzzle(solution);

  const [userSolution, setUserSolution] =
    useState<Matrix15x15<CellContents>>(emptySolution);

  const {
    allCells,
    wordsAreEqual,
    cellIsInWord,
    wordCells,
    acrossWords,
    downWords,
    allWords,
  } = useWord(shape);

  const { cellNumber } = useNumbering(allWords);

  const [focusedWord, setFocusedWord] = useState<Word>(acrossWords[0]);

  useEffect(() => {
    const word = allCells[`${focusedCell}`][clueDirection];
    if (!wordsAreEqual(word, focusedWord)) {
      setFocusedWord(word);
    }
  }, [clueDirection, focusedCell]);

  useEffect(() => {
    // todo: make this handle backspace
    const x = () => () => {};
    setFocusedCell(
      clueDirection === Direction.Across
        ? nextEmptyCell(Direction.Down)
        : nextEmptyCell(Direction.Across)
    );
  }, [userSolution]);

  const flipDirection = () => {
    if (clueDirection === Direction.Across) return Direction.Down;
    else return Direction.Across;
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

  // todo: maybe have interactive updating array of all available words left to fill and navigating is as easy as moving/removing words

  const cellIsFocused = (coordinates: CellCoordinates): boolean => {
    const [row, column] = coordinates;
    const [focusedRow, focusedColumn] = focusedCell;
    return row === focusedRow && column === focusedColumn;
  };

  const isInFocusedWord = (coordinates: CellCoordinates): boolean => {
    return cellIsInWord(coordinates, focusedWord);
  };

  const findEmptyCellInWord = (word: Word): CellCoordinates | undefined => {
    const nextEmptyCellStartingFromFocusedCell = nextEmptyCellInWord(word);

    if (nextEmptyCellStartingFromFocusedCell) {
      return nextEmptyCellStartingFromFocusedCell;
    }

    const firstEmptyCellBeforeFocusedCell = firstEmptyCellInWord(word);

    if (firstEmptyCellBeforeFocusedCell) {
      return firstEmptyCellBeforeFocusedCell;
    }
  };

  const firstEmptyCellInGrid = (direction: Direction): CellCoordinates => {
    const wordList = direction === Direction.Across ? acrossWords : downWords;

    const firstWord = wordList.find((word) => {
      const hasEmpties = wordCells(word).some((cell) => {
        const [rIdx, cIdx] = cell;
        return userSolution[rIdx][cIdx] === "";
      });

      if (hasEmpties) return word;
    });

    if (!firstWord) return focusedCell;

    return firstEmptyCellInWord(firstWord) as CellCoordinates;
  };

  const nextWordWithEmpties = (): Word | undefined => {
    const wordList =
      clueDirection === Direction.Across ? acrossWords : downWords;

    const stringifiedAcrossWords = wordList.map((word) => JSON.stringify(word));
    const stringifiedFocusedWord = JSON.stringify(focusedWord);
    const currentWordIndex = stringifiedAcrossWords.indexOf(
      stringifiedFocusedWord
    );

    return wordList.find((word, idx) => {
      const hasEmpties = wordCells(word).some((cell) => {
        const [rIdx, cIdx] = cell;
        return userSolution[rIdx][cIdx] === "";
      });
      if (idx > currentWordIndex && hasEmpties) return word;
    });
  };

  // const previousWordWithEmpties = (): Word | undefined => {};

  const firstEmptyCellInWord = (word: Word): CellCoordinates | undefined => {
    return wordCells(word).find((cell) => {
      const [rIdx, cIdx] = cell;

      return userSolution[rIdx][cIdx] === "";
    });
  };

  const nextEmptyCellInWord = (word: Word): CellCoordinates | undefined => {
    const cells = wordCells(word);

    const wordStartIndex =
      clueDirection === Direction.Across ? cells[0][1] : cells[0][0];

    const userCells = cells.map((cell) => userSolution[cell[0]][cell[1]]);

    const startingPoint =
      clueDirection === Direction.Across ? focusedCell[1] : focusedCell[0];

    const nextEmptyCoordinate = userCells.indexOf(
      "",
      startingPoint - wordStartIndex
    );

    if (nextEmptyCoordinate > -1) {
      const finalCoordinate = nextEmptyCoordinate + wordStartIndex;

      return clueDirection === Direction.Across
        ? [focusedCell[0], finalCoordinate]
        : [finalCoordinate, focusedCell[1]];
    }
  };

  const nextEmptyCell = (nextDirection: Direction): CellCoordinates => {
    const [rIdx, cIdx] = focusedCell;
    if (userSolution[rIdx][cIdx] === "") {
      return focusedCell;
    }

    const cellInWord = findEmptyCellInWord(focusedWord);

    if (cellInWord) return cellInWord;

    const nextWordWithEmptiesAfterCurrent = nextWordWithEmpties();

    if (nextWordWithEmptiesAfterCurrent) {
      return firstEmptyCellInWord(
        nextWordWithEmptiesAfterCurrent
      ) as CellCoordinates;
    }

    changeDirection();
    return firstEmptyCellInGrid(nextDirection);
  };

  // todo: define a nextEmptyCell function that just finds the next empty cell in the puzzle

  /*
onKeyUp,
-- if backspace, clear cell contents
-- if tab, go to first empty cell of next clue
if shift-tab, go to the first of empty cell of previous clue
if single character (letters),
  -- input letter to cell
  -- if current word not finished, goto next empty cell in current direction
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
          event.preventDefault();

          const direction = code.replace("Arrow", "") as CursorDirection;
          moveCursor(direction, [row, column]);
          break;
        case "Tab":
          event.preventDefault();

          if (!event.shiftKey) {
            const nextEmptyWord = nextWordWithEmpties() as Word;

            const nextFocusedCell = firstEmptyCellInWord(
              nextEmptyWord
            ) as CellCoordinates;

            setFocusedWord(nextEmptyWord);
            setFocusedCell(nextFocusedCell);
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
          if (event.altKey || event.metaKey) return;
          event.preventDefault();
          const letterCopy: Matrix15x15<CellContents> = JSON.parse(
            JSON.stringify(userSolution)
          );
          // note: this breaks when typing real fast, implement a debounce
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
