"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Navbar: FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
            className="h-10 w-10"
          />
        </Link>

        <div className="flex items-center gap-6">
          <SignedIn>
            <Link
              href="/mealplan"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Mealplan
            </Link>

            {user?.imageUrl && (
              <Link href="/profile">
                <Avatar className="size-10">
                  <AvatarImage src={user.imageUrl} alt="Profile Picture" />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            <SignOutButton>
              <Button>Sign Out</Button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Home
            </Link>
            <Link
              href={isSignedIn ? "/subscribe" : "/sign-up"}
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Subscribe
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
