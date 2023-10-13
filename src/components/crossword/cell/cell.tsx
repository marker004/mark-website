import { CellContents, CellCoordinates, Matrix15x15 } from "../types";
import styles from "./styles.module.scss";
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
  number?: number;
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
  number,
}: CellProps) => {
  let cssClassName = styles.cell;

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
      <>
        <span className={cssClassName} onClick={handleSetFocusedCell}>
          <span className={styles.number}>{number}</span>
          {userSolution[row][column]}
        </span>
      </>
    );
  } else {
    return <BlackCell />;
  }
};
