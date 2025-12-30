import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { authFormStyle } from "../../utils/classNames";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import AuthTitleComponent from "../../components/auth/AuthTitle";
import AuthSpinnerLoader from "../../components/loaders/AuthSpinner";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register: userRegister, isSigningIn } = useAuthStore();
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  useEffect(() => {
    fetch("/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, []);

  const districts = [...new Set(locations.map((l) => l.district))];

  const watchPassword = useWatch({ name: "password", control });
  const watchRole = useWatch({ name: "role", control });

  const handleRegister = async (data) => {
    const { user, error } = await userRegister(
      data.fullName,
      data.email,
      data.password
    );
    await axiosInstance.post("/users", {
      name: data.fullName,
      email: data.email,
      role: data.role,
      preferredCity: data.preferredCity,
    });
    if (!user) {
      toast.error(error);
      return;
    } else {
      toast.success(t("form.toasts.success.registration"));
      user && navigate("/");
    }
  };
  return (
    <form className={authFormStyle} onSubmit={handleSubmit(handleRegister)}>
      <AuthTitleComponent
        title={t("form.titles.create_account")}
        subtitle={t("form.titles.old_user")}
        link={{ path: "/auth/login", name: t("auth.login") }}
      />
      <label className="label">{t("form.labels.full_name")}</label>
      <input
        type="text"
        className="input w-full"
        placeholder="John Doe"
        {...register("fullName", {
          required: t("form.validations.name"),
        })}
      />
      {errors.fullName && (
        <p className="text-error">{errors.fullName.message}</p>
      )}
      <label className="label mt-2">{t("form.labels.email")}</label>
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
      <label className="label mt-2">{t("form.labels.confirm_password")}</label>
      <input
        type="password"
        className="input w-full"
        placeholder="******"
        {...register("cPassword", {
          required: t("form.validations.password"),
          validate: (value) =>
            value === watchPassword || t("form.validations.password_mismatch"),
        })}
      />
      {errors.cPassword && (
        <p className="text-error">{errors.cPassword.message}</p>
      )}
      <label className="label mt-2">{t("form.labels.role")}</label>
      <select className="select w-full" {...register("role")}>
        <option value="user">User</option>
        <option value="agent">Delivery Agent</option>
      </select>
      {watchRole === "agent" && (
        <>
          <label className="label mt-2">
            {t("form.labels.preferred_city")}
          </label>
          <select
            className="select w-full"
            {...register("preferredCity", {
              required:
                watchRole !== "agent" || t("form.validations.preferred_city"),
            })}
          >
            <option value="">{t("form.options.select_preferred_city")}</option>
            {districts.sort().map((dis, i) => (
              <option key={i} value={dis}>
                {dis}
              </option>
            ))}
          </select>
          {errors.preferredCity && (
            <p className="text-error">{errors.preferredCity.message}</p>
          )}
        </>
      )}
      <button disabled={isSigningIn} className="btn btn-primary mt-3">
        {isSigningIn && <AuthSpinnerLoader />}
        {isSigningIn
          ? t("form.actions.registering")
          : t("form.actions.register")}
      </button>
    </form>
  );
}
