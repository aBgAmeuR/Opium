type RecentSongLinkInfoProps = {
  link: string;
  isPillowcase: boolean;
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

  // return (
  //   <div className="border-border-color relative flex w-full flex-col gap-8 rounded-3xl border px-24 py-12 pb-24">
  //     <div className="bg-background text-muted-foreground absolute -top-3 left-6 flex items-start justify-center gap-4 px-4 text-sm">
  //       Info
  //     </div>
  //     <div className="flex w-full flex-col gap-4">
  //       <Wavesurfer url={link} />
  //       <a
  //         href={link}
  //         target="_blank"
  //         className="hover:text-muted-foreground line-clamp-1 break-all"
  //       >
  //         {link}
  //       </a>
  //     </div>
  //     <div className="flex w-full flex-col gap-8"></div>
  //   </div>
  // );
};
