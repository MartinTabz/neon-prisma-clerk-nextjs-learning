import { auth } from "@clerk/nextjs/server";
import Unauthenticated from "./_components/Unathenticated";

export default async function IndexPage() {
	const { userId } = await auth();

	if (!userId) {
		return <Unauthenticated />;
	}

	return <h1>Jsi přihlášený!</h1>;
}
