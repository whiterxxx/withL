// with L+ v2 / bath mode
let bathStartedAt = null;
let bathTimerId = null;
let bathNoticeIndex = 0;
let bathHairStep = 0;
let bathHydrationStep = 0;
let bathSkincareStep = 0;


function setBathStatus(status, state = "") {
  bathStatusLabel.textContent = status;
  bathStateLabel.textContent = state;
}

function stopBathTimer() {
  if (bathTimerId) {
    window.clearInterval(bathTimerId);
    bathTimerId = null;
  }
}

function updateBathDisplay() {
  if (!bathStartedAt) return;

  const elapsedMilliseconds = Date.now() - bathStartedAt;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  bathTime.textContent = formatElapsed(elapsedMilliseconds);
  bathTime.dateTime = `PT${elapsedSeconds}S`;

  const notice = bathTimedMessages[bathNoticeIndex];
  if (notice && elapsedSeconds >= notice.seconds) {
    typeMessage(
      takeRandom(`bath-time-${notice.seconds}`, notice.messages)
    );
    bathNoticeIndex += 1;
  }
}

function startBathSession() {
  setBathStatus("BATH SESSION", "ACTIVE");
  bathTimeCaption.textContent = "ELAPSED BATH TIME";

  if (bathStartedAt) {
    typeMessage(
      takeRandom("bath-soak-running", bathSoakMessages.alreadyRunning)
    );
    return;
  }

  bathStartedAt = Date.now();
  bathNoticeIndex = 0;
  bathSoakButton.classList.add("is-active");
  bathTimerId = window.setInterval(updateBathDisplay, 1000);

  typeMessage(
    takeRandom("bath-soak-start", bathSoakMessages.start)
  );
}

function endBathTimerSilently() {
  stopBathTimer();
  bathStartedAt = null;
  bathSoakButton.classList.remove("is-active");
}

function advanceBathCare({
  status,
  state,
  messages,
  stepName
}) {
  setBathStatus(status, state);
  bathTimeCaption.textContent = "AFTER BATH CARE";

  let step = 0;

  if (stepName === "hair") {
    step = bathHairStep;
    bathHairStep = (bathHairStep + 1) % messages.length;
  } else if (stepName === "hydration") {
    step = bathHydrationStep;
    bathHydrationStep =
      (bathHydrationStep + 1) % messages.length;
  } else {
    step = bathSkincareStep;
    bathSkincareStep =
      (bathSkincareStep + 1) % messages.length;
  }

  typeMessage(messages[step]);
}

function finishBathMode() {
  const hadBathTimer = Boolean(bathStartedAt);
  const elapsed = hadBathTimer
    ? formatElapsed(Date.now() - bathStartedAt)
    : null;

  endBathTimerSilently();
  setBathStatus("SESSION COMPLETE", "COMPLETE");
  bathTimeCaption.textContent = "BATH CARE COMPLETE";

  const closing = takeRandom(
    "bath-finish",
    bathFinishMessages
  );

  const message = elapsed
    ? `入浴時間は${elapsed}でした。${closing}`
    : closing;

  typeMessage(message, { returnHomeAfter: true });
}

function resetBathMode() {
  endBathTimerSilently();
  bathNoticeIndex = 0;
  bathHairStep = 0;
  bathHydrationStep = 0;
  bathSkincareStep = 0;
  bathTime.textContent = "00:00";
  bathTime.dateTime = "PT0S";
  bathTimeCaption.textContent = "ELAPSED BATH TIME";
  setBathStatus("BATH SESSION", "READY");
}

