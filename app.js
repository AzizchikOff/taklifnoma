'use strict';
const config = window.WEDDING;
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const guest = (params.get('guest') || '').trim().slice(0, 140);
const honor = params.get('type') === 'honor';
let language = 'uz';
let opened = false;
let audio;
const words = {
 uz: {edition:honor?'EHTIROM BILAN, SHAXSAN SIZGA':'SIZ UCHUN TAKLIF',coverTitle:'Baxtli kunimizga\nbir maktub.',recipient:'Aziz mehmonimiz',openHint:'MUHRNI BOSIB, MAKTUBNI OCHING',heroLabel:'BIZNING ENG GO‘ZAL KUNIMIZ',letterLabel:'QALBIMIZDAN SIZGA',greeting:guest ? `Hurmatli ${guest}!`:'Aziz mehmonimiz!',message:honor?'Hayotimizning yangi sahifasini ochar ekanmiz, ushbu qutlug‘ kunda Sizning tashrifingiz va duolaringiz biz uchun alohida qadrlidir. Sizni nikoh to‘yimizga chuqur hurmat va ehtirom bilan taklif etamiz.':'Umrimizning eng baxtli kunini qadrdonlarimiz davrasida nishonlashni niyat qildik. Sizni nikoh to‘yimizga samimiy taklif etamiz.',closing:honor?'Davramizga fayz bag‘ishlab, aziz mehmonimiz bo‘lishingizni kutamiz.':'Keling, ushbu go‘zal xotirani birga yarataylik.',whenLabel:'QACHON',whereLabel:'QAYERDA',calendar:'Taqvimga qo‘shish ↗',map:'Xaritada ochish ↗',mapMissing:'Manzil tez orada qo‘shiladi',countTitle:'UNUTILMAS KUNGACHA',countNote:'Har bir quvonch yaqinlar bilan go‘zal.',footerTitle:'Borligingiz — bizga sovg‘a.',footerNote:'Sizni intiqlik bilan kutamiz.',units:['KUN','SOAT','DAQIQA','SONIYA'],pending:'Aniqlashtirilmoqda',today:'Baxtli kunimiz keldi!'},
 ru: {edition:honor?'С ОСОБЫМ УВАЖЕНИЕМ, ЛИЧНО ВАМ':'ПРИГЛАШЕНИЕ ДЛЯ ВАС',coverTitle:'Письмо к нашему\nсчастливому дню.',recipient:'Дорогой гость',openHint:'НАЖМИТЕ НА ПЕЧАТЬ, ЧТОБЫ ОТКРЫТЬ',heroLabel:'НАШ САМЫЙ ПРЕКРАСНЫЙ ДЕНЬ',letterLabel:'ОТ ВСЕГО СЕРДЦА',greeting:guest?`С уважением к Вам, ${guest}!`:'Дорогие гости!',message:honor?'В этот особенный день Ваше присутствие и добрые пожелания имеют для нас большую ценность. С глубоким уважением приглашаем Вас на нашу свадьбу.':'Мы хотим разделить самый счастливый день с близкими. От всего сердца приглашаем Вас на нашу свадьбу.',closing:'Будем рады разделить с Вами наше счастье.',whenLabel:'КОГДА',whereLabel:'ГДЕ',calendar:'Добавить в календарь ↗',map:'Открыть карту ↗',mapMissing:'Адрес скоро появится',countTitle:'ДО НАШЕГО ДНЯ',countNote:'Счастье прекраснее рядом с близкими.',footerTitle:'Ваше присутствие — наш подарок.',footerNote:'С нетерпением ждём Вас.',units:['ДНЕЙ','ЧАСОВ','МИНУТ','СЕКУНД'],pending:'Уточняется',today:'Наш счастливый день настал!'}
};
document.body.classList.toggle('honor',honor);
function formatDate(){return new Intl.DateTimeFormat(language==='uz'?'uz-UZ':'ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${config.date}T12:00:00Z`));}
function render(){
 const t=words[language]; document.documentElement.lang=language;
 for(const [key,value] of Object.entries(t)) if($(key)) $(key).textContent=value;
 $('coverTitle').style.whiteSpace='pre-line';
 $('recipient').textContent=guest||t.recipient;
 $('groom').textContent=config.groom; $('bride').textContent=config.bride;
 $('seal').textContent=`${Array.from(config.groom)[0]}·${Array.from(config.bride)[0]}`;
 $('signature').textContent=`${config.groom} & ${config.bride}`;
 $('dateHero').textContent=formatDate(); $('dateDetail').textContent=formatDate();
 $('time').textContent=config.time||t.pending; $('venue').textContent=config.venue||t.pending; $('address').textContent=config.address;
 $('lang').textContent=language==='uz'?'Русский':'O‘zbekcha';
 $('calendar').hidden=!config.time;
 let safeMap=false;try{const url=new URL(config.mapUrl);safeMap=['https:','http:'].includes(url.protocol);}catch{}
 $('map').hidden=!safeMap; $('mapMissing').hidden=safeMap;if(safeMap)$('map').href=config.mapUrl;
 document.title=`${config.groom} & ${config.bride} · ${language==='uz'?'To‘y taklifnomasi':'Приглашение'}`;
 updateCountdown();
}
function updateCountdown(){
 const t=words[language]; const target=new Date(`${config.date}T${config.time||'00:00'}:00${config.timezone}`).getTime();
 const seconds=Math.max(0,Math.floor((target-Date.now())/1000));
 $('digits').replaceChildren();
 if(!config.time){$('countNote').textContent=language==='uz'?'Boshlanish vaqti aniqlashtirilmoqda.':'Время начала уточняется.';return;}
 const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
 values.forEach((value,i)=>{const cell=document.createElement('div');const number=document.createElement('strong');const label=document.createElement('small');number.textContent=String(value).padStart(2,'0');label.textContent=t.units[i];cell.append(number,label);$('digits').append(cell);});
 $('countNote').textContent=seconds===0?t.today:t.countNote;
}
$('lang').addEventListener('click',()=>{language=language==='uz'?'ru':'uz';render();});
$('open').addEventListener('click',()=>{
 if(opened)return; opened=true;$('open').classList.add('opening');
 if(config.musicUrl){audio=new Audio(config.musicUrl);audio.loop=true;audio.volume=.25;const button=document.createElement('button');button.className='text-button';button.textContent='♫';button.setAttribute('aria-label','Musiqani yoqish yoki o‘chirish');button.onclick=()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause();};document.querySelector('header').append(button);audio.play().catch(()=>{});}
 setTimeout(()=>{$('cover').hidden=true;$('invitation').hidden=false;$('invitation').focus();window.scrollTo(0,0);},matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);
});
const escapeICS=text=>String(text).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
$('calendar').addEventListener('click',()=>{
 const start=new Date(`${config.date}T${config.time}:00${config.timezone}`);const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Taklifnoma//UZ','BEGIN:VEVENT',`UID:wedding-${config.date}@taklifnoma`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(new Date(start.getTime()+3*3600000))}`,`SUMMARY:${escapeICS(config.groom+' & '+config.bride+' — To‘y')}`,`LOCATION:${escapeICS(config.venue+' '+config.address)}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='toy.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
if(config.groom==='Kuyov'||!config.time||!config.venue){$('setupNote').hidden=false;$('setupNote').textContent='Namuna: kuyov-kelin ismlari, to‘y vaqti va manzili hali kiritilmagan.';}
render();setInterval(updateCountdown,1000);

// Subtle depth on pointer devices; touch and reduced-motion users keep a static view.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const envelope = $('open');
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
 envelope.addEventListener('pointermove', event => {
  if (opened || reducedMotion.matches) return;
  const box = envelope.getBoundingClientRect();
  envelope.style.setProperty('--tilt-x', `${-(event.clientY-box.top-box.height/2)/28}deg`);
  envelope.style.setProperty('--tilt-y', `${(event.clientX-box.left-box.width/2)/35}deg`);
 });
 const resetTilt = () => { envelope.style.setProperty('--tilt-x','0deg'); envelope.style.setProperty('--tilt-y','0deg'); };
 envelope.addEventListener('pointerleave', resetTilt);
 envelope.addEventListener('click', resetTilt);
}
const navigation = document.querySelector('header');
const updateNavigation = () => navigation.classList.toggle('scrolled', window.scrollY > 20);
addEventListener('scroll', updateNavigation, {passive:true});
updateNavigation();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
 const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
   entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
  }
 }, {threshold:0.08});
 document.querySelectorAll('.letter,.details,.countdown,footer').forEach(section => {
  section.classList.add('reveal-ready'); observer.observe(section);
 });
}
