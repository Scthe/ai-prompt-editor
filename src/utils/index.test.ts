import { describe, expect, test } from '@jest/globals';
import { arrayMove } from './index';

describe('utils/index.ts', () => {
  describe('arrayMove', function () {
    test('should move array item to toIndex', () => {
      const testArray = [0, 1, 2, 3];
      expect(arrayMove(testArray, 2, 0)).toEqual([2, 0, 1, 3]);
      expect(arrayMove(testArray, 3, 1)).toEqual([0, 3, 1, 2]);
      expect(arrayMove(testArray, 1, 2)).toEqual([0, 2, 1, 3]);
      expect(arrayMove(testArray, 0, 2)).toEqual([1, 2, 0, 3]);
      expect(arrayMove(testArray, 0, 3)).toEqual([1, 2, 3, 0]);
      // does not modify org. object
      expect(testArray).toEqual([0, 1, 2, 3]);
    });
  });
});
