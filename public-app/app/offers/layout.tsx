import Header from '../components/Header';

export default function OffersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header neutral={true} />
			{children}
		</>
	);
}
