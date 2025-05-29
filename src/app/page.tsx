import { auth } from "@clerk/nextjs/server";

export default async function IndexPage() {
	const { userId } = await auth();

	if (!userId) {
		return <h1>Nejsi přihlášený</h1>;
	}

	return <h1>Jsi přihlášený!</h1>;
}
