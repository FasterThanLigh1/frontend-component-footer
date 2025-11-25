import React from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { sendTrackEvent } from "@edx/frontend-platform/analytics";
import { ensureConfig, getConfig } from "@edx/frontend-platform";
import { AppContext } from "@edx/frontend-platform/react";
import messages from "./Footer.messages";
import LanguageSelector from "./LanguageSelector";

ensureConfig(["LMS_BASE_URL", "LOGO_TRADEMARK_URL"], "Footer component");

const EVENT_NAMES = {
  FOOTER_LINK: "edx.bi.footer.link",
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute("href");
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: "outbound_link",
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const { supportedLanguages, onLanguageSelected, logo, intl } = this.props;
    const showLanguageSelector =
      supportedLanguages.length > 0 && onLanguageSelected;
    const config = getConfig();
    const currentYear = new Date().getFullYear();

    return (
      <div className="wrapper wrapper-footer">
        <footer id="footer" className="tutor-container">
          <div className="footer-top">
            <div className="powered-area">
              <ul className="logo-list">
                <li>
                  <a
                    href="https://veronlabs.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    onClick={this.externalLinkClickHandler}
                  >
                    <img
                      src={`${config.LMS_BASE_URL}/theming/asset/images/logo.png`}
                      alt="Runs on Tutor"
                      width="57"
                    />
                  </a>
                </li>
              </ul>
            </div>

            <nav
              className="nav-colophon"
              aria-label={intl.formatMessage(
                messages["footer.about.ariaLabel"],
              )}
            >
              <ol>
                <li>
                  <a href="/about" onClick={this.externalLinkClickHandler}>
                    {intl.formatMessage(messages["footer.edxLinks.about"])}
                  </a>
                </li>
                <li>
                  <span>Terms and Service</span>
                </li>
                <li>
                  <span>
                    {intl.formatMessage(messages["footer.privacyPolicy"])}
                  </span>
                </li>
                <li>
                  <a href="/contact" onClick={this.externalLinkClickHandler}>
                    {intl.formatMessage(messages["footer.contactUs"])}
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          <span className="copyright-site">
            {intl.formatMessage(messages["footer.copyright.text"], {
              year: currentYear,
            })}
          </span>

          <div className="colophon">
            {showLanguageSelector && (
              <LanguageSelector
                options={supportedLanguages}
                onSubmit={onLanguageSelected}
              />
            )}

            <p className="copyright">
              {intl.formatMessage(messages["footer.edx.copyright"])}
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
