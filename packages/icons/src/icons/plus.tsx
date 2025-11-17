type Props = React.SVGProps<SVGSVGElement>;

export const PlusIcon = (props: Props) => (
	<svg viewBox="0 0 24 24" fill="none" {...props}>
		<title>Plus</title>
		<path
			d="M12 4V20M20 12H4"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
