import LanguageSelector from "@/components/LanguageSelector";

export default function PartnerRegisterHeader() {
  return (
    <>
      <style>{`
        .partner-register-header {
          --blue-dark: #003b95;
        }
        .partner-register-header .page-header {
          background: var(--blue-dark);
          color: #fff;
          height: 56px;
          display: flex;
          align-items: center;
        }
        .partner-register-header .wrap {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }
        .partner-register-header .header-in {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .partner-register-header .logo {
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }
        .partner-register-header .logo:hover {
          text-decoration: none !important;
        }
        .partner-register-header .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #ffffffcc;
        }
        .partner-register-header .language-selector {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          background: transparent;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .partner-register-header .language-selector:hover {
          background: rgba(255,255,255,0.1);
        }
        .partner-register-header .help-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border: 1px solid #fff;
          border-radius: 9999px;
          line-height: 1;
          color: #fff;
          font-size: 12px;
          background: transparent;
          cursor: pointer;
        }
        .partner-register-header .help-btn:hover {
          background: rgba(255,255,255,0.14);
        }
      `}</style>
      <div className="partner-register-header">
        <header className="page-header">
          <div className="wrap header-in">
            <a className="logo" href="/list-your-property">
              Booking.com
            </a>
            <div className="header-right">
              <LanguageSelector variant="header" />
              <button aria-label="Help" className="help-btn">
                ?
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
