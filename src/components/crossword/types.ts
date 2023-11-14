// https://stackoverflow.com/questions/52489261/typescript-can-i-define-an-n-length-tuple-type
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

type Tuple15<T> = Tuple<T, 15>;
export type Matrix15x15<P> = Tuple15<Tuple15<P>>;

export type CellContents = string | null;

export type PuzzleDirection = "across" | "down";

export type HorizontalDirection = "Right" | "Left";
export type VerticalDirection = "Down" | "Up";

export type CursorDirection = HorizontalDirection | VerticalDirection;

export type CellCoordinates = [number, number];

export type Clues = {
  across: string[];
  down: string[];
};
