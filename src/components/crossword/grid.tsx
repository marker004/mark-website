import { ReactNode, useState } from "react";

type GridProps = {
  children: ReactNode;
};

export const Grid = ({ children }: GridProps) => {
  // prettier-ignore
  return (
    <>{children}</>
  )
};
