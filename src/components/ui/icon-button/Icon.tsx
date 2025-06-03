import hamburgerIcon from "../../../assets/svg/hamburger.svg";
import closeIcon from "../../../assets/svg/close.svg";
import searchIcon from "../../../assets/svg/search.svg";

const iconMap = {
  hamburger: hamburgerIcon,
  close: closeIcon,
  search: searchIcon,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

function Icon({
  name,
  alt = "",
  width = 24,
  height = 24,
  className,
}: IconProps) {
  const iconSrc = iconMap[name];

  return (
    <img
      src={iconSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default Icon;
