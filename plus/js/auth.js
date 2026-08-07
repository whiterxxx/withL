// with L+ v2 / limited access and age authentication

/* ========================================
   WITH L+ AUTHENTICATION / REWRITE
======================================== */

const authOverlay = document.getElementById("authOverlay");
const authPanel = document.getElementById("authPanel");
const authLevelLabel = document.getElementById("authLevelLabel");
const authCode = document.getElementById("authCode");
const authProgress = document.getElementById("authProgress");
const authBootLog = document.getElementById("authBootLog");
const authAccessForm = document.getElementById("authAccessForm");
const authAccessCode = document.getElementById("authAccessCode");
const authAccessError = document.getElementById("authAccessError");
const authAccessReveal = document.getElementById("authAccessReveal");
const authIntro = document.getElementById("authIntro");
const authIntroContinue = document.getElementById("authIntroContinue");
const authAgeForm = document.getElementById("authAgeForm");
const authAge = document.getElementById("authAge");
const authAgeError = document.getElementById("authAgeError");
const authQuestion = document.getElementById("authQuestion");
const authPasscodeForm = document.getElementById("authPasscodeForm");
const authBirthYear = document.getElementById("authBirthYear");
const authError = document.getElementById("authError");
const authResult = document.getElementById("authResult");
const authResultCode = document.getElementById("authResultCode");
const authResultMessage = document.getElementById("authResultMessage");
const authFragments = document.getElementById("authFragments");

const plusTitleMain = document.getElementById("appTitleMain");
const plusTitleAccess = document.getElementById("appTitleAccess");
const plusButtons = [
  document.getElementById("plusButton1"),
  document.getElementById("plusButton2"),
  document.getElementById("plusButton3"),
  document.getElementById("plusButton4")
];
const plusLabels = [
  document.getElementById("plusLabel1"),
  document.getElementById("plusLabel2"),
  document.getElementById("plusLabel3"),
  document.getElementById("plusLabel4")
];
const plusIcons = [
  document.getElementById("plusIcon1"),
  document.getElementById("plusIcon2"),
  document.getElementById("plusIcon3"),
  document.getElementById("plusIcon4")
];

const PLUS_REWRITE_DELAY = 1200;
let plusRewriteComplete = false;
let declaredAge = null;

/*
  限定アクセスコードの平文は保存しません。
  入力値をSHA-256で変換し、この照合値と比較します。
*/
const LIMITED_ACCESS_DIGEST = [
  "4d59c8ff2db705d6",
  "b5ee93860ad84829",
  "5a22cfa107df643a",
  "bfa764f12920b701"
].join("");

const PLUS_TARGETS = [
  {
    title: "二人きりになる",
    mode: "private",
    icon: '<svg viewBox="0 0 24 24"><circle cx="8.4" cy="10.8" r="3.55"></circle><path d="M11.7 10.8h6.2"></path><path d="M15.45 10.8v2.2"></path><path d="M17.75 10.8v1.4"></path></svg>'
  },
  {
    title: "一緒にお風呂",
    mode: "bath",
    icon: '<svg viewBox="0 0 24 24"><path d="M4 11.5h16v3.3a4.2 4.2 0 0 1-4.2 4.2H8.2A4.2 4.2 0 0 1 4 14.8Z"></path><path d="M6.3 19v1.5M17.7 19v1.5"></path><path d="M7 11.5V8.2a2.2 2.2 0 0 1 4.4 0"></path><path d="M14.5 4.5c-1 1.1 1 1.8 0 3M18 4.5c-1 1.1 1 1.8 0 3"></path></svg>'
  },
  {
    title: "一緒にトレーニング",
    mode: "training",
    icon: '<svg viewBox="0 0 24 24"><path d="M3.8 9.2v5.6M6.4 7.4v9.2M17.6 7.4v9.2M20.2 9.2v5.6"></path><path d="M6.4 12h11.2"></path></svg>'
  },
  {
    title: "一緒に眠る",
    mode: "sleep",
    icon: '<svg viewBox="0 0 24 24"><path d="M17.4 15.8A7 7 0 0 1 8.2 6.6a7.2 7.2 0 1 0 9.2 9.2Z"></path><path d="M16.8 5.5h3.2l-3.2 3.2H20"></path></svg>'
  }
];

function createAuthFragments() {
  for (let index = 0; index < 30; index += 1) {
    const fragment = document.createElement("span");
    fragment.style.setProperty("--x", `${Math.random() * 100}%`);
    fragment.style.setProperty("--y", `${Math.random() * 100}%`);
    fragment.style.setProperty("--w", `${7 + Math.random() * 44}px`);
    fragment.style.setProperty("--o", `${0.06 + Math.random() * 0.22}`);
    fragment.style.setProperty("--d", `${1.3 + Math.random() * 3.6}s`);
    authFragments.appendChild(fragment);
  }
}

function showAccessGate() {
  authCode.textContent = "RESTRICTED DEVICE";
  authLevelLabel.textContent = "CODE REQUIRED";
  authProgress.hidden = true;
  authBootLog.hidden = true;
  authAccessForm.hidden = false;
  window.setTimeout(() => authAccessCode.focus(), 80);
}

function authGlitch() {
  authPanel.classList.remove("is-auth-glitching");
  void authPanel.offsetWidth;
  authPanel.classList.add("is-auth-glitching");
}

function denyPlusAccess(message) {
  authAccessForm.hidden = true;
  authIntro.hidden = true;
  authAgeForm.hidden = true;
  authQuestion.hidden = true;
  authPasscodeForm.hidden = true;
  authResult.hidden = false;
  authResult.classList.add("is-denied");
  authResultCode.textContent = "ACCESS DENIED";
  authResultMessage.textContent = message || "通常版のwith Lを起動します。";
  authLevelLabel.textContent = "STANDARD";
  authGlitch();
  window.setTimeout(() => window.location.replace("../"), 1450);
}

function corruptText(target, finalText, duration = 520) {
  const glyphs = "▓▒░01/\\\\<>[]{}#%&";
  const startedAt = performance.now();
  target.classList.add("is-corrupted");

  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const revealCount = Math.floor(finalText.length * progress);
    let output = "";
    for (let index = 0; index < finalText.length; index += 1) {
      if (index < revealCount) output += finalText[index];
      else if (finalText[index] === " ") output += " ";
      else output += glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    target.textContent = output;
    if (progress < 1) requestAnimationFrame(tick);
    else {
      target.textContent = finalText;
      target.classList.remove("is-corrupted");
    }
  };
  requestAnimationFrame(tick);
}

function rewriteToPlus() {
  if (plusRewriteComplete) return;
  plusRewriteComplete = true;
  document.body.classList.add("plus-rewriting");
  triggerGlitch();

  plusButtons.forEach((button, index) => {
    const target = PLUS_TARGETS[index];
    button.classList.add("plus-rewrite-target");
    window.setTimeout(() => {
      button.dataset.mode = target.mode;
      plusIcons[index].innerHTML = target.icon;
      corruptText(plusLabels[index], target.title, 540);
    }, 70 + index * 65);
  });

  window.setTimeout(() => {
    corruptText(plusTitleMain, "with L+", 620);
    plusTitleAccess.hidden = false;
  }, 110);

  window.setTimeout(() => {
    document.body.classList.remove("plus-rewriting");
    document.body.classList.add("plus-ready");
    plusButtons.forEach((button) => button.classList.remove("plus-rewrite-target"));
    typeMessage("……認証完了しました。それでは、二人だけの時間を始めましょう。");
  }, 850);
}

function closeAuthOverlay() {
  authOverlay.classList.add("is-closing");
  document.body.classList.remove("auth-locked");
  window.setTimeout(() => {
    authOverlay.hidden = true;
    window.setTimeout(rewriteToPlus, PLUS_REWRITE_DELAY);
  }, 380);
}

function grantPlusAccess() {
  authAccessForm.hidden = true;
  authIntro.hidden = true;
  authAgeForm.hidden = true;
  authQuestion.hidden = true;
  authPasscodeForm.hidden = true;
  authResult.hidden = false;
  authResultCode.textContent = "ACCESS GRANTED";
  if (!authResultMessage.textContent) {
    authResultMessage.textContent =
      "申告内容を照合しました。入室を許可します。";
  }
  authLevelLabel.textContent = "VERIFIED";
  authGlitch();
  window.setTimeout(closeAuthOverlay, 900);
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

authAccessCode.addEventListener("input", () => {
  authAccessError.textContent = "";
  authAccessForm.classList.remove("is-rejected");
});

authAccessReveal.addEventListener("click", () => {
  const willReveal = authAccessCode.type === "password";
  authAccessCode.type = willReveal ? "text" : "password";
  authAccessReveal.textContent = willReveal ? "HIDE" : "VIEW";
  authAccessReveal.setAttribute("aria-pressed", String(willReveal));
  authAccessReveal.setAttribute(
    "aria-label",
    willReveal ? "アクセスコードを隠す" : "アクセスコードを表示"
  );
  authAccessCode.focus();
});

authAccessForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessCode = authAccessCode.value.trim();

  if (!accessCode) {
    authAccessError.textContent = "アクセスコードを入力してください。";
    return;
  }

  authCode.textContent = "VERIFYING ACCESS CODE";
  authLevelLabel.textContent = "VERIFYING";
  authAccessError.textContent = "";
  authGlitch();

  try {
    const digest = await sha256Hex(accessCode);

    if (digest !== LIMITED_ACCESS_DIGEST) {
      authAccessForm.classList.remove("is-rejected");
      void authAccessForm.offsetWidth;
      authAccessForm.classList.add("is-rejected");
      authAccessError.textContent = "アクセスコードを確認できません。";
      authCode.textContent = "ACCESS CODE REJECTED";
      authLevelLabel.textContent = "RETRY";
      authAccessCode.select();
      return;
    }

    authAccessForm.classList.add("is-authorized");
    authCode.textContent = "ACCESS CODE ACCEPTED";
    authLevelLabel.textContent = "LIMITED ACCESS";

    window.setTimeout(() => {
      authAccessForm.hidden = true;
      authIntro.hidden = false;
      authCode.textContent = "IDENTITY CONFIRMATION";
      authLevelLabel.textContent = "AGE CHECK";
    }, 520);
  } catch (error) {
    authAccessError.textContent = "照合処理を開始できませんでした。";
    authCode.textContent = "AUTHENTICATION ERROR";
    authLevelLabel.textContent = "ERROR";
  }
});

authIntroContinue.addEventListener("click", () => {
  authIntro.hidden = true;
  authAgeForm.hidden = false;
  authCode.textContent = "AGE DECLARATION";
  authLevelLabel.textContent = "AGE INPUT";
  window.setTimeout(() => authAge.focus(), 80);
});

authAge.addEventListener("input", () => {
  authAge.value = authAge.value.replace(/\D/g, "").slice(0, 3);
  authAgeError.textContent = "";
});

authAgeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const age = Number(authAge.value);

  if (!/^\d{1,3}$/.test(authAge.value)) {
    authAgeError.textContent = "現在の年齢を数字で入力してください。";
    return;
  }

  if (age < 0 || age > 120) {
    authAgeError.textContent = "入力された年齢を確認できません。";
    return;
  }

  declaredAge = age;
  authGlitch();

  if (age < 18) {
    denyPlusAccess(
      "認証条件を満たしていません。通常版のwith Lを起動します。"
    );
    return;
  }

  authAgeForm.hidden = true;
  authQuestion.hidden = false;
  authCode.textContent = "AGE CONFIRMATION";
  authLevelLabel.textContent = "CONFIRM";
});

document.querySelectorAll("[data-auth-age-confirm]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.authAgeConfirm === "no") {
      denyPlusAccess(
        "認証条件を満たしていません。通常版のwith Lを起動します。"
      );
      return;
    }

    authQuestion.hidden = true;
    authPasscodeForm.hidden = false;
    authCode.textContent = "PASSCODE REQUIRED";
    authLevelLabel.textContent = "PASSCODE";
    window.setTimeout(() => authBirthYear.focus(), 80);
  });
});

authBirthYear.addEventListener("input", () => {
  authBirthYear.value = authBirthYear.value.replace(/\D/g, "").slice(0, 4);
  authError.textContent = "";
});

authPasscodeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const year = Number(authBirthYear.value);
  const currentYear = new Date().getFullYear();

  if (!/^\d{4}$/.test(authBirthYear.value)) {
    authError.textContent = "4桁の生まれ年を入力してください。";
    return;
  }

  if (year < 1900 || year > currentYear) {
    authError.textContent = "入力されたパスコードを確認できません。";
    return;
  }

  if (!Number.isInteger(declaredAge) || declaredAge < 18) {
    denyPlusAccess(
      "認証条件を満たしていません。通常版のwith Lを起動します。"
    );
    return;
  }

  /*
    誕生日を迎えている場合と、まだ迎えていない場合の両方を許容します。
    例：2026年に25歳なら、生まれ年は2000年または2001年です。
  */
  const possibleBirthYears = [
    currentYear - declaredAge,
    currentYear - declaredAge - 1
  ];

  authCode.textContent = "VERIFYING PASSCODE";
  authLevelLabel.textContent = "VERIFYING";
  authGlitch();

  window.setTimeout(() => {
    if (possibleBirthYears.includes(year)) {
      authResultMessage.textContent =
        "申告内容を照合しました。入室を許可します。";
      grantPlusAccess();
    } else {
      denyPlusAccess(
        "申告された年齢とパスコードが一致しません。通常版のwith Lを起動します。"
      );
    }
  }, 650);
});

createAuthFragments();
window.setTimeout(showAccessGate, 2850);
