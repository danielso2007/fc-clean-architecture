export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\.(t|j)sx?$": ["@swc/jest"],
    
  },
  clearMocks: true,
  coverageProvider: "v8",
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)",
    "/node_modules/(?!jstoxml)"
  ]
};