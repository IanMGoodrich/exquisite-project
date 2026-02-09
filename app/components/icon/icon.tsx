import { type FC } from "react";
import vectors from "@/public/vectors";
import './icon.css';
type IconProps = {
  name: string;
}

const Icon: FC<IconProps> = ({...props}) => {
  const svgMarkup = vectors[props.name as keyof typeof vectors];
  return (
  <span className="icon-wrapper" dangerouslySetInnerHTML={{ __html: svgMarkup }}/>

  )
}

export default Icon;