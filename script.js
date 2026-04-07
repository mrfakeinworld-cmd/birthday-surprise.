const PASSWORD = "Malaika";

const screens = {
  lock: document.getElementById("screen-lock"),
  choice: document.getElementById("screen-choice"),
  surprise: document.getElementById("screen-surprise"),
  letter: document.getElementById("screen-letter"),
};

function showScreen(key){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[key].classList.add("active");
}

/* Lock */
const input = document.getElementById("password");
const btnUnlock = document.getElementById("btn-unlock");
const lockErr = document.getElementById("lock-error");

function unlock(){
  const val = (input.value || "").trim();
  if(val === PASSWORD){
    lockErr.hidden = true;
    sparkleBurst(0.5, 0.35, 26);
    showScreen("choice");
  } else {
    lockErr.hidden = false;
    input.value = "";
    input.focus();
    teaseShake();
    sparkleBurst(0.5, 0.35, 10, true);
  }
}
btnUnlock.addEventListener("click", unlock);
input.addEventListener("keydown", (e)=>{ if(e.key === "Enter") unlock(); });

function teaseShake(){
  const card = screens.lock.querySelector(".card");
  card.animate([
    { transform:"translateX(0)" },
    { transform:"translateX(-8px)" },
    { transform:"translateX(8px)" },
    { transform:"translateX(-6px)" },
    { transform:"translateX(6px)" },
    { transform:"translateX(0)" },
  ], { duration: 420, easing:"ease-out" });
}

/* Choice */
const btnNeed = document.getElementById("btn-need");
const btnNoNeed = document.getElementById("btn-noneed");
const tease = document.getElementById("choice-tease");

btnNoNeed.addEventListener("click", ()=>{
  tease.textContent = "Nice try… 😌 pick “Need surprise”";
  sparkleBurst(0.55, 0.42, 16);
  // stays on same screen, playful loop
});

btnNeed.addEventListener("click", ()=>{
  tease.textContent = "";
  showScreen("surprise");
  // open gift automatically after a short pause
  setTimeout(()=> openGift(true), 500);
});

/* Surprise scene */
const gift = document.getElementById("gift");
const cakeWrap = document.getElementById("cakeWrap");
const candles = document.getElementById("candles");
const slice = document.getElementById("slice");
const btnWishDone = document.getElementById("btn-wishdone");
const btnMyWish = document.getElementById("btn-mywish");

let giftOpened = false;
function openGift(auto=false){
  if(giftOpened) return;
  giftOpened = true;
  gift.classList.add("open");
  sparkleBurst(0.5, 0.55, 40);
  setTimeout(()=>{
    cakeWrap.classList.add("show");
    cakeWrap.setAttribute("aria-hidden","false");
    // extra confetti + emoji pops
    sparkleBurst(0.5, 0.52, 50);
    emojiPopLoop(1600);
  }, 650);

  if(!auto){
    // optional extra feedback if user taps gift
    sparkleBurst(0.48, 0.50, 20);
  }
}
gift.addEventListener("click", ()=> openGift(false));

btnWishDone.addEventListener("click", ()=>{
  // blow out candles
  candles.classList.add("out");
  sparkleBurst(0.5, 0.55, 36, false, "gold");
  // cut slice
  setTimeout(()=> slice.classList.add("cut"), 500);
  // enable my wish
  setTimeout(()=>{
    btnMyWish.disabled = false;
    btnMyWish.classList.add("primary");
    btnMyWish.classList.remove("ghost");
    sparkleBurst(0.5, 0.60, 26);
  }, 850);
});

btnMyWish.addEventListener("click", ()=>{
  showScreen("letter");
  setTimeout(()=> {
    // reveal envelope + letter
    sparkleBurst(0.5, 0.32, 24);
  }, 200);
});

/* Letter screen */
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const btnReplay = document.getElementById("btn-replay");

envelope.addEventListener("click", ()=>{
  letter.classList.add("show");
  letter.setAttribute("aria-hidden","false");
  sparkleBurst(0.5, 0.28, 36);
  emojiPopLoop(2200);
});

btnReplay.addEventListener("click", ()=>{
  // reset
  giftOpened = false;
  gift.classList.remove("open");
  cakeWrap.classList.remove("show");
  cakeWrap.setAttribute("aria-hidden","true");
  candles.classList.remove("out");
  slice.classList.remove("cut");
  btnMyWish.disabled = true;
  btnMyWish.classList.remove("primary");
  btnMyWish.classList.add("ghost");
  letter.classList.remove("show");
  letter.setAttribute("aria-hidden","true");
  input.value = "";
  lockErr.hidden = true;
  showScreen("lock");
});

/* Premium FX: sparkles + emoji */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W=0,H=0;
function resize(){
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const particles = [];
function sparkleBurst(nx, ny, count, isError=false, palette="pink"){
  const x = nx * W;
  const y = ny * H;

  const colors = palette === "gold"
    ? ["#fff1b3", "#ffd36a", "#f6c453", "#ffffff"]
    : isError
      ? ["#ffb4c4","#ffd1dc","#ffffff"]
      : ["#ffd1f5","#c7fbff","#b9a5ff","#ffffff"];

  for(let i=0;i<count;i++){
    const a = Math.random()*Math.PI*2;
    const s = (isError? 0.55:0.9) + Math.random()*1.6;
    particles.push({
      x, y,
      vx: Math.cos(a)*s*9,
      vy: Math.sin(a)*s*9 - 6,
      life: 60 + Math.random()*25,
      r: 1.5 + Math.random()*3.0,
      c: colors[(Math.random()*colors.length)|0],
      g: 0.22 + Math.random()*0.18
    });
  }
}

const EMOJIS = ["❤️","🌹","🎈","✨","💗","🫂","😍","🥹","♾️","🧬","😊","🤞🏻","🎉"];
let emojiTimer = null;
function emojiPopLoop(interval=1800){
  if(emojiTimer) clearTimeout(emojiTimer);
  const pop = ()=>{
    const e = EMOJIS[(Math.random()*EMOJIS.length)|0];
    const x = 0.18 + Math.random()*0.64;
    const y = 0.18 + Math.random()*0.56;
    floatingEmoji(e, x, y);
    emojiTimer = setTimeout(pop, interval);
  };
  pop();
}

function floatingEmoji(char, nx, ny){
  const el = document.createElement("div");
  el.textContent = char;
  el.style.position = "fixed";
  el.style.left = (nx*100) + "vw";
  el.style.top = (ny*100) + "vh";
  el.style.fontSize = (22 + Math.random()*18) + "px";
  el.style.transform = "translate(-50%,-50%)";
  el.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,.35))";
  el.style.zIndex = 50;
  el.style.pointerEvents = "none";
  document.body.appendChild(el);

  const dx = (-30 + Math.random()*60);
  const dy = (-70 - Math.random()*60);
  el.animate([
    { opacity:0, transform:"translate(-50%,-50%) scale(.6)" },
    { opacity:1, transform:"translate(-50%,-50%) scale(1)" },
    { opacity:0, transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.1)` }
  ], { duration: 1500 + Math.random()*900, easing:"cubic-bezier(.2,.9,.2,1)" });

  setTimeout(()=> el.remove(), 2600);
}

function tick(){
  ctx.clearRect(0,0,W,H);
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life -= 1;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    const alpha = Math.max(0, Math.min(1, p.life / 70));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI*2);
    ctx.fill();
    if(p.life<=0) particles.splice(i,1);
  }
  requestAnimationFrame(tick);
}
tick();
