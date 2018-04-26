module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/src"],
  setupFiles: ["raf/polyfill", "./jest.setup.ts"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  transform: { "^.+\\.tsx?$": "ts-jest" }
};
