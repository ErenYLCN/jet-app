import { useRef } from "react";
import Input from "../../ui/input/Input";
import IconButton from "../../ui/icon-button/IconButton";
import SearchIcon from "../../../assets/search.svg";
import CloseIcon from "../../../assets/close.svg";

import styles from "./RestaurantSearchInput.module.css";

interface RestaurantSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function RestaurantSearchInput({
  value,
  onChange,
}: RestaurantSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearSearch = () => {
    onChange("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <Input
        ref={inputRef}
        placeholder={"Search for restaurants or cuisines..."}
        value={value}
        onChange={handleChange}
        leftIcon={<img src={SearchIcon} alt="Search" />}
        rightActions={
          value ? (
            <IconButton
              description="Clear search"
              size="sm"
              onClick={clearSearch}
              className={styles.clearButton}
            >
              <img src={CloseIcon} alt="" />
            </IconButton>
          ) : undefined
        }
      />
    </div>
  );
}

export default RestaurantSearchInput;
