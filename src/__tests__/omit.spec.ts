import omit from "../omit";

describe("omit", () => {
  test("should omit keys passed in", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["c", "b"])).toEqual({ a: 1 });
  });

  test("should return empty object when target is null", () => {
    expect(omit(null, ["c", "b"])).toEqual({});
  });
});
