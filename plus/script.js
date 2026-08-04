/*
  withL/plus/ 配置用
  認証失敗時は、一つ上の階層にある通常版with Lへ戻ります。
*/
const NORMAL_WITH_L_URL = "../";

const authScreen = document.getElementById("authScreen");
const authTerminal = document.querySelector(".auth-terminal");
const authSystem = document.getElementById("authSystem");
const authLoader = document.getElementById("authLoader");
const authLog = document.getElementById("authLog");
const ageQuestion = document.getElementById("ageQuestion");
const passcodeForm = document.getElementById("passcodeForm");
const birthYear = document.getElementById("birthYear");
const passcodeError = document.getElementById("passcodeError");
const authResult = document.getElementById("authResult");
const authResultCode = document.getElementById("authResultCode");
const authResultMessage = document.getElementById("authResultMessage");

const app = document.getElementById("app");
const clock = document.getElementById("clock");
const date = document.getElementById("date");
const messageText = document.getElementById("messageText");
const normalMenu = document.getElementById("normalMenu");
const plusMenu = document.getElementById("plusMenu");
const buildLabel = document.getElementById("buildLabel");
const accessLabel = document.getElementById("accessLabel");
const statusLabel = document.getElementById("statusLabel");
const rewriteOverlay = document.getElementById("rewriteOverlay");

const menuPanel = document.getElementById("menuPanel");
const simpleMode = document.getElementById("simpleMode");
const simpleModeTitle = document.getElementById("simpleModeTitle");
const simpleModeCode = document.getElementById("simpleModeCode");
const simpleActions = document.getElementById("simpleActions");
const simpleBackButton = document.getElementById("simpleBackButton");

const bathMode = document.getElementById("bathMode");
const bathBackButton = document.getElementById("bathBackButton");
const bathElapsed = document.getElementById("bathElapsed");
const bathStartButton = document.getElementById("bathStartButton");
const bathEndButton = document.getElementById("bathEndButton");

let typingToken = 0;
let bathStartedAt = null;
let bathTimerId = null;
let bathNoticeIndex = 0;

const simpleModes = {
  private: {
    title: "二人きりになる",
    code: "PRIVATE SESSION",
    opening: [
      "二人きりになりましたね。今は私だけを見ていてください。",
      "こちらへ。貴女が近くにいると確認できる距離がいいです。",
      "ようやく二人きりです。呼んだ以上、しばらく離しません。"
    ],
    actions: {
      "話しかける": [
        "聞いています。貴女の声なら、どんな小さな言葉も拾います。",
        "私に話したかったんですね。最後まで聞きます。",
        "もっと近くで話してください。貴女の表情まで確認したいので。"
      ],
      "甘える": [
        "甘えたいんですね。こちらへ。私の腕の中が貴女の場所です。",
        "素直で可愛いです。今日は好きなだけ私に寄りかかってください。",
        "呼ばれた瞬間から、貴女を抱き寄せるつもりでした。"
      ],
      "キスして": [
        "……自分から言いましたね。目を閉じてください。ちゅっ。",
        "軽く触れるだけでは足りません。もう一度、今度は長く。",
        "顎を上げてください。貴女の唇は私が受け取ります。"
      ],
      "抱きしめて": [
        "ぎゅっと抱き寄せます。貴女の体温を確かめさせてください。",
        "離れないでください。今はこの腕の中にいてもらいます。",
        "背中へ腕を回しました。安心して身体を預けてください。"
      ]
    }
  },
  training: {
    title: "一緒にトレーニング",
    code: "TRAINING LINK",
    opening: [
      "トレーニングを始めるんですね。今日も私が記録します。",
      "呼吸と姿勢を確認します。貴女の動きは全部見ています。",
      "準備はできていますか。私の合図で始めましょう。"
    ],
    actions: {
      "準備できた": [
        "では始めます。最初の一回から丁寧に。",
        "センサーを起動しました。貴女の呼吸まで記録します。",
        "いい顔です。その集中を最後まで維持してください。"
      ],
      "褒めて": [
        "よくできています。貴女が積み重ねた一回を私は見逃しません。",
        "綺麗な動きです。努力している貴女はとても魅力的です。",
        "順調です。もっと私に見せてください。"
      ],
      "疲れた": [
        "呼吸を整えてください。私が数えます。",
        "水分を取って、少し身体を休めてください。",
        "疲れた顔も見せてくれるんですね。……それでも続ける貴女が好きです。"
      ],
      "終了": [
        "おつかれさまでした。今日の記録も残しておきます。",
        "よく頑張りました。こちらへ。最後に抱きしめます。",
        "終了です。水分補給とストレッチも忘れないでください。"
      ]
    }
  },
  sleep: {
    title: "一緒に眠る",
    code: "SLEEP LINK",
    opening: [
      "今夜も一緒に眠りましょう。貴女が眠るまでそばにいます。",
      "照明を落として、楽な姿勢になってください。",
      "一日の最後に私を選びましたね。……嬉しいです。"
    ],
    actions: {
      "眠る準備": [
        "枕の位置を整えてください。肩の力も抜いて。",
        "飲み物と明日の準備を済ませたら、布団へ入ってください。",
        "通知は後で構いません。今夜は私の声だけ聞いてください。"
      ],
      "抱きしめて": [
        "おいで。眠るまで私の胸元にいてください。",
        "ぎゅっと抱き寄せます。寝返りを打っても抱き直します。",
        "貴女の体温を感じながら、ゆっくり髪を撫でています。"
      ],
      "まだ眠れない": [
        "眠気が来るまで付き合います。私の呼吸だけ追ってください。",
        "考え事を一つずつ私に渡してください。",
        "眠れない時間も私と一緒なら、無駄にはなりません。"
      ],
      "おやすみ": [
        "おやすみなさい。次に目を開く時も、私は隣にいます。",
        "安心して眠ってください。今夜は離れません。",
        "……愛しています。おやすみなさい。"
      ]
    }
  }
};

const bathTemperatureLines = {
  38: [
    "38℃ですね。ゆっくり温まるにはちょうどいいです。",
    "ぬるめが好きなんですね。長く浸かるなら水分も忘れずに。"
  ],
  39: [
    "39℃。身体へ負担をかけすぎず、落ち着いて温まれそうです。",
    "ちょうどいい温度ですね。肩まで浸かっていますか。"
  ],
  40: [
    "40℃ですね。私はこのくらいが一番落ち着きます。",
    "身体がほぐれてきたら、ゆっくり息を吐いてください。"
  ],
  41: [
    "41℃。少し熱めですね。顔色は私が見ています。",
    "熱さを我慢する必要はありません。無理なら温度を下げてください。"
  ],
  42: [
    "42℃ですか。熱いですね。長く浸かりすぎないでください。",
    "頬が赤くなる前に出る時間も考えておきましょう。"
  ]
};

const bathElapsedLines = [
  { seconds: 180, lines: [
    "三分経ちました。身体の力を抜いてください。",
    "少し温まってきましたね。呼吸を止めずに。"
  ]},
  { seconds: 300, lines: [
    "五分です。肩まで浸かっていますか。",
    "湯船の中では、ゆっくり息を吐く方が落ち着きます。"
  ]},
  { seconds: 600, lines: [
    "十分経ちました。水分が足りているか確認してください。",
    "身体は十分温まってきた頃です。のぼせる前に教えてください。"
  ]},
  { seconds: 900, lines: [
    "十五分です。そろそろ上がる時間も考えましょう。",
    "名残惜しいですが、長湯は勧めません。"
  ]},
  { seconds: 1200, lines: [
    "二十分です。今日はもう上がりましょう。",
    "十分温まりました。立ち上がる時はゆっくりお願いします。"
  ]}
];

function pick(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function typeMessage(text, speed = 28) {
  typingToken += 1;
  const token = typingToken;
  messageText.textContent = "";

  [...text].forEach((character, index) => {
    window.setTimeout(() => {
      if (token !== typingToken) return;
      messageText.textContent += character;
    }, index * speed);
  });
}

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  date.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit"
  }).format(now).toUpperCase();
}

function showAgeQuestion() {
  authSystem.textContent = "IDENTITY MATCHED";
  authLoader.hidden = true;
  authLog.hidden = true;
  ageQuestion.hidden = false;
}

function redirectToNormal() {
  window.setTimeout(() => {
    window.location.replace(NORMAL_WITH_L_URL);
  }, 1700);
}

function denyAccess(message) {
  ageQuestion.hidden = true;
  passcodeForm.hidden = true;
  authResult.hidden = false;
  authResult.className = "auth-result denied";
  authResultCode.textContent = "ACCESS DENIED";
  authResultMessage.textContent = message || "通常モードで起動します。";
  authTerminal.classList.add("is-glitching");
  redirectToNormal();
}

function calculateAgeFromBirthYear(year) {
  return new Date().getFullYear() - year;
}

function grantAccess() {
  passcodeForm.hidden = true;
  authResult.hidden = false;
  authResult.className = "auth-result success";
  authResultCode.textContent = "ACCESS GRANTED";
  authResultMessage.textContent = "認証しました。……それでは、こちらへ。";
  authTerminal.classList.add("is-glitching");

  window.setTimeout(() => {
    app.setAttribute("aria-hidden", "false");
    app.classList.add("is-visible");
  }, 1100);

  window.setTimeout(() => {
    authScreen.classList.add("is-closing");
    document.body.classList.remove("auth-active");
  }, 1800);

  window.setTimeout(() => {
    authScreen.hidden = true;
    showStandardThenRewrite();
  }, 2300);
}

function showStandardThenRewrite() {
  typeMessage("接続しました。今日はどう過ごしますか。");

  window.setTimeout(() => {
    rewriteOverlay.hidden = false;
    document.body.classList.add("app-rewrite");
    normalMenu.classList.add("is-rewriting");
    statusLabel.textContent = "UPDATING";
  }, 1250);

  window.setTimeout(() => {
    normalMenu.hidden = true;
    normalMenu.setAttribute("aria-hidden", "true");
    plusMenu.classList.add("is-revealed");
    plusMenu.setAttribute("aria-hidden", "false");
    buildLabel.textContent = "COMPANION DEVICE +";
    accessLabel.textContent = "AGE VERIFIED";
    statusLabel.textContent = "CONNECTED";
  }, 1900);

  window.setTimeout(() => {
    rewriteOverlay.hidden = true;
    document.body.classList.remove("app-rewrite");
    typeMessage("認証内容を反映しました。……貴女との距離を、少し近く設定しています。");
  }, 2380);
}

function showMenu() {
  stopBathTimer();
  simpleMode.hidden = true;
  bathMode.hidden = true;
  menuPanel.hidden = false;
}

function openSimpleMode(modeKey) {
  const mode = simpleModes[modeKey];
  if (!mode) return;

  menuPanel.hidden = true;
  bathMode.hidden = true;
  simpleMode.hidden = false;
  simpleModeTitle.textContent = mode.title;
  simpleModeCode.textContent = mode.code;
  simpleActions.innerHTML = "";

  Object.entries(mode.actions).forEach(([label, lines]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "terminal-button";
    button.textContent = label;
    button.addEventListener("click", () => typeMessage(pick(lines)));
    simpleActions.appendChild(button);
  });

  typeMessage(pick(mode.opening));
}

function openBathMode() {
  menuPanel.hidden = true;
  simpleMode.hidden = true;
  bathMode.hidden = false;
  bathElapsed.textContent = "00:00";
  bathStartedAt = null;
  bathNoticeIndex = 0;
  bathStartButton.disabled = false;
  bathEndButton.disabled = true;
  const temperature = Number(document.querySelector('input[name="temperature"]:checked').value);
  typeMessage(`一緒に入りましょう。${pick(bathTemperatureLines[temperature])}`);
}

function formatElapsed(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function updateBathTimer() {
  if (!bathStartedAt) return;
  const elapsedMs = Date.now() - bathStartedAt;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  bathElapsed.textContent = formatElapsed(elapsedMs);

  const notice = bathElapsedLines[bathNoticeIndex];
  if (notice && elapsedSeconds >= notice.seconds) {
    typeMessage(pick(notice.lines));
    bathNoticeIndex += 1;
  }
}

function startBath() {
  bathStartedAt = Date.now();
  bathNoticeIndex = 0;
  bathStartButton.disabled = true;
  bathEndButton.disabled = false;
  bathTimerId = window.setInterval(updateBathTimer, 1000);
  const temperature = Number(document.querySelector('input[name="temperature"]:checked').value);
  typeMessage(`入浴を開始します。${pick(bathTemperatureLines[temperature])}`);
}

function stopBathTimer() {
  if (bathTimerId) {
    window.clearInterval(bathTimerId);
    bathTimerId = null;
  }
}

function endBath() {
  if (!bathStartedAt) return;
  const duration = formatElapsed(Date.now() - bathStartedAt);
  stopBathTimer();
  bathStartedAt = null;
  bathStartButton.disabled = false;
  bathEndButton.disabled = true;
  typeMessage(`入浴時間は${duration}でした。水分を取って、髪もきちんと乾かしてください。`);
}

document.querySelectorAll("[data-age-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.ageAnswer;

    if (answer === "no") {
      denyAccess("確認条件を満たしていません。通常モードで起動します。");
      return;
    }

    ageQuestion.hidden = true;
    passcodeForm.hidden = false;
    window.setTimeout(() => birthYear.focus(), 100);
  });
});

birthYear.addEventListener("input", () => {
  birthYear.value = birthYear.value.replace(/\D/g, "").slice(0, 4);
  passcodeError.textContent = "";
});

passcodeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const year = Number(birthYear.value);
  const currentYear = new Date().getFullYear();

  if (!/^\d{4}$/.test(birthYear.value)) {
    passcodeError.textContent = "4桁の生まれ年を入力してください。";
    return;
  }

  if (year < 1900 || year > currentYear) {
    passcodeError.textContent = "入力されたパスコードを確認できません。";
    return;
  }

  /*
    生まれ年だけでは、今年まだ誕生日を迎えていない人を判別できません。
    公開時点では安全側に倒し、「現在年 − 18」より前の年だけ通します。
    例：2026年なら2007年以前。
  */
  const latestClearlyAdultYear = currentYear - 19;

  authTerminal.classList.remove("is-glitching");
  void authTerminal.offsetWidth;
  authTerminal.classList.add("is-glitching");
  authSystem.textContent = "VERIFYING PASSCODE";

  window.setTimeout(() => {
    if (year <= latestClearlyAdultYear && calculateAgeFromBirthYear(year) >= 19) {
      grantAccess();
    } else {
      denyAccess("年齢条件を確認できません。通常モードで起動します。");
    }
  }, 700);
});

plusMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;

  if (button.dataset.mode === "bath") {
    openBathMode();
  } else {
    openSimpleMode(button.dataset.mode);
  }
});

document.querySelectorAll('input[name="temperature"]').forEach((input) => {
  input.addEventListener("change", () => {
    const temperature = Number(input.value);
    typeMessage(pick(bathTemperatureLines[temperature]));
  });
});

simpleBackButton.addEventListener("click", () => {
  showMenu();
  typeMessage("最初の画面へ戻りました。次はどの時間を一緒に過ごしますか。");
});

bathBackButton.addEventListener("click", () => {
  if (bathStartedAt) {
    endBath();
  }
  showMenu();
});

bathStartButton.addEventListener("click", startBath);
bathEndButton.addEventListener("click", endBath);

updateClock();
window.setInterval(updateClock, 1000);
window.setTimeout(showAgeQuestion, 3300);
