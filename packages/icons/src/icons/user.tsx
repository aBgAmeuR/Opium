type Props = React.SVGProps<SVGSVGElement>;

export const UserIcon = (props: Props) => (
  <svg fill="none" viewBox="0 0 24 24" {...props}>
    <path
      d="M12 3.5C14.7614 3.5 17 5.73858 17 8.5C17 11.2614 14.7614 13.5 12 13.5C15.866 13.5 19 16.634 19 20.5H5C5 16.634 8.13401 13.5 12 13.5C9.23858 13.5 7 11.2614 7 8.5C7 5.73858 9.23858 3.5 12 3.5Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
