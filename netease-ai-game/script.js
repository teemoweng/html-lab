/* ── PROGRESS BAR ── */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  prog.style.width = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
},{passive:true});

/* ── SCROLLSPY ── */
const navLinks = document.querySelectorAll('.topnav a');
const spy = new IntersectionObserver(e => {
  e.forEach(el => { if(el.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+el.target.id)); });
},{rootMargin:'-40% 0px -50% 0px'});
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

/* ── REVEAL ── */
function revealInView() {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
  });
}
const revealObs = new IntersectionObserver(e => { e.forEach(el => { if(el.isIntersecting){ el.target.classList.add('in'); revealObs.unobserve(el.target); } }); },{threshold:0.05});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
revealInView();
window.addEventListener('load', revealInView);

/* ── COUNTERS ── */
const cObs = new IntersectionObserver(e => {
  e.forEach(el => { if(el.isIntersecting){
    const t = parseInt(el.target.dataset.count), step = () => { el.target.textContent++; if(parseInt(el.target.textContent)<t) setTimeout(step,120); };
    setTimeout(step,200); cObs.unobserve(el.target);
  }});
},{threshold:0.5});
document.querySelectorAll('.stat-num[data-count]').forEach(el => cObs.observe(el));

/* ── METRIC BARS ── */
const bObs = new IntersectionObserver(e => {
  e.forEach(el => { if(el.isIntersecting){
    el.target.querySelectorAll('.mbar-fill[data-w]').forEach((b,i) => setTimeout(() => b.style.width = b.dataset.w+'%', i*150+200));
    bObs.unobserve(el.target);
  }});
},{threshold:0.3});
document.querySelectorAll('.metrics-main').forEach(el => bObs.observe(el));

/* ── AI FLOW PIPELINE ── */
document.querySelectorAll('.pipe-node').forEach(n => {
  n.addEventListener('click', () => {
    document.querySelectorAll('.pipe-node').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.flow-pane').forEach(p => p.classList.remove('active'));
    n.classList.add('active');
    document.querySelector(`[data-fp="${n.dataset.step}"]`)?.classList.add('active');
  });
});

/* ── AUGMENT SELECTION UI ── */
document.querySelectorAll('.pselector').forEach(btn => {
  btn.addEventListener('click', () => {
    const ps = btn.dataset.ps;
    document.querySelectorAll('.pselector').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.aug-display').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.aug-reason-row').forEach(r => r.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('aug-'+ps)?.classList.add('active');
    document.getElementById('reason-'+ps)?.classList.add('active');
  });
});

/* ── CHAMPION CARD 3D TILT ── */
document.querySelectorAll('.champ-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 400ms cubic-bezier(.2,.8,.3,1)';
    setTimeout(() => card.style.transition = '', 400);
  });
  card.style.transformStyle = 'preserve-3d';
});
