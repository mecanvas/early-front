import Link from 'next/link';

export const Li = ({
  link,
  txt,
  ...props
}: { link?: string; txt: string } & React.HtmlHTMLAttributes<HTMLLIElement>) => {
  return (
    <>
      {link ? (
        <Link href={link}>
          <li {...props}>{txt}</li>
        </Link>
      ) : (
        <li {...props}>{txt}</li>
      )}
    </>
  );
};
