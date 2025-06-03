import { useRef } from "react";
import Input from "../../ui/input/Input";
import IconButton from "../../ui/icon-button/button/IconButton";
import Button from "../../ui/button/Button";
import SearchIcon from "../../../assets/svg/search.svg";
import CloseIcon from "../../../assets/svg/close.svg";

import styles from "./RestaurantSearchInput.module.css";

interface RestaurantSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

function RestaurantSearchInput({
  value,
  onChange,
  onSearch,
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
    <div className={styles.searchContainer}>
      <Input
        ref={inputRef}
        placeholder={"Search for restaurants or cuisines..."}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftIcon={<img src={SearchIcon} alt="Search" />}
        rightActions={
          <div className={styles.rightActions}>
            {value && (
              <>
                <IconButton
                  description="Clear search"
                  size="sm"
                  onClick={clearSearch}
                  className={styles.clearButton}
                >
                  <img src={CloseIcon} />
                </IconButton>
                <Button onClick={handleSearch} variant="primary" size="lg">
                  Search
                </Button>
              </>
            )}
          </div>
        }
      />
    </div>
  );
}

export default RestaurantSearchInput;
