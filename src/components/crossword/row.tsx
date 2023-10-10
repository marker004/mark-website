import { ReactNode } from "react";
import { Cell } from "./cell";
import { Tuple15, CellContents } from "./types";

type RowProps = {
  // cells: Tuple15<CellContents>;
  children: ReactNode;
};

export const Row = ({ children }: RowProps) => {
  return (
    <div>
      {children}
      {/* {cells.map((cell, idx) => (
        <Cell key={idx} contents={cell} />
      ))} */}
    </div>
  );
};
