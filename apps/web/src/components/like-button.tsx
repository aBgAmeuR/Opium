import { HeartAddIcon, HeartIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";

type LikeButtonProps = {
	isLiked: boolean;
	onClick: () => void;
	className?: string;
};

export const LikeButton = ({
	isLiked,
	onClick,
	className,
}: LikeButtonProps) => {
	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={onClick}
			aria-label={isLiked ? "Unlike song" : "Like song"}
			className={className}
		>
			{isLiked ? (
				<HeartIcon className="size-4 text-red-500" />
			) : (
				<HeartAddIcon className="size-4" />
			)}
		</Button>
	);
};
