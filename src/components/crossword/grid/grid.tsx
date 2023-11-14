import { ReactNode } from "react";

import styles from "./styles.module.scss";

type GridProps = {
  children: ReactNode;
};

export const Grid = ({ children }: GridProps) => {
  // prettier-ignore
  return <div className={styles.grid}>{children}</div>;
};
