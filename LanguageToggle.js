export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="toggle" role="tablist" aria-label="Language toggle">
      <div
        className={`pill ${lang === "en" ? "pillOn" : ""}`}
        onClick={() => setLang("en")}
        role="tab"
      >
        EN
      </div>
      <div
        className={`pill ${lang === "it" ? "pillOn" : ""}`}
        onClick={() => setLang("it")}
        role="tab"
      >
        IT
      </div>
    </div>
  );
}
