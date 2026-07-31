(() => {
  const routine = window.GYM_COMPANION_ROUTINE;
  const STORE_KEY = 'gym-companion-history-v3';
  localStorage.removeItem('gym-companion-v2');
  let store;
  try { store = JSON.parse(localStorage.getItem(STORE_KEY) || '{"version":3,"sessions":{}}'); } catch { store = {version:3,sessions:{}}; }
  if(!store || store.version !== 3 || !store.sessions) store = {version:3,sessions:{}};
  let screen = 'home', dayIndex = 0, activeDate = '', readOnlyDate = '', calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const $ = id => document.getElementById(id);
  const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const dateFromIso = value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d); };
  const formatDate = value => dateFromIso(value).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
  const nextDateFor = index => { const now=new Date(), target=index+1, delta=(target-now.getDay()+7)%7; now.setHours(0,0,0,0); now.setDate(now.getDate()+delta); return now; };
  const persist = () => localStorage.setItem(STORE_KEY, JSON.stringify(store));
  const blankSession = (date, index) => ({date,dayIndex:index,day:routine[index].day,focus:routine[index].focus,slots:{},warmup:{},finish:{}});
  const getSession = (date, index) => store.sessions[date] || blankSession(date,index);
  const saveSession = session => { store.sessions[session.date]=session; persist(); return session; };
  const listSessions = month => Object.values(store.sessions).filter(session => { const date=dateFromIso(session.date); return date.getFullYear()===month.getFullYear() && date.getMonth()===month.getMonth(); });
  const activity = (session, day=routine[session.dayIndex]) => { const done=Object.values(session.slots||{}).filter(x=>x.done).length; return {done,total:day?.slots.length||0,complete:!!day?.slots.length && done===day.slots.length}; };
  const activeSession = () => getSession(activeDate,dayIndex);
  const saveActive = mutate => { const session=activeSession(); mutate(session); saveSession(session); };
  const guidedOption = (session, phase, index, step) => step.choices ? step.choices[Math.min(session[phase]?.[index]?.choice ?? 0, step.choices.length-1)] : step;
  const validate = () => {
    const errors=[], guidedAssets=new Set();
    routine.forEach(day => { ['warmup','finish'].forEach(phase => day[phase].steps.forEach((step,index) => { if(!step.title||!step.duration||!step.image||!step.alt)errors.push(`${day.day} ${phase} ${index+1}`); [step,...(step.choices||[])].forEach(item=>guidedAssets.add(item.image)); })); day.slots.forEach((slot,index)=>{const options=[slot.primary,slot.alternative,slot.third].filter(Boolean);if(options.length<2||new Set(options.map(option=>option.image)).size!==options.length)errors.push(`${day.day} slot ${index+1}`);}); });
    [...guidedAssets].forEach(src=>{const image=new Image();image.onerror=()=>console.warn(`Missing guided asset: ${src}`);image.src=src;});
    if(errors.length) console.error('Routine validation failed:',errors);
  };
  const logo = '<img class="logo" src="assets/fitness7-hero-logo.png" alt="Fitness 7">';
  function renderHome() {
    const today=new Date();
    $('app').innerHTML=`<main class="shell home-screen"><header class="home-hero">${logo}<p>Your simple workout companion</p><span>${today.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</span></header><section class="home-days" aria-label="Choose a training day">${routine.map((day,index)=>{const date=nextDateFor(index), session=store.sessions[iso(date)], status=session?activity(session,routine[index]):null;return `<button class="day-card" data-open-day="${index}"><b>${day.day}</b><span>${day.focus}</span><small>${date.toLocaleDateString(undefined,{day:'numeric',month:'short'})}${status?` · ${status.complete?'Completed':'In progress'}`:''}</small><i>›</i></button>`;}).join('')}<button class="day-card rest-card" data-rest><b>Sunday</b><span>Rest day</span><small>Recover, walk, or reset</small><i>›</i></button></section><p class="device-note">Progress and history stay privately on this device.</p></main>`;
  }
  function phase(day, session, name, label, editable) {
    const group=day[name];
    return `<section class="phase card"><header><div><b>${label} <em>Recommended</em></b><small>${group.total} · optional</small></div></header><div class="guided-list">${group.steps.map((step,index)=>{const saved=session[name]?.[index]||{}, choice=guidedOption(session,name,index,step), done=saved.done;return `<article class="guided-step ${done?'done':''}"><div class="guided-image" role="img" aria-label="${choice.alt||step.alt}" style="background-image:url('${choice.image||step.image}')"></div><div><b>${choice.name||step.title}</b><small>${step.duration}</small><p>${step.cue}</p>${step.choices?`<div class="guided-choices" role="radiogroup">${step.choices.map((item,choiceIndex)=>`<button ${editable?'':'disabled'} class="pill ${choice.name===item.name?'selected':''}" data-guided-choice="${name}" data-guided-step="${index}" data-guided-choice-index="${choiceIndex}">${item.name}</button>`).join('')}</div>`:''}</div>${editable?`<label class="check"><input type="checkbox" data-phase-done="${name}" data-step="${index}" ${done?'checked':''}><span>Done</span></label>`:''}</article>`;}).join('')}</div></section>`;
  }
  function workoutSlots(day, session, editable) {
    return `<section id="slots">${day.slots.map((slot,index)=>{const choices=[slot.primary,slot.alternative,slot.third].filter(Boolean), saved=session.slots?.[index]||{}, choiceIndex=Math.min(saved.choice??0,choices.length-1), choice=choices[choiceIndex];return `<article class="card workout-slot"><div class="slot-head"><span class="num">${String(index+1).padStart(2,'0')}</span><div><b>${choice.name}</b><small>${slot.scheme}</small></div>${editable?`<input type="checkbox" data-slot-done="${index}" aria-label="Mark ${choice.name} complete" ${saved.done?'checked':''}>`:saved.done?'<span class="complete-mark">Done</span>':''}</div>${editable?`<div class="option-pills" role="radiogroup">${choices.map((item,i)=>`<button class="pill ${i===choiceIndex?'selected':''}" data-choice="${index}" data-choice-index="${i}">${i===0?'Primary':i===1?'Variation':'Cardio option'}</button>`).join('')}</div>`:''}<div class="selected-exercise"><div class="visual" role="img" aria-label="${choice.name} exercise illustration" style="background-image:url('${choice.image}')"></div><div><h2>${choice.name}</h2><p>${slot.cue}</p><span>${slot.scheme}</span></div></div></article>`;}).join('')}</section>`;
  }
  function calendar() {
    const first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1), start=first.getDay(), days=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,0).getDate();
    const sessions=Object.fromEntries(listSessions(calendarMonth).map(session=>[session.date,session]));
    const cells=Array.from({length:start+days},(_,index)=>{if(index<start)return '<span class="calendar-blank"></span>';const date=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),index-start+1), id=iso(date), session=sessions[id], status=session?activity(session):null;return `<button class="calendar-day ${status?(status.complete?'complete':'partial'):''}" ${session?`data-history-date="${id}"`:'disabled'} aria-label="${date.toLocaleDateString()}${status?`, ${status.complete?'complete':'in progress'}`:''}">${date.getDate()}</button>`;}).join('');
    return `<section class="calendar card"><header><div><b>Workout history</b><small>Stored privately on this device</small></div><div><button class="icon-btn" data-calendar-nav="-1" aria-label="Previous month">‹</button><button class="icon-btn" data-calendar-nav="1" aria-label="Next month">›</button></div></header><strong>${calendarMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</strong><div class="weekdays"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div><div class="calendar-grid">${cells}</div><p class="legend"><i class="partial"></i> In progress <i class="complete"></i> Complete</p></section>`;
  }
  function renderReadOnly(session) {
    const day=routine[session.dayIndex], count=activity(session,day), warm=Object.values(session.warmup||{}).filter(x=>x.done).length, finish=Object.values(session.finish||{}).filter(x=>x.done).length;
    return `<section class="history-summary card"><button class="back-link" data-close-history>‹ Back to active workout</button><span class="eyebrow">Saved session · ${formatDate(session.date)}</span><h1>${session.focus}</h1><p>${count.done}/${count.total} workout exercises completed · warm-up ${warm}/${day.warmup.steps.length} · recovery ${finish}/${day.finish.steps.length}</p>${workoutSlots(day,session,false)}</section>`;
  }
  function renderDetail() {
    const day=routine[dayIndex], session=activeSession(), count=activity(session,day), readonly=readOnlyDate&&store.sessions[readOnlyDate];
    $('app').innerHTML=`<main class="shell detail-screen"><header class="detail-top"><button class="back-link" data-home>‹ All days</button>${logo}<span>${formatDate(activeDate)}</span></header>${readonly?renderReadOnly(readonly):`<section class="head"><div class="eyebrow">${formatDate(activeDate)}</div><h1>${day.focus}</h1><span class="tag">${day.time}</span></section><section class="progress-card card"><b>${count.done}/${count.total} workout exercises</b><span>Recommended: warm-up ${Object.values(session.warmup||{}).filter(x=>x.done).length}/${day.warmup.steps.length} · recovery ${Object.values(session.finish||{}).filter(x=>x.done).length}/${day.finish.steps.length}</span><div class="progress"><i style="width:${count.total?count.done/count.total*100:0}%"></i></div></section>${phase(day,session,'warmup','Warm-up',true)}${workoutSlots(day,session,true)}${phase(day,session,'finish','Recovery finish',true)}`} ${calendar()}<section class="utility"><button class="button" id="print">Print workout</button><button class="button" id="reset">Clear local history</button></section></main>`;
  }
  function renderRest() { $('app').innerHTML=`<main class="shell rest-screen"><header class="detail-top"><button class="back-link" data-home>‹ All days</button>${logo}</header><section class="rest-card card"><span class="eyebrow">Sunday</span><h1>Rest day</h1><p>No workout needs tracking today. A relaxed walk, easy mobility, or a full day off all count as recovery.</p></section></main>`; }
  function render(){ if(screen==='home')renderHome(); else if(screen==='rest')renderRest(); else renderDetail(); }
  document.addEventListener('click',event=>{
    const openDay=event.target.closest('[data-open-day]'); if(openDay){dayIndex=Number(openDay.dataset.openDay);activeDate=iso(nextDateFor(dayIndex));calendarMonth=new Date(dateFromIso(activeDate).getFullYear(),dateFromIso(activeDate).getMonth(),1);readOnlyDate='';screen='detail';render();return;}
    if(event.target.closest('[data-rest]')){screen='rest';render();return;}
    if(event.target.closest('[data-home]')){screen='home';readOnlyDate='';render();return;}
    if(event.target.closest('[data-close-history]')){readOnlyDate='';render();return;}
    const choice=event.target.closest('[data-choice]'); if(choice){saveActive(session=>{session.slots[choice.dataset.choice]={...(session.slots[choice.dataset.choice]||{}),choice:Number(choice.dataset.choiceIndex)};});render();return;}
    const guided=event.target.closest('[data-guided-choice]'); if(guided){saveActive(session=>{const phase=guided.dataset.guidedChoice,index=guided.dataset.guidedStep;session[phase][index]={...(session[phase][index]||{}),choice:Number(guided.dataset.guidedChoiceIndex)};});render();return;}
    const navigation=event.target.closest('[data-calendar-nav]'); if(navigation){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+Number(navigation.dataset.calendarNav),1);render();return;}
    const history=event.target.closest('[data-history-date]'); if(history){readOnlyDate=history.dataset.historyDate;render();return;}
    if(event.target.id==='print')window.print(); if(event.target.id==='reset'&&confirm('Clear all local workout history from this device?')){store={version:3,sessions:{}};persist();screen='home';readOnlyDate='';render();}
  });
  document.addEventListener('change',event=>{if(screen!=='detail'||readOnlyDate)return; if(event.target.dataset.slotDone!==undefined)saveActive(session=>{const index=event.target.dataset.slotDone;session.slots[index]={...(session.slots[index]||{}),done:event.target.checked};}); if(event.target.dataset.phaseDone){saveActive(session=>{const phase=event.target.dataset.phaseDone,index=event.target.dataset.step;session[phase][index]={...(session[phase][index]||{}),done:event.target.checked};});}render();});
  validate(); render();
})();
