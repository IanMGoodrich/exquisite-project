import { type FC } from "react";
import vectors from "@/public/vectors";

type IconProps = {
  name: string;
}

const Icon: FC<IconProps> = ({...props}) => {
  const svgMarkup = vectors[props.name as keyof typeof vectors];
  return (
  <span dangerouslySetInnerHTML={{ __html: svgMarkup }}/>

  )
}

export default Icon;