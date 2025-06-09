import { useRef } from "react";
import SearchIcon from "../../../../assets/svg/search.svg";

import styles from "./RestaurantSearchInput.module.css";
import Input from "../../../../components/ui/input/Input";
import IconButton from "../../../../components/ui/icon/button/IconButton";
import Button from "../../../../components/ui/button/Button";
import cn from "../../../../utils/class-names/classNames";

interface RestaurantSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  customClassName?: string;
}

function RestaurantSearchInput({
  value,
  onChange,
  onSearch,
  placeholder,
  customClassName,
}: RestaurantSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  const handleSearch = () => {
    onSearch(value);
  };

  const clearSearch = () => {
    onChange("");
    onSearch("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Input
      customClassName={customClassName}
      ref={inputRef}
      placeholder={placeholder || "Search for restaurants or cuisines..."}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leftIcon={<img src={SearchIcon} alt="Search" />}
      rightActions={
        <div className={styles.rightActions}>
          {value && (
            <>
              <IconButton
                icon="close"
                description="Clear search"
                size="sm"
                onClick={clearSearch}
                customClassName={styles.clearButton}
              />

              <Button
                customClassName="hide-sm"
                onClick={handleSearch}
                variant="primary"
                size="lg"
              >
                Search
              </Button>
              <IconButton
                icon="search"
                description="Search"
                size="sm"
                onClick={handleSearch}
                customClassName={cn(styles.searchIconButton, "hide-lg")}
              />
            </>
          )}
        </div>
      }
    />
  );
}

export default RestaurantSearchInput;
