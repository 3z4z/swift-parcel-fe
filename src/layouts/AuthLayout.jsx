import { Outlet } from "react-router";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

export default function AuthLayout() {
  const { language } = i18n;
  const { t } = useTranslation();
  console.log("language", language);
  return (
    <div className="lg:grid flex max-lg:flex-col lg:grid-cols-2 w-full items-center bg-white">
      <header className="text-center py-8">
        <p className="text-2xl font-bold">
          {language === "bn" ? (
            <>
              <span className="text-primary me-2">SwiftParcel</span>
              <span>{t("auth.title")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.title")}</span>
              <span className="text-primary ms-2">SwiftParcel</span>
            </>
          )}
        </p>
        <p className="text-neutral/70 text-sm mt-1">{t("slogan")}</p>
      </header>
      <main className="bg-base-300 w-full lg:min-h-full max-lg:flex-1 flex lg:items-center items-start max-lg:pt-10 justify-center px-3">
        <Outlet />
      </main>
    </div>
  );
}
