import { JSX } from "react";
import "./container.css";

type ContainerProps = {
  children: React.ReactNode;
  classes: string;
  tag?: keyof JSX.IntrinsicElements;
};

const Container = ({ children, classes, tag = "div" }: ContainerProps) => {
  const Tag = tag;
  return (
    <Tag className={`container ${classes}`}>
      <div className="container-content">{children}</div>
    </Tag>
  );
};

export default Container;
