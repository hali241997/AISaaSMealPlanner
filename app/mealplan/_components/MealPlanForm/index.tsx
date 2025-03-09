import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FC, FormEvent, useCallback, useState } from "react";
import { MealPlanInput } from "../../page";

type MealPlanFormProps = {
  isPending: boolean;
  onSubmit: (payload: MealPlanInput) => void;
};

const MealPlanForm: FC<MealPlanFormProps> = ({ isPending, onSubmit }) => {
  const [calories, setCalories] = useState<number>(2000);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);

      const payload: MealPlanInput = {
        dietType: formData.get("dietType")?.toString() || "",
        calories: Number(formData.get("calories")) || 2000,
        allergies: formData.get("allergies")?.toString() || "",
        cuisine: formData.get("cuisine")?.toString() || "",
        snacks: Boolean(formData.get("snacks")) || false,
        days: 7,
      };

      onSubmit(payload);
    },
    [onSubmit]
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">
        AI Meal Plan Generator
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="dietType">Dietary Preference</Label>
          <Select name="dietType">
            <SelectTrigger>
              <SelectValue placeholder="Select your diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Daily Calorie Target: {calories}</Label>
          <Slider
            value={[calories]}
            onValueChange={(value) => setCalories(value[0])}
            min={500}
            max={15000}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input
            id="allergies"
            name="allergies"
            placeholder="Enter any allergies (comma separated)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine">Preferred Cuisine</Label>
          <Select name="cuisine">
            <SelectTrigger>
              <SelectValue placeholder="Select preferred cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="american">American</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="snacks" name="snacks" />
            <Label htmlFor="snacks">Include Snacks</Label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Generating..." : "Generate Meal Plan"}
        </Button>
      </form>
    </div>
  );
};

export default MealPlanForm;
