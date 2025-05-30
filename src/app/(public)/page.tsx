import { auth } from "@clerk/nextjs/server";
import Unauthenticated from "./_components/Unathenticated";
import TaskForm from "./_components/TaskForm";

export default async function IndexPage() {
	const { userId } = await auth();

	if (!userId) {
		return <Unauthenticated />;
	}

	return (
		<div className="w-full flex items-center justify-center py-16">
			<div className="max-w-[800px] w-full">
				<div className="w-full flex items-center justify-between">
					<h1
						style={{ fontFamily: "var(--font-heading)" }}
						className="font-bold text-3xl text-center"
					>
						Úkoly
					</h1>
					<TaskForm mode="create" />
				</div>
				<section></section>
			</div>
		</div>
	);
}
