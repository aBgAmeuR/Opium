import MarqueeComponent from 'react-fast-marquee';

type MarqueeProps = {
  text?: string;
  className?: string;
};

export const Marquee = ({ text, className }: MarqueeProps) => {
  if (!text) return null;

  const texts = text.split('\n');

  return (
    <MarqueeComponent speed={10} delay={2} pauseOnHover className={className}>
      <div>
        {texts[0] ? (
          <p className="text-primary line-clamp-1 text-xs">
            {texts[0]}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        ) : null}
        {texts[1] ? (
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {texts[1]}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        ) : null}
        {texts[2] ? (
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {texts[2]}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        ) : null}
      </div>
    </MarqueeComponent>
  );
};
