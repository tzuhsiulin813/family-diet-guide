const form = document.querySelector("#profileForm");
const resetButton = document.querySelector("#resetButton");
const addMemberButton = document.querySelector("#addMemberButton");
const memberList = document.querySelector("#memberList");
const summaryRow = document.querySelector("#summaryRow");
const familyView = document.querySelector("#familyView");
const pantryView = document.querySelector("#pantryView");
const menuView = document.querySelector("#menuView");
const weekView = document.querySelector("#weekView");
const nutritionView = document.querySelector("#nutritionView");
const shoppingView = document.querySelector("#shoppingView");
const diaryView = document.querySelector("#diaryView");
const aiView = document.querySelector("#aiView");
const tabs = document.querySelectorAll(".tab");
const scaleFileInput = document.querySelector("#scaleFileInput");
const ingredientPhotoInput = document.querySelector("#ingredientPhotoInput");
const scaleImportStatus = document.querySelector("#scaleImportStatus");
const photoPreview = document.querySelector("#photoPreview");
const pantryText = document.querySelector("#pantryText");
const addPantryButton = document.querySelector("#addPantryButton");
const voiceButton = document.querySelector("#voiceButton");
const APP_VERSION = "v1.0";
const APP_UPDATED_AT = "2026-07-03";
const MEMBER_STORAGE_KEY = "familyDietMembersV2";
const PREFERENCES_STORAGE_KEY = "familyDietPreferencesV2";
const PANTRY_STORAGE_KEY = "familyDietPantryV2";

function loadLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    scaleImportStatus.textContent = "瀏覽器儲存空間不可用，這次資料可能無法保留";
  }
}

const memberFields = [
  "name",
  "sex",
  "role",
  "age",
  "height",
  "weight",
  "activity",
  "bodyFat",
  "muscleMass",
  "boneMass",
  "visceralFat",
  "bodyWater",
  "waist",
  "goal",
  "healthFocus",
];

const defaultPreferences = {
  planAudience: "family",
  diet: "balanced",
  cuisineStyle: "home",
  meals: 2,
  cookTime: "standard",
  avoid: "",
  allergyList: "",
  pantryMode: "use",
  stores: ["pxmart", "costco", "leezen"],
  planMode: "today",
  childLunchMode: "school",
  seasonMode: "school",
  husbandDinnerMode: "variable",
  dinnerPrepMode: "reheat",
  weeklyVariety: "varied",
};

function createDefaultMembers() {
  return [
    {
      id: "member-1",
      name: "媽媽",
      sex: "female",
      role: "adult",
      age: 35,
      height: 165,
      weight: 62,
      activity: 1.375,
      bodyFat: 28,
      muscleMass: 38,
      boneMass: 2.5,
      visceralFat: 8,
      bodyWater: 52,
      waist: 78,
      goal: "lose",
      healthFocus: "general",
    },
    {
      id: "member-2",
      name: "先生",
      sex: "male",
      role: "adult",
      age: "",
      height: "",
      weight: "",
      activity: 1.55,
      bodyFat: "",
      muscleMass: "",
      boneMass: "",
      visceralFat: "",
      bodyWater: "",
      waist: "",
      goal: "maintain",
      healthFocus: "cholesterol",
    },
    {
      id: "member-3",
      name: "孩子 A",
      sex: "female",
      role: "child",
      age: "",
      height: "",
      weight: "",
      activity: 1.55,
      bodyFat: "",
      muscleMass: "",
      boneMass: "",
      visceralFat: "",
      bodyWater: "",
      waist: "",
      goal: "maintain",
      healthFocus: "childFriendly",
    },
    {
      id: "member-4",
      name: "孩子 B",
      sex: "male",
      role: "child",
      age: "",
      height: "",
      weight: "",
      activity: 1.55,
      bodyFat: "",
      muscleMass: "",
      boneMass: "",
      visceralFat: "",
      bodyWater: "",
      waist: "",
      goal: "maintain",
      healthFocus: "childFriendly",
    },
  ];
}

function createDefaultPantry() {
  return [];
}

const state = {
  activeMemberId: "member-1",
  members: loadLocalData(MEMBER_STORAGE_KEY, createDefaultMembers()),
  preferences: { ...defaultPreferences, ...loadLocalData(PREFERENCES_STORAGE_KEY, {}) },
  pantry: loadLocalData(PANTRY_STORAGE_KEY, createDefaultPantry()),
  importHistory: ["目前沒有預設庫存，請用文字、語音或照片建立家中食材"],
  diary: loadLocalData("familyDietDiary", []),
  aiAdvice: loadLocalData("familyDietAiAdvice", []),
};

if (!state.members.some((member) => member.id === state.activeMemberId)) {
  state.activeMemberId = state.members[0]?.id || "member-1";
}

const mealBank = {
  balanced: [
    {
      slot: "早餐",
      title: "燕麥優格碗",
      detail: "無糖優格、燕麥、藍莓、奇亞籽，搭配水煮蛋。",
      ingredients: ["無糖優格", "燕麥", "藍莓", "奇亞籽", "雞蛋"],
      tags: ["高纖", "穩定血糖"],
      bg: "radial-gradient(circle at 20% 35%, #f8df96 0 16%, transparent 17%), radial-gradient(circle at 54% 40%, #6c83b7 0 12%, transparent 13%), radial-gradient(circle at 76% 30%, #ffffff 0 18%, transparent 19%), #dfead9",
    },
    {
      slot: "午餐",
      title: "雞胸糙米能量盤",
      detail: "香煎雞胸、糙米飯、花椰菜、甜椒與橄欖油檸檬醬。",
      ingredients: ["雞胸肉", "糙米", "花椰菜", "甜椒", "檸檬"],
      tags: ["均衡", "備餐友善"],
      bg: "radial-gradient(circle at 30% 55%, #e7a070 0 18%, transparent 19%), radial-gradient(circle at 62% 36%, #5f9456 0 16%, transparent 17%), radial-gradient(circle at 74% 65%, #d8a344 0 12%, transparent 13%), #f3ead8",
    },
    {
      slot: "晚餐",
      title: "鮭魚藜麥蔬菜盤",
      detail: "烤鮭魚、藜麥、菠菜、小番茄與菇類，份量清爽但蛋白質充足。",
      ingredients: ["鮭魚", "藜麥", "菠菜", "小番茄", "菇類"],
      tags: ["Omega-3", "低負擔"],
      bg: "radial-gradient(circle at 38% 52%, #c85f4a 0 19%, transparent 20%), radial-gradient(circle at 66% 38%, #577b62 0 16%, transparent 17%), radial-gradient(circle at 74% 65%, #cf5446 0 9%, transparent 10%), #e9f0ec",
    },
    {
      slot: "點心",
      title: "水果堅果盒",
      detail: "一份當季水果搭配原味堅果，適合下午補充能量。",
      ingredients: ["蘋果", "香蕉", "原味堅果"],
      tags: ["便利", "耐餓"],
      bg: "radial-gradient(circle at 24% 42%, #d8a344 0 15%, transparent 16%), radial-gradient(circle at 55% 56%, #c85f4a 0 13%, transparent 14%), radial-gradient(circle at 74% 38%, #7b5f3d 0 10%, transparent 11%), #f7ead9",
    },
  ],
  highProtein: [
    {
      slot: "早餐",
      title: "蛋白蔬菜捲",
      detail: "全麥餅皮包蛋、雞胸片、生菜與番茄，搭配無糖豆漿。",
      ingredients: ["全麥餅皮", "雞蛋", "雞胸肉", "生菜", "無糖豆漿"],
      tags: ["高蛋白", "快速"],
      bg: "radial-gradient(circle at 32% 48%, #f4d178 0 20%, transparent 21%), radial-gradient(circle at 62% 46%, #8db77a 0 15%, transparent 16%), #e8efe2",
    },
    {
      slot: "午餐",
      title: "牛肉豆腐蔬菜飯",
      detail: "瘦牛肉、板豆腐、糙米飯與青江菜，兼顧蛋白質與飽足感。",
      ingredients: ["瘦牛肉", "板豆腐", "糙米", "青江菜", "洋蔥"],
      tags: ["增肌友善", "鐵質"],
      bg: "radial-gradient(circle at 35% 50%, #945a47 0 19%, transparent 20%), radial-gradient(circle at 62% 42%, #f5efe0 0 15%, transparent 16%), radial-gradient(circle at 75% 58%, #577b62 0 12%, transparent 13%), #eee3d4",
    },
    {
      slot: "晚餐",
      title: "蝦仁蒸蛋與地瓜",
      detail: "蝦仁蒸蛋、烤地瓜、炒青菜，晚餐保持清爽不犧牲蛋白質。",
      ingredients: ["蝦仁", "雞蛋", "地瓜", "青菜", "菇類"],
      tags: ["清爽", "高蛋白"],
      bg: "radial-gradient(circle at 36% 50%, #f3d27c 0 22%, transparent 23%), radial-gradient(circle at 61% 39%, #d8957b 0 12%, transparent 13%), radial-gradient(circle at 72% 62%, #5f9456 0 14%, transparent 15%), #f1eee3",
    },
    {
      slot: "點心",
      title: "豆漿茶葉蛋",
      detail: "無糖豆漿搭配茶葉蛋，訓練日可再加一份水果。",
      ingredients: ["無糖豆漿", "茶葉蛋", "香蕉"],
      tags: ["便利", "蛋白質"],
      bg: "radial-gradient(circle at 36% 44%, #f6ead2 0 18%, transparent 19%), radial-gradient(circle at 62% 52%, #8b5b3f 0 13%, transparent 14%), #e7f1e2",
    },
  ],
  vegetarian: [
    {
      slot: "早餐",
      title: "豆腐蔬菜蛋餅",
      detail: "蛋餅加入板豆腐、菠菜與菇類，搭配無糖豆漿。",
      ingredients: ["雞蛋", "板豆腐", "菠菜", "菇類", "無糖豆漿"],
      tags: ["蛋奶素", "高蛋白"],
      bg: "radial-gradient(circle at 33% 46%, #f4d178 0 20%, transparent 21%), radial-gradient(circle at 62% 50%, #f7f1df 0 15%, transparent 16%), radial-gradient(circle at 73% 36%, #577b62 0 11%, transparent 12%), #e8efe2",
    },
    {
      slot: "午餐",
      title: "毛豆藜麥彩蔬碗",
      detail: "毛豆、藜麥、玉米、甜椒、酪梨與檸檬優格醬。",
      ingredients: ["毛豆", "藜麥", "玉米", "甜椒", "酪梨"],
      tags: ["植物蛋白", "高纖"],
      bg: "radial-gradient(circle at 28% 50%, #7bb565 0 15%, transparent 16%), radial-gradient(circle at 54% 42%, #d8a344 0 13%, transparent 14%), radial-gradient(circle at 72% 56%, #c85f4a 0 12%, transparent 13%), #edf3dc",
    },
    {
      slot: "晚餐",
      title: "番茄豆腐燉菜",
      detail: "番茄、豆腐、菇類與深綠蔬菜燉煮，配半碗糙米飯。",
      ingredients: ["番茄", "板豆腐", "菇類", "深綠蔬菜", "糙米"],
      tags: ["暖胃", "低脂"],
      bg: "radial-gradient(circle at 34% 48%, #d85b4a 0 19%, transparent 20%), radial-gradient(circle at 62% 39%, #f5efe0 0 15%, transparent 16%), radial-gradient(circle at 72% 62%, #577b62 0 14%, transparent 15%), #f4e7dc",
    },
    {
      slot: "點心",
      title: "希臘優格與堅果",
      detail: "無糖希臘優格、核桃與少量蜂蜜，補足蛋白質與脂肪。",
      ingredients: ["希臘優格", "核桃", "蜂蜜"],
      tags: ["蛋奶素", "耐餓"],
      bg: "radial-gradient(circle at 34% 48%, #fffaf0 0 20%, transparent 21%), radial-gradient(circle at 63% 50%, #8a6547 0 12%, transparent 13%), #efe7d7",
    },
  ],
  lowCarb: [
    {
      slot: "早餐",
      title: "酪梨蛋沙拉",
      detail: "水煮蛋、酪梨、小黃瓜與番茄，搭配無糖茶。",
      ingredients: ["雞蛋", "酪梨", "小黃瓜", "番茄"],
      tags: ["低醣", "好油脂"],
      bg: "radial-gradient(circle at 36% 48%, #f4d178 0 18%, transparent 19%), radial-gradient(circle at 62% 45%, #6f9655 0 17%, transparent 18%), radial-gradient(circle at 75% 58%, #d85b4a 0 10%, transparent 11%), #e6eedc",
    },
    {
      slot: "午餐",
      title: "雞腿花椰菜米",
      detail: "去皮雞腿排、花椰菜米、菇類與橄欖油拌炒。",
      ingredients: ["去皮雞腿", "花椰菜米", "菇類", "橄欖油", "青菜"],
      tags: ["低醣", "飽足"],
      bg: "radial-gradient(circle at 34% 48%, #c9855f 0 20%, transparent 21%), radial-gradient(circle at 62% 44%, #dfead9 0 17%, transparent 18%), radial-gradient(circle at 74% 62%, #577b62 0 12%, transparent 13%), #f0e9da",
    },
    {
      slot: "晚餐",
      title: "豆腐魚片蔬菜湯",
      detail: "白肉魚、豆腐、白菜與菇類煮湯，清爽收尾。",
      ingredients: ["白肉魚", "板豆腐", "白菜", "菇類", "薑"],
      tags: ["低醣", "暖食"],
      bg: "radial-gradient(circle at 36% 48%, #fffaf0 0 18%, transparent 19%), radial-gradient(circle at 61% 42%, #f5efe0 0 14%, transparent 15%), radial-gradient(circle at 73% 58%, #8db77a 0 13%, transparent 14%), #eaf2ef",
    },
    {
      slot: "點心",
      title: "起司小黃瓜盒",
      detail: "低脂起司、小黃瓜條與水煮蛋，控制醣量又能墊胃。",
      ingredients: ["低脂起司", "小黃瓜", "雞蛋"],
      tags: ["低醣", "簡便"],
      bg: "radial-gradient(circle at 35% 46%, #f4d178 0 16%, transparent 17%), radial-gradient(circle at 62% 50%, #73a766 0 15%, transparent 16%), #edf2df",
    },
  ],
};

const goalCopy = {
  lose: { label: "減脂", delta: -0.15, protein: 1.7, leanProtein: 2.15, fatRatio: 0.28 },
  maintain: { label: "維持", delta: 0, protein: 1.4, leanProtein: 1.85, fatRatio: 0.3 },
  gain: { label: "增肌", delta: 0.12, protein: 1.8, leanProtein: 2.25, fatRatio: 0.27 },
};

const healthFocusCopy = {
  general: "一般均衡",
  bloodSugar: "血糖穩定",
  cholesterol: "膽固醇管理",
  bone: "骨質照護",
  childFriendly: "孩童友善",
};

const cuisineCopy = {
  home: { label: "家常混搭", query: "家常料理" },
  chinese: { label: "中式家常", query: "中式家常" },
  japanese: { label: "日式清爽", query: "日式料理" },
  korean: { label: "韓式風味", query: "韓式料理" },
  thai: { label: "泰式酸香", query: "泰式料理" },
  mediterranean: { label: "地中海輕食", query: "地中海料理" },
  western: { label: "西式簡餐", query: "西式簡餐" },
  rotation: { label: "輪流換風格", query: "異國料理" },
};

const pantryModeCopy = {
  use: "優先消耗庫存",
  empty: "無庫存模式",
  reference: "只參考庫存",
  ignore: "不考慮庫存",
};

const cuisineMealBank = {
  chinese: {
    lunch: { title: "蔥薑雞胸糙米飯", detail: "雞胸肉、糙米、青江菜、菇類與薑蔥醬，食材在全聯很好補齊。", ingredients: ["雞胸肉", "糙米", "青江菜", "菇類", "薑", "蔥"], tags: ["中式", "便當"] },
    dinner: { title: "番茄豆腐雞肉湯", detail: "雞腿肉、番茄、豆腐、白菜與菇類煮成一鍋，可復熱也適合分裝。", ingredients: ["雞腿肉", "番茄", "板豆腐", "白菜", "菇類"], tags: ["中式", "熱菜"] },
    breakfast: { title: "蔬菜蛋餅豆漿餐", detail: "蛋餅加入青菜與菇類，搭配無糖豆漿；若蛋或豆類過敏會自動避開。", ingredients: ["雞蛋", "青菜", "菇類", "無糖豆漿"], tags: ["中式", "快速"] },
    snack: { title: "水果優格盒", detail: "當季水果搭配無糖優格或可替換成地瓜，適合孩子點心。", ingredients: ["當季水果", "無糖優格"], tags: ["點心", "便利"] },
  },
  japanese: {
    lunch: { title: "鮭魚蔬菜糙米定食", detail: "鮭魚、糙米、青江菜、小黃瓜與海帶芽，調味清爽。", ingredients: ["鮭魚", "糙米", "青江菜", "小黃瓜", "海帶芽"], tags: ["日式", "清爽"] },
    dinner: { title: "雞肉蔬菜味噌湯", detail: "雞肉、白菜、菇類、豆腐與味噌湯底，味噌可依過敏狀況替換。", ingredients: ["雞腿肉", "白菜", "菇類", "板豆腐", "味噌"], tags: ["日式", "熱湯"] },
    breakfast: { title: "飯糰蔬菜盒", detail: "糙米飯糰搭配小黃瓜與水果，適合快速出門。", ingredients: ["糙米", "小黃瓜", "當季水果"], tags: ["日式", "快速"] },
    snack: { title: "烤地瓜水果盒", detail: "地瓜加水果，簡單補能量。", ingredients: ["地瓜", "當季水果"], tags: ["日式", "點心"] },
  },
  korean: {
    lunch: { title: "韓式雞肉蔬菜拌飯", detail: "雞肉、糙米、菠菜、小黃瓜、紅蘿蔔，辣醬可分開加。", ingredients: ["雞胸肉", "糙米", "菠菜", "小黃瓜", "紅蘿蔔"], tags: ["韓式", "可分裝"] },
    dinner: { title: "韓式豆腐蔬菜鍋", detail: "豆腐、白菜、菇類、雞肉和番茄煮成暖鍋，辣度可另調。", ingredients: ["板豆腐", "白菜", "菇類", "雞腿肉", "番茄"], tags: ["韓式", "熱菜"] },
    breakfast: { title: "紫菜蔬菜飯捲", detail: "糙米、紫菜、小黃瓜與雞胸片，適合備餐切段。", ingredients: ["糙米", "紫菜", "小黃瓜", "雞胸肉"], tags: ["韓式", "備餐"] },
    snack: { title: "水果地瓜盒", detail: "地瓜搭配水果，替代甜食。", ingredients: ["地瓜", "當季水果"], tags: ["韓式", "點心"] },
  },
  thai: {
    lunch: { title: "泰式打拋雞糙米飯", detail: "雞絞肉、九層塔、四季豆、洋蔥與糙米，魚露可省略。", ingredients: ["雞絞肉", "糙米", "九層塔", "四季豆", "洋蔥"], tags: ["泰式", "下飯"] },
    dinner: { title: "泰式檸檬雞蔬菜湯", detail: "雞肉、菇類、番茄、白菜與檸檬，酸香清爽。", ingredients: ["雞腿肉", "菇類", "番茄", "白菜", "檸檬"], tags: ["泰式", "清爽"] },
    breakfast: { title: "水果優格燕麥碗", detail: "水果、燕麥與優格，清爽快速。", ingredients: ["當季水果", "燕麥", "無糖優格"], tags: ["泰式", "快速"] },
    snack: { title: "香蕉堅果盒", detail: "香蕉搭配堅果，若堅果過敏會避開。", ingredients: ["香蕉", "原味堅果"], tags: ["泰式", "點心"] },
  },
  mediterranean: {
    lunch: { title: "檸檬香草雞蔬菜盤", detail: "雞胸肉、花椰菜、小番茄、糙米與橄欖油檸檬醬。", ingredients: ["雞胸肉", "花椰菜", "小番茄", "糙米", "檸檬"], tags: ["地中海", "少油"] },
    dinner: { title: "白肉魚番茄蔬菜湯", detail: "白肉魚、番茄、菇類、白菜與橄欖油，清爽好復熱。", ingredients: ["白肉魚", "番茄", "菇類", "白菜", "橄欖油"], tags: ["地中海", "清爽"] },
    breakfast: { title: "優格燕麥水果碗", detail: "無糖優格、燕麥、水果與奇亞籽。", ingredients: ["無糖優格", "燕麥", "當季水果", "奇亞籽"], tags: ["地中海", "快速"] },
    snack: { title: "水果起司盒", detail: "水果搭配低脂起司，乳製品過敏時可改地瓜。", ingredients: ["當季水果", "低脂起司"], tags: ["地中海", "點心"] },
  },
  western: {
    lunch: { title: "氣炸雞胸蔬菜便當", detail: "雞胸肉、地瓜、花椰菜與甜椒，適合氣炸鍋一次處理。", ingredients: ["雞胸肉", "地瓜", "花椰菜", "甜椒"], tags: ["西式", "氣炸"] },
    dinner: { title: "牛肉番茄蔬菜碗", detail: "瘦牛肉、番茄、洋蔥、菇類與糙米，醬汁可週末先煮。", ingredients: ["瘦牛肉", "番茄", "洋蔥", "菇類", "糙米"], tags: ["西式", "備餐"] },
    breakfast: { title: "全麥雞肉蔬菜捲", detail: "全麥餅皮、雞胸肉、生菜與番茄。", ingredients: ["全麥餅皮", "雞胸肉", "生菜", "番茄"], tags: ["西式", "快速"] },
    snack: { title: "水果優格杯", detail: "水果與優格分裝，適合下午補充。", ingredients: ["當季水果", "無糖優格"], tags: ["西式", "點心"] },
  },
};

const bmiStatus = [
  { max: 18.5, label: "偏低" },
  { max: 24, label: "標準" },
  { max: 27, label: "過重" },
  { max: Infinity, label: "偏高" },
];

const storeDirectory = {
  pxmart: {
    name: "全聯",
    bestFor: ["每日蔬果", "雞蛋豆腐", "少量補貨"],
    url: "https://www.pxmart.com.tw/",
    search: (item) => `https://www.google.com/search?q=${encodeURIComponent(`全聯 ${item}`)}`,
  },
  costco: {
    name: "好市多",
    bestFor: ["大包裝蛋白質", "冷凍食材", "一週備餐"],
    url: "https://www.costco.com.tw/",
    search: (item) => `https://www.google.com/search?q=${encodeURIComponent(`Costco 台灣 ${item}`)}`,
  },
  leezen: {
    name: "里仁",
    bestFor: ["有機蔬果", "全穀雜糧", "素食食材"],
    url: "https://www.leezen.com.tw/",
    search: (item) => `https://www.google.com/search?q=${encodeURIComponent(`里仁 ${item}`)}`,
  },
  foodpanda: {
    name: "foodpanda",
    bestFor: ["臨時補貨", "外送生鮮", "少量採買"],
    url: "https://www.foodpanda.com.tw/",
    search: (item) => `https://www.google.com/search?q=${encodeURIComponent(`foodpanda ${item}`)}`,
  },
  ubereats: {
    name: "Uber Eats",
    bestFor: ["臨時補貨", "外送雜貨", "即時配送"],
    url: "https://www.ubereats.com/tw",
    search: (item) => `https://www.google.com/search?q=${encodeURIComponent(`Uber Eats 台灣 ${item}`)}`,
  },
};

const weekDays = [
  { key: "mon", label: "週一", weekend: false },
  { key: "tue", label: "週二", weekend: false },
  { key: "wed", label: "週三", weekend: false },
  { key: "thu", label: "週四", weekend: false },
  { key: "fri", label: "週五", weekend: false },
  { key: "sat", label: "週六", weekend: true },
  { key: "sun", label: "週日", weekend: true },
];

const weeklyMealPool = {
  lunch: [
    { title: "雞肉糙米飯盒", ingredients: ["雞胸肉", "糙米", "花椰菜", "紅蘿蔔"], prep: "可週末分裝", tags: ["高蛋白", "便當"] },
    { title: "鮭魚藜麥溫沙拉", ingredients: ["鮭魚", "藜麥", "菠菜", "小番茄"], prep: "魚可冷凍分份", tags: ["Omega-3", "清爽"] },
    { title: "豆腐蔬菜拌飯", ingredients: ["板豆腐", "糙米", "菇類", "青江菜"], prep: "適合熱菜", tags: ["低負擔", "高纖"] },
    { title: "牛肉番茄蔬菜碗", ingredients: ["瘦牛肉", "番茄", "洋蔥", "地瓜"], prep: "醬汁可預煮", tags: ["鐵質", "飽足"] },
  ],
  dinner: [
    { title: "番茄雞肉燉菜", ingredients: ["雞腿肉", "番茄", "洋蔥", "菇類"], prep: "最適合週末煮一鍋", tags: ["熱菜", "孩子友善"] },
    { title: "鮭魚味噌蔬菜湯", ingredients: ["鮭魚", "豆腐", "白菜", "菇類"], prep: "湯底可先備", tags: ["暖食", "少油"] },
    { title: "毛豆豆腐炒蛋", ingredients: ["毛豆", "板豆腐", "雞蛋", "菠菜"], prep: "10 分鐘熱菜", tags: ["高蛋白", "快速"] },
    { title: "地瓜雞肉蔬菜盤", ingredients: ["雞胸肉", "地瓜", "花椰菜", "甜椒"], prep: "烤盤料理可復熱", tags: ["備餐", "均衡"] },
    { title: "菇菇牛肉燴飯", ingredients: ["瘦牛肉", "菇類", "糙米", "青江菜"], prep: "醬料可冷藏 3 天", tags: ["熱菜", "飽足"] },
    { title: "蔬菜蛋豆腐鍋", ingredients: ["雞蛋", "板豆腐", "白菜", "番茄"], prep: "缺人吃飯時很好縮份量", tags: ["彈性", "省時"] },
  ],
  prep: [
    "雞胸肉、雞腿肉分裝冷凍，標記週一到週四。",
    "糙米或藜麥先煮 3-4 餐份，冷藏兩天內用完，其餘冷凍。",
    "番茄燉菜或味噌湯底週末先煮，平日晚餐加豆腐、蛋或魚片復熱。",
    "花椰菜、菇類、青江菜洗切瀝乾，分成 2 天份，避免一次買太多葉菜。",
  ],
};

function numberOrBlank(value) {
  return value === "" || value == null ? "" : Number(value);
}

function activeMember() {
  return state.members.find((member) => member.id === state.activeMemberId) || state.members[0];
}

function readMemberFromForm() {
  const data = new FormData(form);
  const member = {};
  memberFields.forEach((field) => {
    const value = data.get(field);
    if (["age", "height", "weight", "activity", "bodyFat", "muscleMass", "boneMass", "visceralFat", "bodyWater", "waist"].includes(field)) {
      member[field] = numberOrBlank(value);
    } else {
      member[field] = value || "";
    }
  });
  member.name = member.name || "未命名";
  return member;
}

function readPreferencesFromForm() {
  const data = new FormData(form);
  return {
    planAudience: data.get("planAudience") || "family",
    diet: data.get("diet"),
    cuisineStyle: data.get("cuisineStyle") || "home",
    meals: Number(data.get("meals")),
    cookTime: data.get("cookTime"),
    avoid: data.get("avoid") || "",
    allergyList: data.get("allergyList") || "",
    pantryMode: data.get("pantryMode") || "use",
    stores: data.getAll("stores"),
    planMode: data.get("planMode"),
    childLunchMode: data.get("childLunchMode"),
    seasonMode: data.get("seasonMode"),
    husbandDinnerMode: data.get("husbandDinnerMode"),
    dinnerPrepMode: data.get("dinnerPrepMode"),
    weeklyVariety: data.get("weeklyVariety"),
  };
}

function writeMemberToForm(member) {
  memberFields.forEach((field) => {
    if (field === "goal") {
      const goalInput = form.querySelector(`input[name="goal"][value="${member.goal}"]`);
      if (goalInput) goalInput.checked = true;
      return;
    }
    const input = form.elements[field];
    if (input) input.value = member[field] ?? "";
  });
}

function writePreferencesToForm() {
  const preferences = state.preferences;
  ["diet", "cuisineStyle", "meals", "cookTime", "avoid", "allergyList", "pantryMode", "childLunchMode", "seasonMode", "husbandDinnerMode", "dinnerPrepMode", "weeklyVariety"].forEach((field) => {
    form.elements[field].value = preferences[field];
  });
  const audienceInput = form.querySelector(`input[name="planAudience"][value="${preferences.planAudience || "family"}"]`);
  if (audienceInput) audienceInput.checked = true;
  form.querySelectorAll('input[name="stores"]').forEach((input) => {
    input.checked = preferences.stores.includes(input.value);
  });
  const planModeInput = form.querySelector(`input[name="planMode"][value="${preferences.planMode}"]`);
  if (planModeInput) planModeInput.checked = true;
}

function calculateMember(member) {
  const estimated = getRoleEstimate(member);
  const hasBasic = Boolean(member.weight && member.height && member.age);
  const heightM = member.height ? member.height / 100 : 0;
  const bmi = member.weight && heightM ? member.weight / heightM ** 2 : null;
  const sexOffset = member.sex === "male" ? 5 : -161;
  const mifflin = hasBasic ? 10 * member.weight + 6.25 * member.height - 5 * member.age + sexOffset : estimated.bmr;
  const leanMass = member.bodyFat && member.weight ? member.weight * (1 - member.bodyFat / 100) : member.weight ? member.weight * 0.74 : null;
  const leanMassSource = member.bodyFat && member.weight ? "由體重與體脂估算" : member.weight ? "由體重粗估" : "未輸入";
  const nutritionLeanMass = leanMass || estimated.leanMass;
  const katch = 370 + 21.6 * nutritionLeanMass;
  const bmr = member.bodyFat && member.weight ? (mifflin + katch) / 2 : mifflin;
  const activity = member.activity || 1.375;
  const tdee = bmr * activity;
  const goal = goalCopy[member.goal] || goalCopy.maintain;
  const roleFactor = member.role === "child" ? 0.82 : member.role === "teen" ? 0.95 : member.role === "senior" ? 0.94 : 1;
  const focusDelta = member.healthFocus === "bloodSugar" || member.healthFocus === "cholesterol" ? -0.03 : 0;
  const targetCalories = Math.round((tdee * (1 + goal.delta + focusDelta) * roleFactor) / 10) * 10;
  const proteinBase = nutritionLeanMass ? nutritionLeanMass * goal.leanProtein : estimated.weight * goal.protein;
  const protein = Math.round(proteinBase * (member.role === "senior" ? 1.08 : 1));
  const fatRatio = member.healthFocus === "cholesterol" ? 0.25 : goal.fatRatio;
  const fat = Math.round((targetCalories * fatRatio) / 9);
  const carbFloor = member.healthFocus === "bloodSugar" ? 80 : 110;
  const carbs = Math.max(carbFloor, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
  const fiber = Math.round(Math.max(18, targetCalories / 80));
  const status = bmi == null ? "待補身高/體重" : bmiStatus.find((item) => bmi < item.max)?.label || "待輸入";

  return {
    ...member,
    dataQuality: hasBasic ? "完整估算" : "角色估算",
    bmi,
    status,
    leanMass,
    leanMassSource,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    protein,
    fat,
    carbs,
    fiber,
    bodyFatStatus: getBodyFatStatus(member),
    visceralStatus: getVisceralStatus(member.visceralFat),
    boneNote: getBoneNote(member),
  };
}

function getRoleEstimate(member) {
  const table = {
    child: { weight: 28, bmr: 1200, leanMass: 21 },
    teen: { weight: 48, bmr: 1500, leanMass: 36 },
    senior: { weight: 58, bmr: 1250, leanMass: 42 },
    adult: { weight: member.sex === "male" ? 72 : 58, bmr: member.sex === "male" ? 1650 : 1350, leanMass: member.sex === "male" ? 53 : 40 },
  };
  return table[member.role] || table.adult;
}

function getBodyFatStatus(member) {
  if (!member.bodyFat) return "未輸入";
  const high = member.sex === "male" ? 25 : 32;
  const low = member.sex === "male" ? 10 : 18;
  if (member.bodyFat < low) return "偏低";
  if (member.bodyFat > high) return "偏高";
  return "一般範圍";
}

function getVisceralStatus(value) {
  if (!value) return "未輸入";
  if (value <= 9) return "一般";
  if (value <= 14) return "留意";
  return "偏高";
}

function getBoneNote(member) {
  if (!member.boneMass) return "未輸入";
  if (member.healthFocus === "bone" || member.role === "senior") return "強化鈣質與維生素 D";
  return "維持阻力訓練與足量蛋白質";
}

function familyCalculations() {
  const members = state.members.map(calculateMember);
  const familyTotals = sumNutrition(members);
  const planning = buildPlanningContext(members, state.preferences, familyTotals);
  return { members, familyTotals, totals: planning.totals, planning };
}

function sumNutrition(members) {
  return members.reduce(
    (sum, member) => ({
      calories: sum.calories + member.targetCalories,
      protein: sum.protein + member.protein,
      carbs: sum.carbs + member.carbs,
      fat: sum.fat + member.fat,
      fiber: sum.fiber + member.fiber,
      units: sum.units + servingUnit(member),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, units: 0 },
  );
}

function buildPlanningContext(members, preferences, familyTotals) {
  const selectedMembers = selectPlanningMembers(members, preferences.planAudience);
  const totals = sumNutrition(selectedMembers);
  const label = getAudienceLabel(preferences.planAudience, selectedMembers);
  return {
    audience: preferences.planAudience || "family",
    label,
    shortLabel: getAudienceShortLabel(preferences.planAudience, selectedMembers),
    members: selectedMembers,
    memberIds: selectedMembers.map((member) => member.id),
    totals: selectedMembers.length ? totals : familyTotals,
  };
}

function selectPlanningMembers(members, audience = "family") {
  if (audience === "active") return members.filter((member) => member.id === state.activeMemberId);
  if (audience === "mom") {
    const mom = members.find((member) => member.name.includes("媽")) || members.find((member) => member.sex === "female" && member.role === "adult");
    return mom ? [mom] : members.slice(0, 1);
  }
  if (audience === "adults") return members.filter((member) => member.role === "adult" || member.role === "senior");
  if (audience === "kids") return members.filter((member) => member.role === "child" || member.role === "teen");
  return members;
}

function getAudienceLabel(audience, members) {
  if (audience === "active") return members[0] ? `${members[0].name}個人備餐` : "目前成員備餐";
  if (audience === "mom") return members[0] ? `${members[0].name}照顧自己` : "媽媽照顧自己";
  if (audience === "adults") return "大人備餐";
  if (audience === "kids") return "孩子備餐";
  return "全家備餐";
}

function getAudienceShortLabel(audience, members) {
  if (audience === "family") return "全家";
  if (audience === "active" || audience === "mom") return members[0]?.name || "個人";
  if (audience === "adults") return "大人";
  if (audience === "kids") return "孩子";
  return "本次對象";
}

function servingUnit(member) {
  if (member.role === "child") return 0.55;
  if (member.role === "teen") return 0.8;
  if (member.role === "senior") return 0.85;
  return 1;
}

function splitTerms(value) {
  return String(value || "")
    .split(/[、,，\s/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAvoidTerms(preferences = state.preferences) {
  return splitTerms(preferences.avoid);
}

function getAllergyTerms(preferences = state.preferences) {
  return splitTerms(preferences.allergyList);
}

function ingredientText(value) {
  if (Array.isArray(value)) return value.join(" ");
  return String(value || "");
}

function termMatchesText(text, term) {
  const normalizedText = text.toLowerCase();
  const normalizedTerm = term.toLowerCase();
  if (normalizedTerm === "蛋") return /雞蛋|蛋餅|蒸蛋|茶葉蛋|水煮蛋|炒蛋|蛋沙拉|蛋類/.test(normalizedText);
  if (normalizedTerm === "奶") return /牛奶|奶粉|起司|乳酪|優格|優酪乳|鮮奶|奶油|乳製/.test(normalizedText);
  return normalizedText.includes(normalizedTerm);
}

function hasAnyTerm(value, terms) {
  const text = ingredientText(value).toLowerCase();
  return terms.some((term) => termMatchesText(text, term));
}

function isRestrictedIngredient(value, preferences = state.preferences) {
  return hasAnyTerm(value, [...getAvoidTerms(preferences), ...getAllergyTerms(preferences)]);
}

function isAllergyIngredient(value, preferences = state.preferences) {
  return hasAnyTerm(value, getAllergyTerms(preferences));
}

function mealHasRestrictedTerm(meal, preferences = state.preferences) {
  return isRestrictedIngredient(`${meal.title} ${meal.detail} ${meal.ingredients.join(" ")}`, preferences);
}

function shouldUsePantry(preferences = state.preferences) {
  return preferences.pantryMode !== "ignore" && preferences.pantryMode !== "empty";
}

function stableHash(value) {
  return String(value)
    .split("")
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 1000003, 7);
}

function getMenuSeed(preferences = state.preferences) {
  const dayKey = new Date().toISOString().slice(0, 10);
  return stableHash([dayKey, preferences.planAudience, preferences.diet, preferences.cuisineStyle, preferences.meals, preferences.weeklyVariety, preferences.pantryMode].join("|"));
}

function getSlotKey(slot) {
  if (slot === "早餐") return "breakfast";
  if (slot === "午餐" || slot === "第一餐") return "lunch";
  if (slot === "晚餐" || slot === "第二餐" || slot === "單餐") return "dinner";
  return "snack";
}

function getCuisineStyleForMeal(preferences, index) {
  if (preferences.cuisineStyle !== "rotation") return preferences.cuisineStyle || "home";
  const styles = ["chinese", "japanese", "korean", "thai", "mediterranean", "western"];
  return styles[index % styles.length];
}

function applyCuisineStyle(meal, preferences, index) {
  if (meal.keepCuisine) return meal;
  const style = getCuisineStyleForMeal(preferences, index);
  const template = cuisineMealBank[style]?.[getSlotKey(meal.slot)];
  if (!template) return { ...meal, cuisineStyle: "home", cuisineLabel: cuisineCopy.home.label };
  return {
    ...meal,
    ...template,
    slot: meal.slot,
    bg: meal.bg,
    tags: [...new Set([...(template.tags || []), ...meal.tags.slice(0, 1)])],
    cuisineStyle: style,
    cuisineLabel: cuisineCopy[style]?.label || "家常混搭",
  };
}

function createSafeFallbackMeal(slot, index, preferences) {
  const baseIngredients = ["雞胸肉", "糙米", "青江菜", "菇類", "檸檬"].filter((item) => !isRestrictedIngredient(item, preferences));
  const ingredients = baseIngredients.length >= 3 ? baseIngredients : ["地瓜", "青江菜", "菇類"].filter((item) => !isRestrictedIngredient(item, preferences));
  return {
    slot,
    title: "過敏安全蔬菜蛋白餐",
    detail: "已依嚴重過敏原避開衝突食材，實際購買仍請確認食品標示與交叉污染風險。",
    ingredients: ingredients.length ? ingredients : ["當季蔬菜"],
    tags: ["過敏避開", "安全優先"],
    bg: mealBank.balanced[index % mealBank.balanced.length]?.bg || "",
    cuisineStyle: preferences.cuisineStyle,
    cuisineLabel: cuisineCopy[preferences.cuisineStyle]?.label || "家常混搭",
  };
}

function getCandidateMealsForSlot(slot, preferences, members = state.members) {
  const slotKey = getSlotKey(slot);
  const allDietMeals = Object.entries(mealBank).flatMap(([dietKey, meals]) =>
    meals
      .filter((meal) => getSlotKey(meal.slot) === slotKey)
      .map((meal) => ({
        ...meal,
        sourceDiet: dietKey,
        cuisineStyle: "home",
        cuisineLabel: cuisineCopy.home.label,
        keepCuisine: preferences.pantryMode === "empty" || (preferences.pantryMode === "use" && !state.pantry.length),
      })),
  );
  const styles = preferences.cuisineStyle === "rotation" ? ["chinese", "japanese", "korean", "thai", "mediterranean", "western"] : [preferences.cuisineStyle || "home"];
  const cuisineMeals = styles
    .map((style) => cuisineMealBank[style]?.[slotKey] && { ...cuisineMealBank[style][slotKey], slot, sourceDiet: preferences.diet, cuisineStyle: style, cuisineLabel: cuisineCopy[style]?.label, keepCuisine: true })
    .filter(Boolean);
  const pantryMeal = createPantryDrivenMeal(slot, preferences);
  const focusPool = preferences.diet === "balanced" && hasFocus("bloodSugar", members) ? mealBank.lowCarb : mealBank[preferences.diet] || mealBank.balanced;
  const focusMeals = focusPool
    .filter((meal) => getSlotKey(meal.slot) === slotKey)
    .map((meal) => ({ ...meal, sourceDiet: preferences.diet, cuisineStyle: "home", cuisineLabel: cuisineCopy.home.label }));
  return [...(pantryMeal ? [pantryMeal] : []), ...cuisineMeals, ...focusMeals, ...allDietMeals].filter((meal) => !mealHasRestrictedTerm(meal, preferences));
}

function createPantryDrivenMeal(slot, preferences) {
  if (preferences.pantryMode !== "use" || !state.pantry.length) return null;
  const safeItems = state.pantry.filter((item) => !isRestrictedIngredient(item.name, preferences));
  const protein = safeItems.find((item) => item.category === "蛋白質");
  const staple = safeItems.find((item) => item.category === "主食與全穀");
  const vegetables = safeItems.filter((item) => item.category === "蔬果").slice(0, 2);
  const extras = safeItems.filter((item) => item.category === "好油脂與配料").slice(0, 1);
  if (!protein || !vegetables.length) return null;
  const ingredients = [protein.name, staple?.name, ...vegetables.map((item) => item.name), ...extras.map((item) => item.name)].filter(Boolean);
  return {
    slot,
    title: `${slot}庫存快手餐`,
    detail: `優先使用家中已有的 ${ingredients.slice(0, 4).join("、")}，不足的主食或蔬菜再少量補買。`,
    ingredients,
    tags: ["庫存優先", "減少採買"],
    bg: mealBank.balanced.find((meal) => getSlotKey(meal.slot) === getSlotKey(slot))?.bg || "",
    sourceDiet: preferences.diet,
    cuisineStyle: preferences.cuisineStyle,
    cuisineLabel: cuisineCopy[preferences.cuisineStyle]?.label || cuisineCopy.home.label,
    keepCuisine: true,
  };
}

function scoreMealCandidate(meal, slot, index, preferences, seed) {
  if (preferences.pantryMode === "empty") {
    const repeatedStaples = (meal.ingredients.join(" ").match(/雞胸肉|鮭魚|糙米|花椰菜/g) || []).length;
    return (stableHash(`${seed}-${slot}-${index}-${meal.title}`) % 100) - repeatedStaples * 18;
  }
  let score = 0;
  if (meal.sourceDiet === preferences.diet) score += 8;
  if (meal.cuisineStyle && meal.cuisineStyle === getCuisineStyleForMeal(preferences, index)) score += 10;
  if (meal.tags?.includes("庫存優先")) score += 18;
  if (shouldUsePantry(preferences) && state.pantry.length) {
    meal.ingredients.forEach((ingredient) => {
      if (findPantryMatch(ingredient)) score += 18;
      else if (findPantrySubstitute(ingredient)) score += 7;
    });
  } else {
    score += stableHash(`${seed}-${slot}-${index}-${meal.title}`) % 17;
    if (/雞胸肉|鮭魚|糙米|花椰菜/.test(meal.ingredients.join(" "))) score -= preferences.pantryMode === "empty" ? 5 : 2;
  }
  if (preferences.weeklyVariety === "light" && /湯|蔬菜|清爽|少油/.test(`${meal.title}${meal.detail}${meal.tags?.join("")}`)) score += 4;
  if (preferences.weeklyVariety === "budget" && shouldUsePantry(preferences)) score += meal.ingredients.filter((ingredient) => findPantryMatch(ingredient) || findPantrySubstitute(ingredient)).length * 3;
  return score;
}

function pickMealForSlot(slot, index, preferences, members) {
  const candidates = getCandidateMealsForSlot(slot, preferences, members);
  if (!candidates.length) return createSafeFallbackMeal(slot, index, preferences);
  const seed = getMenuSeed(preferences);
  return [...candidates].sort((a, b) => scoreMealCandidate(b, slot, index, preferences, seed) - scoreMealCandidate(a, slot, index, preferences, seed))[0];
}

function getMeals(preferences, totals, members = state.members) {
  const slots = getMealSlots(preferences.meals);
  const distribution = getMealDistribution(preferences.meals);
  const selected = slots
    .map((slot, index) => pickMealForSlot(slot, index, preferences, members))
    .filter(Boolean)
    .slice(0, distribution.length);

  return selected.map((meal, index) => {
    const labeledMeal = { ...meal, slot: getMealLabel(preferences.meals, index, meal.slot) };
    const styledMeal = applyCuisineStyle(labeledMeal, preferences, index);
    const safeMeal = mealHasRestrictedTerm(styledMeal, preferences) ? createSafeFallbackMeal(labeledMeal.slot, index, preferences) : styledMeal;
    return {
      ...safeMeal,
      slot: labeledMeal.slot,
      calories: Math.round((totals.calories * distribution[index]) / 10) * 10,
      protein: Math.round(totals.protein * distribution[index]),
      familyPortions: Math.max(1, Math.round(totals.units * 10) / 10),
    };
  });
}

function getMealSlots(mealCount) {
  if (mealCount === 1) return ["晚餐"];
  if (mealCount === 2) return ["午餐", "晚餐"];
  if (mealCount === 4) return ["早餐", "午餐", "晚餐", "點心"];
  return ["早餐", "午餐", "晚餐"];
}

function getMealDistribution(mealCount) {
  if (mealCount === 1) return [1];
  if (mealCount === 2) return [0.48, 0.52];
  if (mealCount === 4) return [0.25, 0.35, 0.3, 0.1];
  return [0.28, 0.38, 0.34];
}

function getMealLabel(mealCount, index, originalSlot) {
  if (mealCount === 1) return "單餐";
  if (mealCount === 2) return index === 0 ? "第一餐" : "第二餐";
  return originalSlot;
}

function hasFocus(focus, members = state.members) {
  return members.some((member) => member.healthFocus === focus);
}

function getPlanDays(planMode) {
  if (planMode === "week") return 7;
  if (planMode === "random") return Math.floor(Math.random() * 3) + 1;
  return 1;
}

function buildShoppingItems(meals, days, units) {
  const ingredients = [...new Set(meals.flatMap((meal) => meal.ingredients))].filter((name) => !isAllergyIngredient(name));
  return ingredients.map((name) => {
    const pantryMatch = shouldUsePantry() ? findPantryMatch(name) : null;
    const substitute = shouldUsePantry() && !pantryMatch ? findPantrySubstitute(name) : null;
    const referenceOnly = state.preferences.pantryMode === "reference" && pantryMatch;
    return {
      name,
      category: getIngredientCategory(name),
      quantity: estimateQuantity(name, days, units),
      stores: recommendStores(name),
      status: referenceOnly ? "reference" : pantryMatch && state.preferences.pantryMode === "use" ? "owned" : substitute ? "substitute" : "buy",
      pantryMatch,
      substitute,
    };
  });
}

function findPantryMatch(name) {
  return state.pantry.find((item) => !isRestrictedIngredient(item.name) && (item.name.includes(name) || name.includes(item.name)));
}

function findPantrySubstitute(name) {
  const category = getIngredientCategory(name);
  return state.pantry.find((item) => item.category === category && !isRestrictedIngredient(item.name));
}

function getIngredientCategory(name) {
  if (/(雞|魚|鮭|蝦|牛|蛋|豆腐|豆漿|優格|起司|毛豆)/.test(name)) return "蛋白質";
  if (/(糙米|燕麥|藜麥|地瓜|全麥|玉米)/.test(name)) return "主食與全穀";
  if (/(油|堅果|奇亞籽|核桃|酪梨)/.test(name)) return "好油脂與配料";
  return "蔬果";
}

function estimateQuantity(name, days, units) {
  const scaled = Math.max(1, units) * days;
  if (name.includes("雞蛋") || name.includes("茶葉蛋")) return `${Math.ceil(scaled * 1.2)} 顆`;
  if (/(雞|魚|鮭|蝦|牛)/.test(name)) return `${Math.ceil(scaled * 160)} g`;
  if (/(豆腐|優格|豆漿)/.test(name)) return `${Math.ceil(scaled * 1)} 份`;
  if (/(糙米|燕麥|藜麥|地瓜|全麥)/.test(name)) return `${Math.ceil(scaled * 90)} g`;
  if (/(堅果|奇亞籽|核桃)/.test(name)) return `${Math.ceil(scaled * 20)} g`;
  return `${Math.ceil(scaled * 1)} 份`;
}

function recommendStores(name) {
  const category = getIngredientCategory(name);
  if (category === "蛋白質") return ["costco", "pxmart", "foodpanda"];
  if (category === "主食與全穀") return ["leezen", "costco", "pxmart"];
  if (category === "好油脂與配料") return ["leezen", "costco", "pxmart"];
  return ["pxmart", "leezen", "foodpanda", "ubereats"];
}

function safeStoreBestFor(store) {
  const items = store.bestFor.filter((item) => !isRestrictedIngredient(item));
  return items.length ? items : ["常用採買通路"];
}

function renderMemberList() {
  memberList.innerHTML = state.members
    .map(
      (member) => `
        <button class="member-pill ${member.id === state.activeMemberId ? "active" : ""}" type="button" data-member-id="${member.id}">
          <b>${member.name}</b>
          <span>${roleLabel(member.role)}</span>
        </button>
      `,
    )
    .join("");
}

function roleLabel(role) {
  return { adult: "成人", senior: "銀髮族", teen: "青少年", child: "兒童" }[role] || "成員";
}

function renderSummary(calculations) {
  const active = calculations.members.find((member) => member.id === state.activeMemberId) || calculations.members[0];
  const plan = calculations.planning;
  const focusMember = plan.members[0] || active;
  summaryRow.innerHTML = [
    metric(`${plan.members.length}`, `${plan.shortLabel}成員`),
    metric(`${formatBmi(focusMember.bmi)}`, `${focusMember.name} BMI ${focusMember.status}`),
    metric(`${Math.round(plan.totals.calories)}`, `${plan.shortLabel} kcal/日`),
    metric(`${Math.round(plan.totals.protein)}g`, `${plan.shortLabel}蛋白質`),
  ].join("");
}

function metric(value, label) {
  return `<article class="metric"><b>${value}</b><span>${label}</span></article>`;
}

function formatBmi(value) {
  return value == null || Number.isNaN(value) ? "--" : value.toFixed(1);
}

function formatKg(value) {
  return value == null || Number.isNaN(value) ? "--" : value.toFixed(1);
}

function formatLeanMass(member) {
  if (member.leanMass == null || Number.isNaN(member.leanMass)) return "未輸入";
  return `${member.leanMass.toFixed(1)}kg`;
}

function leanMassHelp(member) {
  if (member.leanMassSource === "由體重與體脂估算") return "體重扣除脂肪後的估算值";
  if (member.leanMassSource === "由體重粗估") return "未填體脂，僅用體重粗估";
  return "需體重與體脂才會顯示";
}

function renderFamily(calculations) {
  const plan = calculations.planning;
  familyView.innerHTML = `
    <div class="plan-banner">
      <h3>備餐架構覆盤</h3>
      <p>目前以「${plan.label}」生成菜單與採買，份量約 ${formatPortion(plan.totals.units)} 人份；全家完整需求仍保留在下方，方便你在照顧家人與照顧自己之間切換。</p>
      <p class="sync-note">瘦體重是體重扣除脂肪後的非脂肪重量，包含肌肉、骨骼、水分與器官；它不是單純肌肉量。未填體重或體脂時不會把角色估算值當成真實資料顯示。</p>
    </div>
    <div class="insight-grid">
      ${calculations.members
        .map(
          (member) => `
          <article class="insight-card ${plan.memberIds.includes(member.id) ? "selected-member-card" : ""}">
            <div class="insight-heading">
              <h3>${member.name}</h3>
              <span>${plan.memberIds.includes(member.id) ? "本次納入" : "參考資料"}｜${goalCopy[member.goal].label}｜${healthFocusCopy[member.healthFocus]}</span>
            </div>
            <div class="mini-metrics">
              <span>BMI <b>${formatBmi(member.bmi)}</b></span>
              <span>體脂 <b>${member.bodyFat ? `${member.bodyFat}%` : "未輸入"}</b></span>
              <span>瘦體重 <b>${formatLeanMass(member)}</b><small>${leanMassHelp(member)}</small></span>
              <span>內臟脂肪 <b>${member.visceralStatus}</b></span>
            </div>
            <p>${member.name} 每日約 ${member.targetCalories} kcal、蛋白質 ${member.protein}g、纖維 ${member.fiber}g。${member.dataQuality === "角色估算" ? "部分資料未填，暫以家庭角色估算。" : ""} 骨量建議：${member.boneNote}。</p>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
}

function renderPantry(meals) {
  const needed = [...new Set(meals.flatMap((meal) => meal.ingredients))];
  const suggestions = getManagementSuggestions(needed);
  const gapItems = needed.map((name) => {
    const match = shouldUsePantry() ? findPantryMatch(name) : null;
    const substitute = shouldUsePantry() && !match ? findPantrySubstitute(name) : null;
    return {
      name,
      status: match ? "already-owned" : substitute ? "can-substitute" : "need-buy",
      note: match ? (state.preferences.pantryMode === "reference" ? `家中有 ${match.name}，可選用但不強制消耗` : `家中已有：${match.name} ${match.quantity}`) : substitute ? `可先用 ${substitute.name} 替代` : state.preferences.pantryMode === "empty" ? "無庫存模式下作為菜單輪替參考" : "建議列入採買",
    };
  });

  pantryView.innerHTML = `
    <div class="pantry-dashboard">
      <div class="plan-banner">
        <h3>家中庫存與採買缺口</h3>
        <p>先消耗既有食材，再補足蛋白質、全穀、蔬果與好油脂。照片目前做預覽與人工確認；文字、CSV、JSON 和語音可直接建立資料。</p>
      </div>
      <div class="pantry-list">
        ${
          state.pantry.length
            ? state.pantry
                .map(
                  (item) => `
                    <article class="pantry-item">
                      <b>${item.name}</b>
                      <span>${item.quantity || "未填數量"}｜${item.category}｜${item.source}</span>
                    </article>
                  `,
                )
                .join("")
            : `<article class="pantry-item"><b>尚無庫存</b><span>請用文字、語音或照片建立家中食材</span></article>`
        }
      </div>
      <div class="gap-grid">
        ${suggestions
          .map(
            (item) => `
              <article class="gap-item ${item.type}">
                <b>${item.title}</b>
                <span>${item.detail}</span>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="gap-grid">
        ${gapItems
          .map(
            (item) => `
              <article class="gap-item ${item.status}">
                <b>${item.name}</b>
                <span>${item.note}</span>
              </article>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function getManagementSuggestions(needed) {
  const missing = needed.filter((name) => !shouldUsePantry() || !findPantryMatch(name));
  const suggestions = [
    {
      type: "already-owned",
      title: "先用庫存",
      detail:
        state.preferences.pantryMode === "empty"
          ? "目前採無庫存模式，菜單會主動輪替，不把空庫存誤當成固定採買清單。"
          : state.preferences.pantryMode === "ignore"
            ? "本次暫不考慮庫存，會重新設計菜單與採買。"
            : state.preferences.pantryMode === "reference"
              ? `目前有 ${state.pantry.length} 筆庫存，只作參考不強制消耗。`
              : state.pantry.length
                ? `目前有 ${state.pantry.length} 筆庫存，菜單會優先抵扣相同或同類食材。`
                : "先建立冰箱與乾貨庫存，採買建議會更精準。",
    },
    {
      type: "need-buy",
      title: "優先補缺口",
      detail: missing.length ? `今日優先補 ${missing.slice(0, 3).join("、")}。` : "今日菜單大多可用家中食材完成。",
    },
    {
      type: "can-substitute",
      title: "備餐節奏",
      detail: state.preferences.planMode === "week" ? "一週模式建議蛋白質冷凍分裝、蔬菜保留 2-3 天新鮮補貨。" : "當天模式建議先買易壞蔬菜與新鮮蛋白質。",
    },
    {
      type: "already-owned",
      title: "安全提醒",
      detail: "之後可加保存期限、過敏原、慢性病醫囑與預算上限，讓採買更貼近日常。",
    },
  ];
  return suggestions;
}

function getPreferenceSummary(preferences) {
  const audienceText = getAudienceLabel(preferences.planAudience, selectPlanningMembers(state.members.map(calculateMember), preferences.planAudience));
  const cuisineText = cuisineCopy[preferences.cuisineStyle]?.label;
  const pantryText = pantryModeCopy[preferences.pantryMode];
  const modeText = {
    today: "當天菜單",
    week: "一週備菜",
    random: "隨機補貨",
  }[preferences.planMode];
  const seasonText = {
    school: "平日孩子多在校用午餐",
    vacation: "寒暑假午餐多在家",
    holiday: "例假日午餐多在家",
  }[preferences.seasonMode];
  const dinnerText = {
    home: "先生晚餐在家",
    variable: "先生輪班彈性晚餐",
    away: "先生晚餐多不在家",
  }[preferences.husbandDinnerMode];
  const prepText = {
    reheat: "晚餐可熱菜",
    fresh: "當餐現煮",
    mixed: "現煮與備菜混合",
  }[preferences.dinnerPrepMode];
  return [audienceText, cuisineText, pantryText, modeText, getMealPatternLabel(preferences.meals), seasonText, dinnerText, prepText].filter(Boolean).join("｜");
}

function getPantryCoverage(meals) {
  const mealIngredients = [...new Set(meals.flatMap((meal) => meal.ingredients))];
  const owned = [];
  const substitutes = [];
  const missing = [];
  mealIngredients.forEach((ingredient) => {
    if (!shouldUsePantry()) {
      missing.push(ingredient);
      return;
    }
    const pantryMatch = findPantryMatch(ingredient);
    if (pantryMatch) {
      owned.push(state.preferences.pantryMode === "reference" ? `${ingredient}(家中有，可不消耗)` : `${ingredient}(${pantryMatch.quantity || "已有"})`);
      return;
    }
    const substitute = findPantrySubstitute(ingredient);
    if (substitute) {
      substitutes.push(`${ingredient}->${substitute.name}`);
      return;
    }
    missing.push(ingredient);
  });
  return { mealIngredients, owned, substitutes, missing };
}

function renderPantrySyncSummary(meals, label = "今日菜單") {
  const coverage = getPantryCoverage(meals);
  const ownedText = coverage.owned.length ? coverage.owned.slice(0, 6).join("、") : "尚未抵扣到相同庫存";
  const substituteText = coverage.substitutes.length ? coverage.substitutes.slice(0, 4).join("、") : "暫無同類替代";
  const missingText = coverage.missing.length ? coverage.missing.slice(0, 6).join("、") : "目前菜單缺口很少";
  const pantryActionText =
    state.preferences.pantryMode === "empty"
      ? "無庫存模式會主動輪替菜色，不固定補同一批食材。"
      : state.preferences.pantryMode === "ignore"
        ? "本次不套用庫存抵扣。"
        : state.preferences.pantryMode === "reference"
          ? "庫存只作參考，不強制消耗。"
          : "採買清單會自動抵扣或建議替代。";
  return `
    <section class="sync-panel">
      <div>
        <b>左側庫存已同步</b>
        <span>${label}已讀取 ${state.pantry.length} 筆家中食材，${pantryActionText}</span>
      </div>
      <div class="sync-grid">
        <article class="gap-item already-owned"><b>可先用</b><span>${ownedText}</span></article>
        <article class="gap-item can-substitute"><b>可替代</b><span>${substituteText}</span></article>
        <article class="gap-item need-buy"><b>仍需補</b><span>${missingText}</span></article>
      </div>
    </section>
  `;
}

function getCookingMethod(meal) {
  const text = `${meal.slot} ${meal.title} ${meal.detail} ${meal.ingredients.join(" ")}`;
  const eggRestricted = isRestrictedIngredient("雞蛋");
  const soyRestricted = isRestrictedIngredient("板豆腐") || isRestrictedIngredient("豆漿");
  const quickProtein = eggRestricted ? (soyRestricted ? "補一份安全蛋白質" : "補一杯無糖豆漿") : "補一顆水煮蛋或無糖豆漿";
  if (/優格|水果|堅果|豆漿|沙拉/.test(text) && !/雞胸|牛肉|蝦仁|魚|蛋/.test(text)) {
    return {
      appliance: "免開火 + 電鍋備料",
      time: "約 5-10 分鐘",
      style: "冷食分裝",
      steps: ["前置：前一晚把水果洗切、燕麥或主食分裝好。", "組合：當餐把優格、燕麥、水果放入碗中，堅果最後加入保留口感。", `補強：若是 168 兩餐或容易餓，${quickProtein}。`],
      tip: "適合早上或接送前快速處理，也可以先做成保鮮盒帶出門。",
    };
  }
  if (/燕麥|粥|藜麥|糙米|飯|地瓜|便當|能量盤/.test(text)) {
    return {
      appliance: "電子鍋 + 氣炸鍋 + 三口瓦斯爐",
      time: "約 20-30 分鐘",
      style: "主食先行、蛋白質同步",
      steps: ["前置：電子鍋先煮糙米、藜麥或地瓜，週末可一次煮 2-3 餐份。", "同步：主蛋白進氣炸鍋 180 度 10-14 分鐘，厚肉中途翻面。", "收尾：瓦斯爐快炒或汆燙蔬菜，醬汁最後分開淋，方便隔餐復熱。"],
      tip: "最適合做便當盤，主食和蛋白質先分裝，蔬菜保留 1-2 天份現炒。",
    };
  }
  if (/蒸蛋|蒸|湯|燉|煮|鍋/.test(text)) {
    const steamBase = eggRestricted ? "豆腐或根莖類" : "蒸蛋、豆腐或根莖類";
    return {
      appliance: "電鍋 + 三口瓦斯爐",
      time: "約 20-35 分鐘",
      style: "一鍋熱菜",
      steps: [`前置：電鍋先處理${steamBase}，外鍋約 0.8-1 杯水。`, "同步：瓦斯爐煮湯底或燉菜，先放洋蔥、菇類，再放主蛋白。", "收尾：煮好分成當餐和隔餐，晚餐只要回鍋加熱或補青菜。"],
      tip: "適合媽媽晚餐只能熱菜的日子，湯底可週末先煮一鍋。",
    };
  }
  if (/鮭魚|魚|雞胸|雞腿|蝦|牛肉|豬|豆腐|蛋/.test(text)) {
    const stoveProtein = eggRestricted ? "豆腐或肉類用瓦斯爐快煎快炒" : "豆腐、蛋或肉類用瓦斯爐快煎快炒";
    return {
      appliance: "氣炸鍋 + 三口瓦斯爐",
      time: "約 15-25 分鐘",
      style: "蛋白質快速主菜",
      steps: ["前置：主蛋白用少鹽、胡椒、蒜或檸檬抓醃 5-10 分鐘。", `同步：魚、雞肉進氣炸鍋；${stoveProtein}。`, "收尾：另一口爐炒青菜，先夾出孩子份量，再調整大人口味。"],
      tip: "蛋白質可以週末先分裝冷凍，當天退冰後直接氣炸或快炒。",
    };
  }
  return {
    appliance: "三口瓦斯爐 + 電鍋",
    time: "約 20-30 分鐘",
    style: "家常分工",
    steps: ["前置：主食先用電鍋或電子鍋處理。", "同步：瓦斯爐一口煮蛋白質、一口炒蔬菜、一口備湯或醬汁。", "收尾：把孩子份量先夾出，再調整大人口味或辣度。"],
    tip: "把主食、蛋白質、蔬菜拆開處理，最容易依不同成員調整份量。",
  };
}

function renderCookingMethod(meal) {
  const method = getCookingMethod(meal);
  return `
    <div class="method-box">
      <div class="method-head">
        <b>快速烹調流程</b>
        <span>${method.time}</span>
      </div>
      <p>${method.style}｜${method.appliance}</p>
      <ol>${method.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      <small>${method.tip}</small>
    </div>
  `;
}

function getRecipeLinks(meal, preferences) {
  const cuisineKeyword = cuisineCopy[meal.cuisineStyle || preferences.cuisineStyle]?.query || cuisineCopy[preferences.cuisineStyle]?.query || "家常料理";
  const styleKeyword = {
    varied: "變化菜色",
    comfort: "孩子愛吃",
    light: "清爽少油",
    budget: "省錢備餐",
  }[preferences.weeklyVariety] || "家常";
  const timeKeyword = preferences.cookTime === "quick" ? "快速" : preferences.cookTime === "prep" ? "備餐" : "家常";
  const avoidKeyword = preferences.avoid ? ` 避免 ${preferences.avoid}` : "";
  const allergyKeyword = preferences.allergyList ? ` 無 ${preferences.allergyList} 過敏原替代` : "";
  const storeKeyword = preferences.stores?.length ? ` ${preferences.stores.map((storeId) => storeDirectory[storeId]?.name).filter(Boolean).join(" ")}` : "";
  const query = `${meal.title} ${cuisineKeyword} ${timeKeyword} ${styleKeyword} 食譜 做法${avoidKeyword}${allergyKeyword}${storeKeyword}`;
  return [
    {
      label: "YouTube 做法",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    },
    {
      label: "免費圖文食譜",
      url: `https://www.google.com/search?q=${encodeURIComponent(`${query} 免費食譜`)}`,
    },
    {
      label: "愛料理搜尋",
      url: `https://www.google.com/search?q=${encodeURIComponent(`site:icook.tw ${query}`)}`,
    },
  ];
}

function renderRecipeLinks(meal, preferences) {
  return `
    <div class="recipe-links" aria-label="${meal.title} 食譜連結">
      ${getRecipeLinks(meal, preferences)
        .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`)
        .join("")}
    </div>
  `;
}

function renderAllergySafetyPanel(preferences) {
  const allergyTerms = getAllergyTerms(preferences);
  if (!allergyTerms.length) return "";
  return `
    <section class="safety-panel">
      <b>嚴重過敏原已列為硬性排除</b>
      <span>目前排除：${allergyTerms.join("、")}。本 app 會避開菜單與採買文字中的衝突食材，但實際購買仍需確認食品標示、調味料成分與交叉污染風險。</span>
    </section>
  `;
}

function getSimpleMethodText(meal) {
  const method = getCookingMethod(meal);
  return `${method.appliance}：${method.steps[0]}`;
}

function renderMomCarePanel(calculations) {
  const plan = calculations.planning;
  const focusTexts = [...new Set(plan.members.map((member) => healthFocusCopy[member.healthFocus]).filter(Boolean))];
  const targetNames = plan.members.map((member) => member.name).join("、");
  const baseStrategy =
    plan.audience === "family"
      ? "先做全家可共食的主蛋白、主食與蔬菜基底，再把孩子清淡份、媽媽高纖份、先生彈性晚餐分開調味或分裝。"
      : "這次只為指定對象抓份量，採買會縮小到真正需要的內容，避免媽媽為了備餐多買一整輪。";
  const workload =
    state.preferences.dinnerPrepMode === "reheat"
      ? "優先選可復熱菜色，週末先處理蛋白質與主食，平日晚餐只補青菜或湯。"
      : state.preferences.dinnerPrepMode === "mixed"
        ? "把耗時的蛋白質和主食先備好，當餐只現煮最需要新鮮口感的蔬菜。"
        : "以當餐現煮為主，仍建議先洗切蔬菜和分裝蛋白質，降低臨時決策量。";
  return `
    <section class="care-panel">
      <div>
        <b>媽媽備餐大腦</b>
        <span>本次對象：${targetNames || plan.label}｜重點：${focusTexts.join("、") || "均衡照顧"}</span>
      </div>
      <ol>
        <li>${baseStrategy}</li>
        <li>${workload}</li>
        <li>每餐先確保蛋白質與蔬菜，再依 ${getMealPatternLabel(state.preferences.meals)} 調整主食份量。</li>
      </ol>
    </section>
  `;
}

function renderMenu(meals, preferences, calculations) {
  const cookText = {
    quick: "20 分鐘內",
    standard: "30 分鐘內",
    prep: "適合備餐",
  }[preferences.cookTime];
  const plan = calculations.planning;
  const familyHints = getFamilyHints(plan.members);
  const fastingNote = getFastingNote(preferences.meals);

  menuView.innerHTML = `
    <div class="plan-banner">
      <h3>${plan.label}</h3>
      <p>${familyHints.join("、")}。以 ${formatPortion(plan.totals.units)} 人份規劃，總熱量約 ${Math.round(plan.totals.calories)} kcal/日。${fastingNote}</p>
      <p class="sync-note">已套用左側設定：${getPreferenceSummary(preferences)}</p>
    </div>
    ${renderAllergySafetyPanel(preferences)}
    ${renderMomCarePanel(calculations)}
    ${renderPantrySyncSummary(meals)}
    <div class="meal-list">
      ${meals
        .map(
          (meal) => `
          <article class="meal-card">
            <div class="meal-art" style="--meal-bg: ${meal.bg}"></div>
            <div class="meal-body">
              <h3>${meal.slot}｜${meal.title}</h3>
              <p>${meal.detail}</p>
              ${renderCookingMethod(meal)}
              ${renderRecipeLinks(meal, preferences)}
              <div class="meal-meta">
                <span class="chip">${plan.shortLabel} ${meal.calories} kcal</span>
                <span class="chip">蛋白質 ${meal.protein}g</span>
                <span class="chip">${meal.familyPortions} 人份</span>
                <span class="chip">${cookText}</span>
                ${meal.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
              </div>
            </div>
          </article>
        `,
        )
        .join("")}
    </div>
  `;
}

function buildWeeklyPlan(calculations) {
  return weekDays.map((day, index) => {
    const lunchMembers = getMealMembersForSlot(day, "lunch", calculations);
    const dinnerMembers = getMealMembersForSlot(day, "dinner", calculations);
    const lunchAtHome = lunchMembers.length > 0;
    const dinnerUnits = sumServingUnits(dinnerMembers);
    const lunchUnits = lunchAtHome ? sumServingUnits(lunchMembers) : 0;
    const lunchOffset = shouldUsePantry() && state.pantry.length ? 0 : getMenuSeed(state.preferences) % weeklyMealPool.lunch.length;
    const dinnerOffset = shouldUsePantry() && state.pantry.length ? 0 : getMenuSeed(state.preferences) % weeklyMealPool.dinner.length;
    const rawLunchMeal = lunchAtHome && state.preferences.pantryMode === "use" && state.pantry.length ? pickMealForSlot("午餐", index, state.preferences, calculations.planning.members) : { ...weeklyMealPool.lunch[(index + lunchOffset) % weeklyMealPool.lunch.length], slot: "午餐", bg: "" };
    const rawDinnerMeal = state.preferences.pantryMode === "use" && state.pantry.length ? pickMealForSlot("晚餐", index + 1, state.preferences, calculations.planning.members) : { ...weeklyMealPool.dinner[(index + dinnerOffset) % weeklyMealPool.dinner.length], slot: "晚餐", bg: "" };
    const styledLunch = mealHasRestrictedTerm(rawLunchMeal, state.preferences) ? createSafeFallbackMeal("午餐", index, state.preferences) : applyCuisineStyle(rawLunchMeal, state.preferences, index);
    const styledDinner = mealHasRestrictedTerm(rawDinnerMeal, state.preferences) ? createSafeFallbackMeal("晚餐", index, state.preferences) : applyCuisineStyle(rawDinnerMeal, state.preferences, index + 1);
    const lunchMeal = mealHasRestrictedTerm(styledLunch, state.preferences) ? createSafeFallbackMeal("午餐", index, state.preferences) : styledLunch;
    const dinnerMeal = mealHasRestrictedTerm(styledDinner, state.preferences) ? createSafeFallbackMeal("晚餐", index, state.preferences) : styledDinner;
    return {
      ...day,
      lunchAtHome,
      lunchUnits,
      dinnerUnits,
      lunch: lunchAtHome ? adaptMealForContext(lunchMeal, "lunch", day) : null,
      dinner: dinnerMembers.length ? adaptMealForContext(dinnerMeal, "dinner", day) : null,
      note: getDayContextNote(day, lunchMembers, dinnerMembers, calculations.planning),
    };
  });
}

function getMealMembersForSlot(day, slot, calculations) {
  const members = calculations.planning.members;
  if (slot === "lunch") {
    const childrenAtSchool = state.preferences.seasonMode === "school" && !day.weekend && state.preferences.childLunchMode === "school";
    if (!childrenAtSchool) return members;
    return members.filter((member) => member.role !== "child" && member.role !== "teen");
  }
  return members.filter((member) => !isHusbandAwayForDinner(day, member));
}

function sumServingUnits(members) {
  return members.reduce((sum, member) => sum + servingUnit(member), 0);
}

function isHusbandAwayForDinner(day, member) {
  if (!(member.sex === "male" && member.role === "adult")) return false;
  if (state.preferences.husbandDinnerMode === "home") return false;
  if (state.preferences.husbandDinnerMode === "away") return true;
  return ["tue", "thu", "sat"].includes(day.key);
}

function adaptMealForContext(meal, type, day) {
  const heatNote = type === "dinner" && state.preferences.dinnerPrepMode === "reheat" ? "晚餐設計成可熱菜或一鍋菜" : meal.prep;
  const varietyNote = state.preferences.weeklyVariety === "comfort" ? "口味保守，孩子接受度優先" : state.preferences.weeklyVariety === "light" ? "清爽少油" : state.preferences.weeklyVariety === "budget" ? "優先用庫存與大包裝" : "本週刻意變換主蛋白";
  return { ...meal, prep: `${heatNote}｜${varietyNote}` };
}

function getDayContextNote(day, lunchMembers, dinnerMembers, planning) {
  const parts = [];
  parts.push(`${planning.shortLabel}計畫`);
  if (lunchMembers.length) parts.push(day.weekend ? `午餐 ${formatPortion(sumServingUnits(lunchMembers))} 人份` : `平日午餐 ${formatPortion(sumServingUnits(lunchMembers))} 人份`);
  else parts.push("本日午餐不主動備餐");
  if (state.preferences.husbandDinnerMode === "variable" && dinnerMembers.some((member) => member.sex === "male" && member.role === "adult")) parts.push(`晚餐估 ${formatPortion(sumServingUnits(dinnerMembers))} 人份，先生輪班彈性調整`);
  else parts.push(`晚餐 ${formatPortion(sumServingUnits(dinnerMembers))} 人份`);
  if (state.preferences.dinnerPrepMode === "reheat") parts.push("晚餐可復熱，適合媽媽接送後快速處理");
  return parts.join("；");
}

function formatPortion(value) {
  return Math.round(value * 10) / 10;
}

function renderWeeklyPlan(calculations) {
  const plan = buildWeeklyPlan(calculations);
  const audit = getWeeklyAudit(plan);
  const prepItems = weeklyMealPool.prep.map((item) => `<li>${item}</li>`).join("");
  const weeklyIngredients = [...new Set(plan.flatMap((day) => [day.lunch, day.dinner].filter(Boolean).flatMap((meal) => meal.ingredients)))];
  const weeklyMeals = plan.flatMap((day) => [day.lunch, day.dinner].filter(Boolean));
  const planning = calculations.planning;
  weekView.innerHTML = `
    <div class="plan-banner">
      <h3>${planning.label}的一週菜單</h3>
      <p>依本次備餐對象、孩子平日午餐、假期模式、先生輪班晚餐、媽媽可熱菜晚餐調整人份。切換「採買計畫：一週」時，採買會以這份週菜單為主。</p>
      <p class="sync-note">已套用左側設定：${getPreferenceSummary(state.preferences)}</p>
    </div>
    ${renderMomCarePanel(calculations)}
    ${renderPantrySyncSummary(weeklyMeals, "一週菜單")}
    <div class="weekly-layout">
      <section class="weekly-table">
        ${plan
          .map(
            (day) => `
              <article class="week-day-card">
                <h3>${day.label}</h3>
                <p>${day.note}</p>
                <div class="week-meal ${day.lunch ? "" : "muted-meal"}">
                  <b>午餐</b>
                  <span>${day.lunch ? `${day.lunch.title}｜${formatPortion(day.lunchUnits)} 人份` : "孩子學校用餐，家中不主動備午餐"}</span>
                  ${day.lunch ? `<small>${day.lunch.prep}</small>` : ""}
                  ${day.lunch ? `<small>${getSimpleMethodText(day.lunch)}</small>` : ""}
                </div>
                <div class="week-meal ${day.dinner ? "" : "muted-meal"}">
                  <b>晚餐</b>
                  <span>${day.dinner ? `${day.dinner.title}｜${formatPortion(day.dinnerUnits)} 人份` : "本日不主動備晚餐"}</span>
                  ${day.dinner ? `<small>${day.dinner.prep}</small>` : ""}
                  ${day.dinner ? `<small>${getSimpleMethodText(day.dinner)}</small>` : ""}
                </div>
              </article>
            `,
          )
          .join("")}
      </section>
      <section class="prep-panel">
        <h3>週末備菜大腦</h3>
        <ul>${prepItems}</ul>
        <h3>每週飲食檢視</h3>
        <div class="audit-list">
          ${audit.map((item) => `<article class="gap-item ${item.type}"><b>${item.title}</b><span>${item.detail}</span></article>`).join("")}
        </div>
        <h3>本週核心採買</h3>
        <div class="meal-meta">${weeklyIngredients.slice(0, 14).map((item) => `<span class="chip">${item}</span>`).join("")}</div>
      </section>
    </div>
  `;
}

function getWeeklyAudit(plan) {
  const allIngredients = plan.flatMap((day) => [day.lunch, day.dinner].filter(Boolean).flatMap((meal) => meal.ingredients));
  const fishCount = allIngredients.filter((item) => /魚|鮭/.test(item)).length;
  const beanCount = allIngredients.filter((item) => /豆腐|豆漿|毛豆/.test(item)).length;
  const vegCount = allIngredients.filter((item) => /菜|花椰菜|菠菜|番茄|菇|青江菜|白菜/.test(item)).length;
  const dinnerTitles = plan.map((day) => day.dinner?.title).filter(Boolean);
  const uniqueDinners = new Set(dinnerTitles).size;
  return [
    {
      type: fishCount >= 2 ? "already-owned" : "need-buy",
      title: "魚類與 Omega-3",
      detail: fishCount >= 2 ? "本週魚類安排足夠。" : "建議至少補 1-2 餐魚類，例如鮭魚或白肉魚湯。",
    },
    {
      type: beanCount >= 2 ? "already-owned" : "can-substitute",
      title: "豆製品與鈣質",
      detail: beanCount >= 2 ? "豆腐、毛豆等植物蛋白有出現。" : "可在熱菜晚餐加入豆腐、豆漿或毛豆。",
    },
    {
      type: vegCount >= 8 ? "already-owned" : "need-buy",
      title: "蔬菜密度",
      detail: vegCount >= 8 ? "蔬菜覆蓋度不錯，注意葉菜不要一次買太多。" : "蔬菜種類偏少，建議補深綠葉菜與菇類。",
    },
    {
      type: uniqueDinners >= 5 ? "already-owned" : "can-substitute",
      title: "菜色變化",
      detail: uniqueDinners >= 5 ? "晚餐變化度足夠，不會太一成不變。" : "晚餐重複度偏高，可換不同主蛋白或醬汁。",
    },
  ];
}

function getFastingNote(mealCount) {
  if (mealCount === 1) return "目前是一日一餐模式，建議優先確保蛋白質、蔬菜與水分，不必把所有熱量硬塞進單餐。";
  if (mealCount === 2) return "目前是 168 兩餐模式，建議兩餐都放足蛋白質，主食集中在活動量較高的時段。";
  if (mealCount === 4) return "目前是三餐加點心模式，點心以蛋白質或水果堅果為主。";
  return "目前是三餐模式，適合把主食與蛋白質平均分配。";
}

function getFamilyHints(members = state.members) {
  const hints = ["優先配置高纖蔬菜與足量蛋白質"];
  if (hasFocus("bloodSugar", members)) hints.push("主食選低 GI 並平均分配");
  if (hasFocus("cholesterol", members)) hints.push("減少油炸與高飽和脂肪");
  if (hasFocus("bone", members)) hints.push("增加豆製品、深綠蔬菜與鈣質來源");
  if (hasFocus("childFriendly", members)) hints.push("口味清淡並保留可分裝點心");
  return hints;
}

function renderNutrition(calculations) {
  const totals = calculations.totals;
  const planning = calculations.planning;
  const proteinPct = Math.round(((totals.protein * 4) / totals.calories) * 100);
  const carbPct = Math.round(((totals.carbs * 4) / totals.calories) * 100);

  nutritionView.innerHTML = `
    <div class="nutrition-layout">
      <div class="macro-ring" style="--protein: ${proteinPct}%; --carbs: ${proteinPct + carbPct}%">
        <div>${planning.shortLabel}<br>${Math.round(totals.calories)} kcal</div>
      </div>
      <table class="nutrition-table">
        <thead>
          <tr><th>項目</th><th>${planning.label}每日估算</th><th>規劃重點</th></tr>
        </thead>
        <tbody>
          <tr><td>熱量</td><td>${Math.round(totals.calories)} kcal</td><td>菜單以本次備餐對象需求分配到各餐</td></tr>
          <tr><td>蛋白質</td><td>${Math.round(totals.protein)}g</td><td>依體脂/瘦體重與目標加權</td></tr>
          <tr><td>碳水</td><td>${Math.round(totals.carbs)}g</td><td>${hasFocus("bloodSugar", planning.members) ? "偏向全穀、豆類與高纖蔬菜" : "主食分散到早餐與午餐"}</td></tr>
          <tr><td>脂肪</td><td>${Math.round(totals.fat)}g</td><td>以魚類、堅果、橄欖油為主</td></tr>
          <tr><td>纖維</td><td>${Math.round(totals.fiber)}g</td><td>每餐至少一份蔬菜或水果</td></tr>
          <tr><td>全家參考</td><td>${Math.round(calculations.familyTotals.calories)} kcal</td><td>需要切回全家備餐時，可直接改左側備餐對象</td></tr>
        </tbody>
      </table>
    </div>
    <div class="member-table-wrap">
      <table class="nutrition-table">
        <thead>
          <tr><th>成員</th><th>BMR/TDEE</th><th>BMI/體脂</th><th>每日蛋白質</th></tr>
        </thead>
        <tbody>
          ${calculations.members
            .map(
              (member) => `
              <tr>
                <td>${member.name}</td>
                <td>${member.bmr} / ${member.tdee} kcal</td>
                <td>${formatBmi(member.bmi)} ${member.status}｜${member.bodyFatStatus}</td>
                <td>${member.protein}g</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderShopping(meals, preferences, calculations) {
  const days = getPlanDays(preferences.planMode);
  const shoppingMeals = preferences.planMode === "week" ? buildWeeklyShoppingMeals(calculations) : meals;
  const items = buildShoppingItems(shoppingMeals, preferences.planMode === "week" ? 1 : days, calculations.totals.units);
  const selectedStores = preferences.stores.length ? preferences.stores : ["pxmart"];
  const grouped = groupBy(items, "category");
  const modeLabel = { today: "當天採買", week: "一週備餐", random: `${days} 天隨機補貨` }[preferences.planMode];
  const planning = calculations.planning;

  shoppingView.innerHTML = `
    <div class="plan-banner">
      <h3>${planning.label}｜${modeLabel}</h3>
      <p>${preferences.planMode === "week" ? "依一週菜單彙整週末備菜採買。" : `依 ${formatPortion(calculations.totals.units)} 人份與 ${days} 天估算。`} 實際庫存、外送區域與價格會依門市或平台即時變動，請用下方連結搜尋確認。</p>
      <p class="sync-note">已套用左側設定：${getPreferenceSummary(preferences)}</p>
    </div>
    ${renderAllergySafetyPanel(preferences)}
    ${renderPantrySyncSummary(shoppingMeals, preferences.planMode === "week" ? "一週採買" : "今日採買")}
    <div class="store-grid">
      ${selectedStores
        .map((storeId) => {
          const store = storeDirectory[storeId];
          return `
            <article class="store-card">
              <h3>${store.name}</h3>
              <p>${safeStoreBestFor(store).join("、")}</p>
              <a href="${store.url}" target="_blank" rel="noreferrer">開啟通路</a>
            </article>
          `;
        })
        .join("")}
    </div>
    <div class="shopping-grid">
      ${Object.entries(grouped)
        .map(
          ([group, groupItems]) => `
          <section class="shopping-group">
            <h3>${group}</h3>
            <ul>
              ${groupItems
                .map(
                  (item) => `
                  <li class="${shoppingStatusClass(item)}">
                    <span>${item.name}｜${item.quantity}</span>
                    <small>${shoppingStatusText(item)}</small>
                    <div class="link-row">
                      ${item.stores
                        .filter((storeId) => selectedStores.includes(storeId))
                        .slice(0, 3)
                        .map((storeId) => `<a href="${storeDirectory[storeId].search(item.name)}" target="_blank" rel="noreferrer">${storeDirectory[storeId].name}</a>`)
                        .join("")}
                    </div>
                  </li>
                `,
                )
                .join("")}
            </ul>
          </section>
        `,
        )
        .join("")}
    </div>
  `;
}

function buildWeeklyShoppingMeals(calculations) {
  return buildWeeklyPlan(calculations).flatMap((day) => [day.lunch, day.dinner].filter(Boolean));
}

function renderDiary(calculations) {
  const today = new Date().toISOString().slice(0, 10);
  const recent = [...state.diary].sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`)).slice(0, 12);
  const todayEntries = state.diary.filter((entry) => entry.date === today);
  const proteinScore = estimateDiaryProtein(todayEntries);

  diaryView.innerHTML = `
    <div class="diary-layout">
      <section class="diary-form-panel">
        <div class="plan-banner">
          <h3>每日飲食紀錄</h3>
          <p>記錄吃了什麼、飽足感與採買狀態。這些紀錄會放進 ChatGPT 協作 prompt，讓建議更貼近你的家庭日常。</p>
        </div>
        <div class="diary-form">
          <label>
            <span>日期</span>
            <input id="diaryDate" type="date" value="${today}" />
          </label>
          <label>
            <span>成員</span>
            <select id="diaryMember">
              <option value="全家">全家</option>
              ${calculations.members.map((member) => `<option value="${member.name}">${member.name}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>餐次</span>
            <select id="diaryMealType">
              <option value="第一餐">第一餐</option>
              <option value="第二餐">第二餐</option>
              <option value="單餐">單餐</option>
              <option value="早餐">早餐</option>
              <option value="午餐">午餐</option>
              <option value="晚餐">晚餐</option>
              <option value="點心">點心</option>
              <option value="採買">採買</option>
            </select>
          </label>
          <label>
            <span>吃了或買了什麼</span>
            <textarea id="diaryFood" rows="4" placeholder="例：鮭魚、糙米、花椰菜；或全聯買雞蛋兩盒"></textarea>
          </label>
          <label>
            <span>飽足感 1-5</span>
            <input id="diaryFullness" type="range" min="1" max="5" value="3" />
          </label>
          <label>
            <span>狀態</span>
            <select id="diaryMood">
              <option value="剛好">剛好</option>
              <option value="太餓">太餓</option>
              <option value="太飽">太飽</option>
              <option value="想吃甜">想吃甜</option>
              <option value="外食">外食</option>
              <option value="超買">超買</option>
            </select>
          </label>
          <label>
            <span>備註</span>
            <textarea id="diaryNote" rows="3" placeholder="例：晚餐後還想吃零食；今天好市多買太多肉"></textarea>
          </label>
          <button class="primary-button" type="button" id="addDiaryButton">加入今日紀錄</button>
        </div>
      </section>
      <section class="diary-list-panel">
        <div class="gap-grid">
          <article class="gap-item already-owned">
            <b>今日紀錄</b>
            <span>${todayEntries.length} 筆</span>
          </article>
          <article class="gap-item ${proteinScore.status}">
            <b>蛋白質線索</b>
            <span>${proteinScore.label}</span>
          </article>
        </div>
        <div class="diary-list">
          ${
            recent.length
              ? recent
                  .map(
                    (entry) => `
                    <article class="diary-card">
                      <div>
                        <b>${entry.date}｜${entry.member}｜${entry.mealType}</b>
                        <p>${entry.food}</p>
                        <span>飽足感 ${entry.fullness}/5｜${entry.mood}${entry.note ? `｜${entry.note}` : ""}</span>
                      </div>
                      <button class="icon-action small" type="button" data-delete-diary="${entry.id}" title="刪除紀錄" aria-label="刪除紀錄">×</button>
                    </article>
                  `,
                  )
                  .join("")
              : `<article class="diary-card"><div><b>尚無紀錄</b><p>先記下今天吃了什麼，之後 ChatGPT 才能看見你的趨勢。</p><span>資料只存在此瀏覽器</span></div></article>`
          }
        </div>
      </section>
    </div>
  `;
}

function estimateDiaryProtein(entries) {
  const proteinTerms = /(雞|魚|鮭|蝦|牛|蛋|豆腐|豆漿|優格|起司|毛豆|肉)/;
  const hits = entries.filter((entry) => proteinTerms.test(entry.food)).length;
  if (!entries.length) return { status: "can-substitute", label: "尚未記錄今日飲食" };
  if (hits >= 2) return { status: "already-owned", label: "今天蛋白質出現頻率不錯" };
  return { status: "need-buy", label: "今日蛋白質可能偏少，可請 ChatGPT 幫忙調整" };
}

function renderAiBridge(calculations, meals) {
  const prompt = buildChatGptPrompt(calculations, meals);
  const snapshot = buildShareSnapshot(calculations, meals);

  aiView.innerHTML = `
    <div class="ai-layout">
      <section class="ai-panel">
        <div class="plan-banner">
          <h3>ChatGPT Pro 協作模式</h3>
          <p>這裡不會自動把資料送出。你可以複製完整 prompt 到 ChatGPT Pro，也可以匯出 JSON；ChatGPT 回覆後再貼回來保存。</p>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" id="copyPromptButton">複製給 ChatGPT</button>
          <button class="secondary-button" type="button" id="downloadSnapshotButton">匯出 JSON</button>
          <label class="secondary-button file-button" for="snapshotImportInput">匯入 JSON</label>
          <input class="visually-hidden-file" id="snapshotImportInput" type="file" accept=".json,application/json" />
        </div>
        <textarea id="chatGptPrompt" rows="14" readonly>${escapeTextarea(prompt)}</textarea>
        <details class="data-preview">
          <summary>資料交換 JSON 預覽</summary>
          <pre>${escapeHtml(JSON.stringify(snapshot, null, 2))}</pre>
        </details>
      </section>
      <section class="ai-panel">
        <div class="plan-banner">
          <h3>貼回 ChatGPT 建議</h3>
          <p>把 ChatGPT Pro 給你的建議貼回來，app 會保留成紀錄，之後產生 prompt 時也會納入最近建議。</p>
        </div>
        <textarea id="aiResponseText" rows="8" placeholder="貼上 ChatGPT 的採買建議、菜單調整或避免超買提醒"></textarea>
        <div class="button-row">
          <button class="primary-button" type="button" id="saveAiAdviceButton">保存 AI 建議</button>
          <button class="secondary-button" type="button" id="clearAiAdviceButton">清空建議紀錄</button>
        </div>
        <div class="ai-advice-list">
          ${
            state.aiAdvice.length
              ? state.aiAdvice
                  .slice(0, 6)
                  .map(
                    (advice) => `
                    <article class="advice-card">
                      <b>${advice.createdAt}</b>
                      <p>${escapeHtml(advice.text)}</p>
                    </article>
                  `,
                  )
                  .join("")
              : `<article class="advice-card"><b>尚無 AI 建議</b><p>貼回 ChatGPT 的內容後，這裡會形成可追蹤的決策紀錄。</p></article>`
          }
        </div>
      </section>
    </div>
  `;
}

function buildShareSnapshot(calculations, meals) {
  const days = getPlanDays(state.preferences.planMode);
  const weeklyPlan = buildWeeklyPlan(calculations);
  return {
    appName: "家庭健康飲食指南",
    appVersion: APP_VERSION,
    updatedAt: APP_UPDATED_AT,
    createdAt: new Date().toLocaleString("zh-TW"),
    storagePolicy: "資料只儲存在此瀏覽器 localStorage；匯出 JSON 只有在使用者手動下載或分享時才會離開裝置。",
    appState: {
      members: state.members,
      preferences: state.preferences,
      pantry: state.pantry,
      diary: state.diary,
      aiAdvice: state.aiAdvice,
    },
    preferences: state.preferences,
    mealPattern: getMealPatternLabel(state.preferences.meals),
    planning: {
      label: calculations.planning.label,
      audience: calculations.planning.audience,
      members: calculations.planning.members.map((member) => member.name),
      totals: calculations.planning.totals,
    },
    recipeStrategy: {
      cuisineStyle: cuisineCopy[state.preferences.cuisineStyle]?.label,
      pantryMode: pantryModeCopy[state.preferences.pantryMode],
      severeAllergens: getAllergyTerms(state.preferences),
      avoidIngredients: getAvoidTerms(state.preferences),
    },
    familyTotals: calculations.familyTotals,
    members: calculations.members.map((member) => ({
      name: member.name,
      role: roleLabel(member.role),
      goal: goalCopy[member.goal]?.label,
      healthFocus: healthFocusCopy[member.healthFocus],
      bmi: member.bmi == null ? null : Number(member.bmi.toFixed(1)),
      bodyFat: member.bodyFat || null,
      leanMass: member.leanMass == null ? null : Number(member.leanMass.toFixed(1)),
      calories: member.targetCalories,
      protein: member.protein,
      carbs: member.carbs,
      fat: member.fat,
      fiber: member.fiber,
    })),
    pantry: state.pantry,
    menu: meals.map((meal) => ({
      slot: meal.slot,
      title: meal.title,
      calories: meal.calories,
      protein: meal.protein,
      portions: meal.familyPortions,
      ingredients: meal.ingredients,
      recipeLinks: getRecipeLinks(meal, state.preferences),
    })),
    shopping: buildShoppingItems(state.preferences.planMode === "week" ? buildWeeklyShoppingMeals(calculations) : meals, state.preferences.planMode === "week" ? 1 : days, calculations.totals.units).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      status: shoppingStatusText(item),
    })),
    weeklyPlan: weeklyPlan.map((day) => ({
      day: day.label,
      lunch: day.lunch ? day.lunch.title : "孩子在校用餐 / 家中不主動備午餐",
      dinner: day.dinner ? day.dinner.title : "本日不主動備晚餐",
      lunchUnits: day.lunchUnits,
      dinnerUnits: day.dinnerUnits,
      note: day.note,
    })),
    diaryRecent: state.diary.slice(-12),
    aiAdviceRecent: state.aiAdvice.slice(0, 4),
  };
}

function getMealPatternLabel(mealCount) {
  if (mealCount === 1) return "一日一餐 OMAD";
  if (mealCount === 2) return "168 兩餐";
  if (mealCount === 4) return "三餐加點心";
  return "三餐";
}

function buildChatGptPrompt(calculations, meals) {
  const snapshot = buildShareSnapshot(calculations, meals);
  const overbuySignals = state.diary.filter((entry) => /超買|買太多|囤太多/.test(`${entry.mood} ${entry.note} ${entry.food}`));
  return [
    "請你扮演家庭健康飲食與採買管理助理。",
    "我會提供本次備餐對象、家庭成員需求、家中庫存、今日菜單、採買缺口與最近飲食紀錄。",
    "請用繁體中文回答，重點是：",
    "1. 先確認這次是為全家、媽媽自己或特定成員備餐，份量不要自動放大。",
    "2. 判斷我購買前是否真的需要買，避免過度採買。",
    "3. 依本次備餐對象的營養需求，指出今天最該補的 3-5 個食材。",
    "4. 告訴我哪些家中已有食材應先消耗，並提供替代菜色。",
    "5. 若有血糖、膽固醇、骨質、孩童友善需求，請給出料理調整。",
    "6. 若 severeAllergens 有內容，請把它視為硬性排除，不要推薦含該過敏原或高交叉污染風險的食材。",
    "7. 請依我的餐次型態安排，不要假設我一定吃三餐。",
    "8. 請提供今天採買清單、一週備餐方向、不要買清單，並以減輕媽媽負擔為優先。",
    overbuySignals.length ? `特別注意：最近有 ${overbuySignals.length} 筆超買或囤貨訊號，請幫我克制採買。` : "目前沒有明顯超買紀錄，但仍請幫我檢查是否可能買太多。",
    "",
    "以下是 app 匯出的資料：",
    JSON.stringify(snapshot, null, 2),
  ].join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeTextarea(value) {
  return String(value).replaceAll("</textarea", "&lt;/textarea");
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

function downloadTextFile(filename, text, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function shoppingStatusClass(item) {
  if (item.status === "owned") return "already-owned";
  if (item.status === "reference") return "can-substitute";
  if (item.status === "substitute") return "can-substitute";
  return "need-buy";
}

function shoppingStatusText(item) {
  if (item.status === "owned") return `家中已有 ${item.pantryMatch.name} ${item.pantryMatch.quantity || ""}`;
  if (item.status === "reference") return `家中有 ${item.pantryMatch.name}，本次只作參考，不強制消耗`;
  if (item.status === "substitute") return `可先用 ${item.substitute.name} 替代，不足再補買`;
  return "營養或菜單缺口，建議優先採買";
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const group = item[key];
    groups[group] ||= [];
    groups[group].push(item);
    return groups;
  }, {});
}

function setActiveView(view) {
  tabs.forEach((item) => {
    const isActive = item.dataset.view === view;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${view}View`);
  });
}

function syncActiveMemberFromForm() {
  const index = state.members.findIndex((member) => member.id === state.activeMemberId);
  if (index === -1) return;
  state.members[index] = { ...state.members[index], ...readMemberFromForm() };
}

function updatePreferencesFromForm() {
  state.preferences = readPreferencesFromForm();
}

function saveAppState() {
  saveLocalData(MEMBER_STORAGE_KEY, state.members);
  saveLocalData(PREFERENCES_STORAGE_KEY, state.preferences);
  saveLocalData(PANTRY_STORAGE_KEY, state.pantry);
  saveLocalData("familyDietDiary", state.diary);
  saveLocalData("familyDietAiAdvice", state.aiAdvice);
}

function updateApp(event) {
  event?.preventDefault();
  syncActiveMemberFromForm();
  updatePreferencesFromForm();
  saveAppState();
  const calculations = familyCalculations();
  const meals = getMeals(state.preferences, calculations.totals, calculations.planning.members);
  renderMemberList();
  renderSummary(calculations);
  renderFamily(calculations);
  renderPantry(meals);
  renderMenu(meals, state.preferences, calculations);
  renderWeeklyPlan(calculations);
  renderNutrition(calculations);
  renderShopping(meals, state.preferences, calculations);
  renderDiary(calculations);
  renderAiBridge(calculations, meals);
  if (event?.type === "submit") {
    scaleImportStatus.textContent = "已更新家庭菜單、採買清單與食譜連結";
  }
}

function resetAll() {
  state.activeMemberId = "member-1";
  state.members = createDefaultMembers();
  state.preferences = { ...defaultPreferences };
  state.pantry = createDefaultPantry();
  state.importHistory = ["已重設預設家庭資料，庫存目前為空"];
  saveAppState();
  pantryText.value = "";
  scaleImportStatus.textContent = "已重設，可重新匯入成員資料與家中食材";
  photoPreview.classList.remove("active");
  photoPreview.innerHTML = "";
  writeMemberToForm(activeMember());
  writePreferencesToForm();
  updateApp();
}

function addMember() {
  syncActiveMemberFromForm();
  const next = state.members.length + 1;
  const member = {
    id: `member-${Date.now()}`,
    name: `家人 ${next}`,
    sex: "female",
    role: "adult",
    age: 30,
    height: 165,
    weight: 60,
    activity: 1.375,
    bodyFat: "",
    muscleMass: "",
    boneMass: "",
    visceralFat: "",
    bodyWater: "",
    waist: "",
    goal: "maintain",
    healthFocus: "general",
  };
  state.members.push(member);
  state.activeMemberId = member.id;
  writeMemberToForm(member);
  updateApp();
}

function readTextFile(file, onText) {
  const reader = new FileReader();
  reader.addEventListener("load", () => onText(String(reader.result || "")));
  reader.addEventListener("error", () => {
    scaleImportStatus.textContent = "檔案讀取失敗，請改用 CSV、JSON 或純文字";
  });
  reader.readAsText(file);
}

function importScaleData(file) {
  if (!file) return;
  readTextFile(file, (text) => {
    const parsed = parseScaleText(text);
    if (!Object.keys(parsed).length) {
      scaleImportStatus.textContent = "沒有讀到可套用的身體資料，請確認欄位名稱包含體重、體脂、肌肉量等關鍵字";
      return;
    }
    syncActiveMemberFromForm();
    const index = state.members.findIndex((member) => member.id === state.activeMemberId);
    state.members[index] = { ...state.members[index], ...parsed };
    writeMemberToForm(state.members[index]);
    state.importHistory.unshift(`已從 ${file.name} 匯入 ${Object.keys(parsed).length} 個欄位到 ${state.members[index].name}`);
    scaleImportStatus.textContent = state.importHistory[0];
    updateApp();
  });
}

function parseScaleText(text) {
  const cleanText = text.replace(/\r/g, "\n");
  try {
    const json = JSON.parse(cleanText);
    return normalizeScaleObject(json);
  } catch {
    return normalizeScaleObject(parseKeyValueText(cleanText));
  }
}

function parseKeyValueText(text) {
  const fields = {};
  text
    .split(/\n|,|，|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split(/:|：|=/);
      if (parts.length >= 2) fields[parts[0].trim()] = parts.slice(1).join(":").trim();
      else {
        const match = line.match(/([^\d]+)\s*([\d.]+)/);
        if (match) fields[match[1].trim()] = match[2];
      }
    });
  return fields;
}

function normalizeScaleObject(source) {
  const aliases = {
    name: ["name", "姓名", "成員"],
    age: ["age", "年齡"],
    height: ["height", "身高", "身高cm"],
    weight: ["weight", "體重", "體重kg"],
    bodyFat: ["bodyFat", "體脂", "體脂肪", "體脂率", "body fat"],
    muscleMass: ["muscleMass", "肌肉量", "骨骼肌", "skeletal muscle"],
    boneMass: ["boneMass", "骨量", "骨重"],
    visceralFat: ["visceralFat", "內臟脂肪", "內臟脂肪等級"],
    bodyWater: ["bodyWater", "水分", "身體水分"],
    waist: ["waist", "腰圍"],
  };
  const normalized = {};
  Object.entries(aliases).forEach(([field, names]) => {
    const key = Object.keys(source).find((candidate) => names.some((name) => candidate.toLowerCase().includes(String(name).toLowerCase())));
    if (!key) return;
    normalized[field] = field === "name" ? String(source[key]).trim() : numberOrBlank(String(source[key]).replace(/[^\d.]/g, ""));
  });
  return normalized;
}

function previewIngredientPhoto(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    photoPreview.innerHTML = `<img src="${reader.result}" alt="上傳的食材照片預覽" />`;
    photoPreview.classList.add("active");
    state.importHistory.unshift(`已加入照片預覽：${file.name}。請用文字或語音補上辨識到的食材。`);
    scaleImportStatus.textContent = state.importHistory[0];
    updateApp();
  });
  reader.readAsDataURL(file);
}

function addPantryFromText(text, source = "文字") {
  const items = parsePantryText(text);
  if (!items.length) {
    scaleImportStatus.textContent = "尚未讀到食材，請輸入例如：雞蛋 6 顆、花椰菜 1 顆";
    pantryText.focus();
    return;
  }
  items.forEach((item) => upsertPantryItem({ ...item, source }));
  saveLocalData(PANTRY_STORAGE_KEY, state.pantry);
  state.importHistory.unshift(`已加入 ${items.length} 筆家中食材，右側菜單與採買已同步更新`);
  scaleImportStatus.textContent = state.importHistory[0];
  pantryText.value = "";
  updateApp();
  setActiveView("pantry");
}

function parsePantryText(text) {
  return text
    .split(/\n|、|,|，|;/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^(.+?)(\s*[\d一二三四五六七八九十半兩]+.*)$/);
      const name = (match ? match[1] : chunk).replace(/家裡有|我有|還有/g, "").trim();
      const quantity = match ? match[2].trim() : "未填數量";
      return { name, quantity, category: getIngredientCategory(name) };
    })
    .filter((item) => item.name.length > 0);
}

function upsertPantryItem(item) {
  const index = state.pantry.findIndex((existing) => existing.name === item.name);
  if (index >= 0) {
    state.pantry[index] = { ...state.pantry[index], ...item };
  } else {
    state.pantry.push(item);
  }
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    scaleImportStatus.textContent = "此瀏覽器不支援語音辨識，我已切到文字輸入，可直接打：雞蛋 6 顆、青江菜 2 把";
    pantryText.focus();
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "zh-TW";
  recognition.interimResults = false;
  voiceButton.disabled = true;
  voiceButton.textContent = "聆聽中";
  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("、");
    pantryText.value = pantryText.value ? `${pantryText.value}、${transcript}` : transcript;
    scaleImportStatus.textContent = "已辨識語音，可修正文字後按「加入庫存」";
    pantryText.focus();
  });
  recognition.addEventListener("error", () => {
    scaleImportStatus.textContent = "語音辨識失敗，可能是麥克風權限或瀏覽器限制，請改用文字輸入";
    pantryText.focus();
  });
  recognition.addEventListener("end", () => {
    voiceButton.disabled = false;
    voiceButton.textContent = "語音輸入";
  });
  recognition.start();
  scaleImportStatus.textContent = "正在聆聽家中食材...";
}

function addDiaryEntry() {
  const food = document.querySelector("#diaryFood")?.value.trim();
  if (!food) {
    scaleImportStatus.textContent = "請先輸入今天吃了或買了什麼";
    return;
  }
  const entry = {
    id: `diary-${Date.now()}`,
    date: document.querySelector("#diaryDate")?.value || new Date().toISOString().slice(0, 10),
    member: document.querySelector("#diaryMember")?.value || "全家",
    mealType: document.querySelector("#diaryMealType")?.value || "餐次",
    food,
    fullness: Number(document.querySelector("#diaryFullness")?.value || 3),
    mood: document.querySelector("#diaryMood")?.value || "剛好",
    note: document.querySelector("#diaryNote")?.value.trim() || "",
    createdAt: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
  };
  state.diary.push(entry);
  saveLocalData("familyDietDiary", state.diary);
  scaleImportStatus.textContent = "已加入每日飲食紀錄";
  updateApp();
}

function deleteDiaryEntry(id) {
  state.diary = state.diary.filter((entry) => entry.id !== id);
  saveLocalData("familyDietDiary", state.diary);
  scaleImportStatus.textContent = "已刪除一筆飲食紀錄";
  updateApp();
}

function saveAiAdvice() {
  const text = document.querySelector("#aiResponseText")?.value.trim();
  if (!text) {
    scaleImportStatus.textContent = "請先貼上 ChatGPT 的建議";
    return;
  }
  state.aiAdvice.unshift({
    id: `ai-${Date.now()}`,
    text,
    createdAt: new Date().toLocaleString("zh-TW"),
  });
  state.aiAdvice = state.aiAdvice.slice(0, 20);
  saveLocalData("familyDietAiAdvice", state.aiAdvice);
  scaleImportStatus.textContent = "已保存 ChatGPT 建議";
  updateApp();
}

function clearAiAdvice() {
  state.aiAdvice = [];
  saveLocalData("familyDietAiAdvice", state.aiAdvice);
  scaleImportStatus.textContent = "已清空 AI 建議紀錄";
  updateApp();
}

function currentSnapshotAndPrompt() {
  syncActiveMemberFromForm();
  updatePreferencesFromForm();
  const calculations = familyCalculations();
  const meals = getMeals(state.preferences, calculations.totals, calculations.planning.members);
  return {
    snapshot: buildShareSnapshot(calculations, meals),
    prompt: buildChatGptPrompt(calculations, meals),
  };
}

function copyPromptForChatGpt() {
  const { prompt } = currentSnapshotAndPrompt();
  copyText(prompt)
    .then(() => {
      scaleImportStatus.textContent = "已複製，可貼到 ChatGPT Pro 詢問";
    })
    .catch(() => {
      scaleImportStatus.textContent = "複製失敗，請手動選取 AI 協作文字框內容";
    });
}

function downloadCurrentSnapshot() {
  const { snapshot } = currentSnapshotAndPrompt();
  downloadTextFile(`家庭飲食資料-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2));
  scaleImportStatus.textContent = "已匯出可上傳 ChatGPT 的 JSON";
}

function importSnapshotData(snapshot) {
  const appState = snapshot.appState || snapshot;
  if (Array.isArray(appState.members) && appState.members.length) {
    state.members = appState.members.map((member, index) => ({ ...createDefaultMembers()[index % createDefaultMembers().length], ...member, id: member.id || `member-${Date.now()}-${index}` }));
    state.activeMemberId = state.members[0].id;
  }
  if (appState.preferences) state.preferences = { ...defaultPreferences, ...appState.preferences };
  if (Array.isArray(appState.pantry)) state.pantry = appState.pantry;
  if (Array.isArray(appState.diary)) state.diary = appState.diary;
  else if (Array.isArray(snapshot.diaryRecent)) state.diary = snapshot.diaryRecent;
  if (Array.isArray(appState.aiAdvice)) state.aiAdvice = appState.aiAdvice;
  else if (Array.isArray(snapshot.aiAdviceRecent)) state.aiAdvice = snapshot.aiAdviceRecent;
  state.importHistory.unshift(`已匯入 ${snapshot.appName || "家庭飲食"} JSON 快照`);
  writeMemberToForm(activeMember());
  writePreferencesToForm();
  saveAppState();
  updateApp();
  setActiveView("ai");
}

function importSnapshotFile(file) {
  if (!file) return;
  readTextFile(file, (text) => {
    try {
      const snapshot = JSON.parse(text);
      importSnapshotData(snapshot);
      scaleImportStatus.textContent = `已匯入 ${file.name}，資料只保存於此瀏覽器`;
    } catch {
      scaleImportStatus.textContent = "JSON 匯入失敗，請確認檔案是本 app 匯出的資料快照";
    }
  });
}

memberList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-member-id]");
  if (!button) return;
  syncActiveMemberFromForm();
  state.activeMemberId = button.dataset.memberId;
  writeMemberToForm(activeMember());
  updateApp();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveView(tab.dataset.view);
  });
});

form.addEventListener("submit", updateApp);
form.addEventListener("input", updateApp);
form.addEventListener("change", updateApp);
resetButton.addEventListener("click", resetAll);
addMemberButton.addEventListener("click", addMember);
scaleFileInput.addEventListener("change", (event) => importScaleData(event.target.files[0]));
ingredientPhotoInput.addEventListener("change", (event) => previewIngredientPhoto(event.target.files[0]));
addPantryButton.addEventListener("click", () => addPantryFromText(pantryText.value));
voiceButton.addEventListener("click", startVoiceInput);
document.addEventListener("click", (event) => {
  const deleteDiaryId = event.target.closest("[data-delete-diary]")?.dataset.deleteDiary;
  if (deleteDiaryId) {
    deleteDiaryEntry(deleteDiaryId);
    return;
  }
  if (event.target.closest("#addDiaryButton")) addDiaryEntry();
  if (event.target.closest("#copyPromptButton")) copyPromptForChatGpt();
  if (event.target.closest("#downloadSnapshotButton")) downloadCurrentSnapshot();
  if (event.target.closest("#saveAiAdviceButton")) saveAiAdvice();
  if (event.target.closest("#clearAiAdviceButton")) clearAiAdvice();
});

document.addEventListener("change", (event) => {
  if (event.target.closest("#snapshotImportInput")) importSnapshotFile(event.target.files[0]);
});

writeMemberToForm(activeMember());
writePreferencesToForm();
updateApp();

window.familyDietApp = {
  parseScaleText,
  parsePantryText,
  importSnapshotData,
  state,
};
