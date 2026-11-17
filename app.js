(() => {
"use strict";
const $ = id => document.getElementById(id);
const imageAsset = name => (window.EH_SR90_MEDIA && window.EH_SR90_MEDIA[name]) || new URL(`./assets/${name}`, document.baseURI).href;
const DAY_NAMES=["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"];
const LONG_DAYS=["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
const MODE={
  lift:{label:"RF × EMS LIFT",tag:"RF",minutes:6,symbol:"RF",subtitle:"Лифтинг и мышечная стимуляция",kind:"rf"},
  pump:{label:"RF PUMP",tag:"RF",minutes:6,symbol:"RF",subtitle:"Радиочастотный уход",kind:"rf"},
  eye:{label:"EYE CARE",tag:"EYE",minutes:2,symbol:"EYE",subtitle:"Уход за областью вокруг глаз",kind:"eye"},
  rest:{label:"Восстановление",tag:"УХОД",minutes:0,symbol:"✧",subtitle:"Ежедневный уход без специального режима",kind:"rest"}
};
const DAILY_COMPLIMENTS=['Твоя улыбка умеет делать день светлее.', 'В тебе удивительно красиво сочетаются нежность и сила.', 'Твоя доброта — настоящее украшение.', 'Ты заслуживаешь самого бережного отношения к себе.', 'В твоём присутствии становится теплее.', 'Твоя естественность — твоя особенная прелесть.', 'Ты умеешь находить красоту в простых моментах.', 'Твоя внутренняя гармония заметна даже в мелочах.', 'Ты прекрасна не только в особенные дни, но и в обычные.', 'Твоя искренность делает тебя особенной.', 'В тебе есть тихое очарование, которое запоминается.', 'Ты достойна заботы не за достижения, а просто потому, что ты есть.', 'Твоя улыбка — маленькое чудо этого дня.', 'Ты умеешь вдохновлять своим примером.', 'Твоя мягкость совсем не отменяет твою силу.', 'У тебя замечательный вкус к жизни.', 'Ты заслуживаешь времени, которое посвящаешь себе.', 'Твоё спокойствие — очень красивое качество.', 'Ты умеешь делать мир вокруг чуть добрее.', 'В тебе есть особая элегантность — в словах и поступках.', 'Твоя любознательность делает тебя ещё интереснее.', 'Ты прекрасна своей неповторимостью.', 'Твоя забота о себе — достойный повод для гордости.', 'Ты умеешь замечать детали, которые другие пропускают.', 'В тебе много света, даже когда день непростой.', 'Твоя уверенность растёт с каждым добрым выбором в свою пользу.', 'Ты заслуживаешь комплиментов и без всякого повода.', 'Твоя нежность к миру начинается с нежности к себе.', 'Ты умеешь сочетать рассудительность и лёгкость.', 'Твоё чувство юмора — отдельное очарование.', 'Ты гораздо сильнее, чем иногда думаешь.', 'Твоя индивидуальность — твоя настоящая изюминка.', 'Ты умеешь превращать заботу в красивый ритуал.', 'В тебе есть редкое качество — быть собой без лишнего шума.', 'Твоя энергия способна вдохновлять.', 'Ты достойна красивых слов, тёплых встреч и спокойных вечеров.', 'Твоя внимательность к близким очень ценна.', 'Ты умеешь быть опорой и при этом оставаться нежной.', 'Твоя улыбка — прекрасный аксессуар на каждый день.', 'Ты достойна того, чтобы выбирать себя без чувства вины.', 'В тебе есть благородство, которое не нуждается в доказательствах.', 'Ты умеешь создавать вокруг себя уют.', 'Твоя смелость проявляется даже в маленьких шагах.', 'Ты интересная, глубокая и по-своему волшебная.', 'Твоя доброжелательность делает встречи приятнее.', 'Ты заслуживаешь отдыха так же, как и успеха.', 'В тебе красиво сочетаются ум, чувство меры и обаяние.', 'Ты умеешь начинать заново — и это большая сила.', 'Твоя открытость миру делает жизнь ярче.', 'Ты достойна любви, уважения и бережного отношения.', 'У тебя есть свой неповторимый стиль — и в нём твоя прелесть.', 'Твоя деликатность — настоящее искусство.', 'Ты умеешь вдохновлять не словами, а самим отношением к жизни.', 'Твои маленькие победы тоже заслуживают праздника.', 'В тебе есть особенная женственность без всяких правил.', 'Ты прекрасна, когда смеёшься, мечтаешь и остаёшься собой.', 'Твоя внимательность к себе — проявление мудрости.', 'Ты умеешь привносить тепло даже в обычный разговор.', 'Твоя сила может быть спокойной — и от этого не становится меньше.', 'Ты заслуживаешь дня, в котором будет место только приятному.', 'В тебе есть лёгкость, которая располагает к себе.', 'Ты умеешь видеть возможности там, где другие видят препятствия.', 'Твоё мнение важно, а твой голос достоин быть услышанным.', 'Ты достойна гордиться тем, какой путь уже прошла.', 'Твоя чуткость — красивое и редкое качество.', 'Ты умеешь быть сильной и просить о поддержке — это тоже сила.', 'В тебе есть очарование, которое не зависит от настроения.', 'Ты заслуживаешь нежности в каждом дне.', 'Твоя способность радоваться мелочам делает жизнь богаче.', 'Ты умеешь выбирать то, что приносит тебе спокойствие.', 'Твоя искра чувствуется даже через экран.', 'Ты красива своей историей, характером и мечтами.', 'Твой интерес к новому делает тебя ещё ярче.', 'Ты достойна пространства для своих желаний.', 'Твоя улыбка умеет поддержать лучше многих слов.', 'В тебе есть удивительное сочетание практичности и мечтательности.', 'Ты умеешь создавать красоту вокруг себя.', 'Твои старания имеют значение, даже если их никто не заметил.', 'Ты заслуживаешь говорить с собой так же ласково, как с подругой.', 'Твоя самостоятельность вызывает уважение.', 'Ты прекрасна не по чьим-то меркам, а по праву быть собой.', 'В тебе есть спокойная уверенность, которая притягивает.', 'Ты умеешь делать выбор в пользу своего благополучия.', 'Твоя душевная щедрость делает мир добрее.', 'Ты можешь гордиться своей стойкостью.', 'Твоя способность учиться и меняться восхищает.', 'Ты заслуживаешь приятных сюрпризов и добрых новостей.', 'В тебе есть лёгкость, которая делает даже будни особенными.', 'Ты умеешь быть внимательной, не забывая о себе.', 'Твоё присутствие может стать чьим-то счастливым моментом.', 'Ты достойна любви без условий и заботы без напоминаний.', 'Твоя внутренняя красота проявляется в каждом добром поступке.', 'Ты умеешь сохранять достоинство и тепло одновременно.', 'Твоя способность мечтать — прекрасный источник энергии.', 'Ты заслуживаешь самого красивого отношения — в том числе от себя.', 'В тебе есть талант превращать обычное в особенное.', 'Ты умеешь находить свой темп — и это мудро.', 'Твоя честность с собой заслуживает уважения.', 'Ты прекрасна в своём собственном ритме.', 'Ты уже достаточно хороша — сегодня не нужно ничего доказывать.', 'Пусть сегодня ты увидишь в себе столько же хорошего, сколько видят близкие.', 'Ты — прекрасная причина сделать этот вечер чуть нежнее.'];
const DEFAULT_PLAN=["lift","rest","eye","rest","pump","rest","eye"];
const DEFAULT={version:14,plan:DEFAULT_PLAN,completed:{},stepChecks:{},notes:{},time:"21:00",eveningReminder:true,specialReminder:true,soundEnabled:true,products:{clean:"Sesderma SENSYSES Classic",moist:"Sesderma C-VIT5",lift:"Panasonic EH-4R06",pump:"Сыворотка или эмульсия по инструкции Panasonic",eye:"MT Metatron B5 Contour"},goal:{name:"",date:""},lastNotification:"",complimentDate:"",complimentIndex:-1};
const STORAGE="ehsr90-planner-v2"; // сохраняем прежний ключ, чтобы не потерять данные установившего приложение пользователя
let data=loadData();
let currentScreen="today";
let selectedDay=(new Date().getDay()+6)%7;
let todayDetailsOpen=true;
let selectedHistoryDate=localDateKey(new Date());
let monthCursor=new Date(new Date().getFullYear(),new Date().getMonth(),1,12);
let guideSteps=[],guideIndex=0,guideRemaining=0,guideInterval=null,guideRunning=false,guideEndsAt=null;
let reminderInterval=null,toastTimer=null,audioContext=null;
let videoIndex=0,photoIndex=0,photoItems=[],cleanIndex=0,gestureStart=null;

function clone(obj){return JSON.parse(JSON.stringify(obj));}
function loadData(){
  try{
    const raw=localStorage.getItem(STORAGE);
    if(raw){
      const parsed=JSON.parse(raw);
      const validPlan=Array.isArray(parsed.plan)&&parsed.plan.length===7&&parsed.plan.every(x=>["rest","lift","pump","eye"].includes(x));
      return {...clone(DEFAULT),...parsed,version:14,plan:validPlan?parsed.plan:clone(DEFAULT_PLAN),completed:parsed.completed||{},stepChecks:parsed.stepChecks||{},notes:parsed.notes||{},products:{...DEFAULT.products,...(parsed.products||{})},goal:parsed.goal||{name:"",date:""},eveningReminder:parsed.eveningReminder!==false,specialReminder:parsed.specialReminder!==false,soundEnabled:parsed.soundEnabled!==false,time:/^\d{2}:\d{2}$/.test(parsed.time||"")?parsed.time:"21:00"};
    }
    const old=localStorage.getItem("ehsr90-planner-v1");
    if(old){const parsed=JSON.parse(old);return {...clone(DEFAULT),completed:parsed.done||{},notes:Object.fromEntries(Object.entries(parsed.notes||{}).map(([k,v])=>[k,typeof v==="string"?{text:v,feeling:""}:v])),time:parsed.time||"21:00"};}
  }catch(error){console.warn("Не удалось прочитать локальные данные",error);}
  return clone(DEFAULT);
}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(data));}catch(error){showToast("Не удалось сохранить данные браузера");}}
function localDateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function parseLocalDate(key){const [y,m,d]=key.split("-").map(Number);return new Date(y,m-1,d,12);}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x;}
function mondayOf(d){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
function weekDateKeys(){const mon=mondayOf(new Date());return DAY_NAMES.map((_,i)=>localDateKey(addDays(mon,i)));}
function selectedDateKey(){return weekDateKeys()[selectedDay];}
function modeForDay(i){return MODE[data.plan[i]]||MODE.rest;}
function isSpecial(code){return code!=="rest";}
function dateFmt(d,opts={weekday:"long",day:"numeric",month:"long"}){return new Intl.DateTimeFormat("ru-RU",opts).format(d);}
function showToast(message){const node=$("toast");if(!node)return;node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2800);}
function switchScreen(screen){
  currentScreen=screen;
  document.querySelectorAll(".screen").forEach(el=>el.classList.toggle("active",el.id===`screen-${screen}`));
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.screen===screen));
  if(screen==="today")renderToday();if(screen==="plan")renderPlan();if(screen==="history")renderHistory();if(screen==="settings")renderSettings();if(screen==="technique")renderTechnique();
  window.scrollTo({top:0,behavior:"smooth"});
}
function stepsForDay(i){
  const code=data.plan[i],steps=[
    {id:"prep",title:"Снять макияж и умыться",detail:"Подготовить чистую кожу",minutes:0,short:"Подготовка"},
    {id:"clean",title:"CLEAN",detail:`${data.products.clean} · ватный диск`,minutes:3,short:"Очищение",movementPace:"На одну стрелку: ①–③ — около 7 секунд; ④ — около 5 секунд; ⑤–⑧ — около 3 секунд.",movementNote:"03:00 — общая длительность режима CLEAN. Время 7/5/3 секунды относится к темпу одного движения по стрелке, а не ко всему режиму."},
    {id:"moist",title:"MOIST",detail:data.products.moist,minutes:3,short:"Увлажняющий уход",movementPace:"На одну стрелку: ①–③ — около 7 секунд; ④–⑦ — около 3 секунд.",movementNote:"03:00 — общая длительность режима MOIST. Время 7/3 секунды — ориентир для одного движения по стрелке, а не длительность всего режима."}
  ];
  if(code==="lift")steps.push({id:"special",title:"RF × EMS LIFT",detail:`${data.products.lift} · начать с уровня EMS 1`,minutes:6,short:"Специальный режим",movementPace:"На одну стрелку: ①–⑦ — около 7 секунд; ⑧–⑩ — около 3 секунд.",movementNote:"06:00 — общая длительность RF × EMS LIFT, а не 6 секунд. Темп 7/3 секунды относится к отдельным движениям по стрелкам. В середине процедуры перейди на другую половину лица по сигналу прибора."});
  if(code==="pump")steps.push({id:"special",title:"RF PUMP",detail:`${data.products.pump}`,minutes:6,short:"Специальный режим",movementPace:"На одну стрелку: ①–⑦ — около 7 секунд; ⑧–⑩ — около 3 секунд.",movementNote:"06:00 — общая длительность RF PUMP. Темп 7/3 секунды относится к отдельным движениям по стрелкам, а не ко всему режиму."});
  if(code==="eye")steps.push({id:"special",title:"EYE CARE",detail:`${data.products.eye} · только если производитель разрешает применение вокруг глаз; не обрабатывать веки`,minutes:2,short:"Специальный режим",movementPace:"Движение выполняй по стрелке на схеме Panasonic, около 5 секунд на проход.",movementNote:"02:00 — общая длительность EYE CARE. Не обрабатывай веки; следуй направлению движения на официальной схеме."});
  steps.push({id:"finish",title:"Завершающий уход",detail:code==="eye"?"При необходимости нанести разрешённое средство для области вокруг глаз тонким слоем.":"Нанести MT Metatron B5 Contour как завершающий крем.",minutes:0,short:"Финальный уход"});
  return steps;
}
function checkKey(dateKey,id){return `${dateKey}|${id}`;}
function stepDone(dateKey,id){return !!data.stepChecks[checkKey(dateKey,id)];}
function setStepDone(dateKey,id,value){if(value)data.stepChecks[checkKey(dateKey,id)]=true;else{delete data.stepChecks[checkKey(dateKey,id)];delete data.completed[dateKey];}const all=stepsForDay(selectedDay).every(step=>stepDone(dateKey,step.id));if(all)data.completed[dateKey]=true;else delete data.completed[dateKey];persist();}
function completed(dateKey){return !!data.completed[dateKey];}
function getDailyCompliment(){
  const today=localDateKey(new Date());
  if(data.complimentDate!==today||!Number.isInteger(data.complimentIndex)||data.complimentIndex<0||data.complimentIndex>=DAILY_COMPLIMENTS.length){
    const previous=data.complimentIndex;let next=Math.floor(Math.random()*DAILY_COMPLIMENTS.length);
    if(DAILY_COMPLIMENTS.length>1&&next===previous)next=(next+1+Math.floor(Math.random()*(DAILY_COMPLIMENTS.length-1)))%DAILY_COMPLIMENTS.length;
    data.complimentDate=today;data.complimentIndex=next;persist();
  }
  return DAILY_COMPLIMENTS[data.complimentIndex];
}
function renderHeader(){$("dailyCompliment").textContent=getDailyCompliment();}
function renderWeekStrip(){
  const grid=$("weekStrip");grid.innerHTML="";const keys=weekDateKeys(),todayKey=localDateKey(new Date());
  keys.forEach((key,i)=>{const d=parseLocalDate(key),m=modeForDay(i),b=document.createElement("button");b.type="button";b.className="week-day"+(selectedDay===i?" selected":"")+(key===todayKey?" today":"")+(completed(key)?" done":"");
    const day=document.createElement("span");day.className="dow";day.textContent=DAY_NAMES[i];const num=document.createElement("span");num.className="num";num.textContent=d.getDate();const tag=document.createElement("span");tag.className="tag";tag.textContent=m.tag;b.append(day,num,tag);
    b.addEventListener("click",()=>{stopGuideTimer();if(selectedDay===i){todayDetailsOpen=!todayDetailsOpen;}else{selectedDay=i;todayDetailsOpen=true;}renderToday();});grid.appendChild(b);
  });
}
function renderToday(){
  const key=selectedDateKey(),mode=modeForDay(selectedDay),steps=stepsForDay(selectedDay),done=completed(key),checks=steps.filter(s=>stepDone(key,s.id)).length;
  $("todayDetails").hidden=!todayDetailsOpen;$("collapseHint").hidden=!todayDetailsOpen;
  $("todayMode").textContent=mode.label;$("todaySubtitle").textContent=mode.subtitle;$("modeSymbol").textContent=mode.symbol;$("modeSymbol").className="mode-symbol"+(mode.kind==="eye"?" eye":mode.kind==="rest"?" rest":"");
  $("todayTime").textContent=data.time||"21:00";$("todayDuration").textContent=mode.minutes?`${mode.minutes} мин`:"ежедневный уход";$("todayStatus").textContent=done?"Выполнено":"Запланировано";$("todayStatus").className="status-pill"+(done?" done":"");
  $("todayProgress").style.width=`${Math.round(checks/steps.length*100)}%`;$("stepProgressText").textContent=`${checks} из ${steps.length} этапов`;$("progressPercent").textContent=`${Math.round(checks/steps.length*100)}%`;
  const list=$("todaySteps");list.innerHTML="";
  steps.forEach(s=>{const row=document.createElement("div");const isDone=stepDone(key,s.id);row.className="step-item"+(isDone?" is-complete":"");const btn=document.createElement("button");btn.type="button";btn.className="step-check"+(isDone?" checked":"");btn.textContent=isDone?"✓":"";btn.setAttribute("aria-label",isDone?"Снять отметку":"Отметить выполненным");btn.setAttribute("aria-pressed",String(isDone));btn.addEventListener("click",()=>{setStepDone(key,s.id,!isDone);renderToday();renderHistory();});
    const copy=document.createElement("div");copy.className="step-copy";const strong=document.createElement("strong");strong.textContent=s.title;const small=document.createElement("small");small.textContent=s.detail;copy.append(strong,small);const duration=document.createElement("span");duration.className="step-duration";duration.textContent=s.minutes?`${s.minutes} мин`:"";row.append(btn,copy,duration);list.appendChild(row);});
  $("todaySafetyNote").textContent=mode.kind==="rf"?"Для RF × EMS LIFT используй Panasonic EH-4R06. Для RF PUMP — средство, предусмотренное Panasonic для этого режима.":mode.kind==="eye"?"EYE CARE выполняй без обработки век. Крем для области вокруг глаз используй только при разрешении на упаковке.":"В день восстановления специальных режимов нет. CLEAN и MOIST можно выполнять ежедневно.";
  $("markAllBtn").textContent=done?"Снять отметку о завершении":"Завершить уход";
  $("markAllBtn").onclick=()=>{const k=selectedDateKey();if(completed(k)){delete data.completed[k];steps.forEach(s=>delete data.stepChecks[checkKey(k,s.id)]);}else{data.completed[k]=true;steps.forEach(s=>data.stepChecks[checkKey(k,s.id)]=true);}persist();renderToday();renderHistory();showToast(completed(k)?"Уход отмечен выполненным":"Отметка снята");};
  renderWeekStrip();renderGoalCard();
}
function renderGoalCard(){const goal=data.goal||{},card=$("goalCard");if(!goal.name||!goal.date){card.hidden=true;return;}const target=parseLocalDate(goal.date);target.setHours(0,0,0,0);const today=new Date();today.setHours(0,0,0,0);const n=Math.round((target-today)/86400000);card.hidden=false;$("goalTitle").textContent=goal.name;$("goalCountdown").textContent=n>0?`До события ${n} ${plural(n,["день","дня","дней"])}`:n===0?"Это сегодня":`Событие было ${Math.abs(n)} ${plural(Math.abs(n),["день","дня","дней"])} назад`;}
function plural(n,forms){const n10=n%10,n100=n%100;return n10===1&&n100!==11?forms[0]:n10>=2&&n10<=4&&(n100<12||n100>14)?forms[1]:forms[2];}
function validatePlan(plan){
  const rfDays=plan.map((x,i)=>(x==="lift"||x==="pump")?i:-1).filter(i=>i>=0),eyeDays=plan.map((x,i)=>x==="eye"?i:-1).filter(i=>i>=0);
  if(rfDays.length>3)return "RF × EMS LIFT и RF PUMP вместе можно планировать не чаще 3 раз в неделю.";
  if(eyeDays.length>3)return "EYE CARE можно планировать не чаще 3 раз в неделю.";
  const hasInsufficientGap=days=>days.some((day,index)=>days.length>1&&((days[(index+1)%days.length]-day+7)%7)<2);
  if(hasInsufficientGap(rfDays))return "Между RF-процедурами оставляй минимум один полный день перерыва.";
  if(hasInsufficientGap(eyeDays))return "Между процедурами EYE CARE оставляй минимум один полный день перерыва.";
  return "";
}
function renderPlan(){
  const rf=data.plan.filter(x=>x==="lift"||x==="pump").length,eye=data.plan.filter(x=>x==="eye").length;
  $("planSummary").innerHTML=`<span class="summary-chip"><b>${rf}/3</b> RF-сессии</span><span class="summary-chip"><b>${eye}/3</b> EYE CARE</span><span class="summary-chip"><b>${data.plan.filter(isSpecial).length}</b> специальных дня</span>`;
  const list=$("planList");list.innerHTML="";const keys=weekDateKeys();
  data.plan.forEach((code,i)=>{const row=document.createElement("article");row.className="plan-row";const day=document.createElement("div");day.className="plan-day";const name=document.createElement("span");name.textContent=LONG_DAYS[i];const date=document.createElement("b");date.textContent=parseLocalDate(keys[i]).getDate();day.append(name,date);const wrap=document.createElement("div");wrap.className="plan-select-wrap";const select=document.createElement("select");select.setAttribute("aria-label",`Режим на ${LONG_DAYS[i]}`);[{v:"rest",t:"Восстановление"},{v:"lift",t:"RF × EMS LIFT"},{v:"pump",t:"RF PUMP"},{v:"eye",t:"EYE CARE"}].forEach(o=>{const op=document.createElement("option");op.value=o.v;op.textContent=o.t;select.appendChild(op);});select.value=code;const small=document.createElement("small");small.textContent=MODE[code].minutes?`${MODE[code].minutes} мин · ${data.time}`:"CLEAN + MOIST · ежедневный уход";select.addEventListener("change",()=>{const trial=[...data.plan];trial[i]=select.value;const error=validatePlan(trial);if(error){select.value=code;showToast(error);return;}data.plan=trial;persist();renderPlan();renderToday();renderHistory();showToast("План обновлён");});wrap.append(select,small);row.append(day,wrap);list.appendChild(row);});
}
function renderHistory(){
  const keys=weekDateKeys(),doneCount=keys.filter(k=>completed(k)).length,rf=data.plan.filter(x=>x==="lift"||x==="pump").length,eye=data.plan.filter(x=>x==="eye").length;
  $("historyStats").innerHTML=`<div class="stat-card"><b>${doneCount}/7</b><span>выполнено на этой неделе</span></div><div class="stat-card"><b>${rf}</b><span>RF-сессии в плане</span></div><div class="stat-card"><b>${eye}</b><span>EYE CARE в плане</span></div>`;
  renderMonth();renderNote();renderBars();
}
function renderMonth(){
  const y=monthCursor.getFullYear(),m=monthCursor.getMonth();$("monthLabel").textContent=new Intl.DateTimeFormat("ru-RU",{month:"long",year:"numeric"}).format(monthCursor);
  const first=new Date(y,m,1,12),offset=(first.getDay()+6)%7,start=addDays(first,-offset),grid=$("monthGrid");grid.innerHTML="";
  for(let i=0;i<42;i++){
    const d=addDays(start,i),key=localDateKey(d),b=document.createElement("button");b.type="button";b.className="calendar-day"+(d.getMonth()!==m?" outside":"")+(key===selectedHistoryDate?" selected":"")+(completed(key)?" done":"");
    const number=document.createElement("span");number.className="calendar-num";number.textContent=d.getDate();b.appendChild(number);
    const markers=document.createElement("span");markers.className="calendar-bars";const dayIdx=(d.getDay()+6)%7,mode=data.plan[dayIdx];
    if(mode==="lift"||mode==="pump"){const bar=document.createElement("i");bar.className="calendar-bar rf";markers.appendChild(bar);}else if(mode==="eye"){const bar=document.createElement("i");bar.className="calendar-bar eye";markers.appendChild(bar);}if(completed(key)){const bar=document.createElement("i");bar.className="calendar-bar done";markers.appendChild(bar);}b.appendChild(markers);
    b.addEventListener("click",()=>{selectedHistoryDate=key;renderMonth();renderNote();});grid.appendChild(b);
  }
}
function renderNote(){const note=data.notes[selectedHistoryDate]||{};$("noteDateTitle").textContent=dateFmt(parseLocalDate(selectedHistoryDate),{day:"numeric",month:"long",year:"numeric"});$("noteDatePill").textContent=completed(selectedHistoryDate)?"Уход выполнен":"Без отметки";$("skinNote").value=note.text||"";document.querySelectorAll("#feelingOptions button").forEach(b=>b.classList.toggle("active",b.dataset.feeling===(note.feeling||"")));$("noteStatus").textContent="";}
function renderBars(){const bars=$("weekBars");bars.innerHTML="";const today=new Date();for(let i=6;i>=0;i--){const d=addDays(today,-i),key=localDateKey(d),col=document.createElement("div");col.className="bar-column";const bar=document.createElement("div");bar.className="bar"+(completed(key)?" active":"");bar.style.height=completed(key)?"76%":"7%";const small=document.createElement("small");small.textContent=DAY_NAMES[(d.getDay()+6)%7];col.append(bar,small);bars.appendChild(col);}}
function renderSettings(){
  $("reminderTime").value=data.time||"21:00";$("eveningReminder").checked=data.eveningReminder!==false;$("specialReminder").checked=data.specialReminder!==false;$("soundEnabled").checked=data.soundEnabled!==false;
  $("goalName").value=data.goal?.name||"";$("goalDate").value=data.goal?.date||"";updatePermissionStatus();
  const list=$("productEditList");list.innerHTML="";
  const items=[{key:"clean",name:"CLEAN",note:"Лосьон для очищения"},{key:"moist",name:"MOIST",note:"Сыворотка для режима MOIST"},{key:"lift",name:"RF × EMS LIFT",note:"Контактный гель для RF × EMS"},{key:"pump",name:"RF PUMP",note:"Средство по инструкции Panasonic"},{key:"eye",name:"EYE CARE",note:"Средство для области вокруг глаз"}];
  items.forEach(item=>{const wrap=document.createElement("label");wrap.className="product-edit-item";const head=document.createElement("span");head.className="product-edit-head";head.textContent=item.name;const hint=document.createElement("small");hint.textContent=item.note;const input=document.createElement("input");input.type="text";input.maxLength=90;input.value=data.products[item.key]||"";input.setAttribute("aria-label",`Название средства: ${item.name}`);input.addEventListener("change",()=>{data.products[item.key]=input.value.trim()||DEFAULT.products[item.key];persist();renderToday();showToast("Название средства сохранено");});wrap.append(head,hint,input);list.appendChild(wrap);});
}
function guideForSelectedDay(){return stepsForDay(selectedDay).map(s=>({...s,description:s.detail||s.short}));}
function openGuide(){guideSteps=guideForSelectedDay();guideIndex=0;stopGuideTimer();showGuideStep();$("guideDialog").showModal();}
function showGuideStep(){
  const s=guideSteps[guideIndex];if(!s)return;guideRemaining=s.minutes?Math.round(s.minutes*60):0;
  $("guideCount").textContent=`ЭТАП ${guideIndex+1} ИЗ ${guideSteps.length}`;$("guideTitle").textContent=s.title;$("guideDescription").textContent=s.description;$("guideTimer").textContent=s.minutes?formatTime(guideRemaining):"—";
  $("guideTimerCaption").hidden=!s.minutes;$("guideTimerCaption").textContent=s.id==="special"?"ОБЩАЯ ДЛИТЕЛЬНОСТЬ РЕЖИМА":"ВРЕМЯ ЭТАПА";
  $("guideStart").disabled=!s.minutes;$("guideStart").textContent=s.minutes?"Старт таймера":"Без таймера";$("guidePrev").disabled=guideIndex===0;$("guideNext").textContent=guideIndex===guideSteps.length-1?"Завершить":"Далее";
  const pace=$("guideMovementPace"),paceText=$("guideMovementPaceText"),note=$("guideHint");if(s.movementPace){pace.hidden=false;paceText.textContent=s.movementPace;note.textContent=s.movementNote||"Время на стрелку — ориентир для одного движения, а не общая длительность режима.";}else{pace.hidden=true;paceText.textContent="";note.textContent="Следуй инструкции Panasonic. Не продолжай при раздражении, боли или выраженном дискомфорте.";}
}
function formatTime(s){return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}
function stopGuideTimer(){if(guideRunning&&guideEndsAt)guideRemaining=Math.max(0,Math.ceil((guideEndsAt-Date.now())/1000));if(guideInterval)clearInterval(guideInterval);guideInterval=null;guideRunning=false;guideEndsAt=null;if($("guideStart"))$("guideStart").textContent=guideRemaining>0&&guideRemaining<(guideSteps[guideIndex]?.minutes||0)*60?"Продолжить":"Старт таймера";}
function ensureAudio(){try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return null;if(!audioContext)audioContext=new AudioCtx();if(audioContext.state==="suspended")audioContext.resume();return audioContext;}catch(e){return null;}}
function timerChime(){if(!data.soundEnabled)return;const ctx=ensureAudio();if(!ctx)return;const now=ctx.currentTime;[880,1174].forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+i*.22;osc.type="sine";osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.16,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+.19);osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+.2);});}
function tickGuideTimer(){if(!guideRunning||!guideEndsAt)return;guideRemaining=Math.max(0,Math.ceil((guideEndsAt-Date.now())/1000));$("guideTimer").textContent=formatTime(guideRemaining);if(guideRemaining===0){clearInterval(guideInterval);guideInterval=null;guideRunning=false;guideEndsAt=null;$("guideStart").textContent="Повторить таймер";if(navigator.vibrate)navigator.vibrate([160,90,180]);timerChime();}}
function startGuideTimer(){const s=guideSteps[guideIndex];if(!s?.minutes)return;if(guideRunning){stopGuideTimer();$("guideStart").textContent="Продолжить";return;}if(guideRemaining<=0)guideRemaining=Math.round(s.minutes*60);ensureAudio();guideRunning=true;guideEndsAt=Date.now()+guideRemaining*1000;$("guideStart").textContent="Пауза";guideInterval=setInterval(tickGuideTimer,250);tickGuideTimer();}
function icsEscape(s){return String(s).replace(/\\/g,"\\\\").replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/\r?\n/g,"\\n");}
function foldIcsLine(line){let result="",part="",bytes=0;for(const ch of line){const size=new TextEncoder().encode(ch).length;if(bytes+size>75){result+=part+"\r\n ";part=ch;bytes=1+size;}else{part+=ch;bytes+=size;}}return result+part;}
function downloadBlob(content,name,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportCalendar(){
  if(!data.eveningReminder&&!data.specialReminder){showToast("Включи хотя бы один тип напоминания");return;}
  const [hh,mm]=(data.time||"21:00").split(":").map(Number),now=new Date(),todayIdx=(now.getDay()+6)%7,nowMins=now.getHours()*60+now.getMinutes(),events=[];
  data.plan.forEach((code,i)=>{
    const special=isSpecial(code)&&code!=="rest";if(!data.eveningReminder&&!(data.specialReminder&&special))return;
    let ahead=(i-todayIdx+7)%7;if(ahead===0&&nowMins>=hh*60+mm)ahead=7;
    const start=addDays(new Date(now.getFullYear(),now.getMonth(),now.getDate(),12),ahead),stamp=start.getFullYear()+String(start.getMonth()+1).padStart(2,"0")+String(start.getDate()).padStart(2,"0"),byday=["MO","TU","WE","TH","FR","SA","SU"][i],mode=MODE[code];
    const summary=special&&data.specialReminder?`Уход · ${mode.label}`:"Ежедневный уход";
    const detail=`Время напоминания: ${data.time}. План на день: ${mode.label}. ${data.eveningReminder?"Ежедневное напоминание включено. ":""}${data.specialReminder&&special?"Напоминание о специальной процедуре включено.":""}`;
    const dtstamp=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
    events.push(["BEGIN:VEVENT",`UID:ehsr90-${byday}-weekly@mybeautyroutine`,`DTSTAMP:${dtstamp}`,`DTSTART:${stamp}T${String(hh).padStart(2,"0")}${String(mm).padStart(2,"0")}00`,`DURATION:PT10M`,`RRULE:FREQ=WEEKLY;BYDAY=${byday}`,`SUMMARY:${icsEscape(summary)}`,`DESCRIPTION:${icsEscape(detail)}`,"BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY",`DESCRIPTION:${icsEscape(summary)}`,"END:VALARM","END:VEVENT"].join("\r\n"));
  });
  if(!events.length){showToast("По настройкам нет дней для напоминаний");return;}
  const raw=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Personal Beauty Routine//EH-SR90//RU","CALSCALE:GREGORIAN","METHOD:PUBLISH",...events,"END:VCALENDAR"].join("\r\n");downloadBlob(raw.split("\r\n").map(foldIcsLine).join("\r\n"),"EH-SR90-reminders.ics","text/calendar;charset=utf-8");showToast("Файл напоминаний подготовлен");
}
function updatePermissionStatus(){
  if(!("Notification" in window)){$("permissionStatus").textContent="Этот браузер не поддерживает веб-уведомления. Используй импорт в календарь iPhone.";$("permissionBtn").disabled=true;return;}
  const p=Notification.permission;$("permissionStatus").textContent=p==="granted"?"Разрешение выдано. Приложение проверяет время, пока открыто.":p==="denied"?"Уведомления заблокированы в настройках браузера.":"Разрешение ещё не запрашивалось.";$("permissionBtn").textContent=p==="granted"?"Разрешение включено":"Разрешить уведомления";
}
async function sendNotification(title,body){try{if(navigator.serviceWorker){const reg=await navigator.serviceWorker.ready;if(reg.showNotification){await reg.showNotification(title,{body,icon:"./icon-192.png",badge:"./icon-192.png",tag:"ehsr90-daily-care",data:{url:"./"}});return;}}if("Notification"in window)new Notification(title,{body});}catch(e){console.warn("Не удалось показать уведомление",e);}}
async function requestNotifications(){if(!("Notification"in window)){showToast("Веб-уведомления не поддерживаются");return;}try{const p=await Notification.requestPermission();updatePermissionStatus();if(p==="granted"){await sendNotification("Напоминания включены",`Время напоминания: ${data.time}.`);showToast("Разрешение получено");}else showToast("Разрешение не выдано");}catch(e){showToast("Не удалось включить уведомления");}}
function checkReminder(){
  if(!data.time||!("Notification"in window)||Notification.permission!=="granted")return;
  const now=new Date(),key=localDateKey(now),clock=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,token=`${key}|${data.time}`;if(clock!==data.time||data.lastNotification===token)return;
  const idx=(now.getDay()+6)%7,code=data.plan[idx],special=isSpecial(code);
  if(!data.eveningReminder&&!(data.specialReminder&&special))return;
  const mode=MODE[code],title=special&&data.specialReminder&&!data.eveningReminder?`Пора: ${mode.label}`:"Пора начать ежедневный уход";
  const body=data.eveningReminder?(special?`Сегодня по плану ${mode.label}. Открой приложение, чтобы пройти этапы.`:"Сегодня день восстановления. Открой приложение для обычного ухода."):`Сегодня запланирована специальная процедура ${mode.label}.`;
  data.lastNotification=token;persist();sendNotification(title,body);
}
function scheduleReminderCheck(){if(reminderInterval)clearInterval(reminderInterval);checkReminder();reminderInterval=setInterval(checkReminder,15000);}
function saveHistoryNote(){const feeling=document.querySelector("#feelingOptions button.active")?.dataset.feeling||"";data.notes[selectedHistoryDate]={text:$("skinNote").value.trim(),feeling};persist();$("noteStatus").textContent="Заметка сохранена на этом устройстве.";}
function backupData(){downloadBlob(JSON.stringify(data,null,2),"EH-SR90-backup.json","application/json");}
function importData(file){const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed||!Array.isArray(parsed.plan)||parsed.plan.length!==7||!parsed.plan.every(x=>["rest","lift","pump","eye"].includes(x))||validatePlan(parsed.plan))throw new Error("Некорректный файл или расписание нарушает ограничения.");data={...clone(DEFAULT),...parsed,products:{...DEFAULT.products,...(parsed.products||{})}};persist();renderAll();showToast("Данные восстановлены");}catch(e){showToast(e.message||"Не удалось прочитать файл");}};reader.readAsText(file);}

const VIDEO_MODES=[
  {key:"lift",title:"RF × EMS LIFT",id:"lu-eWTsOrSM",description:"Подтягивающий уход с RF и EMS. Общее видео для RF-режимов.",duration:"6 мин"},
  {key:"pump",title:"RF PUMP",id:"lu-eWTsOrSM",description:"Радиочастотный уход. В ролике показана общая техника RF-режимов.",duration:"6 мин"},
  {key:"eye",title:"EYE CARE",id:"LYwSrkOKfEo",description:"Деликатный уход за областью вокруг глаз. Не обрабатывай веки.",duration:"2 мин"},
  {key:"clean",title:"CLEAN",id:"t9wMeb0W9OE",description:"Очищение кожи с ватным диском и лосьоном.",duration:"3 мин"},
  {key:"moist",title:"MOIST",id:"LFQz4_ZYW4g",description:"Увлажняющий уход с сывороткой или эмульсией.",duration:"3 мин"}
];
const PANASONIC_IMAGES={
  clean:imageAsset("clean-cotton-1.jpg"),
  moist:imageAsset("moist-flow.png")
};
const RF_PHOTOS=[
  {src:imageAsset("rf-1.png"),alt:"Движения 1–2: нижняя часть лица",caption:"Движения ①–②. Веди прибор плавно по направлению стрелок, сохраняя полный контакт головки с кожей."},
  {src:imageAsset("rf-2.png"),alt:"Движения 3–4: область щеки",caption:"Движения ③–④. Следуй направлению стрелок на схеме и не задерживай прибор на одном участке."},
  {src:imageAsset("rf-3.png"),alt:"Движения 5–7: щека и скуловая зона",caption:"Движения ⑤–⑦. Перемещай головку плавно, без сильного надавливания."},
  {src:imageAsset("rf-4.png"),alt:"Движения 8–10: лоб",caption:"Движения ⑧–⑩. Заверши последовательность по направлению стрелок, продолжая двигать головку."}
];
const PHOTO_GROUPS={
  lift:{title:"RF × EMS LIFT",items:RF_PHOTOS},
  pump:{title:"RF PUMP",items:RF_PHOTOS},
  eye:{title:"EYE CARE",items:[{src:imageAsset("eye-care.jpg"),alt:"Схема Panasonic: движение в области под глазом к внешнему уголку",caption:"Проводи головку по направлению стрелки под областью глаза. Не обрабатывай веки и избегай попадания на глазное яблоко."}]},
  clean:{title:"CLEAN",items:[
    {src:imageAsset("clean-cotton-1.jpg"),alt:"Схема Panasonic: установка ватного диска и фиксирующего кольца",caption:"Шаг 1. Установи ватный диск на головку прибора широкой стороной вверх. Закрепи его кольцом, слегка вдавив кольцо на место. Не нажимай слишком сильно."},
    {src:imageAsset("clean-cotton-2.jpg"),alt:"Схема Panasonic: пропитывание ватного диска лосьоном",caption:"Шаг 2. Хорошо пропитай ватный диск лосьоном. Средство должно пройти насквозь, до обратной стороны диска."}
  ]},
  moist:{title:"MOIST",items:[{src:PANASONIC_IMAGES.moist,alt:"Схема последовательности режима MOIST, подготовленная по инструкции Panasonic",caption:"Нанеси сыворотку или эмульсию → выбери режим MOIST → выбери уровень ионизации → проводи прибором по коже около 3 минут → при желании нанеси дополнительное средство."}]}
};
const CLEAN_SLIDES=[
  {title:"Промой головку и кольцо",src:imageAsset("clean-rinse-ru.jpg"),alt:"Промывание головки и кольца. Закройте крышку разъёма.",caption:"Головку и кольцо промой от остатков геля и косметики. Крышку разъёма закрой перед промыванием. Не погружай корпус прибора в воду."},
  {title:"Просуши и убери на хранение",src:imageAsset("clean-dry.jpg"),alt:"Протирание устройства сухой тканью. Не наматывай USB-кабель на корпус.",caption:"Протри устройство сухой тканью и дай ему полностью высохнуть в хорошо проветриваемом месте.\n\n• Если в разъёме остались капли воды, тщательно вытри их.\n• Не наматывай USB-кабель вокруг устройства при хранении."}
];
function renderTechnique(){renderVideoSlide();}
function renderVideoSlide(){
  const item=VIDEO_MODES[videoIndex];$("videoCount").textContent=`ВИДЕО ${videoIndex+1} ИЗ ${VIDEO_MODES.length}`;$("videoTitle").textContent=item.title;$("videoDescription").textContent=item.description;$("videoDuration").textContent=item.duration;
  const stage=$("videoStage");stage.replaceChildren();stage.className="video-stage";
  const preview=document.createElement("div");preview.className="video-preview";const img=document.createElement("img");img.src=`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;img.alt=`Видео ${item.title}`;img.loading="lazy";img.onerror=()=>{img.style.display="none";};const overlay=document.createElement("button");overlay.className="video-play";overlay.type="button";overlay.innerHTML="<span>▶</span><small>Смотреть видео</small>";overlay.addEventListener("click",()=>{const frame=document.createElement("iframe");frame.className="video-player";frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.id)}?rel=0&playsinline=1`;frame.title=`Видео: ${item.title}`;frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";frame.allowFullscreen=true;frame.referrerPolicy="strict-origin-when-cross-origin";stage.replaceChildren(frame);});preview.append(img,overlay);stage.appendChild(preview);
  const dots=$("videoDots");dots.innerHTML="";VIDEO_MODES.forEach((v,i)=>{const b=document.createElement("button");b.type="button";b.className="dot"+(i===videoIndex?" active":"");b.setAttribute("aria-label",`Видео ${i+1}: ${v.title}`);b.addEventListener("click",()=>{videoIndex=i;renderVideoSlide();});dots.appendChild(b);});
}
function moveVideo(delta){videoIndex=(videoIndex+delta+VIDEO_MODES.length)%VIDEO_MODES.length;renderVideoSlide();}
function openPhotos(){const mode=VIDEO_MODES[videoIndex];const group=PHOTO_GROUPS[mode.key];photoItems=group.items;photoIndex=0;$("photoTitle").textContent=group.title;renderPhotoSlide();$("photoDialog").showModal();}
function renderPhotoSlide(){
  const item=photoItems[photoIndex];if(!item)return;$("photoCount").textContent=`СЛАЙД ${photoIndex+1} ИЗ ${photoItems.length}`;$("photoImage").src=item.src;$("photoImage").alt=item.alt;$("photoCaption").textContent=item.caption;
  $("photoImage").onerror=()=>{$("photoCaption").textContent=item.caption+"\n\nНе удалось загрузить схему. Открой официальную инструкцию Panasonic.";};
  const dots=$("photoDots");dots.innerHTML="";photoItems.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.className="dot"+(i===photoIndex?" active":"");b.setAttribute("aria-label",`Слайд ${i+1}`);b.addEventListener("click",()=>{photoIndex=i;renderPhotoSlide();});dots.appendChild(b);});
}
function movePhoto(delta){if(!photoItems.length)return;photoIndex=(photoIndex+delta+photoItems.length)%photoItems.length;renderPhotoSlide();}
function openClean(){cleanIndex=0;renderCleanSlide();$("cleanDialog").showModal();}
function renderCleanSlide(){const item=CLEAN_SLIDES[cleanIndex];$("cleanCount").textContent=`СЛАЙД ${cleanIndex+1} ИЗ ${CLEAN_SLIDES.length}`;$("cleanTitle").textContent=item.title;$("cleanImage").onerror=()=>{$("cleanCaption").textContent=item.caption+"\n\nИзображение не загрузилось. Проверь, что media.js загружен вместе с приложением.";};$("cleanImage").src=item.src;$("cleanImage").alt=item.alt;$("cleanCaption").textContent=item.caption;const dots=$("cleanDots");dots.innerHTML="";CLEAN_SLIDES.forEach((_,i)=>{const b=document.createElement("button");b.type="button";b.className="dot"+(i===cleanIndex?" active":"");b.setAttribute("aria-label",`Слайд ${i+1}`);b.addEventListener("click",()=>{cleanIndex=i;renderCleanSlide();});dots.appendChild(b);});}
function moveClean(delta){cleanIndex=(cleanIndex+delta+CLEAN_SLIDES.length)%CLEAN_SLIDES.length;renderCleanSlide();}
function bindSwipe(el,onPrev,onNext){if(!el)return;let x=0,y=0;el.addEventListener("touchstart",e=>{const t=e.changedTouches[0];x=t.clientX;y=t.clientY;},{passive:true});el.addEventListener("touchend",e=>{const t=e.changedTouches[0],dx=t.clientX-x,dy=t.clientY-y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2){dx<0?onNext():onPrev();}},{passive:true});}
function renderAll(){renderHeader();renderToday();renderPlan();renderHistory();renderSettings();renderTechnique();}

// Main navigation
 document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchScreen(b.dataset.screen)));
$("openGuideBtn").addEventListener("click",openGuide);
$("closeGuide").addEventListener("click",()=>{stopGuideTimer();$("guideDialog").close();});
$("guideDialog").addEventListener("click",e=>{if(e.target===$("guideDialog")){stopGuideTimer();$("guideDialog").close();}});
$("guideStart").addEventListener("click",startGuideTimer);
$("guidePrev").addEventListener("click",()=>{stopGuideTimer();guideIndex=Math.max(0,guideIndex-1);showGuideStep();});
$("guideNext").addEventListener("click",()=>{stopGuideTimer();if(guideIndex<guideSteps.length-1){guideIndex++;showGuideStep();}else{$("guideDialog").close();showToast("Этапы пройдены. Отметь уход выполненным.");}});
$("guideDialog").addEventListener("close",stopGuideTimer);

$("prevMonth").addEventListener("click",()=>{monthCursor=new Date(monthCursor.getFullYear(),monthCursor.getMonth()-1,1,12);renderMonth();});
$("nextMonth").addEventListener("click",()=>{monthCursor=new Date(monthCursor.getFullYear(),monthCursor.getMonth()+1,1,12);renderMonth();});
document.querySelectorAll("#feelingOptions button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#feelingOptions button").forEach(x=>x.classList.remove("active"));b.classList.add("active");}));
$("saveNoteBtn").addEventListener("click",saveHistoryNote);
$("restorePlanBtn").addEventListener("click",()=>{if(confirm("Вернуть исходный недельный план?")){data.plan=clone(DEFAULT_PLAN);persist();renderPlan();renderToday();renderHistory();showToast("Исходный план восстановлен");}});

$("reminderTime").addEventListener("change",e=>{data.time=e.target.value||"21:00";data.lastNotification="";persist();renderToday();renderPlan();scheduleReminderCheck();showToast(`Время напоминания: ${data.time}`);});
$("eveningReminder").addEventListener("change",e=>{data.eveningReminder=e.target.checked;data.lastNotification="";persist();scheduleReminderCheck();});
$("specialReminder").addEventListener("change",e=>{data.specialReminder=e.target.checked;data.lastNotification="";persist();scheduleReminderCheck();});
$("soundEnabled").addEventListener("change",e=>{data.soundEnabled=e.target.checked;persist();showToast(data.soundEnabled?"Звуковой сигнал включён":"Звуковой сигнал выключен");});
$("calendarExportBtn").addEventListener("click",exportCalendar);$("permissionBtn").addEventListener("click",requestNotifications);

$("saveGoalBtn").addEventListener("click",()=>{data.goal={name:$("goalName").value.trim(),date:$("goalDate").value};persist();renderGoalCard();showToast("Цель сохранена");});
$("backupBtn").addEventListener("click",backupData);$("importBtn").addEventListener("click",()=>$("importFile").click());$("importFile").addEventListener("change",e=>{const f=e.target.files?.[0];if(f)importData(f);e.target.value="";});

$("videoPrev").addEventListener("click",()=>moveVideo(-1));$("videoNext").addEventListener("click",()=>moveVideo(1));$("openPhotosBtn").addEventListener("click",openPhotos);$("openCleanBtn").addEventListener("click",openClean);
$("closePhotos").addEventListener("click",()=>$ ("photoDialog").close());
$("photoPrev").addEventListener("click",()=>movePhoto(-1));$("photoNext").addEventListener("click",()=>movePhoto(1));
$("closeClean").addEventListener("click",()=>$ ("cleanDialog").close());$("cleanPrev").addEventListener("click",()=>moveClean(-1));$("cleanNext").addEventListener("click",()=>moveClean(1));
$("photoDialog").addEventListener("click",e=>{if(e.target===$("photoDialog"))$("photoDialog").close();});$("cleanDialog").addEventListener("click",e=>{if(e.target===$("cleanDialog"))$("cleanDialog").close();});
bindSwipe($("videoStage"),()=>moveVideo(-1),()=>moveVideo(1));bindSwipe($("photoDialog"),()=>movePhoto(-1),()=>movePhoto(1));bindSwipe($("cleanDialog"),()=>moveClean(-1),()=>moveClean(1));

let lastDailyHeaderDate=localDateKey(new Date());document.addEventListener("visibilitychange",()=>{if(guideRunning)tickGuideTimer();if(document.visibilityState==="visible"){renderHeader();scheduleReminderCheck();}});setInterval(()=>{const today=localDateKey(new Date());if(today!==lastDailyHeaderDate){lastDailyHeaderDate=today;renderHeader();}},60000);
if("serviceWorker"in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>{reg.update().catch(()=>{});scheduleReminderCheck();}).catch(err=>{console.warn("Service worker registration failed",err);scheduleReminderCheck();}));}else scheduleReminderCheck();
renderAll();
})();
