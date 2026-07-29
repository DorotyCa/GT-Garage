import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const existing = await prisma.utilizator.findUnique({
      where: {
        id: user.id,
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "User already exists",
      });
    }

    await prisma.utilizator.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        rol: "client",

        nume: user.firstName ?? null,
        prenume: user.lastName ?? null,

        telefon: null,
        adresa: null,
        oras: null,
        judet: null,
      },
    });

    return NextResponse.json({
      message: "Profile created",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}