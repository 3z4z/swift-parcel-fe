import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { authFormStyle } from "../../utils/classNames";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const handleLogin = (data) => {
    console.log(data);
  };
  return (
    <form className={authFormStyle} onSubmit={handleSubmit(handleLogin)}>
      <p className="text-xl text-center font-bold">Login Now</p>
      <small className="text-xs text-center mb-6">
        New here?{" "}
        <Link
          to={"/auth/register"}
          className="link link-hover font-bold link-primary"
        >
          Register
        </Link>
      </small>
      <label className="label">Email</label>
      <input
        type="email"
        className="input w-full"
        placeholder="johndoe@email.com"
        {...register("email", {
          required: "Email is required",
        })}
      />
      {errors.email && <p className="text-error">{errors.email.message}</p>}
      <label className="label mt-2">Password</label>
      <input
        type="password"
        className="input w-full"
        placeholder="******"
        {...register("password", {
          required: "Password is required",
        })}
      />
      {errors.password && (
        <p className="text-error">{errors.password.message}</p>
      )}
      <button className="btn btn-primary mt-3">Login Now</button>
    </form>
  );
}
