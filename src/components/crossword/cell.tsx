import { CellContents, CellCoordinates, Matrix15x15 } from "./types";
import styles from "./styles.cell.module.scss";
import { Dispatch, SetStateAction } from "react";

type CellProps = {
  contents: CellContents;
  userSolution: Matrix15x15<CellContents>;
  row: number;
  column: number;
  setFocusedCell: Dispatch<SetStateAction<CellCoordinates>>;
  changeDirection: () => void;
  isFocused: boolean;
  isInFocusedWord: boolean;
};

const BlackCell = () => <span className={`${styles.cell} bg-black`} />;

export const Cell = ({
  contents,
  userSolution,
  row,
  column,
  isFocused,
  isInFocusedWord,
  setFocusedCell,
  changeDirection,
}: CellProps) => {
  let cssClassName = `${styles.cell} ${styles.inputCell}`;

  if (isInFocusedWord) {
    cssClassName += ` ${styles.isFocusedWord}`;
  }

  if (isFocused) {
    cssClassName += ` ${styles.isFocusedCell}`;
  }

  const handleSetFocusedCell = () => {
    if (isFocused) {
      changeDirection();
    } else {
      setFocusedCell([row, column]);
    }
  };

  if (typeof contents === "string") {
    return (
      <span className={cssClassName} onClick={handleSetFocusedCell}>
        {userSolution[row][column]}
      </span>
    );
  } else {
    return <BlackCell />;
  }
};
