import { db } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripeClient";
import Stripe from "stripe";

export async function POST(req: Request) {
	const body = await req.text();
	const sig = req.headers.get("stripe-signature") as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event;

	try {
		if (!sig || !webhookSecret)
			return new Response("Webhook secret not found.", { status: 400 });
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err: any) {
		console.error(`Error message: ${err.message}`);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}

	if (
		![
			"customer.subscription.created",
			"customer.subscription.deleted",
		].includes(event.type)
	) {
		return new Response(`Unhandled event type`, { status: 200 });
	}

	try {
		if (event.type === "customer.subscription.created") {
			const customerId =
				typeof event.data.object.customer === "string"
					? event.data.object.customer
					: event.data.object.customer.id;

			const updatedUser = await db.user.update({
				where: { stripeCustomerId: customerId },
				data: {
					subscribed: true,
				},
			});

			console.log(updatedUser);

			if (!updatedUser) {
				throw new Error("Unable to edit users profile");
			}
		}

		if (event.type === "customer.subscription.deleted") {
			const customerId =
				typeof event.data.object.customer === "string"
					? event.data.object.customer
					: event.data.object.customer.id;

			const updatedUser = await db.user.update({
				where: { stripeCustomerId: customerId },
				data: {
					subscribed: false,
				},
			});

			console.log(updatedUser);

			if (!updatedUser) {
				throw new Error("Unable to edit users profile");
			}
		}
	} catch (error) {
		console.error(error);
		return new Response(`Error editing users`, { status: 400 });
	}

	return new Response(JSON.stringify({ received: true }));
}
