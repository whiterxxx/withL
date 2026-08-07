// with L+ v2 / home and mode navigation
function enterMode(modeKey) {
  const mode = modes[modeKey];

  clearPendingEnd();
  stopSleepBreathingGuide();
  currentModeKey = modeKey;
  document.body.classList.toggle(
    "private-session-active",
    modeKey === "private"
  );
  document.body.classList.toggle(
    "sleep-session-active",
    modeKey === "sleep"
  );
  modeTitle.textContent = mode.title;
  modeCode.textContent = mode.code;

  menuPanel.hidden = true;
  modePanel.hidden = false;

  const isBathMode = modeKey === "bath";
  actionButtons.hidden = isBathMode;
  bathScreen.hidden = !isBathMode;

  if (isBathMode) {
    resetBathMode();
  } else {
    renderActions(modeKey);
  }

  startElapsedTimer();
  startIdleTimer();
  typeMessage(takeRandom(`${modeKey}-start`, mode.start));
  triggerGlitch();
}

function returnToMenu(showMessage = true) {
  clearPendingEnd();
  stopSleepBreathingGuide();
  returnHomeAfterTyping = false;

  if (currentModeKey === "training") {
    leaveTrainingMode();
  }

  currentModeKey = null;
  document.body.classList.remove(
    "private-session-active",
    "private-heartbeat-intense",
    "sleep-session-active"
  );
  sessionStartedAt = null;

  stopElapsedTimer();
  stopIdleTimer();

  resetBathMode();

  actionButtons.hidden = false;
  bathScreen.hidden = true;
  elapsedTime.textContent = "00:00";
  modePanel.hidden = true;
  menuPanel.hidden = false;

  if (showMessage) {
    typeMessage(
      "最初の画面へ戻りました。次はどの時間を共有しますか。"
    );
  }

  startIdleTimer();
  triggerGlitch();
}

function triggerGlitch() {
  document.body.classList.add("is-glitching");

  window.setTimeout(() => {
    document.body.classList.remove("is-glitching");
  }, 180);
}

function createParticles() {
  const particleCount = 26;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");

    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--y", `${Math.random() * 100}%`);
    particle.style.setProperty("--w", `${8 + Math.random() * 42}px`);
    particle.style.setProperty("--o", `${0.07 + Math.random() * 0.24}`);
    particle.style.setProperty("--d", `${1.4 + Math.random() * 3.8}s`);

    glitchParticles.appendChild(particle);
  }
}




