"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CreateProfileOnSignIn() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    fetch("/api/create-profile", {
      method: "POST",
    }).catch(console.error);
  }, [isLoaded, isSignedIn]);

  return null;
}