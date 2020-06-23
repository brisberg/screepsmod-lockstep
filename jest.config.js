module.exports = {
  // -- Default JestSettings (brisberg/typescript-pkg)

  // An array of glob patterns indicating a set of files for which coverage
  // information should be collected
  collectCoverageFrom: ['src/**/*.{js,ts}'],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/lib/', '\\.d\\.ts$'],

  // An array of directory names to be searched recursively up from the
  // requiring module's location
  moduleDirectories: ['node_modules', 'src'],

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.spec.ts', '!**/node_modules/**', '!**/lib/**'],

  // -- Add package specific configurations below here

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The paths to modules that run some code to configure or set up the testing
  // environment before each test
  setupFiles: ['./jest.setup.js'],
};
