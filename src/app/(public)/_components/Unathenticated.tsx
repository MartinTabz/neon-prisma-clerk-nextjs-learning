import Link from "next/link";
import ClerkLogo from "./TechLogos/Clerk";
import NeonLogo from "./TechLogos/Neon";
import NextLogo from "./TechLogos/Next";
import PrismaLogo from "./TechLogos/Prisma";

export default function Unauthenticated() {
	return (
		<section className="h-[calc(100dvh-80px)] w-full flex items-center justify-center">
			<div className="flex flex-col gap-3 items-center justify-center pb-20">
				<h1
					style={{ fontFamily: "var(--font-heading)" }}
					className="font-bold text-4xl text-center"
				>
					Vítej v úkolníčku
				</h1>
				<p className="text-secondary-foreground max-w-[450px] text-sm text-center">
					Ahoj, toto je pouze testovací aplikace, kde se učím s technologiemi
					zmíněnými dole. Pokud chceš aplikaci vyzkoušet, tak{" "}
					<Link
						className="underline font-bold text-primary hover:text-primary/75 duration-150"
						href={"/prihlasit"}
					>
						zde se přihlas
					</Link>{" "}
					a pak na hlavní stránce můžeš přidat úkoly.
				</p>
				<p className="pb-10 text-secondary-foreground max-w-[450px] text-sm text-center">
					<b>Ale bacha!</b> Pokud chceš přidat více než 3 úkoly, tak si musíš
					koupit prémiovou verzi na stránce{" "}
					<Link
						className="underline font-bold text-primary hover:text-primary/75 duration-150"
						href={"/cenik"}
					>
						ceník
					</Link>
					.
				</p>
				<div className="flex items-center justify-center gap-5">
					<NextLogo className="h-3.5 w-auto" />
					<NeonLogo className="h-5 w-auto" />
					<PrismaLogo className="h-5 w-auto" />
					<ClerkLogo className="h-4 w-auto" />
				</div>
			</div>
		</section>
	);
}
