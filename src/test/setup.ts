import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Расширяем expect с матчерами из jest-dom
expect.extend(matchers);

// Очищаем после каждого теста
afterEach(() => {
  cleanup();
});
