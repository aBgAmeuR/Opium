type RecentSongLinkInfoProps = {
  link: string;
};

export const RecentSongLinkInfo = ({ link }: RecentSongLinkInfoProps) => {
  return (
    <a
      href={link}
      target="_blank"
      className="hover:text-muted-foreground line-clamp-1 break-all"
    >
      {link}
    </a>
  );
};
