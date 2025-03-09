"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availablePlans } from "@/lib/plans";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

async function updatePlan(newPlan: string) {
  const response = await fetch("/api/profile/change-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPlan }),
  });
  return response.json();
}

async function unsubscribe() {
  const response = await fetch("/api/profile/unsubscribe", {
    method: "POST",
  });
  return response.json();
}

const Profile: FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const { isLoaded, isSignedIn, user } = useUser();

  const queryClient = useQueryClient();

  const router = useRouter();

  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: updatePlanMutation, isPending: isUpdatePlanPending } =
    useMutation({
      mutationFn: updatePlan,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
        toast.success("Subscription plan updated successfully");
      },
      onError: () => {
        toast.error("Failed to update subscription plan");
      },
    });

  const { mutate: unsubscribeMutation, isPending: isUnsubscribePending } =
    useMutation({
      mutationFn: unsubscribe,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
        router.push("/subscribe");
      },
      onError: () => {
        toast.error("Failed to unsubscribe");
      },
    });

  const currentPlan = availablePlans.find(
    (plan) => plan.interval === subscription?.subscription.subscriptionTier
  );

  const handleUpdatePlan = useCallback(() => {
    if (selectedPlan) {
      updatePlanMutation(selectedPlan);
    }

    setSelectedPlan("");
  }, [selectedPlan, updatePlanMutation]);

  const handleUnsubscribe = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to unsubscribe? You will lose access to premium features"
      )
    ) {
      unsubscribeMutation();
    }
  }, [unsubscribeMutation]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-100">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-100">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-100 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-6 bg-emerald-500 text-white flex flex-col items-center">
            <Image
              src={user.imageUrl || "/default-avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mb-4">{user.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="w-full md:w-2/3 p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-emerald-700">
              Subscription Details
            </h2>

            {isLoading ? (
              <div className="flex items-center">
                <Spinner />
                <span className="ml-2">Loading subscription details...</span>
              </div>
            ) : isError ? (
              <p className="text-red-500">{error?.message}</p>
            ) : subscription ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-600">
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentPlan ? (
                      <>
                        <p>
                          <strong>Plan:</strong> {currentPlan.name}
                        </p>
                        <p>
                          <strong>Amount:</strong> ${currentPlan.amount}{" "}
                          {currentPlan.currency}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {subscription.subscription.subscriptionActive
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </p>
                      </>
                    ) : (
                      <p className="text-red-500">Current plan not found.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-600">
                      Change Subscription Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      defaultValue={currentPlan?.interval}
                      disabled={isUpdatePlanPending}
                      onValueChange={(value) => setSelectedPlan(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a new plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePlans.map((plan, key) => (
                          <SelectItem key={key} value={plan.interval}>
                            {plan.name} - ${plan.amount} / {plan.interval}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleUpdatePlan}
                      className="mt-3"
                      variant="default"
                    >
                      Save Change
                    </Button>
                    {isUpdatePlanPending && (
                      <div className="flex items-center mt-2">
                        <Spinner />
                        <span className="ml-2">Updating plan...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-600">
                      Unsubscribe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="destructive"
                      disabled={isUnsubscribePending}
                      onClick={handleUnsubscribe}
                    >
                      {isUnsubscribePending
                        ? "Unsubscribing..."
                        : "Unsubscribe"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p>You are not subscribed to any plan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
