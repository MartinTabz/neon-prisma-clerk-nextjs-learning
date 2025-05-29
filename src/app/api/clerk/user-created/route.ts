import { db } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripeClient";
import { tryCatch } from "@/utils/try-catch";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { data: event, error } = await tryCatch(verifyWebhook(req));

	if (error) {
		return new Response("Error verifying webhook", { status: 401 });
	}

	const { data, type } = event;

	if (type !== "user.created") {
		return new Response("Event type ignored", { status: 200 });
	}

	const clerkUserId = data.id;
	const emailAddress = data.email_addresses[0].email_address;

	const userExists = await db.user.findUnique({
		where: {
			clerkId: clerkUserId,
		},
	});

	if (userExists) {
		return new Response("User with this ID already exists", { status: 200 });
	}

	const { data: customer, error: customerErr } = await tryCatch(
		stripe.customers.create({
			email: emailAddress,
			metadata: {
				clerk_id: clerkUserId,
			},
		})
	);

	if (customerErr) {
		return new Response("Failed to create Stripe customer", { status: 500 });
	}

	const newUser = await db.user.create({
		data: {
			clerkId: clerkUserId,
			email: emailAddress,
			stripeCustomerId: customer.id,
		},
	});

	if (!newUser) {
		return new Response("Failed to create user", { status: 500 });
	}

	return new Response("User created");
}
