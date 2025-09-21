import LanguageSelector from "@/components/LanguageSelector";

export default function AdminHeader() {
  return (
    <>
      <style>{`
        .admin-header {
          --blue-dark: #003b95;
        }
        .admin-header .page-header {
          background: var(--blue-dark);
          color: #fff;
          padding: 12px 0;
        }
        .admin-header .wrap {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .admin-header .header-in {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-header .logo {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }
        .admin-header .logo:hover {
          text-decoration: none !important;
        }
        .admin-header .header-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-header .header-nav span {
          font-size: 14px;
        }
        .admin-header .header-nav .language-selector {
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
        .admin-header .header-nav .language-selector:hover {
          background: rgba(255,255,255,0.1);
        }
        .admin-header .header-btn {
          display: inline-block;
          padding: 8px 12px;
          border: 1px solid #fff;
          border-radius: 4px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          background: transparent;
        }
        .admin-header .header-btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
      <div className="admin-header">
        <header className="page-header">
          <div className="wrap header-in">
            <a href="/list-your-property" className="logo">
              Booking.com
            </a>
            <nav className="header-nav">
              <LanguageSelector variant="header" />
              <span>Already a partner?</span>
              <a href="#" className="header-btn">
                Sign in
              </a>
              <a href="#" className="header-btn">
                Help
              </a>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
