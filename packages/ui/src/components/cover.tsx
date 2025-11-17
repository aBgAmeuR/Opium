import { mergeProps } from "@base-ui-components/react";
import { MusicIcon } from "@opium/icons";
import { cn } from "@opium/ui/lib/utils";
import { Image } from "@unpic/react";
import type React from "react";

const sizes = {
	sm: {
		image: 24,
		cover: "size-6",
		icon: "size-3",
	},
	default: {
		image: 32,
		cover: "size-8",
		icon: "size-4",
	},
	md: {
		image: 40,
		cover: "size-10",
		icon: "size-5",
	},
	lg: {
		image: 128,
		cover: "size-32",
		icon: "size-6",
	},
	xl: {
		image: 176,
		cover: "size-44",
		icon: "size-8",
	},
};

interface CoverProps extends React.ComponentProps<"div"> {
	variant?: "default" | "blur";
	size?: keyof typeof sizes;
	imageSrc?: string;
	alt?: string;
}

function Cover({
	className,
	variant = "default",
	size = "default",
	imageSrc,
	alt,
	...props
}: CoverProps) {
	const defaultProps = {
		"data-slot": "cover",
		className: cn(
			"relative flex-shrink-0 rounded-sm overflow-hidden z-10 shadow-md",
			sizes[size].cover,
		),
	};

	return (
		<div className={cn("relative", className)}>
			<div {...mergeProps<"div">(defaultProps, props)}>
				{imageSrc ? (
					<Image
						src={imageSrc}
						alt={alt}
						className="size-full object-cover"
						width={sizes[size].image}
						height={sizes[size].image}
					/>
				) : (
					<div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
						<MusicIcon className={sizes[size].icon} />
					</div>
				)}
			</div>
			{imageSrc && variant === "blur" && (
				<div className="absolute bottom-0 left-0 size-full origin-bottom scale-90 blur-lg saturate-200 opacity-30">
					<Image
						src={imageSrc}
						alt={alt}
						className="size-full object-cover"
						width={sizes[size].image}
						height={sizes[size].image}
					/>
				</div>
			)}
		</div>
	);
}

export { Cover };
