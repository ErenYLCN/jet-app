import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

// Mock CSS module
jest.mock("./Modal.module.css", () => ({
  overlay: "overlay",
  modal: "modal",
  header: "header",
  title: "title",
  closeButton: "closeButton",
  content: "content",
}));

// Mock IconButton component
jest.mock("../icon/button/IconButton", () => {
  return function MockIconButton({
    description,
    onClick,
    customClassName,
    icon,
  }: {
    description: string;
    onClick: () => void;
    customClassName?: string;
    icon: string;
  }) {
    return (
      <button
        onClick={onClick}
        className={customClassName}
        aria-label={description}
        data-icon={icon}
      >
        {description}
      </button>
    );
  };
});

// Mock createPortal to render in the same container for testing
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (children: React.ReactNode) => children,
}));

describe("Modal Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = "unset";
  });

  test("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  test("renders with title and close button", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close modal/i })
    ).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    const overlay = screen.getByRole("dialog").parentElement;
    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  test("does not call onClose when modal content is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    const modalContent = screen.getByRole("dialog");
    await user.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("calls onClose when Escape key is pressed", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("sets body overflow to hidden when open", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("unset");
  });

  test("has correct accessibility attributes", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Accessible Modal">
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
    expect(modal).toHaveAttribute("tabIndex", "-1");
  });

  test("traps focus within modal with Tab key", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Focus Trap Modal">
        <button>First button</button>
        <input placeholder="Input field" />
        <button>Last button</button>
      </Modal>
    );

    const lastButton = screen.getByText("Last button");
    const closeButton = screen.getByRole("button", { name: /close modal/i });

    // Focus the first focusable element (close button)
    closeButton.focus();
    expect(closeButton).toHaveFocus();

    // Tab from last element should go to first
    lastButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    // Shift+Tab from first element should go to last
    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastButton).toHaveFocus();
  });

  test("does not trap focus when modal is closed", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Closed Modal">
        <button>Test button</button>
      </Modal>
    );

    // Tab key should not be handled when modal is closed
    const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
    const preventDefaultSpy = jest.spyOn(tabEvent, "preventDefault");

    fireEvent.keyDown(document, tabEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  test("ignores non-Tab key events in focus trap", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Modal">
        <button>Test button</button>
      </Modal>
    );

    const button = screen.getByText("Test button");
    button.focus();

    // Non-Tab keys should be ignored
    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Space" });
    fireEvent.keyDown(document, { key: "ArrowDown" });

    expect(button).toHaveFocus();
  });
});
