import userReducer, { setPostcode } from "./userSlice";

describe("userSlice", () => {
  const initialState = {
    postcode: "CT12EH",
  };

  test("should return the initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle setPostcode", () => {
    const newPostcode = "SW1A1AA";
    const actual = userReducer(initialState, setPostcode(newPostcode));

    expect(actual).toEqual({
      postcode: "SW1A1AA",
    });
  });

  test("should handle setPostcode with empty string", () => {
    const actual = userReducer(initialState, setPostcode(""));

    expect(actual).toEqual({
      postcode: "",
    });
  });

  test("should handle setPostcode with different formats", () => {
    const testCases = ["W1A 0AX", "M1 1AA", "B33 8TH", "N1 9GU", "EC1A 1BB"];

    testCases.forEach((postcode) => {
      const actual = userReducer(initialState, setPostcode(postcode));
      expect(actual.postcode).toBe(postcode);
    });
  });

  test("should handle setPostcode overwriting existing postcode", () => {
    const currentState = {
      postcode: "OLD123",
    };

    const actual = userReducer(currentState, setPostcode("NEW456"));

    expect(actual).toEqual({
      postcode: "NEW456",
    });
  });

  test("should preserve state immutability", () => {
    const state = { ...initialState };
    const newState = userReducer(state, setPostcode("NEW123"));

    expect(newState).not.toBe(state);
    expect(state.postcode).toBe("CT12EH"); // Original state unchanged
    expect(newState.postcode).toBe("NEW123");
  });

  test("should handle special characters in postcode", () => {
    const specialPostcodes = ["W1A-0AX", "M1_1AA", "B33@8TH"];

    specialPostcodes.forEach((postcode) => {
      const actual = userReducer(initialState, setPostcode(postcode));
      expect(actual.postcode).toBe(postcode);
    });
  });

  test("should handle null and undefined postcodes", () => {
    const actual1 = userReducer(initialState, setPostcode(null as any));
    expect(actual1.postcode).toBe(null);

    const actual2 = userReducer(initialState, setPostcode(undefined as any));
    expect(actual2.postcode).toBe(undefined);
  });
});
