import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { authFormStyle } from "../../utils/classNames";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import AuthTitleComponent from "../../components/auth/AuthTitle";
import AuthSpinnerLoader from "../../components/loaders/AuthSpinner";

export default function LoginPage() {
  const { login, isSigningIn } = useAuthStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const handleLogin = async (data) => {
    const { user, error } = await login(data.email, data.password);
    if (!user) {
      toast.error(error);
      return;
    } else {
      toast.success("Logged in Successfully!");
      user && navigate(state || "/", { replace: true });
    }
    console.log(data);
  };
  return (
    <form className={authFormStyle} onSubmit={handleSubmit(handleLogin)}>
      <AuthTitleComponent
        title={"Login Now"}
        subtitle={"New Here?"}
        link={{ path: "/auth/register", name: "Register" }}
      />
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
      <button disabled={isSigningIn} className="btn btn-primary mt-3">
        {isSigningIn && <AuthSpinnerLoader />}
        {isSigningIn ? "Logging in" : "Login Now"}
      </button>
    </form>
  );
}
