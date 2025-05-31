import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripeClient";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";

export default async function PricesPage() {
	const product = await stripe.products.retrieve(
		process.env.STRIPE_PRODUCT_ID!
	);

	let price: number | null = null;

	if (product.default_price) {
		const stripePrice = await stripe.prices.retrieve(
			product.default_price.toString()
		);

		price = stripePrice.unit_amount;
	}

	return (
		<section className="w-full flex justify-center px-2">
			<div className="max-w-[800px] w-full text-center flex flex-col gap-10 py-10 md:py-20 md:gap-20">
				<div className="flex flex-col gap-2 items-center justify-center">
					<h1
						style={{ fontFamily: "var(--font-heading)" }}
						className="text-3xl font-bold pb-2 max-w-[550px] md:text-5xl md:leading-[1.3]"
					>
						Jednoduchá cenovka bez triků
					</h1>
					<p className="text-muted-foreground max-w-[300px] md:max-w-[350px] font-medium">
						Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
						quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
					</p>
				</div>
				<div className="border rounded-2xl p-5 text-left gap-4 grid grid-cols-1 md:grid-cols-5 md:p-3">
					<div className="md:col-span-3 md:p-3 md:flex md:flex-col md:justify-center md:text-left">
						<h2
							style={{ fontFamily: "var(--font-heading)" }}
							className="text-2xl font-bold pb-2"
						>
							{product.name}
						</h2>
						<p className="text-muted-foreground text-sm pb-7 md:text-base">
							{product.description}
						</p>
						<div className="flex items-center justify-start gap-2">
							<span className="font-bold text-sm text-primary">
								Co&nbsp;obsahuje
							</span>
							<div className="w-full h-[1px] bg-border/75"></div>
						</div>
						<ul className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
							{product.marketing_features.map((benefit, index) => (
								<li
									className="flex items-center gap-2 text-secondary-foreground"
									key={index}
								>
									<Check size={17} className="text-primary" /> {benefit.name}
								</li>
							))}
						</ul>
					</div>
					<div className="w-full h-[300px] rounded-xl border bg-input/30 text-center items-center justify-center flex flex-col gap-2 p-5 md:col-span-2">
						<p className="text-sm text-muted-foreground font-medium">
							Jedno měsíční předplatné
						</p>
						<p
							style={{ fontFamily: "var(--font-heading)" }}
							className="text-6xl pb-5"
						>
							{price == null ? (
								<Loader2 className="animate-spin" />
							) : (
								formatPrice(price)
							)}
						</p>
						<SignedIn>
							<Button>Získat přístup</Button>
						</SignedIn>
						<SignedOut>
							<Link href="/prihlasit?redirect_url=/cenik">
								<Button>Přihlásit se</Button>
							</Link>
						</SignedOut>
						<p className="text-xs text-muted-foreground pt-5 max-w-[250px]">
							K dispozici jsou faktury a účtenky pro snadné proplacení nákladů
							společnosti.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

const formatPrice = (amount: number) => {
	const formattedNumber = (amount / 100).toLocaleString("cs-CZ", {
		style: "decimal",
		currency: "CZK",
	});
	return `${formattedNumber} Kč`;
};
