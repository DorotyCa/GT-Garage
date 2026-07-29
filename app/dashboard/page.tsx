import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const utilizator = await prisma.utilizator.findUnique({
    where: {
      id: userId,
    },
  });

  if (!utilizator) {
    redirect("/");
  }

  if (utilizator.rol === "admin") {
    redirect("/admin");
  }

  if (utilizator.rol === "mecanic") {
    redirect("/admin");
  }

  redirect("/client");
}