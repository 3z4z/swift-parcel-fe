import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { authFormStyle } from "../../utils/classNames";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import AuthTitleComponent from "../../components/auth/AuthTitle";
import AuthSpinnerLoader from "../../components/loaders/AuthSpinner";

export default function RegisterPage() {
  const { register: userRegister, isSigningIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const watchPassword = useWatch({ name: "password", control });

  const handleLogin = async (data) => {
    const { user, error } = await userRegister(
      data.fullName,
      data.email,
      data.password
    );
    await axiosInstance.post("/users", {
      name: data.fullName,
      email: data.email,
      role: data.role,
    });
    if (!user) {
      toast.error(error);
      return;
    } else {
      toast.success("User registration successful!");
      user && navigate("/");
    }
  };
  return (
    <form className={authFormStyle} onSubmit={handleSubmit(handleLogin)}>
      <AuthTitleComponent
        title={"Create An Account"}
        subtitle={"Already a user?"}
        link={{ path: "/auth/login", name: "Login" }}
      />
      <label className="label">Full Name</label>
      <input
        type="text"
        className="input w-full"
        placeholder="John Doe"
        {...register("fullName", {
          required: "Name is required",
        })}
      />
      {errors.fullName && (
        <p className="text-error">{errors.fullName.message}</p>
      )}
      <label className="label mt-2">Email</label>
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
          validate: (value) =>
            value === watchPassword || "Password not matched!",
        })}
      />
      {errors.cPassword && (
        <p className="text-error">{errors.cPassword.message}</p>
      )}
      <label className="label mt-2">Select Role</label>
      <select className="select w-full" {...register("role")}>
        <option value="user">User</option>
        <option value="agent">Delivery Agent</option>
      </select>
      <button disabled={isSigningIn} className="btn btn-primary mt-3">
        {isSigningIn && <AuthSpinnerLoader />}
        Register{isSigningIn && "ing"}
      </button>
    </form>
  );
}
