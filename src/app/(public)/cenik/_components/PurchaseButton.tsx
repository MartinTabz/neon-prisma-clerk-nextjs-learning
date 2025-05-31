"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createCheckout } from "../actions";

export default function PurchaseButton({ disabled }: { disabled: boolean }) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const handlePurchase = async () => {
		setIsLoading(true);

		const { url, error } = await createCheckout();

		if (error) {
			toast("Nepodařilo se vytvořit pokladnu", { description: error });
		}

		if (url) {
			return router.push(url);
		}

		setIsLoading(false);
	};

	return (
		<Button onClick={handlePurchase} disabled={isLoading || disabled}>
			{isLoading ? <Loader2 className="animate-spin" /> : <ShoppingCart />}{" "}
			Získat přístup
		</Button>
	);
}
