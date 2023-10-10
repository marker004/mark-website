// list of clues - static
// matrix of solution - static
// matrix of entries - user interaction

import { useState } from "react";
import { Cell } from "./cell";
import { Grid } from "./grid";
import { Row } from "./row";
import {
  CursorDirection,
  Matrix15x15,
  CellContents,
  CellCoordinates,
  PuzzleDirection,
  HorizontalDirection,
  VerticalDirection,
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

// class Word {
//   startingCoordinate: CellCoordinates;

//   constructor(startingCoordinate: CellCoordinates) {
//     this.startingCoordinate = startingCoordinate;
//   }

//   isX = () => true;
// }

// const acrossWords = solution.map((row) => {
//   row.map((contents, idx) => {
//     const isBeginningOfWord = idx === 0 || !row[idx - 1];
//     const isEndOfWord = !row[idx + 1] || idx === row.length - 1;
//     // console.log("row #", idx, contents, `isBeginningOfWord`, isBeginningOfWord);
//     // console.log("row #", idx, contents, `isEndOfWord`, isEndOfWord);
//   });
// });

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

// todo: render something like
/*
  <Grid>
    {solution.map((row, rIdx) => (
      <Row>
      {row.map((cell, cIdx) => (
        <Cell contents={cell} />
      ))}
      </Row>
    ))}
  </Grid>
  <Clues />
*/

/*
onKeyUp,
if backspace, clear cell contents
if tab, go to first empty cell of next clue
if shift-tab, go to the first of empty cell of previous clue
if single character (letters),
  if current word not finished, goto next empty cell in current direction
  else go to next cell of word
if direction,
  if word in same plane, move cursor one in that direction
  else change direction
if non-letter, ignore
if single character in last empty space, change direction and go to first empty character in new direction
if space, change direction
 */

// export const Crossword = (
//   clues: Clues,
//   solution: Matrix15x15<Cell>
// ) => {
export const Crossword = () => {
  const [focusedCell, setFocusedCell] = useState<CellCoordinates>([0, 0]);
  const [clueDirection, setClueDirection] = useState<PuzzleDirection>("down");

  // console.log(focusedCell);

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
          setFocusedCell([rowIdx, colr]);
          break;
        case "Left":
          const coll = row.lastIndexOf(true, columnIdx - 1);
          setFocusedCell([rowIdx, coll < row.length - 1 ? coll : 0]);
          break;
        case "Up":
          console.log('case "up":');
          const rowu = column.lastIndexOf(true, rowIdx - 1);
          setFocusedCell([rowu < column.length - 1 ? rowu : 0, columnIdx]);
          break;
        case "Down":
          const rowd = column.indexOf(true, rowIdx + 1);
          setFocusedCell([rowd, columnIdx]);
          console.log('case "down":');
          break;
      }
    } else {
      setClueDirection((clueDirection) => {
        if (clueDirection === "down") return "across";
        else return "down";
      });
    }
  };

  const emptySolution = solution.map((row) =>
    row.map((cell) => (!!cell ? ("" as string) : null))
  ) as Matrix15x15<string | null>;

  const [userSolution, setUserSolution] =
    useState<Matrix15x15<CellContents>>(emptySolution);

  const isFocused = (coordinates: CellCoordinates): boolean => {
    const [row, column] = coordinates;
    return focusedCell.toString() == [row, column].toString();
  };

  // console.log(userSolution);
  // prettier-ignore
  return (
    <>
      {/* {solution.map((row, idx) => (
        <Row key={idx} cells={row} />
      ))} */}
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
                updateUserSolution={setUserSolution}
                moveCursor={moveCursor}
                onFocus={setFocusedCell}
                isFocused={isFocused([rIdx, cIdx])}
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