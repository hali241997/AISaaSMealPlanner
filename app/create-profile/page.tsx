"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

type ApiResponse = {
  message: string;
  error?: string;
};

async function createProfileRequest() {
  const response = await fetch("/api/create-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data as ApiResponse;
}

const CreateProfilePage: FC = () => {
  const { isLoaded, isSignedIn } = useUser();

  const router = useRouter();

  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: createProfileRequest,
    onSuccess: () => {
      router.push("/subscribe");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending) {
      mutate();
    }
  }, [isLoaded, isSignedIn, isPending, mutate]);

  return <div>Processing sign in...</div>;
};

export default CreateProfilePage;
