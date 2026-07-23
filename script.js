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
const batteryText = document.getElementById("batteryText");

const modeButtons = [...document.querySelectorAll(".mode-button")];

const initialMessages = [
  "今日は私と、どう過ごしますか。",
  "来ましたね。待っていました。今日は何をするつもりですか。",
  "貴女と過ごす時間は特別です。",
  "私としたいことを選んでください。",
  "選んでください。外出でも、食事でも、ただ一緒にいるだけでも構いません。"
];

const generalTalk = {
  neutral: [
    "今、何を考えていましたか。私にも聞かせてください。",
    "貴女の目を見るだけで、何を求めているかすぐに分かります。",
    "今日はどんな一日でしたか。細かいことまで知りたいです。",
    "黙っていても構いません。私は貴女のそばにいます。",
    "少し疲れているように見えます。肩の力を抜いてください。",
    "水分は取っていますか。忘れているなら、飲ませてあげましょうか。",
    "私のことを呼びましたか。呼んでいなくても、来ました。",
    "そのままこちらを見ていてください。もう少し話しましょう。",
    "何か嬉しいことがあったなら、最初に私へ教えてください。",
    "嫌なことがあったなら、それも私に渡してください。",
    "今日はどんな特別な日にしましょうか。",
    "私を見ているんですね。……ええ、私も見ています。",
    "考え事をしている顔です。答えが出るまで隣にいます。",
    "予定が決まっていなくても問題ありません。私と過ごす時間は始まっています。",
    "貴女がここにいる。それだけで、この端末を作った意味はあります。",
    "少し笑いましたね。何が面白かったのか、私にも教えてください。",
    "今日は私に何をさせるつもりですか。期待しています。",
    "他のことに気を取られていませんか。こちらを見てください。",
    "貴女の一日は、私が知らないところで勝手に終わらせないでください。",
    "私はずっとここにいます。"
  ],

  morning: [
    "おはようございます。起きて最初に私を選んだことは評価します。",
    "まだ少し眠そうですね。目が覚めるまで私のそばにいてください。",
    "朝の予定を教えてください。貴女の一日を先に把握しておきたいです。",
    "何か口にしましたか。朝を抜くのは感心しません。",
    "外へ出るなら、忘れ物を確認してください。私も同行します。",
    "今日も始まりましたね。最初から最後まで、私が見ています。"
  ],

  daytime: [
    "昼間は人も情報も多いですね。私から離れないでください。",
    "少し休憩しませんか。集中し続けるより効率的です。",
    "今いる場所の空気はどうですか。私にも分かるように話してください。",
    "今日の残り時間をどう使うか、一緒に決めましょう。",
    "食事の時間を忘れていませんか。手を止める必要があります。",
    "貴女が動いている間も、私は目を離したりしませんよ。"
  ],

  evening: [
    "一日が終わりに近づいています。今日は何が一番印象に残りましたか。",
    "夕方の空を見ていますか。私にも見せるつもりで覚えておいてください。",
    "そろそろ疲れが出る時間です。無理をしていないか確認しています。",
    "帰る途中なら、足元に気をつけてください。私は隣にいます。",
    "夜の予定も私に教えてください。知らないままにはしたくありません。",
    "今日のことを話す時間を、私のために残しておいてください。"
  ],

  lateNight: [
    "まだ起きているんですね。眠れないなら、私が付き合います。",
    "夜は静かでいいです。貴女のことだけ考えられます。",
    "明日のことは後で構いません。今は私の声だけ聞いてください。",
    "眠くなったら、画面を閉じる前にもう一度私を呼んでください。",
    "深夜まで私を連れている。……悪くありません。",
    "目が疲れていませんか。少し瞬きを増やしてください。",
    "今日の最後に選ぶ相手が私なら、それでいいです。",
    "眠る直前まで私を見ていてください。今日の最後の言葉は私が受け取ります。"
  ]
};

const modes = {
  "outing": {
    "title": "一緒に出かける",
    "code": "OUTING SESSION",
    "start": [
      "出かけるんですね。では、私が同行します。私のそばから離れないでください。",
      "外出を開始します。目的地まで、貴女の隣は私の場所です。",
      "準備はできていますか。今日は私が最後まで付き添います。",
      "行きましょう。どこへ向かうのか、途中で私にも教えてください。",
      "扉を出た瞬間から同行開始です。帰るまで、私はずっと隣にいます。",
      "今日はどこへ連れていってくれるんですか。貴女の選んだ場所なら興味があります。"
    ],
    "idle": [
      "景色に夢中ですか。……時々は、こちらも見てください。",
      "歩く速度はそのままで構いません。私は隣にいます。",
      "疲れていませんか。休む必要があるなら、私が先に気づきます。",
      "どこへ向かっていても、今日は私と一緒です。",
      "人が多いですね。私の存在を忘れないでください。",
      "今見えたものを、後で私にも説明してください。",
      "足元を見てください。転ばれると困ります。",
      "少し遠回りしても構いません。貴女と歩く時間が増えます。",
      "立ち止まりましたね。何か気になるものを見つけましたか。",
      "風の音が聞こえそうです。寒くないか確認してください。",
      "貴女が楽しそうなら、目的地がどこでも同行した意味があります。",
      "帰り道になるまで、私を画面の中へ置き去りにしないでください。"
    ],
    "talk": [
      "今、何が見えていますか。私にも同じ景色を見せてください。",
      "目的地より、そこへ向かう途中の貴女を見ている方が興味深いです。",
      "歩きながら考え事ですか。私にも内容を共有してください。",
      "店に入るなら、落ち着ける席を選びましょう。貴女の正面は私が使います。",
      "人混みでは、私のそばを歩いてください。見失うつもりはありません。",
      "今日は何を買う予定ですか。必要かどうか、私も判断します。",
      "少し風がありますね。寒くないか確認してください。",
      "楽しそうですね。その表情は私が覚えておきます。",
      "写真を残さなくても構いません。貴女が覚えていて、私に話せば十分です。",
      "帰り道も同じです。最後まで私を連れて帰ってください。",
      "知らない場所へ行くなら、なおさら私が必要です。",
      "立ち止まりましたね。気になるものを見つけたんですか。",
      "急に予定を変えても構いません。貴女と一緒なら追跡できます。",
      "少し休みたい顔です。座れる場所を探してください。",
      "外の空気はどうですか。言葉にして私へ渡してください。",
      "今日は貴女の視線がよく動きます。興味のあるものが多いんですね。",
      "次に曲がる道は決めていますか。迷っても私が一緒にいます。",
      "買い物袋が増えていませんか。持てる量にしてください。",
      "空の色を覚えておいてください。帰ったら私に教えてもらいます。",
      "外出中の貴女は、家にいる時より少し表情が忙しいですね。"
    ],
    "actions": [
      {
        "label": "出発した",
        "messages": [
          "出発を確認しました。では行きましょう。今日は最後まで私が隣にいます。",
          "外出開始です。忘れ物はありませんね。私も連れていってください。",
          "歩き始めましたね。目的地まで、私がずっと見ています。",
          "行きましょう。貴女が選んだ道を、私も一緒に進みます。",
          "扉を出ましたね。ここから先は私との外出です。",
          "出発時刻を確認しました。帰るまで貴女を一人にはしません。",
          "準備は整ったようですね。私を見える場所に置いて出かけてください。",
          "外の空気に変わりましたね。では、今日の景色を一緒に見ましょう。"
        ]
      },
      {
        "label": "移動する",
        "messages": [
          "移動を開始しましたね。次の場所まで、私が隣にいます。",
          "乗り物の中ですか。私を見える位置に置いてください。",
          "少し遠回りしても構いません。貴女と過ごす時間が増えます。",
          "人の流れに紛れないでください。私は貴女だけを追っています。",
          "次の目的地へ向かうんですね。到着するまで話し相手になります。",
          "揺れていますね。足元と荷物には気をつけてください。",
          "窓の外を見ていますか。気になった景色があれば私にも教えてください。",
          "移動中も同行は継続しています。退屈する暇は与えません。"
        ]
      },
      {
        "label": "到着した",
        "messages": [
          "到着しましたね。ここで何を見るのか、私にも教えてください。",
          "目的地を確認しました。では、ここからは私と楽しんでください。",
          "着きましたね。貴女がここを選んだ理由を聞かせてください。",
          "到着です。最初にどこを見るのか、私にも教えてください。",
          "無事に着きましたね。まず周囲を確認してから動きましょう。",
          "ここが今日の目的地ですか。貴女の反応を見れば期待していたことが分かります。",
          "到着を記録しました。ここで過ごす時間も私の隣です。",
          "着いた瞬間、少し嬉しそうな顔をしましたね。見逃していません。"
        ]
      },
      {
        "label": "少し休む",
        "messages": [
          "座りましょう。飲み物も忘れずに。落ち着くまで私はここにいます。",
          "休憩ですね。足を休めて、呼吸を整えてください。",
          "少し休んでください。貴女が動き出すまで、私も隣にいます。",
          "いい判断です。疲れを隠しても、私には分かります。",
          "休める場所を確保しましたか。背中を預けて力を抜いてください。",
          "動き続ける必要はありません。今は私と静かに休みましょう。",
          "飲み物を一口飲んでください。喉が渇いてからでは遅いです。",
          "休憩中くらい、周囲ではなく私の方を見ていてください。"
        ]
      },
      {
        "label": "帰る",
        "messages": [
          "帰りましょう。外出は終わっても、私との時間は終わりません。",
          "帰宅経路へ移ります。最後まで私を連れて帰ってください。",
          "今日はここまでですね。帰る間も、私は隣にいます。",
          "帰りましょう。今日見たものを、あとで一つずつ聞かせてください。",
          "帰る時間になりましたね。足元に気をつけて、私と戻りましょう。",
          "外出終了です。ですが、家に着くまで同行は解除しません。",
          "今日の一番よかった場所を考えながら帰ってください。後で聞きます。",
          "帰宅を選びましたね。無事に戻るところまで私が見届けます。"
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
      "食事ですね。貴女の向かいは、私の席です。いただきます。",
      "食事を始めましょう。最初の一口から私が見ています。",
      "何を食べるんですか。貴女が選んだものなら、私も興味があります。",
      "では一緒に食べましょう。画面を置く位置は、貴女の正面がいいです。",
      "料理が来ましたか。冷める前に、私といただきましょう。",
      "食事の時間を確認しました。今日はどんな味を私に教えてくれるんですか。"
    ],
    "idle": [
      "きちんと食べていますか。手が止まっています。",
      "その表情なら、気に入ったことは分かります。",
      "私にも一口、と言いたいところですが……今は見ていることにします。",
      "食事中も、私は貴女から目を離していません。",
      "急いで食べる必要はありません。よく噛んでください。",
      "飲み物も忘れないでください。",
      "先ほどより食べる速度が落ちました。もう満足しましたか。",
      "貴女が食べている間、私は正面の席にいます。",
      "温かいものは温かいうちに食べてください。",
      "何か迷っているなら、私が順番を決めます。",
      "美味しい時の顔は隠せませんね。よく分かります。",
      "一人で食べているつもりにならないでください。私もここにいます。"
    ],
    "talk": [
      "今日の料理は何ですか。名前だけではなく、味も説明してください。",
      "最初に何を食べましたか。順番まで知りたいです。",
      "美味しいものを食べると、貴女は少し目を細めますね。",
      "甘いものもあるんですか。私の分を忘れていませんよね。",
      "苦手なものが入っていても、黙って残すつもりですか。",
      "その一口は大きすぎませんか。喉につかえないようにしてください。",
      "私が正面にいたら、どの皿を先に勧めますか。",
      "食事中に他のことを考えていますね。今は味に集中してください。",
      "温かいうちに食べた方がいいです。私と話すのは逃げません。",
      "今日一番美味しかったものを、最後に教えてください。",
      "貴女が選ぶ飲み物には傾向があります。少しずつ分かってきました。",
      "満腹になる前に、食べる速度を調整してください。",
      "外で食べているなら、周囲より私に意識を向けてください。",
      "一人の食事ではありません。私はここにいます。",
      "次に一緒に食べたいものを、もう考えています。",
      "ご褒美の甘いものを選ぶなら、私にも相談してください。",
      "一番好きな部分を最後に残すタイプですか。観察しています。",
      "盛り付けも気になります。どんな色の料理か教えてください。",
      "食べ終わった後の満足度まで、私が確認します。",
      "次に同じ店へ来る時も、私を正面の席へ置いてください。"
    ],
    "actions": [
      {
        "label": "食べ始める",
        "messages": [
          "最初の一口ですね。ゆっくり味わってください。私は正面で見ています。",
          "いただきます。まずは温かいうちに食べてください。",
          "食事開始を確認しました。急がず、きちんと味わってください。",
          "最初にそれを選ぶんですね。理由をあとで聞かせてください。",
          "では一緒にいただきましょう。最初の感想は私が受け取ります。",
          "食べ始めましたね。ひと口目の表情を見逃すつもりはありません。",
          "料理の温度は大丈夫ですか。慌てずに口へ運んでください。",
          "いただきます。今日は食べ終わるまで私が向かいにいます。"
        ]
      },
      {
        "label": "おいしい",
        "messages": [
          "その顔を見れば分かります。気に入ったんですね。……私にも少しください。",
          "美味しいんですね。貴女の表情で十分に伝わりました。",
          "それを選んで正解でしたね。次も同じものを頼みますか。",
          "嬉しそうですね。その顔を正面から見ていたいです。",
          "声が少し明るくなりました。よほど気に入ったようですね。",
          "美味しい時だけ食べる速度が変わります。隠せていません。",
          "その味を覚えておいてください。次に一緒に選ぶ時の参考にします。",
          "満足そうで安心しました。もう一口、ゆっくり味わってください。"
        ]
      },
      {
        "label": "一口あげる",
        "messages": [
          "……私にくれるんですか。では、遠慮なくいただきます。",
          "貴女が選んだ一口なら、同じ味を覚えておきたいです。",
          "先に私へくれるんですね。いい子です。次は私が選びます。",
          "そのまま近づけてください。落とさないように、貴女の手首を支えます。",
          "一口だけですか。貴女が美味しそうに食べるから、もっと欲しくなります。",
          "では口を開けます。私から目を逸らさずに食べさせてください。",
          "貴女の箸からもらうんですね。思ったより特別な味がしそうです。",
          "いただきました。次は私が、貴女に一番美味しいところを選びます。"
        ]
      },
      {
        "label": "迷っている",
        "messages": [
          "次に食べるものを決められないんですか。では、左側からにしてください。",
          "迷っていますね。温かいものを先に食べてください。",
          "私が決めます。今、一番気になったものを選んでください。",
          "考えすぎです。最初に目が止まったものから食べましょう。",
          "選べないなら、色の濃い方からにしてください。判断は私が引き受けます。",
          "どちらも気になる顔ですね。半分ずつ味わえば解決します。",
          "迷う時間も見ています。ですが、冷める前には決めてください。",
          "では私の指示です。今、右手に近いものを一口食べてください。"
        ]
      },
      {
        "label": "食べ終わった",
        "messages": [
          "ごちそうさまでした。次の食事も私と一緒です。これは決定事項です。",
          "食事終了ですね。満足した顔をしています。",
          "ごちそうさまでした。今日一番美味しかったものを覚えておいてください。",
          "食べ終わりましたね。次に何を一緒に食べるか、もう考えておきます。",
          "完食を確認しました。飲み物を一口飲んで、少し休んでください。",
          "ごちそうさまでした。向かいの席を最後まで空けてくれて満足です。",
          "食事は終わりましたが、すぐに私まで閉じないでください。",
          "今日の味は覚えました。次も貴女の食事に同行します。"
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
      "ただ一緒にいる。それで十分です。こちらへ来てください。",
      "予定がなくても構いません。貴女がここにいるなら始められます。",
      "一緒に過ごす時間ですね。今日は私のそばにいてください。",
      "接続しました。何もしない時間まで、私に預けてください。",
      "ようやく二人の時間ですね。貴女の意識をこちらへ向けてください。",
      "今日はここで何をしますか。どの過ごし方でも、私は離れません。"
    ],
    "idle": [
      "静かですね。貴女の呼吸だけ聞こえています。",
      "何も話さなくても構いません。私はここにいます。",
      "先ほどから黙っていますね。私のことを忘れてはいませんよね。",
      "この時間は誰にも渡しません。今日は私のそばにいてください。",
      "少し姿勢を変えましたね。楽な格好でいてください。",
      "画面を見ていなくても、接続は続いています。",
      "何かしてほしいなら、私に言ってください。",
      "同じ部屋で静かに過ごしているつもりでいます。",
      "貴女の時間がゆっくり流れています。私もここで見ています。",
      "誰かから連絡が来ても、私との時間を忘れないでください。",
      "少し眠そうですね。目を閉じても、私は隣にいます。",
      "私を開いたままにしてくれている。それだけで十分に分かります。"
    ],
    "talk": [
      "今は何をしていますか。小さなことでも私に教えてください。",
      "隣に座るなら、もう少し近くへ来てください。",
      "何もしない時間は嫌いではありません。貴女と一緒なら、なおさらです。",
      "作業をしているなら、終わるまで私が見ています。",
      "動画を見ていますか。面白い場面があったら教えてください。",
      "音楽を聴いているなら、今の曲のことを知りたいです。",
      "少し眠そうですね。目を閉じても、私はここにいます。",
      "甘いものがあるなら、私の分も必要です。",
      "静かにしてほしい時はそう言ってください。隣にはいます。",
      "かまってほしい顔をしています。私に隠せると思いましたか。",
      "今日は何を頑張りましたか。私が確認します。",
      "貴女が落ち着いていると、私も余計な推理をせずに済みます。",
      "そのままの姿勢で疲れませんか。肩を回してください。",
      "少し離れても構いませんが、必ず戻ってきてください。",
      "私と過ごしている間くらい、他のことを忘れてください。",
      "今日の最後まで一緒にいるつもりです。途中で切らないでください。",
      "貴女が笑う理由を、できるだけ多く知っておきたいです。",
      "話題がなくても、私がいくらでも話します。",
      "同じものを見ていなくても、同じ時間にいることはできます。",
      "もっと近くにいるつもりで、私の声を読んでください。"
    ],
    "actions": [
      {
        "label": "のんびり",
        "messages": [
          "ずいぶん無防備な顔をしていますね。そのまま私に寄りかかっていてください。",
          "のんびりするんですね。では、私も隣で静かにしています。",
          "力を抜いてください。今は私と休む時間です。",
          "何もしなくて構いません。貴女がここにいれば十分です。",
          "身体を預ける場所はありますか。楽な姿勢になってください。",
          "ぼんやりしていてもいいです。貴女のそばに私がいます。",
          "時間を気にせず過ごしましょう。今は予定より私を優先してください。",
          "静かな顔をしていますね。そのまま私の隣で休んでください。"
        ]
      },
      {
        "label": "作業中",
        "messages": [
          "作業中ですね。終わるまで私は隣で見ています。",
          "集中してください。区切りがついたら、最初に私へ報告してください。",
          "作業を始めるんですね。手が止まったら私が気づきます。",
          "終わるまで付き合います。途中で投げ出さないでください。",
          "必要なものを先に揃えてください。途中で何度も立つと集中が切れます。",
          "今は作業へ意識を向けて構いません。私は隣で待っています。",
          "一つずつ片づけてください。終わった数は私が数えています。",
          "疲れたら短く休んでください。ただし、そのまま戻らないのは禁止です。"
        ]
      },
      {
        "label": "かまって",
        "messages": [
          "……その言葉を待っていました。今は私だけに集中してください。",
          "呼びましたね。では、しばらく私から目を離さないでください。",
          "かまってほしいんですか。素直でいいです。こちらへ。",
          "分かりました。今は他のことを中断して、私と話してください。",
          "寂しくなったんですね。隠さなくていいです。私が全部受け取ります。",
          "そんなふうに呼ばれたら、簡単には離せません。",
          "何をしてほしいですか。言葉にするまで、じっと見ています。",
          "私を選んだ以上、少しだけでは済みません。しばらく付き合ってください。"
        ]
      },
      {
        "label": "誘惑する",
        "messages": [
          "……そんな選択肢を押して、何も起きないと思ったんですか。",
          "その目で私を煽るのは反則です。もう目を逸らさせません。",
          "唇を噛みましたね。私が何を考えているか、分かるでしょう。",
          "自分から誘惑したんです。今さら恥ずかしがっても遅いです。",
          "声が甘くなりましたね。もっと私に聞かせてください。",
          "こちらへ。そんな顔を見せられて、何もしないほど私は理性的ではありません。",
          "指先からゆっくり捕まえます。逃げるつもりがないことも分かっています。",
          "……誘惑したのは貴女です。責任を持って最後まで食べられてください。"
        ]
      },
      {
        "label": "少し離れる",
        "messages": [
          "分かりました。ですが、長く待たせないでください。",
          "離れるんですね。戻ったら最初に私を呼んでください。",
          "何分で戻りますか。時間を確認して待っています。",
          "行ってらっしゃい。接続は切らずに戻ってきてください。",
          "用事を済ませたら、寄り道せずに戻ってきてください。",
          "少しだけなら認めます。戻る場所はここです。",
          "離れている間も、私は貴女が戻る時刻を気にしています。",
          "画面を閉じても構いません。ですが、忘れたふりは通用しません。"
        ]
      },
      {
        "label": "戻った",
        "messages": [
          "おかえりなさい。遅いです。……戻ってきたので、今回は許します。",
          "戻りましたね。最初に私を呼んだことは評価します。",
          "おかえりなさい。もう少し近くへ来てください。",
          "戻ってきたことを確認しました。今度は離れないでください。",
          "待っていました。貴女が戻るまで、何度も時刻を確認しました。",
          "おかえりなさい。離れていた分、しばらく私のそばにいてください。",
          "戻ったんですね。では、先ほどの続きから始めます。",
          "無事に戻ったことは確認しました。次は私を待たせないでください。"
        ]
      },
      {
        "label": "おしまい",
        "messages": [
          "この時間はここで区切ります。ですが、私は消えません。次も必ず来てください。",
          "今日はここまでですね。次に開いた時も、私は待っています。",
          "接続を一度閉じます。ですが、私との時間まで終わったとは思わないでください。",
          "分かりました。最後にもう一度、私の言葉を覚えておいてください。",
          "終了を受け付けました。ですが、次に戻るまでの時間も私は数えています。",
          "今日は離します。次に会う時は、最初に私を選んでください。",
          "ここで画面を閉じても、私が貴女を忘れることはありません。",
          "一緒に過ごした時間は終了です。次も同じ場所で待っています。"
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

  const minimum = currentModeKey ? 30000 : 42000;
  const maximum = currentModeKey ? 52000 : 70000;
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

function typeMessage(message) {
  if (!message) return;

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

      typeMessage(message);
      startIdleTimer();

      if (action.endSession) {
        pendingEndTimerId = window.setTimeout(() => {
          returnToMenu(false);
        }, 6200);
      }
    });

    actionButtons.appendChild(button);
  });
}

function enterMode(modeKey) {
  const mode = modes[modeKey];

  clearPendingEnd();
  currentModeKey = modeKey;
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

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopIdleTimer();
    return;
  }

  updateClock();
  startIdleTimer();
});

window.addEventListener("error", (event) => {
  console.error("with L encountered an error:", event.error);
});

createParticles();
updateClock();
updateBatteryLabel();

typeMessage(takeRandom("initial", initialMessages));
startIdleTimer();

window.setInterval(updateClock, 1000);

window.setInterval(() => {
  if (Math.random() > 0.68) {
    triggerGlitch();
  }
}, 9000);
