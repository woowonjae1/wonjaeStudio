"use client";

// 发音技巧类型
export type SkillCategory =
  | "linking"
  | "plosive"
  | "weak-forms"
  | "intonation"
  | "stress";

// 练习例句
export interface PracticeExample {
  text: string;
  phonetic: string;
  explanation: string;
  explanationCn: string;
}

// 发音技巧
export interface PronunciationSkill {
  id: string;
  category: SkillCategory;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  rules: {
    rule: string;
    ruleCn: string;
    examples: PracticeExample[];
  }[];
  practiceExamples: PracticeExample[];
}

// 分类信息
export const SKILL_CATEGORIES: {
  id: SkillCategory;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
}[] = [
  {
    id: "linking",
    title: "Linking",
    titleCn: "连读",
    description: "Connect words smoothly",
    descriptionCn: "让单词之间平滑连接",
  },
  {
    id: "plosive",
    title: "Plosive Loss",
    titleCn: "失去爆破",
    description: "Soften explosive sounds",
    descriptionCn: "弱化爆破音",
  },
  {
    id: "weak-forms",
    title: "Weak Forms",
    titleCn: "弱读",
    description: "Reduce unstressed words",
    descriptionCn: "弱化非重读词",
  },
  {
    id: "intonation",
    title: "Intonation",
    titleCn: "语调",
    description: "Master pitch patterns",
    descriptionCn: "掌握音高变化",
  },
  {
    id: "stress",
    title: "Stress",
    titleCn: "重音",
    description: "Emphasize the right syllables",
    descriptionCn: "强调正确的音节",
  },
];

// 发音技巧数据
export const PRONUNCIATION_SKILLS: PronunciationSkill[] = [
  // ========== 连读 Linking ==========
  {
    id: "linking-cv",
    category: "linking",
    title: "Consonant + Vowel Linking",
    titleCn: "辅音+元音连读",
    description:
      "When a word ends with a consonant and the next word starts with a vowel, they link together smoothly.",
    descriptionCn:
      "当一个单词以辅音结尾，下一个单词以元音开头时，它们会连在一起发音。",
    rules: [
      {
        rule: "Final consonant + initial vowel = smooth connection",
        ruleCn: "尾辅音 + 首元音 = 平滑连接",
        examples: [
          {
            text: "an apple",
            phonetic: "/ən ˈæpəl/ → /ə-ˈnæpəl/",
            explanation: "The 'n' connects to 'a' in apple",
            explanationCn: "n连接到apple的a",
          },
          {
            text: "turn off",
            phonetic: "/tɜːn ɒf/ → /tɜː-nɒf/",
            explanation: "The 'n' links to 'o'",
            explanationCn: "n连接到o",
          },
          {
            text: "look at it",
            phonetic: "/lʊk æt ɪt/ → /lʊ-kæ-tɪt/",
            explanation: "k→a, t→i all link",
            explanationCn: "k连a，t连i",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "Pick it up",
        phonetic: "/pɪ-kɪ-tʌp/",
        explanation: "Three words become one flow",
        explanationCn: "三个词连成一体",
      },
      {
        text: "Not at all",
        phonetic: "/nɒ-tə-tɔːl/",
        explanation: "t links to a, t links to a",
        explanationCn: "t连接到a，t连接到a",
      },
      {
        text: "Come on in",
        phonetic: "/kʌ-mɒ-nɪn/",
        explanation: "m links to o, n links to i",
        explanationCn: "m连o，n连i",
      },
      {
        text: "Check it out",
        phonetic: "/tʃe-kɪ-taʊt/",
        explanation: "k links to i, t links to ou",
        explanationCn: "k连i，t连ou",
      },
      {
        text: "What is it",
        phonetic: "/wɒ-tɪ-zɪt/",
        explanation: "t links to i, s links to i",
        explanationCn: "t连i，s连i",
      },
      {
        text: "I need a cup of coffee",
        phonetic: "/aɪ niː-də kʌ-pəv kɒfi/",
        explanation: "d→a, p→of all link smoothly",
        explanationCn: "d连a，p连of",
      },
      {
        text: "Turn off the light and go to bed",
        phonetic: "/tɜː-nɒf ðə laɪ-tən gəʊ tə bed/",
        explanation: "Multiple linking points",
        explanationCn: "多处连读",
      },
      {
        text: "I'll think about it and let you know",
        phonetic: "/aɪl θɪŋ-kəbaʊ-tɪ-tən le-tju nəʊ/",
        explanation: "Complex sentence with many links",
        explanationCn: "复杂句子多处连读",
      },
      {
        text: "Can I have a glass of water please",
        phonetic: "/kə-naɪ hæ-və glɑː-səv wɔːtə pliːz/",
        explanation: "Natural request with smooth flow",
        explanationCn: "自然请求句的流畅连读",
      },
      {
        text: "What are you up to this afternoon",
        phonetic: "/wɒ-tɑː-jʊ ʌp tə ðɪ-sɑːftənuːn/",
        explanation: "Casual question linking",
        explanationCn: "日常问句连读",
      },
    ],
  },
  {
    id: "linking-same",
    category: "linking",
    title: "Same Consonant Linking",
    titleCn: "同辅音省略",
    description:
      "When the same consonant appears at the end of one word and the start of the next, pronounce it once but hold it slightly longer.",
    descriptionCn:
      "当相同的辅音出现在一个词的结尾和下一个词的开头时，只发一次音但稍微延长。",
    rules: [
      {
        rule: "Same consonant = one longer sound",
        ruleCn: "相同辅音 = 一个较长的音",
        examples: [
          {
            text: "black coffee",
            phonetic: "/blæk ˈkɒfi/ → /blæ-ˈkɒfi/",
            explanation: "Two 'k' sounds become one",
            explanationCn: "两个k音合并为一个",
          },
          {
            text: "bus stop",
            phonetic: "/bʌs stɒp/ → /bʌ-stɒp/",
            explanation: "Two 's' sounds merge",
            explanationCn: "两个s音合并",
          },
          {
            text: "good day",
            phonetic: "/gʊd deɪ/ → /gʊ-deɪ/",
            explanation: "Two 'd' sounds merge",
            explanationCn: "两个d音合并",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "some money",
        phonetic: "/sʌ-mʌni/",
        explanation: "m+m merge",
        explanationCn: "m+m合并",
      },
      {
        text: "hot tea",
        phonetic: "/hɒ-tiː/",
        explanation: "t+t merge",
        explanationCn: "t+t合并",
      },
      {
        text: "big girl",
        phonetic: "/bɪ-gɜːl/",
        explanation: "g+g merge",
        explanationCn: "g+g合并",
      },
      {
        text: "bad dog",
        phonetic: "/bæ-dɒg/",
        explanation: "d+d merge",
        explanationCn: "d+d合并",
      },
      {
        text: "fish shop",
        phonetic: "/fɪ-ʃɒp/",
        explanation: "sh+sh merge",
        explanationCn: "sh+sh合并",
      },
      {
        text: "I need to get to the bus stop before it leaves",
        phonetic: "/aɪ niːd tə ge-tə ðə bʌ-stɒp bɪfɔː-rɪt liːvz/",
        explanation: "Multiple same consonant links",
        explanationCn: "多处同辅音连读",
      },
      {
        text: "She took Karen's car to the park",
        phonetic: "/ʃi tʊ-kærənz kɑː tə ðə pɑːk/",
        explanation: "k+k merge naturally",
        explanationCn: "k+k自然合并",
      },
      {
        text: "I'll call Linda later this afternoon",
        phonetic: "/aɪl kɔː-lɪndə leɪtə ðɪ-sɑːftənuːn/",
        explanation: "l+l merge smoothly",
        explanationCn: "l+l平滑合并",
      },
      {
        text: "The red door was locked",
        phonetic: "/ðə re-dɔː wəz lɒkt/",
        explanation: "d+d merge in natural speech",
        explanationCn: "d+d在自然语流中合并",
      },
      {
        text: "We need more room for the meeting",
        phonetic: "/wi niː-mɔː ruːm fə ðə miːtɪŋ/",
        explanation: "d+m and r+r patterns",
        explanationCn: "d+m和r+r模式",
      },
    ],
  },
  {
    id: "linking-intrusion",
    category: "linking",
    title: "Intrusive Sounds",
    titleCn: "加音现象",
    description:
      "When two vowel sounds meet, native speakers often add a small /w/, /j/, or /r/ sound to connect them.",
    descriptionCn:
      "当两个元音相遇时，母语者通常会加入一个小的 /w/、/j/ 或 /r/ 音来连接。",
    rules: [
      {
        rule: "/uː/, /əʊ/, /aʊ/ + vowel → add /w/",
        ruleCn: "/uː/, /əʊ/, /aʊ/ + 元音 → 加 /w/",
        examples: [
          {
            text: "go away",
            phonetic: "/gəʊ əˈweɪ/ → /gəʊ-wə-ˈweɪ/",
            explanation: "Add /w/ between 'go' and 'away'",
            explanationCn: "在go和away之间加/w/",
          },
          {
            text: "do it",
            phonetic: "/duː ɪt/ → /duː-wɪt/",
            explanation: "Add /w/ after 'do'",
            explanationCn: "在do后加/w/",
          },
        ],
      },
      {
        rule: "/iː/, /eɪ/, /aɪ/, /ɔɪ/ + vowel → add /j/",
        ruleCn: "/iː/, /eɪ/, /aɪ/, /ɔɪ/ + 元音 → 加 /j/",
        examples: [
          {
            text: "I am",
            phonetic: "/aɪ æm/ → /aɪ-jæm/",
            explanation: "Add /j/ between 'I' and 'am'",
            explanationCn: "在I和am之间加/j/",
          },
          {
            text: "she is",
            phonetic: "/ʃiː ɪz/ → /ʃiː-jɪz/",
            explanation: "Add /j/ after 'she'",
            explanationCn: "在she后加/j/",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "two eggs",
        phonetic: "/tuː-wegz/",
        explanation: "Add /w/ sound",
        explanationCn: "加/w/音",
      },
      {
        text: "the end",
        phonetic: "/ðiː-jend/",
        explanation: "Add /j/ sound",
        explanationCn: "加/j/音",
      },
      {
        text: "how are you",
        phonetic: "/haʊ-wɑː-juː/",
        explanation: "Add /w/ sound",
        explanationCn: "加/w/音",
      },
      {
        text: "say it",
        phonetic: "/seɪ-jɪt/",
        explanation: "Add /j/ sound",
        explanationCn: "加/j/音",
      },
      {
        text: "blue eyes",
        phonetic: "/bluː-waɪz/",
        explanation: "Add /w/ sound",
        explanationCn: "加/w/音",
      },
      {
        text: "I always enjoy eating out with my friends",
        phonetic: "/aɪ-jɔːlweɪz ɪnˈdʒɔɪ-jɪːtɪŋ aʊt wɪð maɪ frendz/",
        explanation: "Multiple intrusive sounds",
        explanationCn: "多处加音",
      },
      {
        text: "She asked me to go out and buy some food",
        phonetic: "/ʃiː-jɑːskt miː tə gəʊ-waʊt ən baɪ sʌm fuːd/",
        explanation: "Natural intrusive /j/ and /w/",
        explanationCn: "自然的/j/和/w/加音",
      },
      {
        text: "Do I need to show any ID at the door",
        phonetic: "/duː-waɪ niːd tə ʃəʊ-weni aɪˈdiː-jət ðə dɔː/",
        explanation: "Complex intrusion pattern",
        explanationCn: "复杂加音模式",
      },
      {
        text: "The movie is about two hours long",
        phonetic: "/ðə muːvi-jɪz əbaʊt tuː-waʊəz lɒŋ/",
        explanation: "Multiple /w/ intrusions",
        explanationCn: "多处/w/加音",
      },
      {
        text: "Why are you always so early in the morning",
        phonetic: "/waɪ-jɑː juː-wɔːlweɪz səʊ-wɜːli ɪn ðə mɔːnɪŋ/",
        explanation: "Sentence with many intrusions",
        explanationCn: "多处加音的句子",
      },
    ],
  },
  // ========== 失去爆破 Plosive Loss ==========
  {
    id: "plosive-plosive",
    category: "plosive",
    title: "Plosive + Plosive",
    titleCn: "爆破音+爆破音",
    description:
      "When two plosive sounds (/p/, /b/, /t/, /d/, /k/, /g/) meet, the first one is not fully released.",
    descriptionCn:
      "当两个爆破音（/p/, /b/, /t/, /d/, /k/, /g/）相遇时，第一个不完全释放。",
    rules: [
      {
        rule: "First plosive: hold position, don't release air",
        ruleCn: "第一个爆破音：保持口型，不释放气流",
        examples: [
          {
            text: "good boy",
            phonetic: "/gʊd bɔɪ/ → /gʊ(d) bɔɪ/",
            explanation: "Hold 'd' position, release on 'b'",
            explanationCn: "保持d的口型，在b时释放",
          },
          {
            text: "that pen",
            phonetic: "/ðæt pen/ → /ðæ(t) pen/",
            explanation: "Hold 't' position, release on 'p'",
            explanationCn: "保持t的口型，在p时释放",
          },
          {
            text: "big dog",
            phonetic: "/bɪg dɒg/ → /bɪ(g) dɒg/",
            explanation: "Hold 'g' position, release on 'd'",
            explanationCn: "保持g的口型，在d时释放",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "hot day",
        phonetic: "/hɒ(t) deɪ/",
        explanation: "t is unreleased",
        explanationCn: "t不完全爆破",
      },
      {
        text: "red car",
        phonetic: "/re(d) kɑː/",
        explanation: "d is unreleased",
        explanationCn: "d不完全爆破",
      },
      {
        text: "stop talking",
        phonetic: "/stɒ(p) tɔːkɪŋ/",
        explanation: "p is unreleased",
        explanationCn: "p不完全爆破",
      },
      {
        text: "black bag",
        phonetic: "/blæ(k) bæg/",
        explanation: "k is unreleased",
        explanationCn: "k不完全爆破",
      },
      {
        text: "sit down",
        phonetic: "/sɪ(t) daʊn/",
        explanation: "t is unreleased",
        explanationCn: "t不完全爆破",
      },
      {
        text: "I had to get back to work before the meeting started",
        phonetic: "/aɪ hæ(d) tə ge(t) bæ(k) tə wɜː(k) bɪfɔː ðə miːtɪŋ stɑːtɪd/",
        explanation: "Multiple unreleased plosives",
        explanationCn: "多处不完全爆破",
      },
      {
        text: "The big black cat sat on the red carpet",
        phonetic: "/ðə bɪ(g) blæ(k) kæ(t) sæ(t) ɒn ðə re(d) kɑːpɪt/",
        explanation: "Chain of plosive combinations",
        explanationCn: "连续爆破音组合",
      },
      {
        text: "Could you please stop by the shop and pick up some bread",
        phonetic: "/kʊ(d) juː pliːz stɒ(p) baɪ ðə ʃɒ(p) ən pɪ(k) ʌp sʌm bred/",
        explanation: "Natural request with plosives",
        explanationCn: "自然请求句中的爆破音",
      },
      {
        text: "I thought that book was about a good detective story",
        phonetic: "/aɪ θɔː(t) ðæ(t) bʊ(k) wəz əbaʊ(t) ə gʊ(d) dɪtektɪv stɔːri/",
        explanation: "Complex sentence plosives",
        explanationCn: "复杂句子中的爆破音",
      },
      {
        text: "The old dog jumped up and grabbed the big bone",
        phonetic: "/ði əʊl(d) dɒ(g) dʒʌm(p)t ʌ(p) ən græ(b)d ðə bɪ(g) bəʊn/",
        explanation: "Story-like sentence with plosives",
        explanationCn: "叙述句中的爆破音",
      },
    ],
  },
  {
    id: "plosive-other",
    category: "plosive",
    title: "Plosive + Other Consonants",
    titleCn: "爆破音+其他辅音",
    description:
      "When a plosive is followed by another consonant (not a plosive), the plosive is often unreleased or very weak.",
    descriptionCn:
      "当爆破音后面跟着其他辅音（非爆破音）时，爆破音通常不释放或非常弱。",
    rules: [
      {
        rule: "Plosive + /s/, /f/, /θ/, /m/, /n/, /l/ = weak or no release",
        ruleCn: "爆破音 + /s/, /f/, /θ/, /m/, /n/, /l/ = 弱化或不释放",
        examples: [
          {
            text: "that thing",
            phonetic: "/ðæt θɪŋ/ → /ðæ(t) θɪŋ/",
            explanation: "'t' is barely heard before 'th'",
            explanationCn: "t在th前几乎听不到",
          },
          {
            text: "help me",
            phonetic: "/help miː/ → /hel(p) miː/",
            explanation: "'p' is weak before 'm'",
            explanationCn: "p在m前弱化",
          },
          {
            text: "kept silent",
            phonetic: "/kept saɪlənt/ → /kep(t) saɪlənt/",
            explanation: "'t' is weak before 's'",
            explanationCn: "t在s前弱化",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "next step",
        phonetic: "/nek(s)t step/",
        explanation: "t weakens before s",
        explanationCn: "t在s前弱化",
      },
      {
        text: "just now",
        phonetic: "/dʒʌs(t) naʊ/",
        explanation: "t weakens before n",
        explanationCn: "t在n前弱化",
      },
      {
        text: "fact sheet",
        phonetic: "/fæk(t) ʃiːt/",
        explanation: "t weakens before sh",
        explanationCn: "t在sh前弱化",
      },
      {
        text: "looked nice",
        phonetic: "/lʊk(t) naɪs/",
        explanation: "t weakens before n",
        explanationCn: "t在n前弱化",
      },
      {
        text: "asked for",
        phonetic: "/ɑːsk(t) fɔː/",
        explanation: "t weakens before f",
        explanationCn: "t在f前弱化",
      },
      {
        text: "I just wanted to let you know that the project is finished",
        phonetic:
          "/aɪ dʒʌs(t) wɒntɪd tə le(t) juː nəʊ ðæ(t) ðə prɒdʒek(t) ɪz fɪnɪʃt/",
        explanation: "Multiple weak plosives",
        explanationCn: "多处弱化爆破音",
      },
      {
        text: "She asked me to help her with the difficult math problem",
        phonetic:
          "/ʃi ɑːsk(t) miː tə hel(p) hɜː wɪð ðə dɪfɪkəl(t) mæθ prɒbləm/",
        explanation: "Natural weak plosives",
        explanationCn: "自然弱化爆破音",
      },
      {
        text: "The last thing I want is to be kept waiting in the cold",
        phonetic:
          "/ðə lɑːs(t) θɪŋ aɪ wɒn(t) ɪz tə biː kep(t) weɪtɪŋ ɪn ðə kəʊld/",
        explanation: "Complex plosive patterns",
        explanationCn: "复杂爆破音模式",
      },
      {
        text: "He walked slowly past the old church and stopped near the gate",
        phonetic:
          "/hiː wɔːk(t) sləʊli pɑːs(t) ði əʊl(d) tʃɜːtʃ ən stɒp(t) nɪə ðə geɪt/",
        explanation: "Narrative with plosives",
        explanationCn: "叙述句中的爆破音",
      },
      {
        text: "Most students find it hard to accept criticism at first",
        phonetic:
          "/məʊs(t) stjuːdənts faɪn(d) ɪ(t) hɑː(d) tə əksep(t) krɪtɪsɪzəm ə(t) fɜːst/",
        explanation: "Academic sentence plosives",
        explanationCn: "学术句子中的爆破音",
      },
    ],
  },
  // ========== 弱读 Weak Forms ==========
  {
    id: "weak-function",
    category: "weak-forms",
    title: "Function Word Reduction",
    titleCn: "功能词弱化",
    description:
      "Function words (articles, prepositions, pronouns, auxiliaries) are usually unstressed and reduced in natural speech.",
    descriptionCn:
      "功能词（冠词、介词、代词、助动词）在自然语流中通常不重读，会弱化。",
    rules: [
      {
        rule: "Common weak forms",
        ruleCn: "常见弱读形式",
        examples: [
          {
            text: "a / an",
            phonetic: "强: /eɪ/ /æn/ → 弱: /ə/ /ən/",
            explanation: "a book /ə bʊk/, an apple /ən æpəl/",
            explanationCn: "a book /ə bʊk/, an apple /ən æpəl/",
          },
          {
            text: "the",
            phonetic: "强: /ðiː/ → 弱: /ðə/ (辅音前) /ði/ (元音前)",
            explanation: "the book /ðə bʊk/, the apple /ði æpəl/",
            explanationCn: "the book /ðə bʊk/, the apple /ði æpəl/",
          },
          {
            text: "to",
            phonetic: "强: /tuː/ → 弱: /tə/ /tʊ/",
            explanation: "go to school /gəʊ tə skuːl/",
            explanationCn: "go to school /gəʊ tə skuːl/",
          },
          {
            text: "for",
            phonetic: "强: /fɔː/ → 弱: /fə/",
            explanation: "wait for me /weɪt fə miː/",
            explanationCn: "wait for me /weɪt fə miː/",
          },
          {
            text: "can",
            phonetic: "强: /kæn/ → 弱: /kən/",
            explanation: "I can do it /aɪ kən duː ɪt/",
            explanationCn: "I can do it /aɪ kən duː ɪt/",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "I can see you",
        phonetic: "/aɪ kən siː jə/",
        explanation: "can and you are weak",
        explanationCn: "can和you都弱读",
      },
      {
        text: "Give it to me",
        phonetic: "/gɪv ɪt tə mi/",
        explanation: "to is weak /tə/",
        explanationCn: "to弱读为/tə/",
      },
      {
        text: "What do you want",
        phonetic: "/wɒt də jə wɒnt/",
        explanation: "do and you are weak",
        explanationCn: "do和you都弱读",
      },
      {
        text: "He was at home",
        phonetic: "/hi wəz ət həʊm/",
        explanation: "was and at are weak",
        explanationCn: "was和at都弱读",
      },
      {
        text: "Some of them",
        phonetic: "/sʌm əv ðəm/",
        explanation: "of and them are weak",
        explanationCn: "of和them都弱读",
      },
      {
        text: "I was going to tell you about it but I forgot",
        phonetic: "/aɪ wəz gəʊɪŋ tə tel jə əbaʊt ɪt bət aɪ fəgɒt/",
        explanation: "Multiple weak forms in natural speech",
        explanationCn: "自然语流中多处弱读",
      },
      {
        text: "Can you give me a hand with this for a minute",
        phonetic: "/kən jə gɪv mi ə hænd wɪð ðɪs fər ə mɪnɪt/",
        explanation: "Request with many weak forms",
        explanationCn: "请求句中多处弱读",
      },
      {
        text: "I think that he should have been there by now",
        phonetic: "/aɪ θɪŋk ðət hi ʃəd əv bɪn ðeə baɪ naʊ/",
        explanation: "Complex sentence weak forms",
        explanationCn: "复杂句子中的弱读",
      },
      {
        text: "We were supposed to meet them at the station at six",
        phonetic: "/wi wə səpəʊzd tə miːt ðəm ət ðə steɪʃən ət sɪks/",
        explanation: "Narrative weak forms",
        explanationCn: "叙述句中的弱读",
      },
      {
        text: "She said that she would be able to come if she had time",
        phonetic: "/ʃi sed ðət ʃi wəd bi eɪbəl tə kʌm ɪf ʃi həd taɪm/",
        explanation: "Conditional sentence weak forms",
        explanationCn: "条件句中的弱读",
      },
    ],
  },
  {
    id: "weak-contrast",
    category: "weak-forms",
    title: "Strong vs Weak Contrast",
    titleCn: "强读与弱读对比",
    description:
      "The same word can be strong or weak depending on whether it carries meaning emphasis.",
    descriptionCn: "同一个词根据是否需要强调意义，可以强读或弱读。",
    rules: [
      {
        rule: "Strong form: emphasis, contrast, sentence-final, or alone",
        ruleCn: "强读：强调、对比、句末、或单独出现时",
        examples: [
          {
            text: "Yes, I CAN!",
            phonetic: "/jes aɪ kæn/",
            explanation: "Emphatic - strong form",
            explanationCn: "强调时用强读",
          },
          {
            text: "I can swim",
            phonetic: "/aɪ kən swɪm/",
            explanation: "Normal - weak form",
            explanationCn: "正常时用弱读",
          },
          {
            text: "Where are you FROM?",
            phonetic: "/weər ɑː jə frɒm/",
            explanation: "Sentence-final - strong",
            explanationCn: "句末用强读",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "I'm from China (weak) vs Where are you FROM? (strong)",
        phonetic: "/frəm/ vs /frɒm/",
        explanation: "from changes based on position",
        explanationCn: "from根据位置变化",
      },
      {
        text: "What ARE you doing? (emphasis) vs What are you doing? (normal)",
        phonetic: "/ɑː/ vs /ə/",
        explanation: "are changes based on emphasis",
        explanationCn: "are根据强调变化",
      },
      {
        text: "I HAVE finished vs I have finished it",
        phonetic: "/hæv/ vs /həv/",
        explanation: "have changes based on emphasis",
        explanationCn: "have根据强调变化",
      },
      {
        text: "You SHOULD do it vs You should do it",
        phonetic: "/ʃʊd/ vs /ʃəd/",
        explanation: "should changes based on emphasis",
        explanationCn: "should根据强调变化",
      },
      {
        text: "I thought you WERE coming vs I thought you were coming",
        phonetic: "/wɜː/ vs /wə/",
        explanation: "were changes based on emphasis",
        explanationCn: "were根据强调变化",
      },
      {
        text: "I CAN do it, but I don't want to",
        phonetic: "/aɪ kæn duː ɪt bət aɪ dəʊnt wɒnt tə/",
        explanation: "CAN is emphasized for contrast",
        explanationCn: "CAN强调表对比",
      },
      {
        text: "She said she WOULD come, and she did",
        phonetic: "/ʃi sed ʃi wʊd kʌm ən ʃi dɪd/",
        explanation: "WOULD emphasized for confirmation",
        explanationCn: "WOULD强调表确认",
      },
      {
        text: "I didn't say TO him, I said FOR him",
        phonetic: "/aɪ dɪdnt seɪ tuː hɪm aɪ sed fɔː hɪm/",
        explanation: "Prepositions strong for contrast",
        explanationCn: "介词强读表对比",
      },
      {
        text: "Are you going TO the party or FROM the party?",
        phonetic: "/ɑː jə gəʊɪŋ tuː ðə pɑːti ɔː frɒm ðə pɑːti/",
        explanation: "Both prepositions strong for contrast",
        explanationCn: "两个介词都强读表对比",
      },
      {
        text: "I HAVE been there, but I haven't been there recently",
        phonetic: "/aɪ hæv bɪn ðeə bət aɪ hævnt bɪn ðeə riːsntli/",
        explanation: "First HAVE emphasized",
        explanationCn: "第一个HAVE强调",
      },
    ],
  },
  // ========== 语调 Intonation ==========
  {
    id: "intonation-basic",
    category: "intonation",
    title: "Rising and Falling Tones",
    titleCn: "升调与降调",
    description:
      "English uses rising and falling intonation to convey different meanings and attitudes.",
    descriptionCn: "英语使用升调和降调来传达不同的含义和态度。",
    rules: [
      {
        rule: "Falling tone ↘: statements, commands, wh-questions",
        ruleCn: "降调 ↘：陈述句、命令句、特殊疑问句",
        examples: [
          {
            text: "I like coffee. ↘",
            phonetic: "降调",
            explanation: "Statement - sounds complete and certain",
            explanationCn: "陈述句 - 听起来完整确定",
          },
          {
            text: "Where do you live? ↘",
            phonetic: "降调",
            explanation: "Wh-question - falling at the end",
            explanationCn: "特殊疑问句 - 句末降调",
          },
          {
            text: "Close the door. ↘",
            phonetic: "降调",
            explanation: "Command - falling tone",
            explanationCn: "命令句 - 降调",
          },
        ],
      },
      {
        rule: "Rising tone ↗: yes/no questions, uncertainty, politeness",
        ruleCn: "升调 ↗：一般疑问句、不确定、礼貌",
        examples: [
          {
            text: "Do you like coffee? ↗",
            phonetic: "升调",
            explanation: "Yes/no question - rising at the end",
            explanationCn: "一般疑问句 - 句末升调",
          },
          {
            text: "Really? ↗",
            phonetic: "升调",
            explanation: "Showing surprise or seeking confirmation",
            explanationCn: "表示惊讶或寻求确认",
          },
          {
            text: "Excuse me? ↗",
            phonetic: "升调",
            explanation: "Polite request for repetition",
            explanationCn: "礼貌请求重复",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "What's your name? ↘",
        phonetic: "降调",
        explanation: "Wh-question uses falling tone",
        explanationCn: "特殊疑问句用降调",
      },
      {
        text: "Is this your book? ↗",
        phonetic: "升调",
        explanation: "Yes/no question uses rising tone",
        explanationCn: "一般疑问句用升调",
      },
      {
        text: "That's interesting. ↘",
        phonetic: "降调",
        explanation: "Statement uses falling tone",
        explanationCn: "陈述句用降调",
      },
      {
        text: "Coffee or tea? ↗↘",
        phonetic: "先升后降",
        explanation: "Choice question: coffee rises, tea falls",
        explanationCn: "选择疑问句：coffee升，tea降",
      },
      {
        text: "Excuse me? ↗",
        phonetic: "升调",
        explanation: "Polite request uses rising tone",
        explanationCn: "礼貌请求用升调",
      },
      {
        text: "I was wondering if you could help me with something? ↗",
        phonetic: "升调",
        explanation: "Polite request rises at end",
        explanationCn: "礼貌请求句末升调",
      },
      {
        text: "What time does the meeting start tomorrow morning? ↘",
        phonetic: "降调",
        explanation: "Wh-question falls at end",
        explanationCn: "特殊疑问句句末降调",
      },
      {
        text: "Would you like to come to the party on Saturday night? ↗",
        phonetic: "升调",
        explanation: "Invitation rises at end",
        explanationCn: "邀请句句末升调",
      },
      {
        text: "I think we should probably leave now before it gets too late. ↘",
        phonetic: "降调",
        explanation: "Suggestion falls at end",
        explanationCn: "建议句句末降调",
      },
      {
        text: "Have you ever been to Japan, or would you like to go someday? ↗↘",
        phonetic: "先升后降",
        explanation: "Compound question pattern",
        explanationCn: "复合问句模式",
      },
    ],
  },
  {
    id: "intonation-emotion",
    category: "intonation",
    title: "Emotional Intonation",
    titleCn: "情感语调",
    description: "Intonation patterns change based on emotions and attitudes.",
    descriptionCn: "语调模式会根据情感和态度而变化。",
    rules: [
      {
        rule: "Different emotions = different pitch patterns",
        ruleCn: "不同情感 = 不同音高模式",
        examples: [
          {
            text: "Oh, really!",
            phonetic: "高起 + 大幅下降",
            explanation: "Surprise - wide pitch range",
            explanationCn: "惊讶 - 音域宽",
          },
          {
            text: "Oh, really.",
            phonetic: "平调 + 小幅下降",
            explanation: "Boredom/sarcasm - flat, narrow range",
            explanationCn: "无聊/讽刺 - 平调窄音域",
          },
          {
            text: "That's GREAT!",
            phonetic: "高音 + 大幅升降",
            explanation: "Excitement - high pitch, wide range",
            explanationCn: "兴奋 - 高音宽音域",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "That's GREAT! (excited)",
        phonetic: "高音 + 大幅升降",
        explanation: "Excitement: wide pitch range",
        explanationCn: "兴奋：音域宽",
      },
      {
        text: "That's great. (neutral)",
        phonetic: "中音 + 小幅降",
        explanation: "Neutral: narrow pitch range",
        explanationCn: "中性：音域窄",
      },
      {
        text: "That's great... (disappointed)",
        phonetic: "低音 + 平调",
        explanation: "Disappointment: low flat tone",
        explanationCn: "失望：低平调",
      },
      {
        text: "I'm SO sorry!",
        phonetic: "高起 + 逐渐下降",
        explanation: "Sincere apology: emphasize SO",
        explanationCn: "真诚道歉：强调SO",
      },
      {
        text: "Whatever.",
        phonetic: "平调 + 轻微下降",
        explanation: "Indifference: flat tone",
        explanationCn: "无所谓：平调",
      },
      {
        text: "I can't BELIEVE you did that! How could you?",
        phonetic: "高起 + 大幅波动",
        explanation: "Shock and anger: dramatic pitch changes",
        explanationCn: "震惊愤怒：剧烈音高变化",
      },
      {
        text: "Oh my goodness, that's absolutely WONDERFUL news!",
        phonetic: "持续上升 + 高峰",
        explanation: "Joy and excitement: rising pitch",
        explanationCn: "喜悦兴奋：上升音调",
      },
      {
        text: "I suppose so... if you really think it's a good idea.",
        phonetic: "平调 + 轻微下降",
        explanation: "Reluctant agreement: hesitant tone",
        explanationCn: "勉强同意：犹豫语调",
      },
      {
        text: "Are you SERIOUS? You can't be serious!",
        phonetic: "高起 + 强调 + 下降",
        explanation: "Disbelief: emphasized words",
        explanationCn: "难以置信：强调词汇",
      },
      {
        text: "Well, I GUESS we could try that, but I'm not sure it'll work.",
        phonetic: "中起 + 轻微波动",
        explanation: "Uncertainty: wavering tone",
        explanationCn: "不确定：摇摆语调",
      },
    ],
  },
  {
    id: "intonation-list",
    category: "intonation",
    title: "List Intonation",
    titleCn: "列举语调",
    description:
      "When listing items, each item rises except the last one which falls.",
    descriptionCn: "列举事物时，每个项目升调，最后一个降调。",
    rules: [
      {
        rule: "Item 1 ↗, Item 2 ↗, Item 3 ↗, and Item 4 ↘",
        ruleCn: "项目1 ↗, 项目2 ↗, 项目3 ↗, 和 项目4 ↘",
        examples: [
          {
            text: "I need eggs ↗, milk ↗, bread ↗, and butter ↘",
            phonetic: "升升升降",
            explanation: "Last item falls to signal completion",
            explanationCn: "最后一项降调表示结束",
          },
          {
            text: "Red ↗, blue ↗, green ↗, and yellow ↘",
            phonetic: "升升升降",
            explanation: "Colors listed with final fall",
            explanationCn: "颜色列举最后降调",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "Monday ↗, Tuesday ↗, Wednesday ↗, and Thursday ↘",
        phonetic: "升升升降",
        explanation: "Days of the week listing",
        explanationCn: "星期列举",
      },
      {
        text: "I like swimming ↗, running ↗, cycling ↗, and hiking ↘",
        phonetic: "升升升降",
        explanation: "Activities listing",
        explanationCn: "活动列举",
      },
      {
        text: "She speaks English ↗, French ↗, Spanish ↗, and Chinese ↘",
        phonetic: "升升升降",
        explanation: "Languages listing",
        explanationCn: "语言列举",
      },
      {
        text: "We visited Paris ↗, Rome ↗, Berlin ↗, and London ↘",
        phonetic: "升升升降",
        explanation: "Cities listing",
        explanationCn: "城市列举",
      },
      {
        text: "The recipe calls for flour ↗, sugar ↗, eggs ↗, butter ↗, and vanilla ↘",
        phonetic: "升升升升降",
        explanation: "Ingredients listing",
        explanationCn: "配料列举",
      },
      {
        text: "For the project, we need to research ↗, plan ↗, design ↗, develop ↗, test ↗, and launch ↘",
        phonetic: "升升升升升降",
        explanation: "Process steps listing",
        explanationCn: "流程步骤列举",
      },
      {
        text: "My favorite subjects are math ↗, science ↗, history ↗, and literature ↘",
        phonetic: "升升升降",
        explanation: "School subjects listing",
        explanationCn: "学科列举",
      },
      {
        text: "The package includes a laptop ↗, a charger ↗, a mouse ↗, a bag ↗, and a warranty card ↘",
        phonetic: "升升升升降",
        explanation: "Product contents listing",
        explanationCn: "产品内容列举",
      },
    ],
  },
  // ========== 重音 Stress ==========
  {
    id: "stress-word",
    category: "stress",
    title: "Word Stress Patterns",
    titleCn: "单词重音规则",
    description:
      "English words have fixed stress patterns. Incorrect stress can cause misunderstanding.",
    descriptionCn: "英语单词有固定的重音模式。重音错误可能导致误解。",
    rules: [
      {
        rule: "Two-syllable nouns/adjectives: usually stress on 1st syllable",
        ruleCn: "双音节名词/形容词：通常重音在第一音节",
        examples: [
          {
            text: "TAble, HAPpy, STUdent",
            phonetic: "/ˈteɪbəl/, /ˈhæpi/, /ˈstjuːdənt/",
            explanation: "First syllable stressed",
            explanationCn: "第一音节重读",
          },
        ],
      },
      {
        rule: "Two-syllable verbs: often stress on 2nd syllable",
        ruleCn: "双音节动词：通常重音在第二音节",
        examples: [
          {
            text: "beLIEVE, deCIDE, rePORT",
            phonetic: "/bɪˈliːv/, /dɪˈsaɪd/, /rɪˈpɔːt/",
            explanation: "Second syllable stressed",
            explanationCn: "第二音节重读",
          },
        ],
      },
      {
        rule: "Noun vs Verb pairs: stress shift changes meaning",
        ruleCn: "名词/动词对：重音转移改变词性",
        examples: [
          {
            text: "REcord (n.) vs reCORD (v.)",
            phonetic: "/ˈrekɔːd/ vs /rɪˈkɔːd/",
            explanation: "Noun: first syllable; Verb: second syllable",
            explanationCn: "名词重音在前，动词在后",
          },
          {
            text: "PREsent (n.) vs preSENT (v.)",
            phonetic: "/ˈprezənt/ vs /prɪˈzent/",
            explanation: "Noun: first syllable; Verb: second syllable",
            explanationCn: "名词重音在前，动词在后",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "PROject (n.) vs proJECT (v.)",
        phonetic: "/ˈprɒdʒekt/ vs /prəˈdʒekt/",
        explanation: "Noun stress first, verb stress second",
        explanationCn: "名词重音在前，动词在后",
      },
      {
        text: "CONtract (n.) vs conTRACT (v.)",
        phonetic: "/ˈkɒntrækt/ vs /kənˈtrækt/",
        explanation: "Noun stress first, verb stress second",
        explanationCn: "名词重音在前，动词在后",
      },
      {
        text: "PHOtograph, phoTOgrapher, photoGRAphic",
        phonetic: "重音随后缀变化",
        explanation: "Stress shifts with suffixes",
        explanationCn: "后缀影响重音位置",
      },
      {
        text: "ecoNOmic, workaHOlic, autoMATic",
        phonetic: "-ic后缀：重音在前一音节",
        explanation: "-ic suffix: stress on preceding syllable",
        explanationCn: "-ic结尾重音规则",
      },
      {
        text: "OBject (n.) vs obJECT (v.)",
        phonetic: "/ˈɒbdʒɪkt/ vs /əbˈdʒekt/",
        explanation: "Noun vs verb stress pattern",
        explanationCn: "名词动词重音模式",
      },
      {
        text: "The company will reCORD the REcord sales figures this quarter",
        phonetic: "/rɪˈkɔːd/ ... /ˈrekɔːd/",
        explanation: "Same word, different stress = different meaning",
        explanationCn: "同词不同重音=不同意思",
      },
      {
        text: "I need to preSENT my PREsent to the birthday girl",
        phonetic: "/prɪˈzent/ ... /ˈprezənt/",
        explanation: "Verb vs noun in same sentence",
        explanationCn: "同句中动词和名词",
      },
      {
        text: "The reBEL decided to reBEL against the government",
        phonetic: "/ˈrebəl/ ... /rɪˈbel/",
        explanation: "Noun vs verb stress",
        explanationCn: "名词动词重音",
      },
      {
        text: "We need to inCREASE the INcrease in productivity",
        phonetic: "/ɪnˈkriːs/ ... /ˈɪnkriːs/",
        explanation: "Verb vs noun stress",
        explanationCn: "动词名词重音",
      },
      {
        text: "The PERmit allows you to perMIT entry to the building",
        phonetic: "/ˈpɜːmɪt/ ... /pəˈmɪt/",
        explanation: "Noun vs verb stress",
        explanationCn: "名词动词重音",
      },
    ],
  },
  {
    id: "stress-sentence",
    category: "stress",
    title: "Sentence Stress",
    titleCn: "句子重音",
    description:
      "In sentences, content words are stressed while function words are usually unstressed.",
    descriptionCn: "在句子中，实词重读，功能词通常不重读。",
    rules: [
      {
        rule: "Content words (stressed): nouns, main verbs, adjectives, adverbs",
        ruleCn: "实词（重读）：名词、主要动词、形容词、副词",
        examples: [
          {
            text: "The CAT sat on the MAT",
            phonetic: "CAT 和 MAT 重读",
            explanation: "Nouns are stressed",
            explanationCn: "名词重读",
          },
        ],
      },
      {
        rule: "Function words (unstressed): articles, prepositions, pronouns, auxiliaries",
        ruleCn: "功能词（不重读）：冠词、介词、代词、助动词",
        examples: [
          {
            text: "I was GOING to the STORE",
            phonetic: "GOING 和 STORE 重读",
            explanation: "was, to, the are unstressed",
            explanationCn: "was, to, the不重读",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "I WANT to GO HOME",
        phonetic: "WANT, GO, HOME 重读",
        explanation: "Verbs and nouns stressed",
        explanationCn: "动词和名词重读",
      },
      {
        text: "She's a BEAUTIFUL SINGER",
        phonetic: "BEAUTIFUL, SINGER 重读",
        explanation: "Adjective and noun stressed",
        explanationCn: "形容词和名词重读",
      },
      {
        text: "He QUICKLY FINISHED his WORK",
        phonetic: "QUICKLY, FINISHED, WORK 重读",
        explanation: "Adverb, verb, noun stressed",
        explanationCn: "副词、动词、名词重读",
      },
      {
        text: "WHAT do you THINK about IT?",
        phonetic: "WHAT, THINK 重读",
        explanation: "Question word and main verb stressed",
        explanationCn: "疑问词和主要动词重读",
      },
      {
        text: "The WEATHER is REALLY NICE TODAY",
        phonetic: "WEATHER, REALLY, NICE, TODAY 重读",
        explanation: "Content words stressed",
        explanationCn: "实词重读",
      },
      {
        text: "I've been WAITING for you at the STATION for TWENTY MINUTES",
        phonetic: "WAITING, STATION, TWENTY, MINUTES 重读",
        explanation: "Key content words stressed",
        explanationCn: "关键实词重读",
      },
      {
        text: "She TOLD me that she COULDN'T COME to the PARTY because she was SICK",
        phonetic: "TOLD, COULDN'T, COME, PARTY, SICK 重读",
        explanation: "Main verbs and nouns stressed",
        explanationCn: "主要动词和名词重读",
      },
      {
        text: "The IMPORTANT THING is to STAY CALM and THINK CLEARLY",
        phonetic: "IMPORTANT, THING, STAY, CALM, THINK, CLEARLY 重读",
        explanation: "Adjectives, nouns, verbs, adverbs stressed",
        explanationCn: "形容词、名词、动词、副词重读",
      },
      {
        text: "I REALLY APPRECIATE your HELP with this DIFFICULT PROJECT",
        phonetic: "REALLY, APPRECIATE, HELP, DIFFICULT, PROJECT 重读",
        explanation: "Content words carry meaning",
        explanationCn: "实词承载意义",
      },
      {
        text: "We NEED to FIND a BETTER SOLUTION to this PROBLEM as SOON as POSSIBLE",
        phonetic: "NEED, FIND, BETTER, SOLUTION, PROBLEM, SOON, POSSIBLE 重读",
        explanation: "Complex sentence stress pattern",
        explanationCn: "复杂句子重音模式",
      },
    ],
  },
  {
    id: "stress-contrastive",
    category: "stress",
    title: "Contrastive Stress",
    titleCn: "对比重音",
    description:
      "Stress can shift to emphasize contrast or correct information.",
    descriptionCn: "重音可以转移来强调对比或纠正信息。",
    rules: [
      {
        rule: "Stress the word that carries the contrast or correction",
        ruleCn: "重读承载对比或纠正的词",
        examples: [
          {
            text: "I said BLUE, not GREEN",
            phonetic: "BLUE 和 GREEN 重读",
            explanation: "Contrasting colors emphasized",
            explanationCn: "对比的颜色强调",
          },
          {
            text: "SHE did it, not HIM",
            phonetic: "SHE 和 HIM 重读",
            explanation: "Contrasting pronouns emphasized",
            explanationCn: "对比的代词强调",
          },
        ],
      },
    ],
    practiceExamples: [
      {
        text: "I wanted COFFEE, not TEA",
        phonetic: "COFFEE, TEA 重读",
        explanation: "Contrasting drinks",
        explanationCn: "对比饮品",
      },
      {
        text: "We're meeting on TUESDAY, not WEDNESDAY",
        phonetic: "TUESDAY, WEDNESDAY 重读",
        explanation: "Contrasting days",
        explanationCn: "对比日期",
      },
      {
        text: "I BOUGHT the book, I didn't BORROW it",
        phonetic: "BOUGHT, BORROW 重读",
        explanation: "Contrasting actions",
        explanationCn: "对比动作",
      },
      {
        text: "She's my SISTER, not my GIRLFRIEND",
        phonetic: "SISTER, GIRLFRIEND 重读",
        explanation: "Contrasting relationships",
        explanationCn: "对比关系",
      },
      {
        text: "I said FIFTEEN, not FIFTY",
        phonetic: "FIFTEEN, FIFTY 重读",
        explanation: "Contrasting numbers",
        explanationCn: "对比数字",
      },
      {
        text: "I didn't say I WOULDN'T help, I said I COULDN'T help",
        phonetic: "WOULDN'T, COULDN'T 重读",
        explanation: "Contrasting modals for clarification",
        explanationCn: "对比情态动词澄清",
      },
      {
        text: "The meeting is at THREE o'clock, not at TWO o'clock",
        phonetic: "THREE, TWO 重读",
        explanation: "Correcting time information",
        explanationCn: "纠正时间信息",
      },
      {
        text: "I'm going to PARIS next month, not LONDON",
        phonetic: "PARIS, LONDON 重读",
        explanation: "Correcting destination",
        explanationCn: "纠正目的地",
      },
      {
        text: "She PASSED the exam, she didn't FAIL it",
        phonetic: "PASSED, FAIL 重读",
        explanation: "Contrasting outcomes",
        explanationCn: "对比结果",
      },
      {
        text: "I need you to SEND the email, not just WRITE it",
        phonetic: "SEND, WRITE 重读",
        explanation: "Contrasting actions for clarity",
        explanationCn: "对比动作以澄清",
      },
    ],
  },
];

// 获取所有技巧
export function getAllSkills(): PronunciationSkill[] {
  return PRONUNCIATION_SKILLS;
}

// 按分类获取技巧
export function getSkillsByCategory(
  category: SkillCategory
): PronunciationSkill[] {
  return PRONUNCIATION_SKILLS.filter((s) => s.category === category);
}

// 获取单个技巧
export function getSkillById(id: string): PronunciationSkill | undefined {
  return PRONUNCIATION_SKILLS.find((s) => s.id === id);
}
