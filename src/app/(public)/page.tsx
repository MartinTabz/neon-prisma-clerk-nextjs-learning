import { auth } from "@clerk/nextjs/server";
import Unauthenticated from "./_components/Unathenticated";
import TaskForm from "./_components/TaskForm";
import { db } from "@/lib/prismaClient";
import TaskComponent from "./_components/TaskComponent";

export default async function IndexPage() {
	const { userId } = await auth();

	if (!userId) {
		return <Unauthenticated />;
	}

	const taskData = await db.task.findMany({
		where: { user: { clerkId: userId } },
		orderBy: { createdAt: "desc" },
	});

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
				{taskData && taskData.length > 0 ? (
					<section className="grid py-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{taskData.map((task) => (
							<TaskComponent key={task.id} {...task} />
						))}
					</section>
				) : (
					<span>Zatím jsi nepřidal žádný úkol</span>
				)}
			</div>
		</div>
	);
}
