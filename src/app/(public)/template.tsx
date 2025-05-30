import PublicHeader from "@/components/PublicHeader";

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<PublicHeader />
			<main>{children}</main>
		</>
	);
}
