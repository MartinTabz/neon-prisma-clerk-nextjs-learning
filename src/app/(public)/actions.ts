"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { taskformSchema } from "./_components/TaskForm";
import { db } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

export async function createTask(values: z.infer<typeof taskformSchema>) {
	const { userId } = await auth();

	if (!userId) {
		return {
			success: false,
			error: "Nejsi přihlášený",
		};
	}

	const userData = await db.user.findUnique({
		where: { clerkId: userId },
		select: { id: true, subscribed: true },
	});

	if (!userData) {
		return {
			success: false,
			error: "Nepodařilo se najít tvůj profil v databázi",
		};
	}

	const tasksCount = await db.task.count({ where: { userId: userData.id } });

	if (tasksCount >= 3 && userData.subscribed != true) {
		return {
			success: false,
			error: "Pokud chceš přidat další úkol, tak musíš zaplatit",
		};
	}

	const { name, description } = values;

	const newTask = await db.task.create({
		data: { name: name, description: description, userId: userData.id },
	});

	if (!newTask) {
		return {
			success: false,
			error: "Něco se pokazilo při vkládání úkolu do databáze",
		};
	}

	revalidatePath("/");

	return {
		success: true,
		error: null,
	};
}
