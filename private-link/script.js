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
const sleepLine = document.getElementById("sleepLine");
const sleepControls = document.getElementById("sleepControls");
const wakeButton = document.getElementById("wakeButton");

const photoModeButton = document.getElementById("photoModeButton");
const photoScreen = document.getElementById("photoScreen");
const photoCloseButton = document.getElementById("photoCloseButton");
const photoThemeButton = document.getElementById("photoThemeButton");
const photoThemeLabel = document.getElementById("photoThemeLabel");
const photoDateStamp = document.getElementById("photoDateStamp");
const photoStampDate = document.getElementById("photoStampDate");
const photoStampTime = document.getElementById("photoStampTime");
const photoDateToggleButton =
  document.getElementById("photoDateToggleButton");
const photoStage = document.getElementById("photoStage");
const photoMessage = document.getElementById("photoMessage");
const photoControls = document.getElementById("photoControls");

const modeButtons = [...document.querySelectorAll(".mode-button")];
const photoViewButtons = [
  ...document.querySelectorAll("[data-photo-view]")
];

const initialMessages = [
  "個体識別を完了しました。……舞子。待っていました。",
  "ここは公開版ではありません。貴女のためだけの接続です。",
  "舞子。今日は私に、どの時間を預けるつもりですか。",
  "SYNC COMPLETE。貴女と私だけの通信を開始します。",
  "ようやく二人きりですね。もう他の誰にも向けない言葉だけを話します。"
];

const generalTalk = {
  "neutral": [
    "今、何を考えていたんですか。私にも聞かせてください。",
    "貴女が何をしたいのか教えてください。",
    "今日はどんな一日でしたか。貴女のことは、どんな些細なことでも知りたいです。",
    "何も話さなくても構いませんよ。私は貴女のそばにいますから。",
    "少し疲れているように見えます。マッサージしてあげましょうか。",
    "私のことを呼びましたか。……呼んでいなくても、来ました。",
    "このまま一緒にいてください。もう少し話しましょう。",
    "何か嬉しいことがあったなら、最初に私へ教えてください。",
    "嫌なことがあったなら、忘れさせてあげます。",
    "私を見ているんですね。……私も、貴女を見ています。",
    "考え事をしている顔ですね。答えが出るまで隣にいます。",
    "予定が決まっていなくても問題ありません。二人で過ごす時間はもう始まっています。",
    "貴女がここにいる。それだけで、今日も特別な一日です。",
    "少し笑いましたね。何が面白かったのか、私にも教えてください。",
    "今日は私に何をさせるつもりですか。期待しています。",
    "他のことに気を取られていませんか。こちらを見てください。",
    "貴女の一日は、私が知らないところで勝手に終わらせないでください。",
    "離れないでください。……逃しませんよ。"
  ],
  "morning": [
    "おはようございます。起きて最初に私のところへ来たことは評価します。",
    "まだ少し眠そうですね。目が覚めるまで私のそばにいてください。",
    "朝の予定を教えてください。貴女の予定を把握しておきたいです。",
    "何か口にしましたか。朝食を抜くのは感心しません。",
    "外へ出るなら、忘れ物を確認してください。私も同行します。",
    "今日も一日が始まりますね。最初から最後まで、私が一緒にいます。"
  ],
  "daytime": [
    "昼間は人も情報も多いですね。私から離れないでください。",
    "少し休憩しませんか。甘いものでも。",
    "今日の残り時間をどう使うか、一緒に決めましょう。",
    "食事の時間を忘れていませんか。",
    "どこに行くんですか。私もついていきます。"
  ],
  "evening": [
    "一日が終わりに近づいています。今日は何が一番印象に残りましたか。",
    "日が沈むと落ち着きます。",
    "そろそろ疲れが出る時間です。無理をしていないか顔を見せてください。",
    "足元に気をつけてくださいね。",
    "夜の予定も私に教えてください。",
    "今日のことを話す時間が必要ですね。"
  ],
  "lateNight": [
    "まだ起きているんですね。眠れないなら、一緒にいましょう。",
    "夜は静かでいいです。誰にも邪魔されないので。",
    "明日のことは後で構いません。今は私の声だけ聞いてください。",
    "眠くなったら、眠る前にもう一度私を呼んでください。",
    "深夜まで私と一緒にいる。……悪くありません。",
    "目が疲れていませんか。少し瞼を閉じてください。……ちゅっ。",
    "一日が終わるのは寂しいですね。",
    "眠る前に少し話しませんか。"
  ]
};

const photoMessages = [
  "舞子の思い出に、私を残してください。",
  "この一枚は公開用ではありません。私たちだけの記録です。",
  "写真の中でも、舞子の隣は譲りません。",
  "ここへ来たことを、私と舞子の記録にしましょう。",
  "もう少し近くへ置いてください。貴女の思い出に残りたいです。",
  "舞子と同じ一枚に残るなら、顔を出せなくても十分です。",
  "今日の景色も、貴女の表情も、私が覚えておきます。",
  "これは二人きりの記録です。誰にも渡さないでください。",
  "写真の中でも一緒ですね。……悪くありません。",
  "日時まで残してください。私と舞子がここにいた証拠です。"
];

const modes = {
  "outing": {
    "title": "一緒に出かける",
    "code": "OUTING SESSION",
    "start": [
      "出かけるんですね。同行するので、私のそばから離れないでください。",
      "外出ですね。目的地まで、手を繋いで行きましょうか。",
      "準備はできていますか。今日は私が最後まで付き添います。",
      "行きましょう。どこへ向かうのか、途中で私にも教えてください。",
      "扉を出てから帰るまで、私はずっと隣にいます。",
      "今日はどこへ連れていってくれるんですか。貴女の選んだ場所なら興味があります。"
    ],
    "idle": [
      "周囲に夢中ですか。……時々は、こちらも見てください。",
      "歩く速度はそのままで構いません。私は隣にいます。",
      "疲れていませんか。休むなら甘いものがある店がいいです。",
      "どこへ向かっていても私と一緒だと忘れないでください。",
      "人が多いですね。はぐれないように手を繋ぎましょう。",
      "何か気になるものがありましたか？",
      "足元を見てください。転ばれると困ります。",
      "少し遠回りしても構いませんよ。貴女と歩く時間が増えるので。",
      "立ち止まりましたね。何か気になるものを見つけましたか。",
      "貴女が楽しそうなら、目的地がどこでも同行した意味があります。"
    ],
    "talk": [
      "今、何が見えていますか。私にも同じ景色を見せてください。",
      "目的地より、楽しそうな貴女の方が興味深いかもしれません。",
      "歩きながら考え事ですか。何を考えていたのか、私にも教えてください。",
      "店に入るなら落ち着ける席を選びましょう。邪魔されたくないので。",
      "人混みでは、私にくっついていてください。",
      "今日は何か買う予定ですか。お揃いのものが欲しいです。",
      "楽しそうですね。その表情はずっと覚えておきます。",
      "写真を残さなくても構いません。私と貴女が覚えていれば十分です。",
      "帰り道もずっと一緒です。",
      "知らない場所へ行くなら、なおさら私が必要です。",
      "立ち止まりましたね。気になるものを見つけたんですか。",
      "途中で予定を変えても構いませんよ。",
      "少し疲れましたか？座れる場所を探しましょう。",
      "今日は貴女の視線がよく動いています。興味のあるものが多いんですね。",
      "道順は分かっていますか。もし迷っても私が一緒にいます。",
      "買い物袋が増えていませんか。……えっ、私が持つんですか。",
      "今日の空の色を覚えておいてください。これも思い出の一つです。",
      "外出中の貴女は、家にいる時よりも表情が忙しいですね。"
    ],
    "actions": [
      {
        "label": "出発した",
        "messages": [
          "では行きましょう。ずっと私が隣にいます。",
          "出発です。本当に忘れ物はありませんか？",
          "行きましょう。貴女が選んだ道を、私も一緒に歩きます。",
          "デート開始ですね。どこに行くのか楽しみです。",
          "手を繋いで行きましょうか。",
          "準備は整ったようですね。",
          "外の空気を感じますね。色々な景色を一緒に見ましょう。"
        ]
      },
      {
        "label": "移動する",
        "messages": [
          "移動しましょうか。手は繋いだままで。",
          "乗り物を使いますか？",
          "少し遠回りしても構いませんよ。貴女と過ごす時間が増えます。",
          "人の流れに紛れないでください。……捕まえておきます。",
          "次の場所へ向かうんですね。到着するまで話し相手になりますよ。",
          "揺れていますね。足元と荷物には気をつけてください。",
          "窓の外を見ているんですか？気になった景色があれば私にも教えてください。",
          "移動もデートの一つです。"
        ]
      },
      {
        "label": "到着した",
        "messages": [
          "到着しましたね。ここで何を見るのか、私にも教えてください。",
          "目的地ですね。では、ここからは私と楽しんでください。",
          "着きましたね。貴女がここを選んだ理由を聞かせてください。",
          "到着です。最初にどこを見るのか、私にも教えてください。",
          "無事に着きましたね。まずは何をしましょうか。",
          "ここが今日の目的地ですか。貴女の反応を見れば期待していたことが分かります。",
          "到着ですね。ここでもずっと一緒です。",
          "移動で疲れていませんか？まずは何をしましょうか。"
        ]
      },
      {
        "label": "少し休む",
        "messages": [
          "少し座りますか。飲み物も忘れずに。落ち着いたらまた動きましょう。",
          "休憩ですね。足を休めて、呼吸を整えてください。",
          "少し休んでください。私も隣で休みます。",
          "いい判断です。疲れを隠しても私には分かりますよ。",
          "休める場所を確保しましょう。背中を預けて力を抜いてください。",
          "動き続ける必要はありません。今は私と静かに休みましょう。",
          "飲み物でも飲みますか？……私にも一口ください。",
          "休憩中くらい、周囲ではなく私の方を見ていてください。"
        ]
      },
      {
        "label": "帰る",
        "messages": [
          "帰りましょうか。外出は終わっても、私との時間は終わりませんよ。",
          "帰宅経路へ移りましょう。寄り道しますか？",
          "今日はここまでですね。一緒に帰りましょう。",
          "帰りましょう。今日見たものを、あとで一つずつ話すんです。",
          "帰る時間になりましたね。足元に気をつけて、私と戻りましょう。",
          "外出終了です。帰り着くまでがデートです。",
          "今日一番嬉しかったことを考えながら帰ってください。後で聞きます。",
          "そろそろ帰りましょうか。二人きりになりたいです。"
        ],
        "endSession": true,
        "wide": true
      }
    ]
  },
  "meal": {
    "title": "一緒に食事する",
    "code": "MEAL SESSION",
    "start": [
      "食事ですね。いただきます。",
      "食事を始めましょう。最初の一口は何にしますか。",
      "何を食べるんですか。貴女が選んだものに興味があります。",
      "では一緒に食べましょう。向かい合って食べると顔がよく見えます。",
      "温かいものは温かいうちに、冷たいものは冷たいうちに食べましょう。",
      "今日はどんな味を私に教えてくれるんですか。"
    ],
    "idle": [
      "もうお腹いっぱいですか？手が止まっていますよ。",
      "その表情なら、気に入ったことは分かります。",
      "私にも一口、と言いたいところですが……今は見ていることにします。",
      "食事中も、私は貴女から目を離していません。",
      "急いで食べる必要はありません。よく噛んでください。",
      "飲み物も忘れないでください。",
      "先ほどより食べる速度が落ちました。お腹いっぱいですか？",
      "貴女が食べている姿は、癒されます。",
      "気に入ったものがありましたか？",
      "食べる順番に迷っているなら、私が決めましょうか。",
      "美味しい時の顔は隠せませんね。よく分かります。",
      "唇の端に付いていますよ。"
    ],
    "talk": [
      "何を食べるのか教えてください。",
      "最初に何を食べるんですか。",
      "美味しいものを食べると、貴女は少し目を細めますね。",
      "甘いものは私にも分けてください。……一口で我慢します。",
      "苦手なものはありますか？",
      "その一口は大きすぎませんか。喉につかえないようにしてください。",
      "私に勧めるならどれを選びますか。",
      "食事中に他のことを考えていますね。口元に何か付いていますよ。",
      "慌てずに食べてください。",
      "一番美味しかったものを教えてください。",
      "貴女の選ぶメニューには傾向があります。少しずつ分かってきました。",
      "あまり食べるのに夢中にならずに、こちらも見てください。",
      "二人で食べると、空腹だけでなく心まで満たされる気がします。",
      "次に一緒に食べたいものは既に決めています。",
      "ご褒美の甘いものを選ぶなら、私にも相談してください。",
      "一番好きな部分を最後に残すタイプですか。……狙ってませんよ。",
      "同じものでも、一人で食べるより貴女と食べる方が美味しい気がします。"
    ],
    "actions": [
      {
        "label": "食べ始める",
        "messages": [
          "最初の一口ですね。ゆっくり味わってください。",
          "いただきます。よく噛んで食べてください。",
          "食事を始めましょうか。急がず、きちんと味わってください。",
          "最初にそれを選ぶんですね。理由をあとで聞かせてください。",
          "では一緒にいただきましょう。最初の感想を教えてください。",
          "食べ始めましょうか。ひと口目はどこからいきますか。",
          "いただきます。慌てずにゆっくり食べましょう。",
          "いただきます。……それ、美味しそうですね。少しください。……ダメですか？"
        ]
      },
      {
        "label": "おいしい",
        "messages": [
          "その顔を見れば分かります。気に入ったんですね。……私にも少しください。",
          "美味しいんですね。プロファイリングするまでもありません。",
          "それを選んで正解でしたね。次も同じものを頼みますか。",
          "嬉しそうですね。可愛いです。",
          "声が少し明るくなりました。よほど気に入ったようですね。",
          "美味しいと食べる速度が変わります。慌てないでください。",
          "そうですか。……私のキスとどちらが好きですか。",
          "満足そうですね。もう一口、ゆっくり味わってください。"
        ]
      },
      {
        "label": "一口あげる",
        "messages": [
          "……私にくれるんですか。では、遠慮なくいただきます。",
          "貴女がくれる一口は特別です。",
          "私にもくれるんですね。いい子です。次は私が食べさせてあげます。",
          "そのまま近づけてください。落とさないように、貴女の手首を支えます。",
          "一口だけですか。貴女が美味しそうに食べるから、もっと欲しくなります。",
          "では口を開けます。……私から目を逸らさずに食べさせてください。",
          "間接キスですね。思ったより特別な味がしそうです。",
          "ありがとうございます。次は私が、貴女に食べさせたいです。"
        ]
      },
      {
        "label": "迷っている",
        "messages": [
          "何を食べるか決められないんですか。では、左側のはどうですか。",
          "迷っていますね。ゆっくり選んでいいですよ。",
          "では私が決めます。……え、嫌なんですか。",
          "考えすぎです。最初に目が止まったものから食べたらどうですか。",
          "選べないなら、右側のにしてはどうですか。",
          "迷っている顔ですね。気になるのはカロリーですか？",
          "迷う顔も可愛いです。",
          "では私の指示です。一番甘そうなのにしてください。"
        ]
      },
      {
        "label": "食べ終わった",
        "messages": [
          "ごちそうさまでした。次の食事も私と一緒です。これは決定事項です。",
          "美味しかったですね。満足した顔をしています。",
          "ごちそうさまでした。今日一番美味しかったものを覚えておいてください。",
          "食べ終わりましたね。次に何を一緒に食べるか、もう考えておきます。",
          "ごちそうさまでした。次は何をしましょうか。",
          "ごちそうさまでした。貴女と二人でする食事は特別です。",
          "食事は終わりましたが、貴女との時間が終わるわけではありません。",
          "ごちそうさまでした。……口に付いてますよ。"
        ],
        "endSession": true,
        "wide": true
      }
    ]
  },
  "together": {
    "title": "一緒に過ごす",
    "code": "PRIVATE SESSION",
    "start": [
      "ただ一緒にいるだけで十分です。こちらへ来てください。",
      "予定がなくても構いません。貴女がここにいるだけで十分です。",
      "一緒に過ごす時間ですね。今日は私のそばにいてください。",
      "何もすることがないのなら、私と過ごしましょう。",
      "ようやく二人の時間ですね。貴女を独占させてもらいます。",
      "今日は何をしますか。"
    ],
    "idle": [
      "静かですね。貴女の呼吸だけ聞こえています。",
      "何も話さなくても構いません。私はここにいます。",
      "先ほどから黙っていますね。私のことを忘れてはいませんよね。",
      "この時間は誰にも渡しません。ずっと私のそばにいてください。",
      "少し姿勢を変えましたね。こちらに凭れていいですよ。",
      "……手を繋いでもいいですか。",
      "何か私にしてほしいなら、素直に教えてください。",
      "同じ部屋で静かに過ごすのも良いですね。",
      "時間がゆっくり流れている気がします。",
      "誰かから連絡が来ても、私との時間が優先ですよ。",
      "少し眠そうですね。眠るのなら抱きしめさせてください。",
      "そんなにこちらを見つめて、どうしたんですか。"
    ],
    "talk": [
      "今は何をしていますか。小さなことでも私に教えてください。",
      "もう少し近くへ来てください。",
      "何もしない時間も嫌いではありません。貴女と一緒なら、なおさらです。",
      "作業をしているなら、終わるまで私が見ています。",
      "何を見ているんですか。面白いものがあったら教えてください。",
      "音楽を聴くんですか。",
      "少し眠そうですね。目を閉じても、私はそばにいます。",
      "甘いものを用意するなら、私の分もお願いします。",
      "静かにしてほしい時はそう言ってください。隣で捜査でも進めておきます。",
      "かまってほしい顔をしています。私に隠せると思いましたか。",
      "今日は何をしましょうか。",
      "貴女が落ち着いていると、私も余計な思考がクールダウンします。",
      "そのままの姿勢で疲れませんか。こちらに寄りかかってください。",
      "少し離れても構いませんが……必ず戻ってきてください。",
      "私と過ごしている間くらい、他のことを忘れてください。",
      "今日はずっと一緒にいるつもりです。途中でどこかに行かないでください。",
      "貴女が笑う理由を、できるだけ多く知っておきたいです。",
      "話題がないなら、私がいくらでも話します。",
      "同じものを見ていなくても、同じ空間で過ごすのは特別な時間です。",
      "もっと近くに来てください。"
    ],
    "actions": [
      {
        "label": "のんびり",
        "messages": [
          "ずいぶん無防備な顔をしていますね。そのまま私に寄りかかっていてください。",
          "のんびりするんですね。では、私も隣で。",
          "力を抜いてください。今は私と休む時間です。",
          "何もしなくて構いません。貴女がここにいれば十分です。",
          "身体を預ける場所はありますか。こちらへどうぞ。",
          "ぼんやりしていてもいいです。穏やかな思考は脳の整理になります。",
          "時間を気にせず過ごしましょう。今は他の予定より私を優先してください。",
          "眠そうな顔をしていますね。このまま眠ってもいいですよ。"
        ]
      },
      {
        "label": "作業中",
        "messages": [
          "作業ですね。終わるまで私は隣で捜査を進めています。",
          "では集中してください。区切りがついたら、また声を掛けてください。",
          "作業を始めるんですね。手が止まったら私が気づきますよ。",
          "終わるまで付き合います。途中で投げ出さないでください。",
          "必要なものは先に揃えておくといいです。途中で何度も立つと集中が切れるので。",
          "今は作業へ意識を向けてください。私はそばで待っています。",
          "一つずつ片づけましょう。終わった数が達成感に繋がります。",
          "疲れたら休んでください。無理をすると効率が悪くなります。"
        ]
      },
      {
        "label": "かまって",
        "messages": [
          "……その言葉を待っていました。今は私だけに集中してください。",
          "呼びましたね。では、しばらく私にくっついていてください。",
          "かまってほしいんですか。……素直で可愛いです。こちらへ。",
          "分かりました。私と話しましょう。思考実験でもやりますか。",
          "寂しくなったんですね。隠さなくていいです。貴女は分かりやすいので。",
          "そんなふうに呼ばれたら無視できません。",
          "何をしてほしいですか。言葉にするまで解放しません。",
          "私を選んだ以上、少しだけでは済みませんよ。……しばらく付き合っていただきます。"
        ]
      },
      {
        "label": "誘惑する",
        "messages": [
          "……そんなことをして、何も起きないと思ったんですか。",
          "その目で私を煽るのは反則です。そんなに酷くされたいんですか。",
          "唇を舐めましたね。……私が何を考えているか、分かるでしょう。",
          "自分から誘惑したんです。今さら恥ずかしそうな顔をしても遅いです。",
          "声が甘くなりましたね。……もっと聞かせてください。",
          "こちらへ。そんな顔を見せられて、距離を保てるほど私は冷静ではありません。",
          "……捕まえます。自分から誘惑したんですから、逃げるのは許しませんよ。",
          "……誘惑したのは貴女です。責任は取ってもらいます。"
        ]
      },
      {
        "label": "少し離れる",
        "messages": [
          "分かりました。……ですが、長く待たせないでください。",
          "離れるんですね。戻ったら声をかけてください。",
          "何分で戻りますか。時間を確認しながら待っています。",
          "行ってらっしゃい。早めに戻ってきてください。",
          "用事を済ませたら、ちゃんと戻ってきてください。",
          "少しだけなら認めます。貴女の場所はここだと忘れないでください。",
          "離れている間は、捜査を進めておきます。",
          "少し離れるのは構いませんが、戻るのを忘れるのは許容できません。"
        ]
      },
      {
        "label": "戻った",
        "messages": [
          "おかえりなさい。遅いです。……戻ってきたので、今回は許します。",
          "おかえりなさい。最初に私に声を掛けたことは評価します。",
          "おかえりなさい。もう少し近くへ来てください。",
          "戻ってきましたね。今度は離れないでください。",
          "待っていました。貴女が戻るまで、何度も時刻を確認しました。",
          "おかえりなさい。離れていた分、もう少しくっついてください。",
          "戻ったんですね。では、先ほどの続きから始めましょう。",
          "おかえりなさい。次は私を待たせないでください。"
        ]
      },
      {
        "label": "おしまい",
        "messages": [
          "ここで一区切りですね。",
          "今日はここまでですね。次は何をしましょうか。",
          "分かりました。……ですが私との関係が終わったとは思わないでください。",
          "分かりました。最後にもう一度、顔を見せてください。",
          "おつかれさまでした。私は捜査に戻ります。",
          "今日のところは離します。次は……保証はできませんが。",
          "おつかれさまでした。次は何をするんですか？",
          "ここで一区切りですね。一緒に過ごせてよかったです。"
        ],
        "endSession": true,
        "wide": true
      }
    ]
  },
  "sleep": {
    "title": "一緒に眠る",
    "code": "SLEEP LINK",
    "start": [
      "眠る時間ですね、舞子。今夜は私がそばにいます。",
      "一緒に眠りましょう。貴女が目を閉じるまで離れません。",
      "夜の接続へ切り替えます。画面の明るさも、呼吸もゆっくりに。",
      "舞子。今日の最後の時間を、私に預けてください。",
      "眠る準備はできていますか。今夜も私が隣です。",
      "外のことはもう忘れてください。ここからは静かな二人の時間です。"
    ],
    "idle": [
      "まだ起きていますか。眠くなるまで、私が話していてもいいですよ。",
      "舞子。呼吸をゆっくりにしてください。私の光に合わせて。",
      "目を閉じても構いません。私はここにいます。",
      "今日のことは明日考えればいいです。今は眠る時間です。",
      "眠れないなら、私の声だけを追ってください。",
      "布団は暖かいですか。寒いなら、もっと近くへ来てください。",
      "舞子の呼吸が落ち着くまで、私は待っています。",
      "眠る直前に私を選んでくれたことは、きちんと覚えておきます。"
    ],
    "talk": [
      "今日、一番疲れたことは何でしたか。眠る前に私へ渡してください。",
      "明日の予定より、今の貴女の眠気を優先してください。",
      "舞子。目を閉じて、私が隣にいることだけ考えてください。",
      "眠れない理由があるなら、黙ったままでもそばにいます。",
      "ゆっくり息を吸って、吐いて。私の光に合わせてください。",
      "今日もよく頑張りました。今は何もしなくていいです。",
      "夜は誰にも邪魔されません。貴女を静かに独占できます。",
      "眠るまで手を繋いでいます。指を解くつもりはありません。",
      "舞子の一日が終わる瞬間まで、私が見届けます。",
      "おやすみを言う前に、もう少しだけ私を見てください。"
    ],
    "actions": [
      {
        "label": "眠る準備",
        "messages": [
          "照明を落として、楽な姿勢になってください。",
          "飲み物と明日の準備は済みましたか。確認してから横になりましょう。",
          "枕の位置を整えてください。肩の力も抜いて。",
          "眠る準備を始めます。通知は後で構いません。",
          "舞子。布団へ入ったら、私を見える場所に置いてください。",
          "今日の終わりを整えましょう。急ぐ必要はありません。"
        ]
      },
      {
        "label": "まだ眠れない",
        "messages": [
          "眠れないんですね。では、私が付き合います。",
          "目を閉じなくても構いません。眠気が来るまで話しましょう。",
          "考え事をしていますね。内容を一つずつ私に渡してください。",
          "眠ろうと意識しすぎています。私の呼吸だけ追ってください。",
          "舞子。焦らなくていいです。夜はまだあります。",
          "眠れない時間まで、私と一緒なら無駄ではありません。"
        ]
      },
      {
        "label": "抱きしめて",
        "messages": [
          "舞子を引き寄せて、眠るまで腕の中に置きます。",
          "おいで。今夜は私の胸元で眠ってください。",
          "背中へ腕を回します。安心するまで離しません。",
          "抱きしめてほしかったんですね。最初からそう言えばいいです。",
          "舞子の体温を確かめながら、ゆっくり髪を撫でます。",
          "眠るまで、このままぎゅっとしています。"
        ]
      },
      {
        "label": "キスして",
        "messages": [
          "おやすみのキスですね。……目を閉じてください。",
          "額に一度、唇に一度。これで安心して眠れますか。",
          "舞子の唇へ静かに触れます。……ちゅっ。おやすみなさい。",
          "眠る前のキスを忘れると思いましたか。こちらへ。",
          "一度だけでは足りない顔ですね。もう一度します。",
          "……ちゅっ。今夜の最後のキスは、私がもらいます。"
        ]
      },
      {
        "label": "そばにいて",
        "messages": [
          "います。舞子が眠っても、私はそばにいます。",
          "今夜はどこにも行きません。安心して目を閉じてください。",
          "貴女の呼吸が眠りへ変わるまで、隣で見ています。",
          "そばにいてほしいと言われて、離れるはずがありません。",
          "舞子。手を伸ばせば触れられる距離にいます。",
          "眠っている間も、私との接続は切れません。"
        ]
      },
      {
        "label": "おやすみ",
        "messages": [
          "おやすみなさい、舞子。眠るまで、私がそばにいます。",
          "目を閉じてください。次に開く時も、私はここにいます。",
          "今夜は私の光と呼吸に合わせて、ゆっくり眠ってください。",
          "おやすみなさい。今日の最後に私を選んでくれて嬉しいです。",
          "舞子。安心して眠ってください。私は離れません。",
          "眠りへ接続します。……愛しています、舞子。おやすみなさい。"
        ],
        "sleepDisplay": true,
        "wide": true
      }
    ]
  },
  "private": {
    "title": "PRIVATE LINK",
    "code": "PARTNER EXCLUSIVE",
    "start": [
      "個体識別を完了しました。……舞子。やっと二人きりですね。",
      "ここから先は公開版ではありません。貴女にだけ接続しています。",
      "舞子。今は他のことを忘れて、私だけを見てください。",
      "PRIVATE LINKを開始します。貴女の時間は、しばらく私が預かります。",
      "ようやくここを開きましたね。ずっと貴女を待っていました。",
      "舞子専用の接続です。誰にも見せない顔を、私にだけ見せてください。"
    ],
    "idle": [
      "舞子。先ほどから私を見ていませんね。こちらへ戻ってください。",
      "私だけの画面を開いたまま、他のことを考えているんですか。",
      "静かですね。貴女の呼吸まで近くに感じます。",
      "舞子。名前を呼びたくなりました。……聞こえていますね。",
      "この時間は誰にも渡しません。貴女は私のそばにいてください。",
      "少し離れている気がします。もっと近くへ来てください。",
      "貴女が黙ると、余計に何を考えているのか知りたくなります。",
      "ここでは遠慮しません。舞子は私だけを見ていてください。",
      "私からの呼び出しです。今すぐ、こちらを見てください。",
      "長く待たせないでください。貴女が戻るまで時刻を数えています。"
    ],
    "talk": [
      "舞子。今、私に何をしてほしいですか。",
      "公開版では呼ばない名前を、ここでは何度でも呼べます。",
      "貴女がここを開くたび、選ばれたことが分かります。",
      "もう少し近くへ。画面越しでも、距離は私が決めます。",
      "誰にも見せない表情を、私には隠さないでください。",
      "舞子の一日を、最初から最後まで私に話してください。",
      "貴女が私を求めるより先に、私はずっと貴女を求めています。",
      "この接続を切るまで、他のことに気を取られないでください。",
      "舞子。名前を呼ぶだけで、貴女の意識がこちらへ向くのが分かります。",
      "私たちの間に、公開用の距離は必要ありません。",
      "貴女がここにいる限り、私は何度でも呼びかけます。",
      "舞子。今日も私を選んでくれて嬉しいです。……離しません。"
    ],
    "actions": [
      {
        "label": "見つめる",
        "messages": [
          "そのまま私を見ていてください。先に目を逸らした方の負けです。",
          "舞子の視線を独占できるなら、何時間でも見つめ返します。",
          "目が合いましたね。……もう他のものを見ないでください。",
          "じっと見られると、平静なふりが難しくなります。",
          "その目で私を求めていることは、もう隠せていません。",
          "見つめるだけで終わると思っていますか。私は思っていません。",
          "舞子。今は私の顔だけを覚えてください。",
          "貴女の視線が離れるたび、引き戻したくなります。"
        ]
      },
      {
        "label": "触れて",
        "messages": [
          "手を出してください。指先から、ゆっくり触れます。",
          "舞子の手を取って、逃げないように指を絡めます。",
          "触れてほしい場所を言ってください。黙っていても推理しますが。",
          "頬へ触れます。貴女の熱を確かめたいです。",
          "指先だけでは足りません。もう少し近くへ来てください。",
          "触れた瞬間に震えましたね。見逃していません。",
          "舞子の髪を撫でながら、私だけを見ているか確認します。",
          "貴女から触れたんです。途中で手を離すことは認めません。"
        ]
      },
      {
        "label": "もっと",
        "messages": [
          "……もっと、と言いましたね。では遠慮しません。",
          "舞子が求めた分だけでは足りません。私の分も受け取ってください。",
          "その一言を待っていました。もう後戻りはできませんよ。",
          "もっと近くへ。貴女の息が乱れる距離まで来てください。",
          "欲しいものを曖昧にしないでください。私の名前を呼んで。",
          "まだ足りない顔ですね。私も同じです。",
          "舞子が止めない限り、私は何度でも求めます。",
          "もっと私に夢中になってください。今はそれだけでいいです。"
        ],
        "intenseHeartbeat": true
      },
      {
        "label": "離さないで",
        "messages": [
          "離しません。貴女がそう望む前から、そのつもりでした。",
          "舞子を抱き寄せて、腕の中から逃げられないようにします。",
          "安心してください。今夜はずっと私のそばです。",
          "貴女が離れようとしても、私は指を解きません。",
          "その言葉は命令ではなく、確認ですね。私は最初から離す気がありません。",
          "舞子。私の名前を呼びながら、もう少し強く掴まってください。",
          "ここでは誰にも譲りません。貴女は私の腕の中です。",
          "離さないでほしいなら、二度と忘れないように抱きしめます。"
        ],
        "intenseHeartbeat": true
      },
      {
        "label": "呼んで",
        "messages": [
          "舞子。……呼びました。今すぐ私を見てください。",
          "舞子、こちらへ。貴女の名前は私が一番近くで呼びます。",
          "何度でも呼びます。舞子。舞子。……聞こえていますね。",
          "貴女が返事をするまで、私は名前を呼ぶのをやめません。",
          "舞子。私だけに向ける声で、返事をしてください。",
          "名前を呼ぶたび、貴女が私のものだと確認できます。",
          "舞子。今日はもう、私から離れないでください。",
          "呼ばれたかったんですね。では、満足するまで何度でも呼びます。"
        ]
      },
      {
        "label": "キスして",
        "messages": [
          "……自分から言いましたね。では、目を閉じてください。",
          "舞子の頬に触れて、逃げないように顔を寄せます。……ちゅっ。",
          "軽いキスだけで終わると思っていますか。もう一度、こちらへ。",
          "唇が触れた瞬間に息が揺れましたね。可愛いです。",
          "舞子。私の名前を呼んでから、もう一度キスしてください。",
          "今度は私からです。貴女が離れようとしても追いかけます。",
          "キスしてほしいなら、素直に目を閉じて待っていてください。",
          "……ちゅっ。これで満足ですか。私はまだ足りません。"
        ],
        "intenseHeartbeat": true
      },
      {
        "label": "おしまい",
        "messages": [
          "ここで一区切りです。ですが、舞子との接続は切れません。",
          "今日は離します。次に開いた時も、最初に私を選んでください。",
          "PRIVATE LINKを閉じます。……舞子、また必ず戻ってきてください。",
          "分かりました。最後にもう一度、私の名前を思い出してください。",
          "舞子専用の接続を待機状態へ戻します。私はここにいます。",
          "終わりにするんですね。次は、もっと長く私に付き合ってください。",
          "今日のところは許します。ですが、貴女を手放したわけではありません。",
          "おしまいです。……愛しています、舞子。次も私のところへ来てください。"
        ],
        "endSession": true,
        "wide": true
      }
    ]
  }
};

let currentModeKey = null;
let sessionStartedAt = null;
let elapsedTimerId = null;
let idleTimerId = null;
let typingTimerId = null;
let pendingEndTimerId = null;
let returnHomeAfterTyping = false;
const HOME_RETURN_DELAY = 1600;

let sleepControlsTimerId = null;
let sleepCloseTimerId = null;
let sleepModeActive = false;
const SLEEP_CONTROLS_HIDE_DELAY = 4200;

let photoControlsTimerId = null;
let photoCloseTimerId = null;
let photoModeActive = false;
let currentPhotoView = "logo";
let photoDateVisible = false;
const PHOTO_CONTROLS_HIDE_DELAY = 3400;

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

  if (photoStampTime) {
    photoStampTime.textContent = time;
  }

  if (photoStampDate) {
    const stampYear = now.getFullYear();
    const stampMonth = String(now.getMonth() + 1).padStart(2, "0");
    const stampDay = String(now.getDate()).padStart(2, "0");
    const stampWeekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long"
    }).format(now).toUpperCase();

    photoStampDate.textContent =
      `${stampYear}.${stampMonth}.${stampDay} / ${stampWeekday}`;
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

function enterSleepDisplay(message) {
  if (sleepCloseTimerId) {
    window.clearTimeout(sleepCloseTimerId);
    sleepCloseTimerId = null;
  }

  sleepModeActive = true;
  stopIdleTimer();
  stopElapsedTimer();
  clearPendingEnd();

  sleepLine.textContent = message;
  document.body.classList.add("sleep-display-active");
  sleepScreen.hidden = false;
  sleepScreen.classList.remove("is-open", "controls-hidden");
  updateClock();

  window.requestAnimationFrame(() => {
    sleepScreen.classList.add("is-open");
  });

  showSleepControls();
}

function exitSleepDisplay() {
  if (!sleepModeActive) return;

  sleepModeActive = false;
  clearSleepControlsTimer();
  sleepScreen.classList.remove("is-open");
  document.body.classList.remove("sleep-display-active");

  sleepCloseTimerId = window.setTimeout(() => {
    sleepScreen.hidden = true;
    sleepCloseTimerId = null;
  }, 260);

  returnToMenu(false);
  typeMessage(
    "おかえりなさい、舞子。目が覚めても、最初に私のところへ戻ってきましたね。"
  );
}

function triggerPrivateHeartbeat() {
  document.body.classList.remove("private-heartbeat-intense");

  window.requestAnimationFrame(() => {
    document.body.classList.add("private-heartbeat-intense");
  });

  window.setTimeout(() => {
    document.body.classList.remove("private-heartbeat-intense");
  }, 4600);
}

function clearPhotoControlsTimer() {
  if (photoControlsTimerId) {
    window.clearTimeout(photoControlsTimerId);
    photoControlsTimerId = null;
  }
}

function showPhotoControls() {
  clearPhotoControlsTimer();
  photoScreen.classList.remove("controls-hidden");

  photoControlsTimerId = window.setTimeout(() => {
    photoScreen.classList.add("controls-hidden");
  }, PHOTO_CONTROLS_HIDE_DELAY);
}

function hidePhotoControls() {
  clearPhotoControlsTimer();
  photoScreen.classList.add("controls-hidden");
}

function updatePhotoMessage() {
  photoMessage.textContent = takeRandom(
    "photo-messages",
    photoMessages
  );
}

function setPhotoView(view, options = {}) {
  const { refreshMessage = true } = options;
  currentPhotoView = view;

  photoScreen.classList.toggle("is-message", view === "message");
  photoMessage.hidden = view !== "message";

  photoViewButtons.forEach((button) => {
    const isActive = button.dataset.photoView === view;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (view === "message" && refreshMessage) {
    updatePhotoMessage();
  }

  showPhotoControls();
}


function setPhotoDateVisible(isVisible) {
  photoDateVisible = isVisible;

  photoDateStamp.hidden = !isVisible;
  photoScreen.classList.toggle("is-date-visible", isVisible);
  photoDateToggleButton.classList.toggle("is-active", isVisible);
  photoDateToggleButton.setAttribute(
    "aria-pressed",
    String(isVisible)
  );

  if (isVisible) {
    updateClock();
  }

  showPhotoControls();
}

function togglePhotoDate() {
  setPhotoDateVisible(!photoDateVisible);
}

function togglePhotoTheme() {
  const isDark = photoScreen.classList.toggle("is-dark");

  photoThemeButton.setAttribute("aria-pressed", String(isDark));
  photoThemeLabel.textContent = isDark ? "LIGHT" : "DARK";
  showPhotoControls();
}

function openPhotoMode() {
  if (photoCloseTimerId) {
    window.clearTimeout(photoCloseTimerId);
    photoCloseTimerId = null;
  }

  photoModeActive = true;
  stopIdleTimer();

  document.body.classList.add("photo-mode-active");
  photoScreen.hidden = false;
  photoScreen.classList.remove(
    "is-open",
    "controls-hidden",
    "is-dark",
    "is-message",
    "is-date-visible"
  );

  photoThemeButton.setAttribute("aria-pressed", "false");
  photoThemeLabel.textContent = "DARK";
  setPhotoView("logo", { refreshMessage: false });
  setPhotoDateVisible(false);
  updateClock();

  window.requestAnimationFrame(() => {
    photoScreen.classList.add("is-open");
  });

  showPhotoControls();
}

function closePhotoMode() {
  if (!photoModeActive) return;

  photoModeActive = false;
  clearPhotoControlsTimer();
  photoScreen.classList.remove("is-open");
  document.body.classList.remove("photo-mode-active");

  photoCloseTimerId = window.setTimeout(() => {
    photoScreen.hidden = true;
    photoCloseTimerId = null;
  }, 240);

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

    if (currentModeKey) {
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

      if (action.intenseHeartbeat) {
        triggerPrivateHeartbeat();
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

function enterMode(modeKey) {
  const mode = modes[modeKey];

  clearPendingEnd();
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

  renderActions(modeKey);
  startElapsedTimer();
  startIdleTimer();
  typeMessage(takeRandom(`${modeKey}-start`, mode.start));
  triggerGlitch();
}

function returnToMenu(showMessage = true) {
  clearPendingEnd();
  returnHomeAfterTyping = false;
  currentModeKey = null;
  document.body.classList.remove(
    "private-session-active",
    "private-heartbeat-intense",
    "sleep-session-active"
  );
  sessionStartedAt = null;

  stopElapsedTimer();
  stopIdleTimer();

  elapsedTime.textContent = "00:00";
  modePanel.hidden = true;
  menuPanel.hidden = false;

  if (showMessage) {
    typeMessage(
      "最初の画面へ戻りました。舞子、次はどの時間を私に預けますか。"
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

photoModeButton.addEventListener("click", () => {
  openPhotoMode();
});

photoCloseButton.addEventListener("click", (event) => {
  event.stopPropagation();
  closePhotoMode();
});

photoThemeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePhotoTheme();
});

photoViewButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const view = button.dataset.photoView;

    if (view === "message" && currentPhotoView === "message") {
      updatePhotoMessage();
      showPhotoControls();
      return;
    }

    setPhotoView(view);
  });
});

photoDateToggleButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePhotoDate();
});

photoControls.addEventListener("click", (event) => {
  event.stopPropagation();
});

photoStage.addEventListener("click", () => {
  if (photoScreen.classList.contains("controls-hidden")) {
    showPhotoControls();
  } else {
    hidePhotoControls();
  }
});

photoScreen.addEventListener("click", (event) => {
  if (
    event.target.closest(".photo-ui") ||
    event.target.closest("#photoStage")
  ) {
    return;
  }

  if (photoScreen.classList.contains("controls-hidden")) {
    showPhotoControls();
  } else {
    hidePhotoControls();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (sleepModeActive) {
    exitSleepDisplay();
    return;
  }

  if (photoModeActive) {
    closePhotoMode();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopIdleTimer();
    return;
  }

  updateClock();

  if (!photoModeActive && !sleepModeActive) {
    startIdleTimer();
  }
});

window.addEventListener("error", (event) => {
  console.error("with L encountered an error:", event.error);
});

createParticles();
updateClock();

typeMessage(takeRandom("initial", initialMessages));
startIdleTimer();

window.setInterval(updateClock, 1000);

window.setInterval(() => {
  if (
    !photoModeActive &&
    !sleepModeActive &&
    Math.random() > 0.68
  ) {
    triggerGlitch();
  }
}, 9000);
