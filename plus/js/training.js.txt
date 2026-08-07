// with L+ v2 / training mode
const TRAINING_MENU_STORAGE_KEY = "withL-partner-training-menu-v1";
const TRAINING_THEME_STORAGE_KEY = "withL-partner-training-theme-v1";
const TRAINING_SET_MESSAGE_DELAY = 2400;

const TRAINING_DEFAULT_MENU = [
  { name: "スクワット", type: "reps", target: 15, sets: 3, rest: 30 },
  { name: "プランク", type: "timer", target: 30, sets: 3, rest: 30 },
  { name: "ヒップリフト", type: "reps", target: 15, sets: 3, rest: 30 },
  { name: "カーフレイズ", type: "reps", target: 20, sets: 3, rest: 30 }
];


let trainingActive = false;
let trainingSessionRunning = false;
let trainingTheme = "light";
let trainingProgram = [];
let trainingSessionProgram = [];
let trainingSelectionMode = "single";
let trainingSelectedIndex = 0;
let trainingItemIndex = 0;
let trainingSetIndex = 1;
let trainingRepCount = 0;
let trainingTimerRemaining = 0;
let trainingTimerTotal = 0;
let trainingRestRemaining = 0;
let trainingRestTotal = 0;
let trainingTimerEndAt = null;
let trainingIntervalId = null;
let trainingTransitionId = null;
let trainingPaused = false;
let trainingPhase = "choices";
let trainingCompletedSets = 0;
let trainingAnnouncements = new Set();

function trainingClamp(value, minimum, maximum, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function trainingRandom(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "";
  return messages[Math.floor(Math.random() * messages.length)];
}

function trainingSpeak(key) {
  const pool = trainingDialogues[`${trainingTheme}.${key}`];
  const message = trainingRandom(pool);
  if (!message) return;
  typeMessage(message);
}

function getTrainingGuideMessage() {
  return trainingRandom(
    TRAINING_GUIDE_MESSAGES[trainingTheme] ||
      TRAINING_GUIDE_MESSAGES.light
  );
}

const TRAINING_RING_OUTER_CIRCUMFERENCE = 2 * Math.PI * 53;
const TRAINING_RING_INNER_CIRCUMFERENCE = 2 * Math.PI * 44;

function setTrainingRingProgress(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const outerOffset =
    TRAINING_RING_OUTER_CIRCUMFERENCE * (1 - clamped);
  const innerOffset =
    TRAINING_RING_INNER_CIRCUMFERENCE * (1 - clamped);

  if (trainingLogoOuterProgress) {
    trainingLogoOuterProgress.style.strokeDashoffset = String(outerOffset);
  }

  if (trainingLogoInnerProgress) {
    trainingLogoInnerProgress.style.strokeDashoffset = String(innerOffset);
  }
}

function setTrainingLogoTimerState(state) {
  const activeState =
    state === "timer" || state === "rest" ? state : "";

  trainingLogoTimer.classList.toggle("is-visible", Boolean(activeState));
  trainingLogoTimer.classList.toggle("is-timer", activeState === "timer");
  trainingLogoTimer.classList.toggle("is-rest", activeState === "rest");
  document.body.classList.toggle(
    "training-logo-timer-active",
    Boolean(activeState)
  );

  if (!activeState) {
    trainingLogoTimer.classList.remove("is-warning");
    setTrainingRingProgress(0);
  }
}

function updateTrainingRingWarning(remainingSeconds) {
  const shouldWarn =
    trainingTheme === "dark" &&
    Number(remainingSeconds) <= 10 &&
    Number(remainingSeconds) > 0;

  trainingLogoTimer.classList.toggle("is-warning", shouldWarn);
}

function trainingPulseVital() {
  if (!trainingVital) return;
  trainingVital.classList.remove("is-pulsing");
  void trainingVital.offsetWidth;
  trainingVital.classList.add("is-pulsing");
  window.setTimeout(() => {
    trainingVital.classList.remove("is-pulsing");
  }, 430);
}

function loadTrainingProgram() {
  try {
    const raw = window.localStorage.getItem(TRAINING_MENU_STORAGE_KEY);
    if (!raw) return TRAINING_DEFAULT_MENU.map((item) => ({ ...item }));

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return TRAINING_DEFAULT_MENU.map((item) => ({ ...item }));
    }

    const normalized = parsed.slice(0, 10).map((item, index) => ({
      name: typeof item.name === "string" && item.name.trim()
        ? item.name.trim().slice(0, 28)
        : `種目 ${index + 1}`,
      type: item.type === "timer" ? "timer" : "reps",
      target: trainingClamp(
        item.target,
        1,
        999,
        item.type === "timer" ? 30 : 15
      ),
      sets: trainingClamp(item.sets, 1, 10, 3),
      rest: trainingClamp(item.rest, 0, 300, 30)
    }));

    if (!normalized.some((item) => item.name === "カーフレイズ")) {
      normalized.push({
        name: "カーフレイズ",
        type: "reps",
        target: 20,
        sets: 3,
        rest: 30
      });
    }

    return normalized.slice(0, 10);
  } catch (error) {
    console.info("Training menu could not be loaded.", error);
    return TRAINING_DEFAULT_MENU.map((item) => ({ ...item }));
  }
}

function saveTrainingProgram() {
  try {
    window.localStorage.setItem(
      TRAINING_MENU_STORAGE_KEY,
      JSON.stringify(trainingProgram)
    );
  } catch (error) {
    console.info("Training menu could not be saved.", error);
  }
}

function setTrainingTheme(theme, options = {}) {
  const { speak = false } = options;
  trainingTheme = theme === "dark" ? "dark" : "light";
  const isDark = trainingTheme === "dark";

  document.body.classList.toggle(
    "training-dark",
    isDark && trainingActive
  );
  trainingThemeButton.setAttribute("aria-pressed", String(isDark));
  trainingThemeButton.setAttribute(
    "aria-label",
    isDark
      ? "ライトモードに戻す"
      : "ダークモードに切り替える"
  );
  trainingThemeButton.title = isDark
    ? "LIGHT MODE"
    : "DARK MODE";
  trainingThemeLabel.textContent = "D";

  try {
    window.localStorage.setItem(
      TRAINING_THEME_STORAGE_KEY,
      trainingTheme
    );
  } catch (error) {
    console.info("Training theme could not be saved.", error);
  }

  if (speak) {
    if (isDark) {
      trainingSpeak(
        trainingSessionRunning
          ? "themeEnterWorkout"
          : "themeEnter"
      );
    } else {
      trainingSpeak(
        trainingSessionRunning
          ? "themeExitWorkout"
          : "themeExit"
      );
    }
  }
}

function showTrainingView(view) {
  const isChoices = view === "choices";

  actionButtons.hidden = !isChoices;
  trainingSetupView.hidden = view !== "setup";
  trainingEditorView.hidden = view !== "editor";
  trainingWorkoutView.hidden = view !== "workout";
  trainingRestView.hidden = view !== "rest";
  trainingPhase = view;
}

function createTrainingChoiceButton({
  title,
  meta,
  wide = false,
  subtle = false,
  onClick
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "action-button training-choice-button";

  if (wide) button.classList.add("is-wide");
  if (subtle) button.classList.add("is-subtle");

  const titleElement = document.createElement("span");
  titleElement.className = "training-choice-name";
  titleElement.textContent = title;

  const metaElement = document.createElement("small");
  metaElement.className = "training-choice-meta";
  metaElement.textContent = meta;

  button.append(titleElement, metaElement);
  button.addEventListener("click", onClick);
  actionButtons.appendChild(button);
}

function getTrainingItemMeta(item) {
  const target = item.type === "timer"
    ? `${item.target} SEC`
    : `${item.target} REP`;

  return `${target} × ${item.sets} SET`;
}

function renderTrainingChoices(options = {}) {
  const { speak = false } = options;

  normalizeTrainingProgram();
  actionButtons.innerHTML = "";

  trainingProgram.forEach((item, index) => {
    createTrainingChoiceButton({
      title: item.name,
      meta: getTrainingItemMeta(item),
      onClick: () => {
        openTrainingSetup(index);
      }
    });
  });

  createTrainingChoiceButton({
    title: "フリーモード",
    meta: "CUSTOM EXERCISE / 自由設定",
    wide: true,
    subtle: true,
    onClick: () => {
      openTrainingSetup("free");
    }
  });

  trainingScreen.hidden = false;
  showTrainingView("choices");

  if (speak) {
    typeMessage(getTrainingGuideMessage());
  }

  startIdleTimer();
}

function openTrainingSetup(selection) {
  clearPendingEnd();
  triggerGlitch();

  if (selection === "free") {
    trainingSelectionMode = "free";
    trainingSetupTitle.textContent = "フリーモード";
    trainingSetupFields.hidden = false;
    trainingSetupSummary.textContent =
      "種目名、計測方式、目標、セット数、休憩時間を自由に設定できます。";
    trainingSetupName.value = "フリートレーニング";
    trainingSetupType.value = "reps";
    trainingSetupTarget.value = "10";
    trainingSetupSets.value = "3";
    trainingSetupRest.value = "30";
    trainingStartButton.textContent = "START / フリーモード開始";
    typeMessage(
      "自由設定ですね。今日行う内容を入力してください。私がその通りに数えます。"
    );
  } else {
    trainingSelectionMode = "single";
    trainingSelectedIndex = trainingClamp(
      selection,
      0,
      trainingProgram.length - 1,
      0
    );

    const item = trainingProgram[trainingSelectedIndex];
    trainingSetupTitle.textContent = item.name;
    trainingSetupFields.hidden = false;
    trainingSetupSummary.textContent =
      "開始前に、今日の目標とセット数を調整できます。";
    trainingSetupName.value = item.name;
    trainingSetupType.value = item.type;
    trainingSetupTarget.value = String(item.target);
    trainingSetupSets.value = String(item.sets);
    trainingSetupRest.value = String(item.rest);
    trainingStartButton.textContent = "START / トレーニング開始";
    typeMessage(
      `${item.name}ですね。回数とセット数を確認したら、開始してください。`
    );
  }

  showTrainingView("setup");
  startIdleTimer();
}

function getFreeTrainingItem() {
  const type = trainingSetupType.value === "timer"
    ? "timer"
    : "reps";

  return {
    name: trainingSetupName.value.trim().slice(0, 28) ||
      "フリートレーニング",
    type,
    target: trainingClamp(
      trainingSetupTarget.value,
      1,
      999,
      type === "timer" ? 30 : 10
    ),
    sets: trainingClamp(
      trainingSetupSets.value,
      1,
      10,
      3
    ),
    rest: trainingClamp(
      trainingSetupRest.value,
      0,
      300,
      30
    )
  };
}

function applyTrainingSetup() {
  if (trainingSelectionMode !== "single") return;

  const item = trainingProgram[trainingSelectedIndex];
  if (!item) return;

  item.name = trainingSetupName.value.trim().slice(0, 28) ||
    `種目 ${trainingSelectedIndex + 1}`;
  item.type = trainingSetupType.value === "timer"
    ? "timer"
    : "reps";
  item.target = trainingClamp(
    trainingSetupTarget.value,
    1,
    999,
    item.type === "timer" ? 30 : 15
  );
  item.sets = trainingClamp(
    trainingSetupSets.value,
    1,
    10,
    3
  );
  item.rest = trainingClamp(
    trainingSetupRest.value,
    0,
    300,
    30
  );

  saveTrainingProgram();
}

function updateTrainingMenuCount() {
  trainingMenuCount.textContent = `${trainingProgram.length} ITEMS`;
}

function escapeTrainingValue(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function renderTrainingMenuEditor() {
  trainingMenuList.innerHTML = "";

  trainingProgram.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "training-menu-card";
    card.dataset.index = String(index + 1).padStart(2, "0");

    card.innerHTML = `
      <label class="training-field training-field-wide">
        <span>EXERCISE / 種目</span>
        <input
          type="text"
          maxlength="28"
          value="${escapeTrainingValue(item.name)}"
        >
      </label>

      <label class="training-field">
        <span>TYPE / 計測</span>
        <select>
          <option
            value="reps"
            ${item.type === "reps" ? "selected" : ""}
          >回数</option>
          <option
            value="timer"
            ${item.type === "timer" ? "selected" : ""}
          >タイマー</option>
        </select>
      </label>

      <label class="training-field">
        <span>TARGET / 目標</span>
        <input
          type="number"
          min="1"
          max="999"
          inputmode="numeric"
          value="${item.target}"
        >
      </label>

      <label class="training-field">
        <span>SETS / セット</span>
        <input
          type="number"
          min="1"
          max="10"
          inputmode="numeric"
          value="${item.sets}"
        >
      </label>

      <label class="training-field">
        <span>REST / 休憩秒</span>
        <input
          type="number"
          min="0"
          max="300"
          inputmode="numeric"
          value="${item.rest}"
        >
      </label>

      <button
        class="training-remove-button"
        type="button"
        aria-label="${index + 1}番目の種目を削除"
      >×</button>
    `;

    const fields = card.querySelectorAll(
      ".training-field input, .training-field select"
    );
    const [
      nameInput,
      typeSelect,
      targetInput,
      setsInput,
      restInput
    ] = fields;

    nameInput.addEventListener("input", () => {
      trainingProgram[index].name =
        nameInput.value.slice(0, 28);
      saveTrainingProgram();
    });

    typeSelect.addEventListener("change", () => {
      trainingProgram[index].type =
        typeSelect.value === "timer" ? "timer" : "reps";
      saveTrainingProgram();
    });

    targetInput.addEventListener("change", () => {
      trainingProgram[index].target = trainingClamp(
        targetInput.value,
        1,
        999,
        trainingProgram[index].type === "timer" ? 30 : 15
      );
      targetInput.value = String(
        trainingProgram[index].target
      );
      saveTrainingProgram();
    });

    setsInput.addEventListener("change", () => {
      trainingProgram[index].sets = trainingClamp(
        setsInput.value,
        1,
        10,
        3
      );
      setsInput.value = String(trainingProgram[index].sets);
      saveTrainingProgram();
    });

    restInput.addEventListener("change", () => {
      trainingProgram[index].rest = trainingClamp(
        restInput.value,
        0,
        300,
        30
      );
      restInput.value = String(trainingProgram[index].rest);
      saveTrainingProgram();
    });

    card
      .querySelector(".training-remove-button")
      .addEventListener("click", () => {
        if (trainingProgram.length <= 1) {
          typeMessage(
            "最低一つは種目を残してください。"
          );
          return;
        }

        trainingProgram.splice(index, 1);
        saveTrainingProgram();
        renderTrainingMenuEditor();
      });

    trainingMenuList.appendChild(card);
  });

  updateTrainingMenuCount();
}

function normalizeTrainingProgram() {
  trainingProgram = trainingProgram.map((item, index) => ({
    name: String(item.name || "").trim().slice(0, 28) ||
      `種目 ${index + 1}`,
    type: item.type === "timer" ? "timer" : "reps",
    target: trainingClamp(
      item.target,
      1,
      999,
      item.type === "timer" ? 30 : 15
    ),
    sets: trainingClamp(item.sets, 1, 10, 3),
    rest: trainingClamp(item.rest, 0, 300, 30)
  }));

  saveTrainingProgram();
}

function clearTrainingTimers() {
  if (trainingIntervalId) {
    window.clearInterval(trainingIntervalId);
    trainingIntervalId = null;
  }

  if (trainingTransitionId) {
    window.clearTimeout(trainingTransitionId);
    trainingTransitionId = null;
  }
}

function formatTrainingSeconds(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(value / 60);
  const remainder = value % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainder
  ).padStart(2, "0")}`;
}

function getCurrentTrainingItem() {
  return trainingSessionProgram[trainingItemIndex] || null;
}

function getNextTrainingLabel() {
  const item = getCurrentTrainingItem();
  if (!item) return "NEXT / COMPLETE";

  if (trainingSetIndex < item.sets) {
    return `NEXT / ${item.name} SET ${trainingSetIndex + 1}`;
  }

  const nextItem =
    trainingSessionProgram[trainingItemIndex + 1];

  return nextItem
    ? `NEXT / ${nextItem.name} SET 1`
    : "NEXT / COMPLETE";
}

function updateTrainingWorkoutDisplay() {
  const item = getCurrentTrainingItem();
  if (!item) return;

  const isTimer = item.type === "timer";
  trainingWorkoutView.classList.toggle("is-timer", isTimer);
  trainingWorkoutView.classList.toggle("is-reps", !isTimer);
  trainingTapButton.classList.toggle("is-timer", isTimer);
  trainingTapButton.classList.toggle("is-reps", !isTimer);
  trainingTapButton.disabled = isTimer;
  trainingTapButton.setAttribute(
    "aria-label",
    isTimer
      ? "タイマー計測中"
      : "回数を1回追加"
  );

  trainingStepLabel.textContent =
    `MENU ${trainingItemIndex + 1} / ${trainingSessionProgram.length}`;
  trainingSetLabel.textContent =
    `SET ${trainingSetIndex} / ${item.sets}`;
  trainingExerciseName.textContent = item.name;

  if (!isTimer) {
    setTrainingLogoTimerState("");
    trainingTapLabel.textContent = "TAP";
    trainingValue.textContent = String(trainingRepCount);
    trainingUnit.textContent = "REP";
    trainingTargetValue.textContent = String(item.target);
  } else {
    setTrainingLogoTimerState("timer");
    trainingTapLabel.textContent = "TIMER";
    trainingValue.textContent =
      formatTrainingSeconds(trainingTimerRemaining);
    trainingUnit.textContent = "";
    trainingTargetValue.textContent =
      formatTrainingSeconds(item.target);

    const remainingRatio = trainingTimerTotal > 0
      ? trainingTimerRemaining / trainingTimerTotal
      : 0;

    setTrainingRingProgress(remainingRatio);
    updateTrainingRingWarning(trainingTimerRemaining);
  }
}

function startTrainingTimer() {
  clearTrainingTimers();
  trainingTimerEndAt =
    Date.now() + trainingTimerRemaining * 1000;

  trainingIntervalId = window.setInterval(() => {
    if (
      trainingPaused ||
      trainingPhase !== "workout"
    ) {
      return;
    }

    trainingTimerRemaining = Math.max(
      0,
      (trainingTimerEndAt - Date.now()) / 1000
    );

    updateTrainingWorkoutDisplay();

    const elapsedRatio = trainingTimerTotal > 0
      ? (
          trainingTimerTotal - trainingTimerRemaining
        ) / trainingTimerTotal
      : 1;

    if (
      elapsedRatio >= 0.25 &&
      !trainingAnnouncements.has("quarter")
    ) {
      trainingAnnouncements.add("quarter");
      trainingSpeak("timerQuarter");
    }

    if (
      elapsedRatio >= 0.50 &&
      !trainingAnnouncements.has("half")
    ) {
      trainingAnnouncements.add("half");
      trainingSpeak("timerHalf");
    }

    if (
      elapsedRatio >= 0.75 &&
      !trainingAnnouncements.has("late")
    ) {
      trainingAnnouncements.add("late");
      trainingSpeak("timerLate");
    }

    if (
      trainingTimerRemaining <= 10 &&
      !trainingAnnouncements.has("ten")
    ) {
      trainingAnnouncements.add("ten");
      trainingSpeak("timerTen");
    }

    if (
      trainingTimerRemaining <= 3 &&
      !trainingAnnouncements.has("three")
    ) {
      trainingAnnouncements.add("three");
      trainingSpeak("timerThree");
    }

    if (trainingTimerRemaining <= 0) {
      trainingTimerRemaining = 0;
      updateTrainingWorkoutDisplay();
      finishTrainingSet("timer");
    }
  }, 100);
}

function startCurrentTrainingItem(options = {}) {
  const { next = false } = options;
  const item = getCurrentTrainingItem();

  if (!item) {
    finishTrainingSession(true);
    return;
  }

  clearTrainingTimers();
  trainingPaused = false;
  trainingScreen.classList.remove("is-paused");
  trainingPauseButton.textContent = "PAUSE";
  trainingRestPauseButton.textContent = "PAUSE";
  trainingRepCount = 0;
  trainingAnnouncements = new Set();
  showTrainingView("workout");
  setTrainingLogoTimerState("");

  if (item.type === "reps") {
    trainingTimerRemaining = 0;
    trainingTimerTotal = 0;
    updateTrainingWorkoutDisplay();
    trainingSpeak(next ? "nextSet" : "startRep");
  } else {
    trainingTimerTotal = item.target;
    trainingTimerRemaining = item.target;
    updateTrainingWorkoutDisplay();
    trainingSpeak(next ? "nextSet" : "timerStart");
    startTrainingTimer();
  }
}

function advanceTrainingPosition() {
  const item = getCurrentTrainingItem();
  if (!item) return false;

  if (trainingSetIndex < item.sets) {
    trainingSetIndex += 1;
    return true;
  }

  if (
    trainingItemIndex <
    trainingSessionProgram.length - 1
  ) {
    trainingItemIndex += 1;
    trainingSetIndex = 1;
    return true;
  }

  return false;
}

function runTrainingRestInterval() {
  trainingTimerEndAt =
    Date.now() + trainingRestRemaining * 1000;

  trainingIntervalId = window.setInterval(() => {
    if (
      trainingPaused ||
      trainingPhase !== "rest"
    ) {
      return;
    }

    trainingRestRemaining = Math.max(
      0,
      (trainingTimerEndAt - Date.now()) / 1000
    );

    trainingRestTime.textContent =
      formatTrainingSeconds(trainingRestRemaining);

    const remainingRatio = trainingRestTotal > 0
      ? trainingRestRemaining / trainingRestTotal
      : 0;
    setTrainingRingProgress(remainingRatio);
    updateTrainingRingWarning(trainingRestRemaining);

    if (
      trainingRestRemaining <= trainingRestTotal / 2 &&
      !trainingAnnouncements.has("half")
    ) {
      trainingAnnouncements.add("half");
      trainingSpeak("restHalf");
    }

    if (
      trainingRestRemaining <= 10 &&
      !trainingAnnouncements.has("ten")
    ) {
      trainingAnnouncements.add("ten");
      trainingSpeak("restTen");
    }

    if (trainingRestRemaining <= 0) {
      clearTrainingTimers();
      advanceTrainingPosition();
      startCurrentTrainingItem({ next: true });
    }
  }, 100);
}

function startTrainingRest() {
  const item = getCurrentTrainingItem();
  if (!item) return;

  const restSeconds = item.rest;
  const hasNext =
    trainingSetIndex < item.sets ||
    trainingItemIndex <
      trainingSessionProgram.length - 1;

  if (!hasNext) {
    finishTrainingSession(true);
    return;
  }

  if (restSeconds <= 0) {
    advanceTrainingPosition();
    startCurrentTrainingItem({ next: true });
    return;
  }

  showTrainingView("rest");
  trainingPaused = false;
  trainingScreen.classList.remove("is-paused");
  trainingRestPauseButton.textContent = "PAUSE";
  trainingRestTotal = restSeconds;
  trainingRestRemaining = restSeconds;
  trainingAnnouncements = new Set();
  trainingNextLabel.textContent =
    getNextTrainingLabel();
  trainingRestTime.textContent =
    formatTrainingSeconds(trainingRestRemaining);
  setTrainingLogoTimerState("rest");
  setTrainingRingProgress(1);
  updateTrainingRingWarning(trainingRestRemaining);
  trainingSpeak("restStart");
  runTrainingRestInterval();
}

function finishTrainingSet(kind) {
  if (
    !trainingSessionRunning ||
    trainingPhase === "transition"
  ) {
    return;
  }

  clearTrainingTimers();
  trainingPhase = "transition";
  trainingCompletedSets += 1;
  trainingSpeak(
    kind === "timer"
      ? "timerComplete"
      : "repComplete"
  );

  trainingTransitionId = window.setTimeout(() => {
    trainingTransitionId = null;
    startTrainingRest();
  }, TRAINING_SET_MESSAGE_DELAY);
}

function finishTrainingSession(isComplete) {
  clearTrainingTimers();
  trainingSessionRunning = false;
  trainingPaused = false;
  trainingScreen.classList.remove("is-paused");
  setTrainingLogoTimerState("");
  renderTrainingChoices({ speak: false });
  trainingSpeak(isComplete ? "complete" : "partial");
}

function startTrainingSession() {
  normalizeTrainingProgram();

  if (trainingSelectionMode === "free") {
    trainingSessionProgram = [getFreeTrainingItem()];
  } else {
    applyTrainingSetup();
    const selected = trainingProgram[trainingSelectedIndex];
    trainingSessionProgram = selected
      ? [{ ...selected }]
      : [{ ...trainingProgram[0] }];
  }

  trainingSessionRunning = true;
  trainingItemIndex = 0;
  trainingSetIndex = 1;
  trainingRepCount = 0;
  trainingCompletedSets = 0;
  trainingPaused = false;
  stopIdleTimer();
  startCurrentTrainingItem();
}

function toggleTrainingPause() {
  if (
    !trainingSessionRunning ||
    trainingPhase === "transition"
  ) {
    return;
  }

  if (!trainingPaused) {
    trainingPaused = true;
    trainingScreen.classList.add("is-paused");

    if (
      trainingPhase === "workout" &&
      getCurrentTrainingItem()?.type === "timer"
    ) {
      trainingTimerRemaining = Math.max(
        0,
        (trainingTimerEndAt - Date.now()) / 1000
      );
    } else if (trainingPhase === "rest") {
      trainingRestRemaining = Math.max(
        0,
        (trainingTimerEndAt - Date.now()) / 1000
      );
    }

    clearTrainingTimers();
    trainingPauseButton.textContent = "RESUME";
    trainingRestPauseButton.textContent = "RESUME";
    trainingSpeak("paused");
    return;
  }

  trainingPaused = false;
  trainingScreen.classList.remove("is-paused");
  trainingPauseButton.textContent = "PAUSE";
  trainingRestPauseButton.textContent = "PAUSE";
  trainingSpeak("resumed");

  if (
    trainingPhase === "workout" &&
    getCurrentTrainingItem()?.type === "timer"
  ) {
    startTrainingTimer();
  } else if (trainingPhase === "rest") {
    runTrainingRestInterval();
  }
}

function handleTrainingTap() {
  if (
    !trainingSessionRunning ||
    trainingPaused ||
    trainingPhase !== "workout"
  ) {
    return;
  }

  const item = getCurrentTrainingItem();
  if (!item || item.type !== "reps") return;

  trainingRepCount += 1;
  trainingPulseVital();

  trainingTapButton.classList.remove(
    "is-tapped",
    "is-counted"
  );
  void trainingTapButton.offsetWidth;
  trainingTapButton.classList.add(
    "is-tapped",
    "is-counted"
  );

  window.setTimeout(() => {
    trainingTapButton.classList.remove(
      "is-tapped",
      "is-counted"
    );
  }, 360);

  if (navigator.vibrate) {
    navigator.vibrate(12);
  }

  updateTrainingWorkoutDisplay();

  const remaining = item.target - trainingRepCount;
  const ratio = trainingRepCount / item.target;

  if (trainingRepCount >= item.target) {
    finishTrainingSet("reps");
    return;
  }

  if (remaining === 1) {
    trainingSpeak("finalRep");
  } else if (ratio >= 0.75) {
    trainingSpeak("lateRep");
  } else if (ratio >= 0.50) {
    trainingSpeak("middleRep");
  } else if (
    trainingRepCount === 1 ||
    trainingRepCount %
      Math.max(2, Math.floor(item.target / 4)) ===
      0
  ) {
    trainingSpeak("earlyRep");
  }
}

function enterTrainingMode() {
  clearPendingEnd();
  stopSleepBreathingGuide();

  trainingActive = true;
  trainingSessionRunning = false;
  trainingProgram = loadTrainingProgram();
  trainingSessionProgram = [];
  trainingCompletedSets = 0;
  trainingPaused = false;
  currentModeKey = "training";

  document.body.classList.remove(
    "private-session-active",
    "private-heartbeat-intense",
    "sleep-session-active"
  );
  document.body.classList.add(
    "training-session-active"
  );

  let savedTheme = "light";
  try {
    savedTheme =
      window.localStorage.getItem(
        TRAINING_THEME_STORAGE_KEY
      ) || "light";
  } catch (error) {
    savedTheme = "light";
  }

  setTrainingTheme(savedTheme);
  trainingThemeButton.hidden = false;
  trainingScreen.hidden = false;
  modeTitle.textContent = "一緒に運動";
  modeCode.textContent = "PARTNER TRAINING LINK";
  menuPanel.hidden = true;
  modePanel.hidden = false;

  renderTrainingChoices();
  startElapsedTimer();
  typeMessage(getTrainingGuideMessage());
  triggerGlitch();
}

function leaveTrainingMode() {
  clearTrainingTimers();
  trainingSessionRunning = false;
  trainingActive = false;
  trainingPaused = false;
  trainingScreen.classList.remove("is-paused");
  setTrainingLogoTimerState("");
  trainingScreen.hidden = true;
  trainingThemeButton.hidden = true;
  document.body.classList.remove(
    "training-session-active",
    "training-dark",
    "training-logo-timer-active"
  );
}

function handleTrainingBack() {
  if (
    trainingPhase === "workout" ||
    trainingPhase === "rest" ||
    trainingPhase === "transition"
  ) {
    finishTrainingSession(false);
    return;
  }

  if (
    trainingPhase === "setup" ||
    trainingPhase === "editor"
  ) {
    if (trainingPhase === "setup") {
      applyTrainingSetup();
    }

    renderTrainingChoices();
    typeMessage(
      "種目選択へ戻りました。次に行うトレーニングを選んでください。"
    );
    return;
  }

  returnToMenu(true);
}

