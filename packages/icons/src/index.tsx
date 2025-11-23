import type React from "react";
import { AdminIcon } from "./icons/admin";
import { AlbumIcon } from "./icons/album";
import { ArrowLeftIcon } from "./icons/arrow-left";
import { ArrowRightIcon } from "./icons/arrow-right";
import { ChevronLeftIcon } from "./icons/chevron-left";
import { ChevronRightIcon } from "./icons/chevron-right";
import { CrossIcon } from "./icons/cross";
import { DeleteIcon } from "./icons/delete";
import { ExploreIcon } from "./icons/explore";
import { HeartIcon } from "./icons/heart";
import { HeartAddIcon } from "./icons/heart-add";
import { HeartCheckIcon } from "./icons/heart-check";
import { HomeIcon } from "./icons/home";
import { MoonIcon } from "./icons/moon";
import { MoreIcon } from "./icons/more";
import { MusicIcon } from "./icons/music";
import { NextIcon } from "./icons/next";
import { PauseIcon } from "./icons/pause";
import { PlayIcon } from "./icons/play";
import { PlayCircleIcon } from "./icons/play-circle";
import { PlaylistIcon } from "./icons/playlist";
import { PlusIcon } from "./icons/plus";
import { PreviousIcon } from "./icons/previous";
import { QueueIcon } from "./icons/queue";
import { RepeatIcon } from "./icons/repeat";
import { RepeatOneIcon } from "./icons/repeat-one";
import { SearchIcon } from "./icons/search";
import { ShareIcon } from "./icons/share";
import { ShuffleIcon } from "./icons/shuffle";
import { SidebarLeftIcon } from "./icons/sidebar-left";
import { SidebarRightIcon } from "./icons/sidebar-right";
import { SunIcon } from "./icons/sun";
import { UserIcon } from "./icons/user";
import { VolumeHighIcon } from "./icons/volume-high";
import { VolumeLowIcon } from "./icons/volume-low";
import { VolumeMediumIcon } from "./icons/volume-medium";
import { VolumeOffIcon } from "./icons/volume-off";

export {
	AdminIcon,
	AlbumIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CrossIcon,
	DeleteIcon,
	ExploreIcon,
	HeartIcon,
	HeartAddIcon,
	HeartCheckIcon,
	HomeIcon,
	MoonIcon,
	MoreIcon,
	MusicIcon,
	NextIcon,
	PauseIcon,
	PlayIcon,
	PlayCircleIcon,
	PlaylistIcon,
	PlusIcon,
	PreviousIcon,
	QueueIcon,
	RepeatIcon,
	RepeatOneIcon,
	SearchIcon,
	ShareIcon,
	ShuffleIcon,
	SidebarLeftIcon,
	SidebarRightIcon,
	SunIcon,
	UserIcon,
	VolumeHighIcon,
	VolumeLowIcon,
	VolumeMediumIcon,
	VolumeOffIcon,
};

export const icons = {
	admin: AdminIcon,
	album: AlbumIcon,
	"arrow-left": ArrowLeftIcon,
	"arrow-right": ArrowRightIcon,
	"chevron-left": ChevronLeftIcon,
	"chevron-right": ChevronRightIcon,
	cross: CrossIcon,
	delete: DeleteIcon,
	explore: ExploreIcon,
	heart: HeartIcon,
	"heart-add": HeartAddIcon,
	"heart-check": HeartCheckIcon,
	home: HomeIcon,
	moon: MoonIcon,
	more: MoreIcon,
	music: MusicIcon,
	next: NextIcon,
	pause: PauseIcon,
	play: PlayIcon,
	"play-circle": PlayCircleIcon,
	playlist: PlaylistIcon,
	plus: PlusIcon,
	previous: PreviousIcon,
	queue: QueueIcon,
	repeat: RepeatIcon,
	"repeat-one": RepeatOneIcon,
	search: SearchIcon,
	share: ShareIcon,
	shuffle: ShuffleIcon,
	"sidebar-left": SidebarLeftIcon,
	"sidebar-right": SidebarRightIcon,
	sun: SunIcon,
	user: UserIcon,
	"volume-high": VolumeHighIcon,
	"volume-low": VolumeLowIcon,
	"volume-medium": VolumeMediumIcon,
	"volume-off": VolumeOffIcon,
} as const;

export type Icons = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
	name: Icons;
}

export const Icon = ({ name, ...props }: IconProps) => {
	const Component = icons[name];
	if (!Component) return null;
	return <Component {...props} />;
};
