"use server";

import { db } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripeClient";
import { tryCatch } from "@/utils/try-catch";
import { auth } from "@clerk/nextjs/server";

export async function createCheckout() {
	const { userId } = await auth();

	if (!userId) {
		return {
			url: null,
			error: "Nejsi přihlášený",
		};
	}

	const userData = await db.user.findUnique({
		where: { clerkId: userId },
		select: { subscribed: true, stripeCustomerId: true },
	});

	if (!userData) {
		return {
			url: null,
			error: "Nepodařilo se najít tvůj profil v databázi",
		};
	}

	if (userData.subscribed == true) {
		return {
			url: null,
			error: "Členství máš stále zakoupené a aktivní",
		};
	}

	const product = await stripe.products.retrieve(
		process.env.STRIPE_PRODUCT_ID!
	);

	if (!product.default_price || typeof product.default_price !== "string") {
		return {
			url: null,
			error: "Produkt nemá stanovenou aktivní cenu",
		};
	}

	const { data: checkout, error } = await tryCatch(
		stripe.checkout.sessions.create({
			success_url: `${process.env.NEXT_PUBLIC_URL}/?success=true`,
			line_items: [
				{
					price: product.default_price,
					quantity: 1,
				},
			],
			mode: "subscription",
			customer: userData.stripeCustomerId,
		})
	);

	if (error || !checkout.url) {
		if (error) {
			console.error(error);
		}
		return {
			url: null,
			error: "Nepodařilo se vytvořit pokladnu",
		};
	}

	return {
		url: checkout.url,
		error: null,
	};
}
