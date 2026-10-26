export type MealCounts = Record<string, number>;

export const emptyMeals = (ids: readonly string[]): MealCounts => Object.fromEntries(ids.map((id) => [id, 0]));

export const mealTotal = (meals: MealCounts) => Object.values(meals).reduce((sum, n) => sum + n, 0);

/** Positive = meals still to choose, negative = too many meals, 0 = matches the guest count. */
export const mealGap = (count: number, meals: MealCounts) => count - mealTotal(meals);

export function isValidAttendance(count: number, meals: MealCounts, max: number): boolean {
  if (!Number.isInteger(count) || count < 1 || count > max) return false;
  const values = Object.values(meals);
  if (values.some((n) => !Number.isInteger(n) || n < 0)) return false;
  return mealGap(count, meals) === 0;
}
