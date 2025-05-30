import { Task } from "@prisma/client";

export default function TaskComponent({ id, name, description }: Task) {
	return (
		<div className="p-5 rounded-lg border-2">
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
