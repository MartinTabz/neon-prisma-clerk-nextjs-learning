import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<section className="w-full h-svh flex items-center justify-center">
			<SignIn />
		</section>
	);
}
