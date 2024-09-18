module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // setupFilesAfterEnv: ['/home/shay/a/gscheng/ece461/ECE461/prototype_testing/jest.setup.ts'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
        // 'index.js',          // Explicitly include 'index.js' in the coverage
        'src/**/*.{ts,js}',  // Include all JS/TS files in the 'src' directory
      ],    
    collectCoverage: true, // Enable coverage collection
    coverageDirectory: 'coverage', // Output directory for coverage reports
    coverageReporters: ['text'], // Specify the format of the coverage report
  };