module.exports = {
  transform: {},
  roots: ["<rootDir>"],
  testRegex: "((\\.|/*.)(test))\\.js?$",
  moduleFileExtensions: ["js"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/tests"],
};
