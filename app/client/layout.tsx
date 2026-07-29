// app/client/layout.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  
    if (
      utilizator.rol !== "admin" &&
      utilizator.rol !== "mecanic"
    ) 
  
    return (
      <DashboardLayout
          user={utilizator}
      >
          {children}
      </DashboardLayout>
  );
  }