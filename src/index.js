import React from "react";

import PWAPrompt from "./components/PWAPrompt";

const deviceCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isStandalone =
    "standalone" in window.navigator && window.navigator.standalone;

  return (isiOS || isiPadOS) && !isStandalone;
};

export default React.memo(({
  timesToShow = 1,
  promptOnVisit = 1,
  permanentlyHideOnDismiss = true,
  copyTitle = "Add to Home Screen",
  copyBody = "This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.",
  copyShareButtonLabel = "1) Press the 'Share' button on the menu bar below.",
  copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'.",
  copyClosePrompt = "Cancel",
  delay = 1000,
  debug = false,
  onClose = () => {},
  willNotShowPrompt = () => {},
  dir = "ltr",
  font_family = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,'Helvetica Neue', Arial, sans-serif",
}) => {
  let promptData = JSON.parse(localStorage.getItem("iosPwaPrompt"));
  if (promptData === null) {
    promptData = { isiOS: deviceCheck(), visits: 0 };
    localStorage.setItem("iosPwaPrompt", JSON.stringify(promptData));
  }

  const aboveMinVisits = promptData.visits + 1 >= promptOnVisit;
  const belowMaxVisits = promptData.visits + 1 < promptOnVisit + timesToShow;

  if (promptData.isiOS || debug) {

    if (belowMaxVisits || debug) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          visits: promptData.visits + 1,
        })
      );

      if (aboveMinVisits || debug) {
        return (
          <PWAPrompt
            delay={delay}
            copyTitle={copyTitle}
            copyBody={copyBody}
            copyAddHomeButtonLabel={copyAddHomeButtonLabel}
            copyShareButtonLabel={copyShareButtonLabel}
            copyClosePrompt={copyClosePrompt}
            permanentlyHideOnDismiss={permanentlyHideOnDismiss}
            promptData={promptData}
            maxVisits={timesToShow + promptOnVisit}
            onClose={onClose}
            dir={dir}
            font_family={font_family}
          />
        );
      }
    }
  }

  /**
   * Check prompt will show 
   */
  if (!promptData.isiOS || !aboveMinVisits || !belowMaxVisits) {
      willNotShowPrompt()
  }

  return null;
});
