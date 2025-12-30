import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../stores/useAuthStore";

export default function UserDbHome() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  return (
    <>
      <h1 className="text-xl">
        {t("title")} {t("user")}!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
    </>
  );
}
