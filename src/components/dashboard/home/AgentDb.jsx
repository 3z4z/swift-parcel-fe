import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../stores/useAuthStore";

export default function AgentDbHome() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  return (
    <>
      <h1 className="text-xl">
        {t("title")} {t("agent")}!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
    </>
  );
}
