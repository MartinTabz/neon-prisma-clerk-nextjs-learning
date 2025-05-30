import { Task } from "@prisma/client";

export default function TaskComponent({ id, name, description }: Task) {
	return (
		<div className="p-5 rounded-[var(--radius)] border-1 bg-background dark:bg-input/30">
			<h2
				style={{ fontFamily: "var(--font-heading)" }}
				className="font-bold text-lg pb-3 leading-[1]"
			>
				{name}
			</h2>
			<p className="text-xs">{description}</p>
		</div>
	);
}
