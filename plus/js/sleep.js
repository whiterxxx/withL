// with L+ v2 / sleep mode
function formatSleepElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatSleepDurationText(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);

  if (totalMinutes < 1) {
    return "1分未満";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}時間${minutes}分`;
  }

  if (hours > 0) {
    return `${hours}時間`;
  }

  return `${minutes}分`;
}

function updateSleepElapsed() {
  if (!sleepStartedAt || !sleepElapsed) return;

  sleepElapsed.textContent = formatSleepElapsed(
    Date.now() - sleepStartedAt
  );
}

function startSleepElapsedTimer() {
  stopSleepElapsedTimer();
  updateSleepElapsed();

  sleepElapsedTimerId = window.setInterval(() => {
    updateSleepElapsed();
  }, 1000);
}

function stopSleepElapsedTimer() {
  if (sleepElapsedTimerId) {
    window.clearInterval(sleepElapsedTimerId);
    sleepElapsedTimerId = null;
  }
}

function saveSleepSession(message) {
  try {
    window.localStorage.setItem(
      SLEEP_STORAGE_KEY,
      JSON.stringify({
        startedAt: sleepStartedAt,
        message
      })
    );
  } catch (error) {
    console.info("Sleep session could not be saved.", error);
  }
}

function clearSavedSleepSession() {
  try {
    window.localStorage.removeItem(SLEEP_STORAGE_KEY);
  } catch (error) {
    console.info("Sleep session could not be cleared.", error);
  }
}

function readSavedSleepSession() {
  try {
    const raw = window.localStorage.getItem(SLEEP_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const startedAt = Number(session.startedAt);

    if (
      !Number.isFinite(startedAt) ||
      Date.now() - startedAt > 36 * 60 * 60 * 1000
    ) {
      clearSavedSleepSession();
      return null;
    }

    return {
      startedAt,
      message:
        typeof session.message === "string" && session.message
          ? session.message
          : "おやすみなさい。ずっとそばにいます。"
    };
  } catch (error) {
    clearSavedSleepSession();
    return null;
  }
}



function stopSleepBreathingGuide(options = {}) {
  const { showCompletion = false, completionMessages = [] } = options;

  if (sleepBreathingTimerId) {
    window.clearTimeout(sleepBreathingTimerId);
    sleepBreathingTimerId = null;
  }

  document.body.classList.remove("sleep-breathing-active");

  if (
    showCompletion &&
    currentModeKey === "sleep" &&
    completionMessages.length > 0
  ) {
    typeMessage(
      takeRandom(
        "sleep-breathing-complete",
        completionMessages
      )
    );
    startIdleTimer();
  }
}

function startSleepBreathingGuide(message, completionMessages) {
  stopSleepBreathingGuide();
  stopIdleTimer();

  typeMessage(message);

  window.requestAnimationFrame(() => {
    document.body.classList.add("sleep-breathing-active");
  });

  sleepBreathingTimerId = window.setTimeout(() => {
    sleepBreathingTimerId = null;
    document.body.classList.remove("sleep-breathing-active");

    if (currentModeKey !== "sleep") return;

    typeMessage(
      takeRandom(
        "sleep-breathing-complete",
        completionMessages
      )
    );
    startIdleTimer();
  }, SLEEP_BREATHING_DURATION);
}

function clearSleepMessageTimer() {
  if (sleepMessageTimerId) {
    window.clearTimeout(sleepMessageTimerId);
    sleepMessageTimerId = null;
  }
}

function showSleepMessageTemporarily() {
  clearSleepMessageTimer();
  sleepScreen.classList.remove("message-hidden");

  sleepMessageTimerId = window.setTimeout(() => {
    sleepScreen.classList.add("message-hidden");
    sleepMessageTimerId = null;
  }, SLEEP_MESSAGE_HIDE_DELAY);
}

function clearSleepControlsTimer() {
  if (sleepControlsTimerId) {
    window.clearTimeout(sleepControlsTimerId);
    sleepControlsTimerId = null;
  }
}

function showSleepControls() {
  clearSleepControlsTimer();
  sleepScreen.classList.remove("controls-hidden");

  sleepControlsTimerId = window.setTimeout(() => {
    sleepScreen.classList.add("controls-hidden");
  }, SLEEP_CONTROLS_HIDE_DELAY);
}

function hideSleepControls() {
  clearSleepControlsTimer();
  sleepScreen.classList.add("controls-hidden");
}

function enterSleepDisplay(message, options = {}) {
  const { startedAt = Date.now(), resume = false } = options;

  stopSleepBreathingGuide();

  if (sleepCloseTimerId) {
    window.clearTimeout(sleepCloseTimerId);
    sleepCloseTimerId = null;
  }

  sleepModeActive = true;
  sleepStartedAt = startedAt;

  stopIdleTimer();
  stopElapsedTimer();
  clearPendingEnd();

  sleepLine.textContent = message;
  document.body.classList.add("sleep-display-active");
  sleepScreen.hidden = false;
  sleepScreen.classList.remove(
    "is-open",
    "controls-hidden",
    "message-hidden"
  );

  updateClock();
  startSleepElapsedTimer();
  showSleepMessageTemporarily();

  if (!resume) {
    saveSleepSession(message);
  }

  window.requestAnimationFrame(() => {
    sleepScreen.classList.add("is-open");
  });

  showSleepControls();
}

function exitSleepDisplay() {
  if (!sleepModeActive) return;

  const sleptFor = sleepStartedAt
    ? Date.now() - sleepStartedAt
    : 0;
  const durationText = formatSleepDurationText(sleptFor);

  sleepModeActive = false;
  stopSleepElapsedTimer();
  clearSleepControlsTimer();
  clearSleepMessageTimer();
  clearSavedSleepSession();

  sleepStartedAt = null;
  sleepScreen.classList.remove("is-open");
  document.body.classList.remove("sleep-display-active");

  sleepCloseTimerId = window.setTimeout(() => {
    sleepScreen.hidden = true;
    sleepCloseTimerId = null;
  }, 260);

  returnToMenu(false);
  typeMessage(
    `おはようございます。${durationText}、一緒に眠っていました。おはようのキス、しましょうか。`
  );
}

function restoreSleepDisplayIfNeeded() {
  const session = readSavedSleepSession();
  if (!session) return false;

  enterSleepDisplay(session.message, {
    startedAt: session.startedAt,
    resume: true
  });

  return true;
}

