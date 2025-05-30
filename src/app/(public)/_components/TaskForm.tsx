"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TaskData = {
	id: string;
	createdAt: string;
	updatedAt?: string;
	name: string;
	description: string;
	completed: boolean;
};

type Props =
	| {
			mode: "create";
			data?: null;
	  }
	| {
			mode: "update";
			data: TaskData;
	  };

export const taskformSchema = z.object({
	name: z
		.string()
		.min(1, "Název je povinný")
		.max(150, "Maximální délka názvu je 150 znaků"),
	description: z.string().max(2000),
});

export default function TaskForm({ mode = "create", data }: Props) {
	const [show, setShow] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const form = useForm<z.infer<typeof taskformSchema>>({
		resolver: zodResolver(taskformSchema),
		defaultValues:
			mode === "create"
				? { name: "", description: "" }
				: {
						description: data!.description,
						name: data!.name,
				  },
	});

	async function onSubmit(values: z.infer<typeof taskformSchema>) {
		setIsLoading(true);

		const { success, error } = await createTask(values);

		if (error) {
			toast("Něco se pokazilo", {
				description: error,
				action: error ==
					"Pokud chceš přidat další úkol, tak musíš zaplatit" && {
					label: "Koupit",
					onClick: () => router.push("/cenik"),
				},
			});
		}

		if (success) {
			toast.success("Úkol byl vytvořen");
			setShow(false);
			setIsLoading(false);
			form.reset();
		}

		setIsLoading(false);
	}

	return (
		<>
			<Button
				variant={mode === "create" ? "default" : "outline"}
				size={mode === "create" ? "lg" : "icon"}
				onClick={() => setShow(true)}
			>
				<Plus /> Přidat úkol
			</Button>
			<Dialog onOpenChange={setShow} open={show}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{mode === "create" ? "Vytvořit nový" : "Upravit"} úkol
						</DialogTitle>
						<DialogDescription>
							V této formě můžeš{" "}
							{mode === "create" ? "vytvořit nový" : "upravit"} úkol
						</DialogDescription>
					</DialogHeader>
					<div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									disabled={isLoading}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Název</FormLabel>
											<FormControl>
												<Input placeholder="Uklidit pokoj" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									disabled={isLoading}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Popis</FormLabel>
											<FormControl>
												<Textarea {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									{isLoading ? (
										<Loader2 className="animate-spin" />
									) : mode === "create" ? (
										"Vytvořit"
									) : (
										"Upravit"
									)}
								</Button>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
