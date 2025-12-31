import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { authFormStyle } from "../../utils/classNames";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import AuthTitleComponent from "../../components/auth/AuthTitle";
import AuthSpinnerLoader from "../../components/loaders/AuthSpinner";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
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
      toast.success(t("form.toasts.success.login"));
      user && navigate(state || "/", { replace: true });
    }
  };
  return (
    <form className={authFormStyle} onSubmit={handleSubmit(handleLogin)}>
      <AuthTitleComponent
        title={t("form.titles.login")}
        subtitle={t("form.titles.new_user")}
        link={{ path: "/auth/register", name: t("auth.register") }}
      />
      <label className="label">{t("form.labels.email")}</label>
      <input
        type="email"
        className="input w-full"
        placeholder="johndoe@email.com"
        {...register("email", {
          required: t("form.validations.email"),
        })}
      />
      {errors.email && <p className="text-error">{errors.email.message}</p>}
      <label className="label mt-2">{t("form.labels.password")}</label>
      <input
        type="password"
        className="input w-full"
        placeholder="******"
        {...register("password", {
          required: t("form.validations.password"),
        })}
      />
      {errors.password && (
        <p className="text-error">{errors.password.message}</p>
      )}
      <button disabled={isSigningIn} className="btn btn-primary mt-3">
        {isSigningIn && <AuthSpinnerLoader />}
        {isSigningIn
          ? t("form.actions.logging_in")
          : t("form.actions.login_now")}
      </button>
    </form>
  );
}
