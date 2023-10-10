import {
  CellContents,
  CellCoordinates,
  CursorDirection,
  Matrix15x15,
} from "./types";
import styles from "./styles.cell.module.scss";
import { Dispatch, SetStateAction, useRef } from "react";

type CellProps = {
  contents: CellContents;
  userSolution: Matrix15x15<CellContents>;
  updateUserSolution: Dispatch<SetStateAction<Matrix15x15<CellContents>>>;
  moveCursor: (
    direction: CursorDirection,
    cellCoordinates: CellCoordinates
  ) => void;
  row: number;
  column: number;
  onFocus: Dispatch<SetStateAction<CellCoordinates>>;
  isFocused: boolean;
};

const BlackCell = () => <span className={`${styles.cell} bg-black`} />;

export const Cell = ({
  contents,
  userSolution,
  updateUserSolution,
  moveCursor,
  row,
  column,
  onFocus,
  isFocused,
}: CellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (isFocused && inputRef.current) {
    inputRef.current.focus();
  }

  const handleOnFocus = () => {
    // todo: simplify if possible
    onFocus([row, column]);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const event = e.nativeEvent;
    const key = event.key;
    const code = event.code;

    // console.log(event);

    switch (code) {
      case "Space":
        // handleChangeDirection
        break;
      case code.match(/^Arrow/)?.input:
        const direction = code.replace("Arrow", "") as CursorDirection;
        moveCursor(direction, [row, column]);
        break;
      // case "ArrowRight":
      //   console.log("matching explicit");
      //   // moveCursor("right", [row, column]);
      //   break;
      // case "ArrowLeft":
      //   moveCursor("left", [row, column]);
      //   break;
      // case "ArrowDown":
      //   moveCursor("down", [row, column]);
      //   break;
      // case "ArrowUp":
      //   moveCursor("up", [row, column]);
      //   break;
      case "Tab":
        if (!event.shiftKey) {
          // handleNextWord
        } else {
          // handlePreviousWord (or maybe handleNextWord(-1) or something)
        }
        break;
      case "Backspace":
        // handleEmptyCell
        const backspaceCopy: Matrix15x15<CellContents> = JSON.parse(
          JSON.stringify(userSolution)
        );
        backspaceCopy[row][column] = "";
        updateUserSolution(backspaceCopy);
        break;
      case `Key${key.toUpperCase()}`:
        const letterCopy: Matrix15x15<CellContents> = JSON.parse(
          JSON.stringify(userSolution)
        );
        letterCopy[row][column] = key.toUpperCase();
        updateUserSolution(letterCopy);
        // updateUserSolution(userSolution => userSolution[coordinates[0]][coordinates[1]] = event.key.toLocaleUpperCase())
        // updateUserSolution(userSolution => userSolution)
        break;
      default:
        break;
    }
  };

  if (typeof contents === "string") {
    return (
      <input
        type="text"
        readOnly
        className={`${styles.cell} ${styles.inputCell}`}
        onKeyUp={handleOnKeyDown}
        onFocus={handleOnFocus}
        value={userSolution[row][column] as string}
        ref={inputRef}
      />
    );
  } else {
    return <BlackCell />;
  }
};
