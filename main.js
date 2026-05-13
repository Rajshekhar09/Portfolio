const cur = document.getElementById('cur'),
    ring = document.getElementById('ring');
let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});
(function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
})();

const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
    prog.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
}, {
    passive: true
});

const io = new IntersectionObserver(e => e.forEach(x => {
    if (x.isIntersecting) x.target.classList.add('in');
}), {
    threshold: .1
});
document.querySelectorAll('section').forEach(s => io.observe(s));

/* counter */
function animCount(el, t, d = 1300) {
    let s = null;
    const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / d, 1),
            e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * t);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const cio = new IntersectionObserver(e => e.forEach(x => {
    if (x.isIntersecting) {
        const t = parseInt(x.target.dataset.count);
        if (!isNaN(t)) animCount(x.target, t);
        cio.unobserve(x.target);
    }
}), {
    threshold: .5
});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* tilt on stat cards */
document.querySelectorAll('.sc').forEach(c => {
    c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(),
            cx = r.left + r.width / 2,
            cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / r.width * 12,
            dy = (e.clientY - cy) / r.height * 12;
        c.style.transform = `perspective(600px) rotateX(${-dy}deg) rotateY(${dx}deg) translateZ(6px)`;
        c.style.transition = 'none';
    });
    c.addEventListener('mouseleave', () => {
        c.style.transition = 'transform .5s cubic-bezier(.25,1,.5,1)';
        c.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
        setTimeout(() => c.style.transition = '', 500);
    });
});

/* stagger tags when section enters view */
document.querySelectorAll('section').forEach(sec => {
    const o2 = new IntersectionObserver(e => {
        if (e[0].isIntersecting) {
            sec.querySelectorAll('.tag').forEach((t, i) => {
                setTimeout(() => {
                    t.style.transition = 'opacity .4s ease,transform .4s ease';
                    t.style.opacity = '1';
                    t.style.transform = 'none';
                }, 70 + i * 55);
            });
            o2.unobserve(sec);
        }
    }, {
        threshold: .15
    });
    o2.observe(sec);
});