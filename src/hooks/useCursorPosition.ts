import { useState } from "react";
import {
  Matrix15x15,
  CellContents,
  CellCoordinates,
} from "../components/crossword/types";

const useCursorPosition = (grid: Matrix15x15<CellContents>) => {
  const [position, setPosition] = useState<CellCoordinates>([0, 0]);

  return {};
};
