import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import Select from "./Select";

jest.mock("./Select.module.css", () => ({
  selectWrapper: "selectWrapper",
  label: "label",
  selectContainer: "selectContainer",
  select: "select",
  iconContainer: "iconContainer",
}));

jest.mock("../icon/Icon", () => {
  return function MockIcon({
    name,
    alt,
    width = 24,
    height = 24,
  }: {
    name: string;
    alt?: string;
    width?: number;
    height?: number;
  }) {
    return (
      <img
        src={`mock-${name}-icon.svg`}
        alt={alt}
        width={width}
        height={height}
        data-testid={`icon-${name}`}
      />
    );
  };
});

interface TestSelectProps {
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  customClassName?: string;
}

const TestSelect = (props: TestSelectProps) => {
  const ref = useRef<HTMLSelectElement>(null);
  return <Select ref={ref} {...props} />;
};

describe("Select Component", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  test("renders correctly with basic props", () => {
    render(<TestSelect label="Test Select" options={mockOptions} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Test Select")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Test Select"
    );
  });

  test("renders all options", () => {
    render(<TestSelect label="Test Select" options={mockOptions} />);

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue("option1");
    expect(options[0]).toHaveTextContent("Option 1");
    expect(options[1]).toHaveValue("option2");
    expect(options[1]).toHaveTextContent("Option 2");
    expect(options[2]).toHaveValue("option3");
    expect(options[2]).toHaveTextContent("Option 3");
  });

  test("renders caret down icon", () => {
    render(<TestSelect label="Test Select" options={mockOptions} />);

    expect(screen.getByTestId("icon-caret-down")).toBeInTheDocument();
  });

  test("can be disabled", () => {
    render(<TestSelect label="Test Select" options={mockOptions} disabled />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  test("handles value changes", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <TestSelect
        label="Test Select"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "option2");

    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue("option2");
  });

  test("applies custom className", () => {
    render(
      <TestSelect
        label="Test Select"
        options={mockOptions}
        customClassName="custom-class"
      />
    );

    const wrapper = screen.getByRole("combobox").closest(".selectWrapper");
    expect(wrapper).toHaveClass("custom-class");
  });
});
