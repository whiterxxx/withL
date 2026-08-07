// with L+ v2 / shared DOM, state, and utility functions
const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const menuPanel = document.getElementById("menuPanel");
const modePanel = document.getElementById("modePanel");
const modeTitle = document.getElementById("modeTitle");
const modeCode = document.getElementById("modeCode");
const actionButtons = document.getElementById("actionButtons");
const backButton = document.getElementById("backButton");
const talkButton = document.getElementById("talkButton");
const messageText = document.getElementById("messageText");
const typingCursor = document.getElementById("typingCursor");
const dialogueButton = document.getElementById("dialogueButton");
const elapsedTime = document.getElementById("elapsedTime");
const glitchParticles = document.getElementById("glitchParticles");

const sleepScreen = document.getElementById("sleepScreen");
const sleepClock = document.getElementById("sleepClock");
const sleepElapsed = document.getElementById("sleepElapsed");
const sleepLine = document.getElementById("sleepLine");
const sleepControls = document.getElementById("sleepControls");
const wakeButton = document.getElementById("wakeButton");

const trainingScreen = document.getElementById("trainingScreen");
const trainingLogoTimer = document.getElementById("trainingLogoTimer");
const trainingLogoOuterProgress = document.getElementById("trainingLogoOuterProgress");
const trainingLogoInnerProgress = document.getElementById("trainingLogoInnerProgress");
const trainingThemeButton = document.getElementById("trainingThemeButton");
const trainingThemeLabel = document.getElementById("trainingThemeLabel");
const trainingSetupView = document.getElementById("trainingSetupView");
const trainingSetupTitle = document.getElementById("trainingSetupTitle");
const trainingSetupSummary = document.getElementById("trainingSetupSummary");
const trainingSetupFields = document.getElementById("trainingSetupFields");
const trainingSetupName = document.getElementById("trainingSetupName");
const trainingSetupType = document.getElementById("trainingSetupType");
const trainingSetupTarget = document.getElementById("trainingSetupTarget");
const trainingSetupSets = document.getElementById("trainingSetupSets");
const trainingSetupRest = document.getElementById("trainingSetupRest");
const trainingSetupBackButton =
  document.getElementById("trainingSetupBackButton");
const trainingEditorView = document.getElementById("trainingEditorView");
const trainingMenuCount = document.getElementById("trainingMenuCount");
const trainingMenuList = document.getElementById("trainingMenuList");
const trainingAddItemButton = document.getElementById("trainingAddItemButton");
const trainingEditorDoneButton =
  document.getElementById("trainingEditorDoneButton");
const trainingStartButton = document.getElementById("trainingStartButton");
const trainingWorkoutView = document.getElementById("trainingWorkoutView");
const trainingRestView = document.getElementById("trainingRestView");
const trainingStepLabel = document.getElementById("trainingStepLabel");
const trainingSetLabel = document.getElementById("trainingSetLabel");
const trainingExerciseName = document.getElementById("trainingExerciseName");
const trainingVital = document.getElementById("trainingVital");
const trainingTapLabel = document.getElementById("trainingTapLabel");
const trainingValue = document.getElementById("trainingValue");
const trainingUnit = document.getElementById("trainingUnit");
const trainingTargetText = document.getElementById("trainingTargetText");
const trainingTargetValue = document.getElementById("trainingTargetValue");
const trainingTapButton = document.getElementById("trainingTapButton");
const trainingPauseButton = document.getElementById("trainingPauseButton");
const trainingEndButton = document.getElementById("trainingEndButton");
const trainingRestTime = document.getElementById("trainingRestTime");
const trainingNextLabel = document.getElementById("trainingNextLabel");
const trainingSkipRestButton = document.getElementById("trainingSkipRestButton");
const trainingRestPauseButton =
  document.getElementById("trainingRestPauseButton");
const trainingRestEndButton = document.getElementById("trainingRestEndButton");


const bathScreen = document.getElementById("bathScreen");
const bathTime = document.getElementById("bathTime");
const bathStatusLabel = document.getElementById("bathStatusLabel");
const bathStateLabel = document.getElementById("bathStateLabel");
const bathTimeCaption = document.getElementById("bathTimeCaption");
const bathSoakButton = document.getElementById("bathSoakButton");
const bathHairButton = document.getElementById("bathHairButton");
const bathHydrationButton = document.getElementById("bathHydrationButton");
const bathSkincareButton = document.getElementById("bathSkincareButton");
const bathFinishButton = document.getElementById("bathFinishButton");

const modeButtons = [...document.querySelectorAll(".mode-button")];


let currentModeKey = null;
let sessionStartedAt = null;
let elapsedTimerId = null;
let idleTimerId = null;
let typingTimerId = null;
let pendingEndTimerId = null;
let returnHomeAfterTyping = false;
const HOME_RETURN_DELAY = 1600;

let sleepControlsTimerId = null;
let sleepMessageTimerId = null;
let sleepCloseTimerId = null;
let sleepElapsedTimerId = null;
let sleepBreathingTimerId = null;
let sleepStartedAt = null;
let sleepModeActive = false;
const SLEEP_CONTROLS_HIDE_DELAY = 4200;
const SLEEP_MESSAGE_HIDE_DELAY = 6000;
const SLEEP_BREATHING_DURATION = 30000;
const SLEEP_STORAGE_KEY = "withL-partner-exclusive-sleep";


let currentFullMessage = "";
let displayedCharacters = 0;
let typeToken = 0;
let lastSpokenMessage = "";
const randomBags = new Map();

function updateClock() {
  const now = new Date();

  const time = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit"
  }).format(now).toUpperCase();

  clockElement.textContent = time;
  dateElement.textContent = date;

  if (sleepClock) {
    sleepClock.textContent = time.slice(0, 5);
  }
}

function formatElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function takeRandom(poolKey, messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "";
  }

  let bag = randomBags.get(poolKey);

  if (!bag || bag.length === 0) {
    bag = shuffle(messages);

    if (bag.length > 1 && bag[bag.length - 1] === lastSpokenMessage) {
      [bag[bag.length - 1], bag[bag.length - 2]] =
        [bag[bag.length - 2], bag[bag.length - 1]];
    }

    randomBags.set(poolKey, bag);
  }

  const message = bag.pop();
  lastSpokenMessage = message;
  return message;
}

function getTimePeriod() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "daytime";
  if (hour >= 17 && hour < 23) return "evening";
  return "lateNight";
}

function getRandomTalkMessage() {
  if (currentModeKey === "training") {
    return getTrainingGuideMessage();
  }

  if (currentModeKey && Math.random() < 0.72) {
    return takeRandom(
      `${currentModeKey}-talk`,
      modes[currentModeKey].talk
    );
  }

  const period = getTimePeriod();
  const useTimeMessage = Math.random() < 0.44;

  if (useTimeMessage) {
    return takeRandom(
      `general-${period}`,
      generalTalk[period]
    );
  }

  return takeRandom("general-neutral", generalTalk.neutral);
}

function speakRandom() {
  clearPendingEnd();
  triggerGlitch();
  typeMessage(getRandomTalkMessage());
  startIdleTimer();
}





function startElapsedTimer() {
  stopElapsedTimer();
  sessionStartedAt = Date.now();
  elapsedTime.textContent = "00:00";

  elapsedTimerId = window.setInterval(() => {
    elapsedTime.textContent = formatElapsed(Date.now() - sessionStartedAt);
  }, 1000);
}

function stopElapsedTimer() {
  if (elapsedTimerId) {
    window.clearInterval(elapsedTimerId);
    elapsedTimerId = null;
  }
}

function startIdleTimer() {
  stopIdleTimer();

  const isPrivateLink = currentModeKey === "private";
  const isSleepLink = currentModeKey === "sleep";
  const minimum = isPrivateLink
    ? 18000
    : isSleepLink
      ? 42000
      : currentModeKey
        ? 30000
        : 42000;
  const maximum = isPrivateLink
    ? 32000
    : isSleepLink
      ? 72000
      : currentModeKey
        ? 52000
        : 70000;
  const delay =
    minimum + Math.floor(Math.random() * (maximum - minimum + 1));

  idleTimerId = window.setTimeout(() => {
    let message;

    if (currentModeKey === "training") {
      if (
        trainingPhase === "workout" ||
        trainingPhase === "rest" ||
        trainingPhase === "transition"
      ) {
        return;
      }

      message = getTrainingGuideMessage();
    } else if (currentModeKey) {
      message = takeRandom(
        `${currentModeKey}-idle`,
        modes[currentModeKey].idle
      );
    } else {
      message = getRandomTalkMessage();
    }

    typeMessage(message);
    startIdleTimer();
  }, delay);
}

function stopIdleTimer() {
  if (idleTimerId) {
    window.clearTimeout(idleTimerId);
    idleTimerId = null;
  }
}

function clearPendingEnd() {
  if (pendingEndTimerId) {
    window.clearTimeout(pendingEndTimerId);
    pendingEndTimerId = null;
  }
}

function scheduleHomeReturn() {
  clearPendingEnd();

  pendingEndTimerId = window.setTimeout(() => {
    returnHomeAfterTyping = false;
    returnToMenu(false);
  }, HOME_RETURN_DELAY);
}

function typeMessage(message, options = {}) {
  if (!message) return;

  const { returnHomeAfter = false } = options;

  clearPendingEnd();
  returnHomeAfterTyping = returnHomeAfter;

  if (typingTimerId) {
    window.clearTimeout(typingTimerId);
  }

  typeToken += 1;
  const localToken = typeToken;

  currentFullMessage = message;
  displayedCharacters = 0;
  messageText.textContent = "";
  typingCursor.hidden = false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    finishTyping();
    return;
  }

  const tick = () => {
    if (localToken !== typeToken) return;

    displayedCharacters += 1;
    messageText.textContent = currentFullMessage.slice(
      0,
      displayedCharacters
    );

    if (displayedCharacters >= currentFullMessage.length) {
      typingCursor.hidden = false;
      typingTimerId = null;

      if (returnHomeAfterTyping) {
        returnHomeAfterTyping = false;
        scheduleHomeReturn();
      }

      return;
    }

    const currentCharacter =
      currentFullMessage[displayedCharacters - 1];

    let delay = 35;

    if ("。！？".includes(currentCharacter)) {
      delay = 215;
    } else if ("、……".includes(currentCharacter)) {
      delay = 90;
    }

    typingTimerId = window.setTimeout(tick, delay);
  };

  tick();
}

function finishTyping() {
  typeToken += 1;

  if (typingTimerId) {
    window.clearTimeout(typingTimerId);
    typingTimerId = null;
  }

  displayedCharacters = currentFullMessage.length;
  messageText.textContent = currentFullMessage;
  typingCursor.hidden = false;

  if (returnHomeAfterTyping) {
    returnHomeAfterTyping = false;
    scheduleHomeReturn();
  }
}

