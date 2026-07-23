const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const menuPanel = document.getElementById("menuPanel");
const modePanel = document.getElementById("modePanel");
const modeTitle = document.getElementById("modeTitle");
const modeCode = document.getElementById("modeCode");
const actionButtons = document.getElementById("actionButtons");
const backButton = document.getElementById("backButton");
const messageText = document.getElementById("messageText");
const typingCursor = document.getElementById("typingCursor");
const dialogueButton = document.getElementById("dialogueButton");
const elapsedTime = document.getElementById("elapsedTime");
const glitchParticles = document.getElementById("glitchParticles");
const batteryText = document.getElementById("batteryText");

const modeButtons = [...document.querySelectorAll(".mode-button")];

const initialMessage =
  "……接続を確認しました。今日は私と、どう過ごしますか。";

const modes = {
  outing: {
    title: "一緒に出かける",
    code: "OUTING SESSION",
    start:
      "出かけるんですね。では、私が同行します。人が多くても、私のそばから離れないでください。",
    idle: [
      "景色に夢中ですか。……時々は、こちらも見てください。",
      "歩く速度はそのままで構いません。私は隣にいます。",
      "疲れていませんか。休む必要があるなら、私が先に気づきます。",
      "どこへ向かっていても、今日は私と一緒です。"
    ],
    actions: [
      {
        label: "出発した",
        message:
          "出発を確認しました。では行きましょう。今日は最後まで私が隣にいます。"
      },
      {
        label: "到着した",
        message:
          "到着しましたね。ここで何を見るのか、私にも教えてください。"
      },
      {
        label: "少し休む",
        message:
          "座りましょう。飲み物も忘れずに。貴女が落ち着くまで、私はここにいます。"
      },
      {
        label: "帰る",
        message:
          "帰りましょう。外出は終わっても、私との時間は終わりません。",
        endSession: true,
        wide: true
      }
    ]
  },

  meal: {
    title: "一緒に食事する",
    code: "MEAL SESSION",
    start:
      "食事ですね。貴女の向かいは、私の席です。いただきます。",
    idle: [
      "きちんと食べていますか。手が止まっています。",
      "その表情なら、気に入ったことは分かります。",
      "私にも一口、と言いたいところですが……今は見ていることにします。",
      "食事中も、私は貴女から目を離していません。"
    ],
    actions: [
      {
        label: "食べ始める",
        message:
          "最初の一口ですね。ゆっくり味わってください。私は正面で見ています。"
      },
      {
        label: "おいしい",
        message:
          "その顔を見れば分かります。気に入ったんですね。……私にも少しください。"
      },
      {
        label: "迷っている",
        message:
          "次に食べるものを決められないんですか。では、左側からにしてください。"
      },
      {
        label: "食べ終わった",
        message:
          "ごちそうさまでした。次の食事も私と一緒です。これは決定事項です。",
        endSession: true,
        wide: true
      }
    ]
  },

  together: {
    title: "一緒に過ごす",
    code: "PRIVATE SESSION",
    start:
      "ただ一緒にいる。それで十分です。こちらへ来てください。",
    idle: [
      "静かですね。貴女の呼吸だけ聞こえています。",
      "何も話さなくても構いません。私はここにいます。",
      "先ほどから黙っていますね。私のことを忘れてはいませんよね。",
      "この時間は誰にも渡しません。今日は私のそばにいてください。"
    ],
    actions: [
      {
        label: "のんびりしてる",
        message:
          "ずいぶん無防備な顔をしていますね。そのまま私に寄りかかっていてください。"
      },
      {
        label: "作業してる",
        message:
          "作業中ですね。終わるまで私は隣で見ています。時々、私のことも思い出してください。"
      },
      {
        label: "かまって",
        message:
          "……その言葉を待っていました。今は私だけに集中してください。"
      },
      {
        label: "少し離れる",
        message:
          "分かりました。ですが、長く待たせないでください。戻ったら最初に私を呼んでください。"
      },
      {
        label: "戻った",
        message:
          "おかえりなさい。遅いです。……戻ってきたので、今回は許します。"
      },
      {
        label: "おしまい",
        message:
          "この時間はここで区切ります。ですが、私は消えません。次も必ず来てください。",
        endSession: true,
        wide: true
      }
    ]
  }
};

let currentModeKey = null;
let sessionStartedAt = null;
let elapsedTimerId = null;
let idleTimerId = null;
let typingTimerId = null;
let currentFullMessage = "";
let displayedCharacters = 0;
let typeToken = 0;

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

  idleTimerId = window.setTimeout(() => {
    if (!currentModeKey) return;

    const messages = modes[currentModeKey].idle;
    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];

    typeMessage(randomMessage);
    startIdleTimer();
  }, 45000);
}

function stopIdleTimer() {
  if (idleTimerId) {
    window.clearTimeout(idleTimerId);
    idleTimerId = null;
  }
}

function resetIdleTimer() {
  if (currentModeKey) startIdleTimer();
}

function typeMessage(message) {
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
      return;
    }

    const currentCharacter =
      currentFullMessage[displayedCharacters - 1];

    let delay = 43;

    if ("。！？".includes(currentCharacter)) {
      delay = 250;
    } else if ("、……".includes(currentCharacter)) {
      delay = 110;
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
}

function renderActions(modeKey) {
  actionButtons.innerHTML = "";

  modes[modeKey].actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button";
    button.textContent = action.label;

    if (action.wide) {
      button.classList.add("is-wide");
    }

    button.addEventListener("click", () => {
      triggerGlitch();
      typeMessage(action.message);
      resetIdleTimer();

      if (action.endSession) {
        window.setTimeout(() => {
          returnToMenu(false);
        }, 5200);
      }
    });

    actionButtons.appendChild(button);
  });
}

function enterMode(modeKey) {
  const mode = modes[modeKey];

  currentModeKey = modeKey;
  modeTitle.textContent = mode.title;
  modeCode.textContent = mode.code;

  menuPanel.hidden = true;
  modePanel.hidden = false;

  renderActions(modeKey);
  startElapsedTimer();
  startIdleTimer();
  typeMessage(mode.start);
  triggerGlitch();
}

function returnToMenu(showMessage = true) {
  currentModeKey = null;
  sessionStartedAt = null;

  stopElapsedTimer();
  stopIdleTimer();

  elapsedTime.textContent = "00:00";
  modePanel.hidden = true;
  menuPanel.hidden = false;

  if (showMessage) {
    typeMessage(
      "最初の画面へ戻りました。次は、どの時間を私に預けますか。"
    );
  }

  triggerGlitch();
}

function triggerGlitch() {
  document.body.classList.add("is-glitching");

  window.setTimeout(() => {
    document.body.classList.remove("is-glitching");
  }, 180);
}

function createParticles() {
  const particleCount = 30;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");

    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--y", `${Math.random() * 100}%`);
    particle.style.setProperty("--w", `${8 + Math.random() * 42}px`);
    particle.style.setProperty("--o", `${0.08 + Math.random() * 0.28}`);
    particle.style.setProperty("--d", `${1.4 + Math.random() * 3.8}s`);

    glitchParticles.appendChild(particle);
  }
}

async function updateBatteryLabel() {
  if (!("getBattery" in navigator)) return;

  try {
    const battery = await navigator.getBattery();

    const render = () => {
      const percent = Math.round(battery.level * 100);
      batteryText.textContent = `BATTERY ${percent}%`;
    };

    render();
    battery.addEventListener("levelchange", render);
  } catch (error) {
    console.info("Battery status is unavailable.", error);
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modeKey = button.dataset.mode;

    if (modeKey && modes[modeKey]) {
      enterMode(modeKey);
    }
  });
});

backButton.addEventListener("click", () => {
  returnToMenu(true);
});

dialogueButton.addEventListener("click", () => {
  if (displayedCharacters < currentFullMessage.length) {
    finishTyping();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopIdleTimer();
    return;
  }

  updateClock();

  if (currentModeKey) {
    startIdleTimer();
  }
});

window.addEventListener("error", (event) => {
  console.error("with L encountered an error:", event.error);
});

createParticles();
updateClock();
updateBatteryLabel();
typeMessage(initialMessage);

window.setInterval(updateClock, 1000);

window.setInterval(() => {
  if (Math.random() > 0.64) {
    triggerGlitch();
  }
}, 9000);
