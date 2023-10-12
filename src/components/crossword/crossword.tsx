// list of clues - static
// matrix of solution - static
// matrix of entries - user interaction

import { useCallback, useEffect, useState } from "react";
import { Cell } from "./cell";
import { Grid } from "./grid";
import { Row } from "./row";
import {
  CursorDirection,
  Matrix15x15,
  CellContents,
  CellCoordinates,
  PuzzleDirection,
} from "./types";

// prettier-ignore
const solution: Matrix15x15<CellContents> = [
  ["I", "D", "L", "Y", null, "E", "G", "G", "S", null, "S", "A", "C", "H", "A"],
  ["R", "I", "A", "A", null, "E", "U", "R", "O", null, "E", "M", "A", "I", "L"],
  ["M", "A", "R", "K", "A", "N", "S", "A", "S", null, "M", "C", "G", "E", "E"],
  ["A", "L", "B", "U", "S", null, null, "M", "A", "C", "I", null, "E", "S", "S"],
  [null, null, null, "T", "E", "N", "A", "M", null, "A", "H", "A", null, null, null],
  ["V", "A", "R", null, "A", "B", "B", "Y", "S", "T", "A", "N", "D", "E", "R"],
  ["I", "D", "E", "S", null, "C", "A", "S", "H", null, "R", "A", "I", "M", "I"],
  ["C", "O", "M", "P", "A", "S", "S", null, "O", "L", "D", "M", "A", "I", "D"],
  ["A", "B", "O", "R", "G", null, "I", "G", "G", "Y", null, "E", "R", "L", "E"],
  ["R", "O", "W", "A", "N", "G", "C", "H", "U", "N", "G", null, "Y", "E", "R"],
  [null, null, null, "Y", "O", "U", null, "A", "N", "N", "A", "L", null, null, null],
  ["R", "S", "T", null, "S", "T", "A", "N", null, null, "P", "H", "A", "G", "E"],
  ["I", "C", "A", "N", "T", null, "S", "I", "L", "A", "S", "A", "G", "N", "A"],
  ["T", "U", "C", "C", "I", null, "H", "A", "I", "M", null, "S", "O", "A", "R"],
  ["A", "D", "H", "O", "C", null, "E", "N", "D", "S", null, "A", "G", "T", "S"],
];

const shape = solution.map((row) =>
  row.map((cell) => !!cell)
) as Matrix15x15<boolean>;

// word is a starting coordinate, direction, and length

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
    return (
      this.startingCoordinate == word.startingCoordinate &&
      this.direction == word.direction &&
      this.length == word.length
    );
  };

  // isFull = (): boolean => {
  //   return userSolution;
  // };
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

// across
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

type Clues = {
  across: string[];
  down: string[];
};
/*
square is numbered if it is:
beginning of row
after (to the right of) a null (black)
first column
below (same index as) a null (black)
*/
const clues: Clues = {
  across: [
    `Inactively`,
    `Urges`,
    `___ Baron Cohen`,
    `Diamond, Platinum, and Gold certifiers: Abbr`,
    `___zone, with Finland and France, but not Sweden or Switzerland`,
    `What many meetings could have been`,
    `Sea to a Spaniard + Dorothy's home state`,
    `"___ and Me!"`,
    `___ Dumbledore`,
    `Bookout of "16 and Pregnant" and "Teen Mom"`,
    `Dangerous type of curve, maybe`,
    `Mid-morning hour`,
    `"Take on Me" band`,
    `Soccer replay official, for short`,
    `You may find one in a 6 pack + Onlooker`,
    `Mid-March hazard`,
    `It's cold and hard`,
    `Director of "The Evil Dead" and "The Quick and the Dead"`,
    `Its needle always points North`,
    `Mary's alternate reality fate in "It's a Wonderful Life"`,
    `Seven of Nine, for one`,
    `Leader of a band of Stooges?`,
    `Writer ___ Stanley Gardner`,
    `___ Khanna (California's 17th) + "Everybody Have Fun Tonight" band`,
    `"___ Blues" from The Beatles "The Beatles"`,
    `The pronoun of the person doing this puzzle?`,
    `Record of the year?`,
    `What may sometimes come between Q and U in English?`,
    `NBA's Van Gundy`,
    `Germicidal germ`,
    `"This's too much"`,
    `Yucatan Yes + Garfield's Favorite Food`,
    `Director and Star of Big Night (1996)`,
    `Group of Women in Music (Pt III)`,
    `John Ashcroft's "Let the Eagle ___"`,
    `As necessary`,
    `Where hairs are usually split`,
    `Some F.B.I`,
  ],
  down: [
    `Strongest Hurricane of 2017`,
    `Clock face, or a big name in soap`,
    `Meaty Southeast Asian Salad`,
    `Official language of the Russian Republic of Sakha`,
    `Nighttime, poetically`,
    `Astronaut Grissom`,
    `Music awards ceremony`,
    `Only three-time member of the 60 home run club`,
    `Like Manchego, Gouda or Cheddar`,
    `Station for Mad Men`,
    `Nick of The Wicker Man`,
    `Races, archaically`,
    `Some are browns, some are pales, some are reals, all are...`,
    `Toward the ocean`,
    `Creature with nine lives`,
    `___ Saturday Night (Original title of SNL)`,
    `Unable to walk`,
    `"What's in ___?"`,
    `Anglican parish priest`,
    `Chipotle marinade`,
    `Fix the lawn, maybe`,
    `Ancient Japanese military dictator`,
    `Log`,
    `Hirsch of "Into the Wild"`,
    `1994 Slam Dunk Contest Champion J.R.`,
    `"Say it, don't ___ it"`,
    `One who doesn't claim to know`,
    `Red Sox Hall of Famer Fred`,
    `Neighbor of an Ivorian and a Togolese`,
    `A certain type of feeling`,
    `Breaks in continuity`,
    `Capital of Tibet`,
    `A lovely meter maid`,
    `A type of surface to surface missile`,
    `RPM measurer, for short`,
    `Tennis champion and AIDS activist Arthur`,
    `Wide-eyed`,
    `A tiny insect that mates in a swarm`,
    `"I'm all ___"`,
    `Sgt or Cpl`,
    `One of three around the eye of 22-Down`,
    `Trans and Pan, for two`,
  ],
};

/*
onKeyUp,
if backspace, clear cell contents
if tab, go to first empty cell of next clue
if shift-tab, go to the first of empty cell of previous clue
if single character (letters),
  if current word not finished, goto next empty cell in current direction
  else
    if not last cell of word go to next cell of word
    else goto next empty cell in current direction
if direction (left, right, up, down arrow),
  if word in same plane, move cursor one in that direction
  else change direction
if non-letter, ignore
if single character in last empty space, change direction and go to first empty character in new direction
if space, change direction
 */

/*
onClick
if not already focused, focus (this is automatic with inputs)
else, change direction
*/

// export const Crossword = (
//   clues: Clues,
//   solution: Matrix15x15<Cell>
// ) => {
export const Crossword = () => {
  const [focusedCell, setFocusedCell] = useState<CellCoordinates>([0, 0]);
  const [focusedWord, setFocusedWord] = useState<Word>(acrossWords[0]);
  const [clueDirection, setClueDirection] = useState<PuzzleDirection>("across");

  useEffect(() => {
    const word = allCells[`${focusedCell}`][clueDirection];
    if (!word.equals(focusedWord)) {
      console.log("setting focused Word");
      setFocusedWord(word);
    }
  }, [clueDirection, focusedCell]);

  const changeDirection = () => {
    setClueDirection((clueDirection) => {
      if (clueDirection === "down") return "across";
      else return "down";
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", function (e: KeyboardEvent) {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    });
  }, []);

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

  const emptySolution = solution.map((row) =>
    row.map((cell) => (!!cell ? ("" as string) : null))
  ) as Matrix15x15<string | null>;

  const [userSolution, setUserSolution] =
    useState<Matrix15x15<CellContents>>(emptySolution);

  const cellIsFocused = (coordinates: CellCoordinates): boolean => {
    const [row, column] = coordinates;
    const [focusedRow, focusedColumn] = focusedCell;
    return row === focusedRow && column === focusedColumn;
  };

  const isInFocusedWord = (coordinates: CellCoordinates): boolean => {
    return isInWord(coordinates, focusedWord);
  };
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
          changeDirection();
          break;
        case code.match(/^Arrow/)?.input:
          const direction = code.replace("Arrow", "") as CursorDirection;
          moveCursor(direction, [row, column]);
          break;
        case "Tab":
          if (!event.shiftKey) {
            // handleNextWord
            // const word = allWords.indexOf(focusedWord);
            // const nextEmptyWord = allWords.find((word) => word.)
            // console.log(word);
            // setFocusedWord()
          } else {
            // handlePreviousWord (or maybe handleNextWord(-1) or something)
          }
          break;
        case "Backspace":
          const backspaceCopy: Matrix15x15<CellContents> = JSON.parse(
            JSON.stringify(userSolution)
          );
          backspaceCopy[row][column] = "";
          setUserSolution(backspaceCopy);
          break;
        case `Key${key.toUpperCase()}`:
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
