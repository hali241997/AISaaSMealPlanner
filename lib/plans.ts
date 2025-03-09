export interface Plan {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

export const availablePlans: Plan[] = [
  {
    name: "Weekly Plan",
    amount: 9.99,
    currency: "USD",
    interval: "week",
    description:
      "Great if you want to try the service before committing longer.",
    features: [
      "7-day meal plan",
      "Basic shopping list",
      "Essential recipes",
      "Cancel anytime",
    ],
  },
  {
    name: "Monthly Plan",
    amount: 39.99,
    currency: "USD",
    interval: "month",
    isPopular: true,
    description:
      "Perfect for ongoing, month-to-month meal planning and features.",
    features: [
      "30-day meal planning",
      "Advanced shopping lists",
      "Full recipe collection",
      "Basic nutrition tracking",
      "Cancel anytime",
    ],
  },
  {
    name: "Yearly Plan",
    amount: 299.99,
    currency: "USD",
    interval: "year",
    description:
      "Best value for those committed to improving their diet long-term.",
    features: [
      "Unlimited meal planning",
      "Advanced shopping lists",
      "Premium recipe collection",
      "Nutrition analytics",
      "Cancel anytime",
    ],
  },
];

const priceIdsMap: Record<string, string> = {
  week: process.env.STRIPE_PRICE_WEEKLY!,
  month: process.env.STRIPE_PRICE_MONTHLY!,
  year: process.env.STRIPE_PRICE_YEARLY!,
};

export const getPriceIDFromType = (planType: string) => {
  return priceIdsMap[planType];
};
