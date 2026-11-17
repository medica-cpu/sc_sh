(() => {
"use strict";
const $ = id => document.getElementById(id);
const DAY_NAMES=["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"];
const LONG_DAYS=["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
const MODE={lift:{label:"RF × EMS LIFT",tag:"RF",minutes:6,symbol:"RF",subtitle:"Лифтинг и мышечная стимуляция",kind:"rf"},pump:{label:"RF PUMP",tag:"RF",minutes:6,symbol:"RF",subtitle:"RF-уход",kind:"rf"},eye:{label:"EYE CARE",tag:"EYE",minutes:2,symbol:"EYE",subtitle:"Уход за областью вокруг глаз",kind:"eye"},rest:{label:"Восстановление",tag:"УХОД",minutes:0,symbol:"✧",subtitle:"Ежедневный уход без специального режима",kind:"rest"}};
const DEFAULT_PLAN=["lift","rest","eye","rest","pump","rest","eye"];
const DEFAULT={version:2,plan:DEFAULT_PLAN,completed:{},stepChecks:{},notes:{},time:"21:00",goal:{name:"",date:""},lastNotification:""};
const STORAGE="ehsr90-planner-v2";
let data=loadData();
let currentScreen="today";
let selectedDay=(new Date().getDay()+6)%7;
let selectedHistoryDate=localDateKey(new Date());
let monthCursor=new Date(new Date().getFullYear(),new Date().getMonth(),1,12);
let guideSteps=[],guideIndex=0,guideRemaining=0,guideInterval=null,guideRunning=false;
let reminderInterval=null,toastTimer=null;

function clone(obj){return JSON.parse(JSON.stringify(obj));}
function loadData(){
  try{
    const current=localStorage.getItem(STORAGE);
    if(current){const parsed=JSON.parse(current);const validPlan=Array.isArray(parsed.plan)&&parsed.plan.length===7&&parsed.plan.every(x=>["rest","lift","pump","eye"].includes(x));return {...clone(DEFAULT),...parsed,plan:validPlan?parsed.plan:clone(DEFAULT_PLAN),completed:parsed.completed||{},stepChecks:parsed.stepChecks||{},notes:parsed.notes||{},goal:parsed.goal||{name:"",date:""}};}
    // Migrate the first PWA version without discarding its checkmarks and notes.
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
function showToast(message){const node=$("toast");node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2600);}
function switchScreen(screen){currentScreen=screen;document.querySelectorAll(".screen").forEach(el=>el.classList.toggle("active",el.id===`screen-${screen}`));document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.screen===screen));if(screen==="today")renderToday();if(screen==="plan")renderPlan();if(screen==="history")renderHistory();if(screen==="settings")renderSettings();window.scrollTo({top:0,behavior:"smooth"});}
function stepsForDay(i){
  const code=data.plan[i],steps=[{id:"prep",title:"Снять макияж и умыться",detail:"Подготовить чистую кожу",minutes:0,short:"Подготовка"},{id:"clean",title:"CLEAN",detail:"Sesderma SENSYSES Classic · ватный диск",minutes:3,short:"Очищение"},{id:"moist",title:"MOIST",detail:"Sesderma C-VIT5",minutes:3,short:"Увлажняющий уход"}];
  if(code==="lift")steps.push({id:"special",title:"RF × EMS LIFT",detail:"Panasonic EH-4R06 · начать с уровня EMS 1",minutes:6,short:"Специальный режим"});
  if(code==="pump")steps.push({id:"special",title:"RF PUMP",detail:"Сыворотка или эмульсия по инструкции Panasonic",minutes:6,short:"Специальный режим"});
  if(code==="eye")steps.push({id:"special",title:"EYE CARE",detail:"MT Metatron B5 Contour тонким слоем как средство для процедуры — только если упаковка разрешает область вокруг глаз; не обрабатывать веки",minutes:2,short:"Специальный режим"});
  steps.push({id:"finish",title:"Завершающий уход",detail:code==="eye"?"Не наноси повторно тот же крем толстым слоем; при необходимости добавь только привычное средство, разрешённое для этой зоны.":"Нанести MT Metatron B5 Contour как завершающий крем.",minutes:0,short:"Финальный уход"});
  return steps;
}
function checkKey(dateKey,id){return `${dateKey}|${id}`;}
function stepDone(dateKey,id){return !!data.stepChecks[checkKey(dateKey,id)];}
function setStepDone(dateKey,id,value){if(value)data.stepChecks[checkKey(dateKey,id)]=true;else{delete data.stepChecks[checkKey(dateKey,id)];delete data.completed[dateKey];}if(value&&stepsForDay(selectedDay).every(step=>stepDone(dateKey,step.id)))data.completed[dateKey]=true;persist();}
function completed(dateKey){return !!data.completed[dateKey];}
function renderHeader(){const now=new Date();$("headerDate").textContent=new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short"}).format(now);}
function renderWeekStrip(){const grid=$("weekStrip");grid.innerHTML="";const keys=weekDateKeys();const todayKey=localDateKey(new Date());keys.forEach((key,i)=>{const d=parseLocalDate(key),m=modeForDay(i),b=document.createElement("button");b.type="button";b.className="week-day"+(selectedDay===i?" selected":"")+(key===todayKey?" today":"")+(completed(key)?" done":"");b.innerHTML=`<span class="dow">${DAY_NAMES[i]}</span><span class="num">${d.getDate()}</span><span class="tag">${m.tag}</span>`;b.addEventListener("click",()=>{stopGuideTimer();selectedDay=i;renderToday();});grid.appendChild(b);});}
function renderToday(){
 const now=new Date(),key=selectedDateKey(),mode=modeForDay(selectedDay),steps=stepsForDay(selectedDay),done=completed(key),checks=steps.filter(s=>stepDone(key,s.id)).length;
 $("todayDate").textContent=dateFmt(parseLocalDate(key))+" · "+(key===localDateKey(now)?"сегодня":"выбранный день");
 $("todayMode").textContent=mode.label;$("todaySubtitle").textContent=mode.subtitle;$("modeSymbol").textContent=mode.symbol;$("modeSymbol").className="mode-symbol"+(mode.kind==="eye"?" eye":mode.kind==="rest"?" rest":"");
 $("todayTime").textContent=data.time||"21:00";$("todayDuration").textContent=mode.minutes?`${mode.minutes} мин`:"ежедневный уход";$("todayStatus").textContent=done?"Выполнено":"Запланировано";$("todayStatus").className="status-pill"+(done?" done":"");
 $("todayProgress").style.width=`${Math.round(checks/steps.length*100)}%`;$("stepProgressText").textContent=`${checks} из ${steps.length} этапов`;$("progressPercent").textContent=`${Math.round(checks/steps.length*100)}%`;
 const list=$("todaySteps");list.innerHTML="";steps.forEach((s)=>{const row=document.createElement("div");row.className="step-item";const isDone=stepDone(key,s.id);const btn=document.createElement("button");btn.type="button";btn.className="step-check"+(isDone?" checked":"");btn.textContent=isDone?"✓":"";btn.setAttribute("aria-label",isDone?"Снять отметку":"Отметить этап");btn.addEventListener("click",()=>{setStepDone(key,s.id,!isDone);renderToday();});const copy=document.createElement("div");copy.className="step-copy";const strong=document.createElement("strong");strong.textContent=s.title;const small=document.createElement("small");small.textContent=s.detail;copy.append(strong,small);const duration=document.createElement("span");duration.className="step-duration";duration.textContent=s.minutes?`${s.minutes} мин`:"";row.append(btn,copy,duration);list.appendChild(row);});
 $("todaySafetyNote").textContent=mode.kind==="rf"?"Для RF × EMS LIFT — только гель EH-4R06. Для RF PUMP используй средство, указанное в инструкции. Не совмещай специальные режимы в один день.":mode.kind==="eye"?"EYE CARE выполняй без обработки век. Используй средство для зоны вокруг глаз, разрешённое его производителем.":"В дни восстановления специальных режимов нет. CLEAN и MOIST можно выполнять ежедневно.";
 $("markAllBtn").textContent=done?"Снять отметку о завершении":"Завершить уход";
 $("markAllBtn").onclick=()=>{const k=selectedDateKey();if(completed(k)){delete data.completed[k];steps.forEach(s=>delete data.stepChecks[checkKey(k,s.id)]);}else{data.completed[k]=true;steps.forEach(s=>{data.stepChecks[checkKey(k,s.id)]=true;});}persist();renderToday();showToast(completed(k)?"Уход отмечен выполненным":"Отметка снята");};
 renderWeekStrip();renderGoalCard();
}
function renderGoalCard(){const goal=data.goal||{};const card=$("goalCard");if(!goal.name||!goal.date){card.hidden=true;return;}const target=parseLocalDate(goal.date);target.setHours(0,0,0,0);const today=new Date();today.setHours(0,0,0,0);const n=Math.round((target-today)/86400000);card.hidden=false;$("goalTitle").textContent=goal.name;$("goalCountdown").textContent=n>0?`До события ${n} ${plural(n,["день","дня","дней"])}`:n===0?"Это сегодня":`Событие было ${Math.abs(n)} ${plural(Math.abs(n),["день","дня","дней"])} назад`;}
function plural(n,forms){const n10=n%10,n100=n%100;return n10===1&&n100!==11?forms[0]:n10>=2&&n10<=4&&(n100<12||n100>14)?forms[1]:forms[2];}
function validatePlan(plan){
 const rfDays=plan.map((x,i)=>(x==="lift"||x==="pump")?i:-1).filter(i=>i>=0),eyeDays=plan.map((x,i)=>x==="eye"?i:-1).filter(i=>i>=0);
 if(rfDays.length>3)return "RF × EMS LIFT и RF PUMP вместе можно планировать не чаще 3 раз в неделю.";
 if(eyeDays.length>3)return "EYE CARE можно планировать не чаще 3 раз в неделю.";
 const hasInsufficientGap=days=>days.some((day,index)=>days.length>1&&((days[(index+1)%days.length]-day+7)%7)<2);
 if(hasInsufficientGap(rfDays))return "Между RF × EMS LIFT и RF PUMP оставляй минимум один полный день перерыва.";
 if(hasInsufficientGap(eyeDays))return "Между процедурами EYE CARE оставляй минимум один полный день перерыва.";
 return "";
}
function renderPlan(){
 const rf=data.plan.filter(x=>x==="lift"||x==="pump").length,eye=data.plan.filter(x=>x==="eye").length;
 $("planSummary").innerHTML=`<span class="summary-chip"><b>${rf}/3</b> RF-сессии</span><span class="summary-chip"><b>${eye}/3</b> EYE CARE</span><span class="summary-chip"><b>${data.plan.filter(isSpecial).length}</b> специальных дня</span>`;
 const list=$("planList");list.innerHTML="";const keys=weekDateKeys();data.plan.forEach((code,i)=>{const row=document.createElement("div");row.className="plan-row";const d=document.createElement("div");d.className="plan-day";d.textContent=DAY_NAMES[i];const date=document.createElement("b");date.textContent=parseLocalDate(keys[i]).getDate();d.appendChild(date);const wrap=document.createElement("div");wrap.className="plan-select-wrap";const select=document.createElement("select");select.setAttribute("aria-label",`Режим на ${LONG_DAYS[i]}`);[{v:"rest",t:"Восстановление"},{v:"lift",t:"RF × EMS LIFT"},{v:"pump",t:"RF PUMP"},{v:"eye",t:"EYE CARE"}].forEach(o=>{const op=document.createElement("option");op.value=o.v;op.textContent=o.t;select.appendChild(op);});select.value=code;const small=document.createElement("small");small.textContent=MODE[code].minutes?`${MODE[code].minutes} мин · напоминание ${data.time}`:"CLEAN + MOIST · без специального режима";select.addEventListener("change",()=>{const old=data.plan[i],trial=[...data.plan];trial[i]=select.value;const error=validatePlan(trial);if(error){select.value=old;showToast(error);return;}data.plan=trial;persist();renderPlan();renderToday();showToast("План обновлён");});wrap.append(select,small);row.append(d,wrap);list.appendChild(row);});
}
function renderHistory(){
 const thisWeek=weekDateKeys(),doneCount=thisWeek.filter(k=>completed(k)).length,rf=data.plan.filter(x=>x==="lift"||x==="pump").length,eye=data.plan.filter(x=>x==="eye").length;
 $("historyStats").innerHTML=`<div class="stat-card"><b>${doneCount}/7</b><span>выполнено на этой неделе</span></div><div class="stat-card"><b>${rf}</b><span>RF-сессии в плане</span></div><div class="stat-card"><b>${eye}</b><span>EYE CARE в плане</span></div>`;
 renderMonth();renderNote();renderBars();
}
function renderMonth(){const y=monthCursor.getFullYear(),m=monthCursor.getMonth();$("monthLabel").textContent=new Intl.DateTimeFormat("ru-RU",{month:"long",year:"numeric"}).format(monthCursor);const first=new Date(y,m,1,12),offset=(first.getDay()+6)%7,start=addDays(first,-offset),grid=$("monthGrid");grid.innerHTML="";for(let i=0;i<42;i++){const d=addDays(start,i),key=localDateKey(d),b=document.createElement("button");b.type="button";b.className="calendar-day"+(d.getMonth()!==m?" outside":"")+(key===selectedHistoryDate?" selected":"")+(completed(key)?" done":"");const dayIdx=(d.getDay()+6)%7;if(d.getMonth()===m&&isSpecial(data.plan[dayIdx]))b.classList.add("planned");b.textContent=d.getDate();b.addEventListener("click",()=>{selectedHistoryDate=key;renderMonth();renderNote();});grid.appendChild(b);}}
function renderNote(){const note=data.notes[selectedHistoryDate]||{};$("noteDateTitle").textContent=dateFmt(parseLocalDate(selectedHistoryDate),{day:"numeric",month:"long",year:"numeric"});$("noteDatePill").textContent=completed(selectedHistoryDate)?"Уход выполнен":"Без отметки";$("skinNote").value=note.text||"";document.querySelectorAll("#feelingOptions button").forEach(b=>b.classList.toggle("active",b.dataset.feeling===(note.feeling||"")));$("noteStatus").textContent="";}
function renderBars(){const bars=$("weekBars");bars.innerHTML="";const today=new Date();for(let i=6;i>=0;i--){const d=addDays(today,-i),key=localDateKey(d),col=document.createElement("div");col.className="bar-column";const bar=document.createElement("div");bar.className="bar"+(completed(key)?" active":"");bar.style.height=completed(key)?"72%":"5%";const small=document.createElement("small");small.textContent=DAY_NAMES[(d.getDay()+6)%7];col.append(bar,small);bars.appendChild(col);}}
function renderSettings(){ $("reminderTime").value=data.time||"21:00";$("goalName").value=data.goal?.name||"";$("goalDate").value=data.goal?.date||"";updatePermissionStatus();}
function guideForSelectedDay(){const steps=stepsForDay(selectedDay);return steps.map(s=>({...s,description:s.detail||s.short}));}
function openGuide(){guideSteps=guideForSelectedDay();guideIndex=0;stopGuideTimer();showGuideStep();$("guideDialog").showModal();}
function showGuideStep(){const s=guideSteps[guideIndex];if(!s)return;guideRemaining=s.minutes||0;$("guideCount").textContent=`ЭТАП ${guideIndex+1} ИЗ ${guideSteps.length}`;$("guideTitle").textContent=s.title;$("guideDescription").textContent=s.description;$("guideTimer").textContent=s.minutes?formatTime(guideRemaining):"—";$("guideStart").disabled=!s.minutes;$("guideStart").textContent=s.minutes?"Старт таймера":"Без таймера";$("guideHint").textContent=s.id==="special"&&data.plan[selectedDay]==="lift"?"Начинай с уровня EMS 1. Двигай головку постоянно, не задерживай на месте.":s.id==="special"&&data.plan[selectedDay]==="eye"?"Не обрабатывай веки. Следуй схеме EYE CARE из инструкции.":s.id==="special"&&data.plan[selectedDay]==="pump"?"Используй сыворотку или эмульсию, предусмотренную инструкцией Panasonic.":"Сверяйся с инструкцией прибора и не продолжай при раздражении.";}
function formatTime(s){return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}
function stopGuideTimer(){if(guideInterval)clearInterval(guideInterval);guideInterval=null;guideRunning=false;if($("guideStart"))$("guideStart").textContent="Старт таймера";}
function startGuideTimer(){const s=guideSteps[guideIndex];if(!s?.minutes)return;if(guideRunning){stopGuideTimer();return;}if(guideRemaining<=0)guideRemaining=s.minutes;guideRunning=true;$("guideStart").textContent="Пауза";guideInterval=setInterval(()=>{guideRemaining=Math.max(0,guideRemaining-1);$("guideTimer").textContent=formatTime(guideRemaining);if(guideRemaining===0){stopGuideTimer();$("guideStart").textContent="Готово";if(navigator.vibrate)navigator.vibrate([180,100,180]);}},1000);}
function exportCalendar(){
 const time=data.time||"21:00",[hh,mm]=time.split(":").map(Number),now=new Date(),nowTime=now.getHours()*60+now.getMinutes(),todayIndex=(now.getDay()+6)%7,events=[];
 data.plan.forEach((code,i)=>{let daysAhead=(i-todayIndex+7)%7;if(daysAhead===0&&nowTime>hh*60+mm)daysAhead=7;const start=addDays(new Date(now.getFullYear(),now.getMonth(),now.getDate(),12),daysAhead);const date=localDateKey(start).replaceAll("-","");const mode=MODE[code];const details=stepsForDay(i).map(s=>`${s.title}${s.minutes?` — ${s.minutes} мин`:""}: ${s.detail}`).join("\n");const byday=["MO","TU","WE","TH","FR","SA","SU"][i];events.push(["BEGIN:VEVENT",`UID:ehsr90-${byday}-weekly@mybeautyroutine`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}`,`DTSTART:${date}T${String(hh).padStart(2,"0")}${String(mm).padStart(2,"0")}00`,`DURATION:PT20M`,`TRANSP:TRANSPARENT`,`RRULE:FREQ=WEEKLY;BYDAY=${byday}`,`SUMMARY:${icsEscape(`Вечерний уход — ${mode.label}`)}`,`DESCRIPTION:${icsEscape(`Пора начать вечерний уход. Сегодня по плану: ${mode.label}. ${details}`)}`,"BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY",`DESCRIPTION:${icsEscape(`Время ухода: ${mode.label}`)}`,"END:VALARM","END:VEVENT"].join("\r\n"));});
 const raw=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Personal Beauty Routine//EH-SR90//RU","CALSCALE:GREGORIAN","METHOD:PUBLISH",...events,"END:VCALENDAR"].join("\r\n");const content=raw.split("\r\n").map(foldIcsLine).join("\r\n");downloadBlob(content,"EH-SR90-weekly-reminders.ics","text/calendar;charset=utf-8");showToast("Файл календаря подготовлен");
}
function foldIcsLine(line){let result="",part="",bytes=0;for(const ch of line){const size=new TextEncoder().encode(ch).length;if(bytes+size>75){result+=part+"\r\n ";part=ch;bytes=1+size;}else{part+=ch;bytes+=size;}}return result+part;}
function icsEscape(s){return String(s).replace(/\\/g,"\\\\").replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/\r?\n/g,"\\n");}
function downloadBlob(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function updatePermissionStatus(){if(!("Notification" in window)){$("permissionStatus").textContent="Уведомления браузера не поддерживаются. Используй импорт в календарь iPhone.";$("permissionBtn").disabled=true;return;}const p=Notification.permission;$("permissionStatus").textContent=p==="granted"?"Разрешение выдано. Пока приложение открыто, оно проверяет время напоминания.":p==="denied"?"Уведомления заблокированы в настройках браузера.":"Разрешение ещё не запрашивалось.";$("permissionBtn").textContent=p==="granted"?"Проверить уведомление":"Разрешить";}
async function requestNotifications(){if(!("Notification" in window)){showToast("Браузер не поддерживает уведомления");return;}try{const p=await Notification.requestPermission();updatePermissionStatus();if(p==="granted"){await sendNotification("Напоминания включены","Планировщик сможет напомнить о процедуре, пока приложение открыто.");showToast("Разрешение получено");}else showToast("Разрешение не выдано");}catch(e){showToast("Не удалось включить уведомления");}}
async function sendNotification(title,body){try{if(navigator.serviceWorker){const reg=await navigator.serviceWorker.ready;if(reg.showNotification){await reg.showNotification(title,{body,icon:"./icon-192.png",badge:"./icon-192.png",tag:"ehsr90-daily-care",data:{url:"./"}});return;}}new Notification(title,{body});}catch(e){console.warn("Не удалось показать уведомление",e);}}
function checkReminder(){if(!data.time||!("Notification" in window)||Notification.permission!=="granted")return;const now=new Date(),key=localDateKey(now),clock=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;if(clock!==data.time||data.lastNotification===key)return;const idx=(now.getDay()+6)%7,mode=MODE[data.plan[idx]];data.lastNotification=key;persist();sendNotification("Пора начать вечерний уход",`Сегодня по плану: ${mode.label}. Открой приложение, чтобы пройти этапы.`);}
function scheduleReminderCheck(){if(reminderInterval)clearInterval(reminderInterval);checkReminder();reminderInterval=setInterval(checkReminder,15000);}
function saveHistoryNote(){const selected=document.querySelector("#feelingOptions button.active")?.dataset.feeling||"";data.notes[selectedHistoryDate]={text:$("skinNote").value.trim(),feeling:selected};persist();$("noteStatus").textContent="Заметка сохранена на этом устройстве.";}
function backupData(){downloadBlob(JSON.stringify(data,null,2),"EH-SR90-backup.json","application/json");}
function importData(file){const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);if(!parsed||!Array.isArray(parsed.plan)||parsed.plan.length!==7||!parsed.plan.every(x=>["rest","lift","pump","eye"].includes(x))||validatePlan(parsed.plan)){throw new Error("Некорректный формат или расписание нарушает ограничения Panasonic.");}data={...clone(DEFAULT),...parsed};persist();renderAll();showToast("Данные восстановлены");}catch(e){showToast(e.message||"Не удалось прочитать файл");}};reader.readAsText(file);}
function renderAll(){renderHeader();renderToday();renderPlan();renderHistory();renderSettings();}

// Navigation
 document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchScreen(b.dataset.screen)));
$("headerDate").addEventListener("click",()=>{selectedDay=(new Date().getDay()+6)%7;switchScreen("today");});
$("openGuideBtn").addEventListener("click",openGuide);$("closeGuide").addEventListener("click",()=>{stopGuideTimer();$("guideDialog").close();});$("guideDialog").addEventListener("click",e=>{if(e.target===$("guideDialog")){stopGuideTimer();$("guideDialog").close();}});
$("guideStart").addEventListener("click",startGuideTimer);$("guidePrev").addEventListener("click",()=>{stopGuideTimer();guideIndex=Math.max(0,guideIndex-1);showGuideStep();});$("guideNext").addEventListener("click",()=>{stopGuideTimer();if(guideIndex<guideSteps.length-1){guideIndex++;showGuideStep();}else{$("guideDialog").close();showToast("Этапы пройдены. Отметь уход выполненным.");}});
$("prevMonth").addEventListener("click",()=>{monthCursor=new Date(monthCursor.getFullYear(),monthCursor.getMonth()-1,1,12);renderMonth();});$("nextMonth").addEventListener("click",()=>{monthCursor=new Date(monthCursor.getFullYear(),monthCursor.getMonth()+1,1,12);renderMonth();});
document.querySelectorAll("#feelingOptions button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#feelingOptions button").forEach(x=>x.classList.remove("active"));b.classList.add("active");}));$("saveNoteBtn").addEventListener("click",saveHistoryNote);
$("restorePlanBtn").addEventListener("click",()=>{if(confirm("Вернуть исходный недельный план?")){data.plan=clone(DEFAULT_PLAN);persist();renderPlan();renderToday();showToast("Исходный план восстановлен");}});
$("reminderTime").addEventListener("change",e=>{data.time=e.target.value||"21:00";persist();renderToday();renderPlan();scheduleReminderCheck();showToast("Время напоминания сохранено");});$("calendarExportBtn").addEventListener("click",exportCalendar);$("permissionBtn").addEventListener("click",requestNotifications);
$("saveGoalBtn").addEventListener("click",()=>{data.goal={name:$("goalName").value.trim(),date:$("goalDate").value};persist();renderGoalCard();showToast("Цель сохранена");});$("backupBtn").addEventListener("click",backupData);$("importBtn").addEventListener("click",()=>$("importFile").click());$("importFile").addEventListener("change",e=>{const f=e.target.files?.[0];if(f)importData(f);e.target.value="";});

if("serviceWorker" in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").then(()=>scheduleReminderCheck()).catch(err=>{console.warn("Service worker registration failed",err);scheduleReminderCheck();}));}else scheduleReminderCheck();
renderAll();
})();