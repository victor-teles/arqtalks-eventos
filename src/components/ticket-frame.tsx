export default function TicketFrame({ color = "#252729" }: { color?: string }) {
	return (
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 650 330"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>TicketMono</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20 0C8.95431 0 0 8.95431 0 20V138C14.9117 138 27 150.088 27 165C27 179.912 14.9117 192 0 192V310C0 321.046 8.9543 330 20 330H630C641.046 330 650 321.046 650 310V192C635.088 192 623 179.912 623 165C623 150.088 635.088 138 650 138V20C650 8.95431 641.046 0 630 0H20Z"
				fill={color}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M21 5C12.1634 5 5 12.1634 5 21V133.388C20.2981 135.789 32 149.028 32 165C32 180.972 20.2981 194.211 5 196.612V309C5 317.837 12.1634 325 21 325H629C637.837 325 645 317.837 645 309V196.612C629.702 194.211 618 180.972 618 165C618 149.028 629.702 135.789 645 133.388V21C645 12.1634 637.837 5 629 5H21Z"
				fill="black"
			/>
			<path d="M512 5V326" stroke="#444444" strokeDasharray="6 6" />
		</svg>
	);
}
