// with L+ v2 / private mode
function triggerPrivateHeartbeat() {
  document.body.classList.remove("private-heartbeat-intense");

  window.requestAnimationFrame(() => {
    document.body.classList.add("private-heartbeat-intense");
  });

  window.setTimeout(() => {
    document.body.classList.remove("private-heartbeat-intense");
  }, 4600);
}


function renderActions(modeKey) {
  actionButtons.innerHTML = "";

  modes[modeKey].actions.forEach((action, actionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button";
    button.textContent = action.label;

    if (action.wide) {
      button.classList.add("is-wide");
    }

    button.addEventListener("click", () => {
      clearPendingEnd();
      triggerGlitch();

      const message = takeRandom(
        `${modeKey}-action-${actionIndex}`,
        action.messages
      );

      if (!action.breathingGuide) {
        stopSleepBreathingGuide();
      }

      if (action.intenseHeartbeat) {
        triggerPrivateHeartbeat();
      }

      if (action.breathingGuide) {
        startSleepBreathingGuide(
          message,
          action.completionMessages || []
        );
        return;
      }

      if (action.sleepDisplay) {
        enterSleepDisplay(message);
        return;
      }

      typeMessage(message, {
        returnHomeAfter: Boolean(action.endSession)
      });
      startIdleTimer();
    });

    actionButtons.appendChild(button);
  });
}


