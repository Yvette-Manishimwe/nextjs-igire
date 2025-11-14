import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Params) {
  const { name, email, role } = await req.json();
  const updatedUser = await prisma.user.update({
    where: { id: Number(params.id) },
    data: { name, email, role },
  });
  return NextResponse.json(updatedUser);
}

export async function DELETE(req: Request, { params }: Params) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
