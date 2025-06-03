import { renderHook, act } from "@testing-library/react";
import useModalState from "./useModalState";

describe("useModalState Hook", () => {
  test("initializes with default state (false)", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);
  });

  test("initializes with custom initial state", () => {
    const { result } = renderHook(() => useModalState(true));

    expect(result.current.isOpen).toBe(true);
  });

  test("opens modal when open is called", () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("closes modal when close is called", () => {
    const { result } = renderHook(() => useModalState(true));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test("toggles modal state when toggle is called", () => {
    const { result } = renderHook(() => useModalState());

    // Start false, toggle to true
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle back to false
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  test("returns all expected functions", () => {
    const { result } = renderHook(() => useModalState());

    expect(typeof result.current.open).toBe("function");
    expect(typeof result.current.close).toBe("function");
    expect(typeof result.current.toggle).toBe("function");
    expect(typeof result.current.isOpen).toBe("boolean");
  });
});
