import { ReactNode } from "react";

type RowProps = {
  children: ReactNode;
};

export const Row = ({ children }: RowProps) => {
  return <div>{children}</div>;
};
