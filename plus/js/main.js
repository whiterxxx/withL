// with L+ v2 / event binding and app startup
trainingThemeButton.addEventListener("click", () => {
  setTrainingTheme(
    trainingTheme === "dark" ? "light" : "dark",
    { speak: true }
  );
});

trainingSetupBackButton.addEventListener("click", () => {
  applyTrainingSetup();
  renderTrainingChoices();
  typeMessage(
    "種目選択へ戻りました。設定した内容は保存されています。"
  );
});

trainingSetupType.addEventListener("change", () => {
  const isTimer = trainingSetupType.value === "timer";
  trainingSetupTarget.setAttribute(
    "aria-label",
    isTimer ? "目標秒数" : "目標回数"
  );
});

trainingAddItemButton.addEventListener("click", () => {
  if (trainingProgram.length >= 10) {
    typeMessage("登録できる種目は10件までです。");
    return;
  }

  trainingProgram.push({
    name: `種目 ${trainingProgram.length + 1}`,
    type: "reps",
    target: 10,
    sets: 3,
    rest: 30
  });
  saveTrainingProgram();
  renderTrainingMenuEditor();
});

trainingEditorDoneButton.addEventListener("click", () => {
  normalizeTrainingProgram();
  renderTrainingChoices();
  typeMessage(
    "メニューを保存しました。今日行う種目を選んでください。"
  );
});

trainingStartButton.addEventListener("click", () => {
  startTrainingSession();
});

trainingTapButton.addEventListener("click", () => {
  handleTrainingTap();
});

trainingPauseButton.addEventListener("click", () => {
  toggleTrainingPause();
});

trainingRestPauseButton.addEventListener("click", () => {
  toggleTrainingPause();
});

trainingEndButton.addEventListener("click", () => {
  finishTrainingSession(false);
});

trainingRestEndButton.addEventListener("click", () => {
  finishTrainingSession(false);
});

trainingSkipRestButton.addEventListener("click", () => {
  if (
    !trainingSessionRunning ||
    trainingPhase !== "rest"
  ) {
    return;
  }

  clearTrainingTimers();
  advanceTrainingPosition();
  startCurrentTrainingItem({ next: true });
});



bathSoakButton.addEventListener("click", startBathSession);

bathHairButton.addEventListener("click", () => {
  advanceBathCare({
    status: "HAIR CARE",
    state: `STEP ${bathHairStep + 1}`,
    messages: bathHairMessages,
    stepName: "hair"
  });
});

bathHydrationButton.addEventListener("click", () => {
  advanceBathCare({
    status: "HYDRATION",
    state: `STEP ${bathHydrationStep + 1}`,
    messages: bathHydrationMessages,
    stepName: "hydration"
  });
});

bathSkincareButton.addEventListener("click", () => {
  advanceBathCare({
    status: "SKIN CARE",
    state: `STEP ${bathSkincareStep + 1}`,
    messages: bathSkincareMessages,
    stepName: "skincare"
  });
});

bathFinishButton.addEventListener("click", finishBathMode);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modeKey = button.dataset.mode;

    if (modeKey === "training") {
      enterTrainingMode();
      return;
    }

    if (modeKey && modes[modeKey]) {
      enterMode(modeKey);
    }
  });
});

backButton.addEventListener("click", () => {
  if (currentModeKey === "training") {
    handleTrainingBack();
    return;
  }

  returnToMenu(true);
});

talkButton.addEventListener("click", () => {
  if (displayedCharacters < currentFullMessage.length) {
    finishTyping();
    return;
  }

  speakRandom();
});

dialogueButton.addEventListener("click", () => {
  if (displayedCharacters < currentFullMessage.length) {
    finishTyping();
    return;
  }

  speakRandom();
});



wakeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  exitSleepDisplay();
});

sleepControls.addEventListener("click", (event) => {
  event.stopPropagation();
});

sleepScreen.addEventListener("click", () => {
  if (sleepScreen.classList.contains("controls-hidden")) {
    showSleepControls();
  } else {
    hideSleepControls();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (trainingActive) {
    closeTrainingScreen();
    return;
  }

  if (sleepModeActive) {
    exitSleepDisplay();
    return;
  }

});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopIdleTimer();
    return;
  }

  updateClock();

  if (trainingActive) {
    if (
      trainingSessionRunning &&
      !trainingPaused &&
      trainingPhase === "workout" &&
      getCurrentTrainingItem()?.type === "timer"
    ) {
      trainingTimerRemaining = Math.max(
        0,
        (trainingTimerEndAt - Date.now()) / 1000
      );
      updateTrainingWorkoutDisplay();
      if (trainingTimerRemaining <= 0) {
        finishTrainingSet("timer");
      }
    } else if (
      trainingSessionRunning &&
      !trainingPaused &&
      trainingPhase === "rest"
    ) {
      trainingRestRemaining = Math.max(
        0,
        (trainingTimerEndAt - Date.now()) / 1000
      );
      trainingRestTime.textContent = formatTrainingSeconds(trainingRestRemaining);
      trainingRestFill.style.width =
        `${Math.min(100, ((trainingRestTotal - trainingRestRemaining) / trainingRestTotal) * 100)}%`;
      if (trainingRestRemaining <= 0) {
        clearTrainingTimers();
        advanceTrainingPosition();
        startCurrentTrainingItem({ next: true });
      }
    }
    return;
  }

  if (!sleepModeActive) {
    startIdleTimer();
  }
});

window.addEventListener("error", (event) => {
  console.error("with L encountered an error:", event.error);
});

createParticles();
updateClock();

const restoredSleepSession = restoreSleepDisplayIfNeeded();

if (!restoredSleepSession) {
  typeMessage(takeRandom("initial", initialMessages));
  startIdleTimer();
}

window.setInterval(updateClock, 1000);

window.setInterval(() => {
  if (
    !sleepModeActive &&
    !trainingActive &&
    Math.random() > 0.68
  ) {
    triggerGlitch();
  }
}, 9000);


