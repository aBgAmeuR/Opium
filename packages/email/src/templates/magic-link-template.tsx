type MagicLinkTemplateProps = {
  email: string;
  token: string;
  url: string;
};

export const MagicLinkTemplate = ({ url }: MagicLinkTemplateProps) => (
  <div>
    <h1>Magic Link</h1>
    <p>Click the link below to login:</p>
    <a href={url}>{url}</a>
  </div>
);
