import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});