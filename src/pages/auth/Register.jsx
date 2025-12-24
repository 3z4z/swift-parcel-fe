import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { authFormStyle } from "../../utils/classNames";

export default function RegisterPage() {
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
      <p className="text-xl text-center font-bold">Create An Account</p>
      <small className="text-xs text-center mb-6">
        Already a member?{" "}
        <Link
          to={"/auth/login"}
          className="link link-hover font-bold link-primary"
        >
          Login
        </Link>
      </small>
      <label className="label">Full Name</label>
      <input
        type="email"
        className="input w-full"
        placeholder="John Doe"
        {...register("fullName", {
          required: "Name is required",
        })}
      />
      {errors.fullName && (
        <p className="text-error">{errors.fullName.message}</p>
      )}
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
      <label className="label mt-2">Confirm Password</label>
      <input
        type="password"
        className="input w-full"
        placeholder="******"
        {...register("cPassword", {
          required: "Password is required",
        })}
      />
      {errors.cPassword && (
        <p className="text-error">{errors.cPassword.message}</p>
      )}
      <button className="btn btn-primary mt-3">Login Now</button>
    </form>
  );
}
