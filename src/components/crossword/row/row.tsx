import { ReactNode } from "react";
import styles from "./styles.module.scss";

type RowProps = {
  children: ReactNode;
};

export const Row = ({ children }: RowProps) => {
  return <div className={styles.row}>{children}</div>;
};
