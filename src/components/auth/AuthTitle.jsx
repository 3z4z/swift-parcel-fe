import { Link } from "react-router";

export default function AuthTitleComponent({
  title,
  subtitle,
  link: { name, path },
}) {
  return (
    <>
      <p className="text-xl text-center font-bold">{title}</p>
      <small className="text-sm text-center mb-6">
        {subtitle}{" "}
        <Link to={path} className="link link-hover font-bold link-primary">
          {name}
        </Link>
      </small>
    </>
  );
}
