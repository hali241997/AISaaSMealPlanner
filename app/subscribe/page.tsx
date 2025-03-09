"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { availablePlans } from "@/lib/plans";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "react-hot-toast";

type SubscribeResponse = {
  url: string;
};

type SubscribeError = {
  error: string;
};

async function subscribeToPlan(
  planType: string,
  userId: string,
  email: string
) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planType, userId, email }),
  });

  if (!response.ok) {
    const errorData: SubscribeError = await response.json();
    throw new Error(errorData.error || "Something went wrong");
  }

  const data: SubscribeResponse = await response.json();
  return data;
}

const SubscribePage: FC = () => {
  const { user } = useUser();

  const router = useRouter();

  const userId = user?.id;
  const email = user?.emailAddresses[0].emailAddress || "";

  const { mutate, isPending } = useMutation<
    SubscribeResponse,
    Error,
    { planType: string }
  >({
    mutationFn: async ({ planType }) => {
      if (!userId) {
        throw new Error("User not found");
      }

      return subscribeToPlan(planType, userId, email);
    },
    onMutate: () => {
      toast.loading("Processing your subscription...");
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubscribe = (planType: string) => {
    if (!userId) {
      router.push("/sign-up");
      return;
    }

    mutate({ planType });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-4">
        Choose your meal planning subscription
      </h1>
      <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Select the plan that works best for you
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {availablePlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col transition-transform duration-300 hover:scale-105 shadow-lg ${
              plan.isPopular ? "border-emerald-500" : ""
            }`}
          >
            {plan.isPopular && (
              <Badge
                className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs sm:text-sm"
                variant="secondary"
              >
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow text-sm sm:text-base">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button
                  className="w-full text-sm sm:text-base py-2 sm:py-3"
                  onClick={() => handleSubscribe(plan.interval)}
                  disabled={isPending}
                >
                  {isPending
                    ? "Please wait..."
                    : `Subscribe for ${plan.amount}/${plan.interval}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscribePage;
