import { BookMarked, CircleUser } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeModeToggle } from "./ThemeModeToggle";

export default function PublicHeader() {
	return (
		<header className="h-20 w-full flex justify-center">
			<div className="w-[800px] flex items-center justify-between">
				<Link href={"/"}>
					<Button variant={"ghost"}>
						<BookMarked /> Úkolníček
					</Button>
				</Link>
				<nav>
					<Link className="px-5" href={"/"}>
						Úkoly
					</Link>
					<Link className="px-5" href={"/cenik"}>
						Ceník
					</Link>
				</nav>
				<div className="flex items-center justify-end gap-2">
					<SignedOut>
						<Link href={"/prihlasit"}>
							<Button size={"sm"}>Přihlásit</Button>
						</Link>
					</SignedOut>
					<SignedIn>
						<Link href={"/ucet"}>
							<Button size={"sm"}>
								<CircleUser />
								Účet
							</Button>
						</Link>
					</SignedIn>
					<ThemeModeToggle />
				</div>
			</div>
		</header>
	);
}
