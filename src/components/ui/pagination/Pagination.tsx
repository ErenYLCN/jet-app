import Button from "../button/Button";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end based on current page
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        variant="secondary"
        size="sm"
        customClassName={styles.navButton}
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      {showPageNumbers && (
        <div className={styles.pageNumbers}>
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={`${styles.ellipsis} hide-sm`}
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = currentPage === pageNumber;
            return (
              <Button
                variant="ghost"
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                customClassName={`${styles.pageButton} ${
                  isActive ? styles.active : "hide-sm"
                }`}
                disabled={isActive}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
      )}

      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="secondary"
        size="sm"
        customClassName={styles.navButton}
        aria-label="Go to next page"
      >
        Next
      </Button>
    </nav>
  );
}

export default Pagination;
