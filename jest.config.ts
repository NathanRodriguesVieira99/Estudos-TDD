import type { Config } from "jest";

const config: Config = {
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
  coverageProvider: "v8",
  coverageReporters: ["text", "json", "html", "lcov"],
  testEnvironment: "node",
  testMatch: [
    "**/test/**/*.?([mc])[jt]s?(x)",
    "**/?(*.)+(spec|test).?([mc])[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
};

export default config;
