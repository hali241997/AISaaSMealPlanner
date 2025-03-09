import { FC, useCallback } from "react";
import { WeeklyMealPlan } from "../../page";
import Spinner from "@/components/Spinner";

type MealPlanProps = {
  isPending: boolean;
  isSuccess: boolean;
  mealPlan: WeeklyMealPlan;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MealPlan: FC<MealPlanProps> = ({ isPending, isSuccess, mealPlan }) => {
  const getMealPlanForDay = useCallback(
    (day: string) => {
      if (!mealPlan) return undefined;

      return mealPlan[day];
    },
    [mealPlan]
  );

  console.log(mealPlan);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-emerald-500">
        Weekly Meal Plan
      </h1>

      {mealPlan && isSuccess ? (
        <div className="h-[600px] overflow-y-auto">
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const mealPlan = getMealPlanForDay(day);
              return (
                <div
                  key={day}
                  className="bg-white shadow-md rounded-lg p-4 border border-emerald-200"
                >
                  <h3 className="text-xl font-semibold mb-2 text-emerald-600">
                    {day}
                  </h3>
                  {mealPlan ? (
                    <div className="space-y-2">
                      <div>
                        <strong>Breakfast:</strong> {mealPlan.Breakfast}
                      </div>
                      <div>
                        <strong>Lunch:</strong> {mealPlan.Lunch}
                      </div>
                      <div>
                        <strong>Dinner:</strong> {mealPlan.Dinner}
                      </div>
                      {mealPlan.Snacks && (
                        <div>
                          <strong>Snacks:</strong> {mealPlan.Snacks}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No meal plan available.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : isPending ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <div>
          <p>Please generate a meal plan to see it here</p>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
