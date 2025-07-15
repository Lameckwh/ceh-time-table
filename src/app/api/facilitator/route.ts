import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient());

const teamMembers = ["Lucius Malizani", "Astonie Mukiwa", "Hopkins Ceaser"];
const TEAM_LENGTH = teamMembers.length;

export async function GET() {
  try {
    console.log("GET /api/facilitator called");
    let state = await prisma.facilitatorState.findFirst();
    if (!state) {
      console.log("No facilitator state found, creating new state with index 0");
      state = await prisma.facilitatorState.create({ data: { index: 0 } });
    }
    console.log(`Returning facilitator index: ${state.index}`);
    return NextResponse.json({ index: state.index, teamMembers }, { status: 200 });
  } catch (error) {
    console.error("GET /api/facilitator error:", error);
    return NextResponse.json({ error: "Failed to fetch facilitator" }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log("POST /api/facilitator called");
    const state = await prisma.facilitatorState.findFirst();
    const newIndex = state ? (state.index + 1) % TEAM_LENGTH : 0;
    if (state) {
      console.log(`Updating facilitator index from ${state.index} to ${newIndex}`);
      await prisma.facilitatorState.update({ where: { id: state.id }, data: { index: newIndex } });
    } else {
      console.log(`Creating new facilitator state with index ${newIndex}`);
      await prisma.facilitatorState.create({ data: { index: newIndex } });
    }
    return NextResponse.json({ index: newIndex, teamMembers }, { status: 200 });
  } catch (error) {
    console.error("POST /api/facilitator error:", error);
    return NextResponse.json({ error: "Failed to update facilitator" }, { status: 500 });
  }
}