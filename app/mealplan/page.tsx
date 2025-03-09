"use client";

import { FC, useCallback } from "react";
import MealPlanForm from "./_components/MealPlanForm";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import MealPlan from "./_components/MealPlan";

type MealPlanResponse = {
  mealPlan: WeeklyMealPlan;
  error?: string;
};

export type WeeklyMealPlan = {
  [day: string]: DailyMealPlan;
};

type DailyMealPlan = {
  Breakfast: string;
  Lunch: string;
  Dinner: string;
  Snacks?: string[];
};

export type MealPlanInput = {
  dietType: string;
  calories: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  days?: number;
};

async function generateMealPlan(payload: MealPlanInput) {
  const response = await fetch("/api/generate-mealplan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

const MealPlanPage: FC = () => {
  const { mutate, isPending, data, isSuccess } = useMutation<
    MealPlanResponse,
    Error,
    MealPlanInput
  >({
    mutationFn: generateMealPlan,
  });

  const handleSubmit = useCallback(
    async (payload: MealPlanInput) => {
      mutate(payload);
    },
    [mutate]
  );

  return (
    <Card className="mt-10 py-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Left Section - 25% */}
          <div className="w-1/4 p-4 border-r">
            <MealPlanForm isPending={isPending} onSubmit={handleSubmit} />
          </div>

          {/* Right Section - 75% */}
          <div className="w-3/4 p-4">
            <MealPlan
              isPending={isPending}
              isSuccess={isSuccess}
              mealPlan={data?.mealPlan || {}}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanPage;
