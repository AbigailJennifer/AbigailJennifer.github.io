/* ===========================================================================
   Comments and likes for blog posts.
   - readers give a name and a comment; an email is optional and only you can see it
   - the only reaction is a thumbs-up like (on the post and on each comment)
   - new comments appear immediately (no approval); the commenter sees a short thank-you
     that fades away after a few seconds
   Until you paste your Firebase details below, it runs in PREVIEW MODE: everything is kept in the
   visitor's own browser, so you can see and try the layout before setting anything up.
   =========================================================================== */

/* Firebase console > Project settings (gear icon) > General > Your apps > Web app > "SDK setup and configuration" > Config.
   Paste your four values between the quotes. These values are safe to be public; your Firestore rules protect the data. */
const FIREBASE_CONFIG = {
  apiKey: '',        // e.g. 'AIza...'
  authDomain: '',    // e.g. 'your-project.firebaseapp.com'
  projectId: '',     // e.g. 'your-project'
  appId: ''          // e.g. '1:1234567890:web:abcdef123456'
};

const LIVE = !!FIREBASE_CONFIG.projectId, FB = '10.12.2', cdn = f => `https://www.gstatic.com/firebasejs/${FB}/${f}.js`;
const THUMB = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>';

/* how long the thank-you stays visible (milliseconds) */
const THANKS_MS = 4000;

/* ---------- preview mode: everything stays in this browser ---------- */
const ls = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} };
const demo = {
  preview: true,
  async list(post) { return ls('cm:comments', []).filter(c => c.post === post) },
  async add(post, c) { const a = ls('cm:comments', []); a.push({ id: 'c' + Date.now(), post, name: c.name, text: c.text, t: Date.now() }); sv('cm:comments', a); return true },
  async count(t) { return (ls('cm:likes', {})[t] || 0) },
  async liked(t) { return !!ls('cm:mine', {})[t] },
  async setLike(t, on) { const l = ls('cm:likes', {}), m = ls('cm:mine', {}); l[t] = Math.max(0, (l[t] || 0) + (on ? 1 : -1)); if (on) m[t] = 1; else delete m[t]; sv('cm:likes', l); sv('cm:mine', m) }
};

/* ---------- live mode: Firebase (Firestore for data, anonymous sign-in so each visitor can like once) ---------- */
let backendP;
function backend() {
  if (!LIVE) return Promise.resolve(demo);
  return backendP ||= (async () => {
    const [app, fs, au] = await Promise.all([import(cdn('firebase-app')), import(cdn('firebase-firestore')), import(cdn('firebase-auth'))]);
    const a = app.initializeApp(FIREBASE_CONFIG), db = fs.getFirestore(a), auth = au.getAuth(a);
    let uid = null;
    const ready = new Promise(r => { au.onAuthStateChanged(auth, u => { if (u) { uid = u.uid; r() } }); setTimeout(r, 7000) });
    au.signInAnonymously(auth).catch(() => {});
    return {
      async list(post) {
        const s = await fs.getDocs(fs.query(fs.collection(db, 'comments'), fs.where('post', '==', post), fs.where('approved', '==', true)));
        return s.docs.map(d => { const x = d.data(); return { id: d.id, post: x.post, name: x.name, text: x.text, t: x.createdAt?.toMillis?.() || 0 } }).sort((p, q) => p.t - q.t)
      },
      async add(post, c) {
        /* approved: true = published straight away. To bring moderation back, set it to false and return false below. */
        await fs.addDoc(fs.collection(db, 'comments'), { post, name: c.name, text: c.text, createdAt: fs.serverTimestamp(), approved: true });
        if (c.email) await fs.addDoc(fs.collection(db, 'emails'), { post, name: c.name, email: c.email, createdAt: fs.serverTimestamp() });
        return true   // true = shows straight away
      },
      async count(t) { return (await fs.getCountFromServer(fs.query(fs.collection(db, 'likes'), fs.where('target', '==', t)))).data().count },
      async liked(t) { await ready; return !!uid && (await fs.getDoc(fs.doc(db, 'likes', t + '_' + uid))).exists() },
      async setLike(t, on) { await ready; if (!uid) throw new Error('no user'); const r = fs.doc(db, 'likes', t + '_' + uid); on ? await fs.setDoc(r, { target: t, uid }) : await fs.deleteDoc(r) }
    };
  })();
}

/* ---------- look (uses the site's colours, so dark mode works too) ---------- */
function style() {
  if (document.getElementById('cm-style')) return;
  const s = document.createElement('style'); s.id = 'cm-style';
  s.textContent = `
.cm{margin:18px 0 0;border-top:2px solid var(--line);padding-top:18px;font-family:var(--b,Georgia,serif)}
.cm *{box-sizing:border-box}
.cm-top{display:flex;justify-content:space-between;align-items:center;gap:12px 16px;flex-wrap:wrap;margin:0 0 4px}
.cm-q{display:block;font:800 22px var(--h,sans-serif);color:var(--ink)}.cm-s{display:block;color:var(--mut);font-size:15px;margin-top:2px}
.cm-like{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:8px 16px;font:700 15px var(--h,sans-serif);cursor:pointer;transition:.2s}
.cm-like:hover{border-color:var(--teal);color:var(--teal)}
.cm-like[aria-pressed=true]{background:var(--teal);border-color:var(--teal);color:#fff}
.cm-like.sm{padding:4px 11px;font-size:13px}.cm-like.sm svg{width:15px;height:15px}
.cm-like:disabled{opacity:.55;cursor:default}
.cm-c{display:grid;grid-template-columns:42px 1fr;gap:4px 14px;padding:14px 0;border-top:1px solid var(--line)}
.cm-c:first-of-type{border-top:0}
.cm-list{margin:0}
.cm-av{width:42px;height:42px;border-radius:50%;background:color-mix(in srgb,var(--teal) 16%,var(--card));color:var(--teal);display:grid;place-items:center;font:800 17px var(--h,sans-serif)}
.cm-n{font:800 16px var(--h,sans-serif);color:var(--ink)}.cm-d{font:500 14px var(--h,sans-serif);color:var(--mut);margin-left:10px}
.cm-t{margin:6px 0 10px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:17px;line-height:1.6}
.cm-empty{color:var(--mut);font-style:italic;padding:10px 0 4px}
.cm-f{display:grid;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px;margin-top:14px}
.cm-f h4{font:800 20px var(--h,sans-serif);margin:0}
.cm-f label{display:block;font:700 14px var(--h,sans-serif);margin-bottom:6px}.cm-f label i{font-weight:500;color:var(--mut);font-style:normal}
.cm-f input,.cm-f textarea{width:100%;font:16px var(--b,serif);padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink)}
.cm-f textarea{min-height:120px;resize:vertical}
.cm-f .hint{font-size:13.5px;color:var(--mut);margin-top:5px}
.cm-f button[type=submit]{justify-self:start;border:0;border-radius:99px;background:var(--ink);color:var(--bg);font:700 15px var(--h,sans-serif);padding:12px 24px;cursor:pointer}
.cm-f button[type=submit]:disabled{opacity:.6;cursor:default}
.cm-hp{position:absolute!important;left:-9999px!important;height:0;overflow:hidden}
.cm-msg{font:600 15px var(--h,sans-serif);color:var(--teal);min-height:1.2em;transition:opacity .6s}.cm-msg.err{color:#c2410c}.cm-msg.cm-fade{opacity:0}
.cm-pv{font:600 13px var(--h,sans-serif);color:var(--mut);background:color-mix(in srgb,var(--amber) 22%,var(--card));border-radius:10px;padding:8px 12px;margin-top:14px}`;
  document.head.append(s);
}

/* ---------- the widget ---------- */
const dt = t => t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
function like(b, target, be) {
  b.className = 'cm-like' + (b.dataset.sm ? ' sm' : ''); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
  b.innerHTML = THUMB + '<span>0</span>'; const n = b.querySelector('span'); let on = false, c = 0, busy = false;
  const paint = () => { b.setAttribute('aria-pressed', on); n.textContent = c; b.title = on ? 'Remove my like' : 'Like' };
  Promise.all([be.count(target), be.liked(target)]).then(r => { c = r[0]; on = r[1]; paint() }).catch(() => { b.disabled = true; b.title = 'Likes are not available right now' });
  b.onclick = async () => { if (busy) return; busy = true; const was = on; on = !on; c += on ? 1 : -1; paint(); try { await be.setLike(target, on) } catch (e) { on = was; c += on ? 1 : -1; paint() } busy = false };
}
export async function mountComments(el, postId) {
  const post = String(postId).replace(/[\/\s]+/g, '-'); style();
  let be;
  try { be = await backend() }
  catch (e) { console.error('Comments: could not start', e); el.className = 'cm'; el.innerHTML = '<div class="cm-empty">Comments are not available right now. Please check back soon.</div>'; return }
  el.classList.add('cm');
  el.innerHTML = `<div class="cm-top"><div><b class="cm-q">Share Your Perspectives</b><span class="cm-s">An open space for thoughts and discussion.</span></div><button data-t="post"></button></div>
<div class="cm-list"></div>
<form class="cm-f" novalidate><h4>Leave a comment</h4>
<div><label for="cmn-${post}">Name</label><input id="cmn-${post}" name="name" maxlength="80" autocomplete="name" required></div>
<div><label for="cme-${post}">Email <i>(optional)</i></label><input id="cme-${post}" name="email" type="email" maxlength="200" autocomplete="email"><div class="hint">Never shown on this site. Only I can see it, so I can write back to you.</div></div>
<div><label for="cmt-${post}">Comment</label><textarea id="cmt-${post}" name="text" maxlength="3000" required></textarea></div>
<input class="cm-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button type="submit">Post comment</button><div class="cm-msg" role="status"></div></form>${be.preview ? '<div class="cm-pv">Preview mode: comments and likes are stored only in this browser until Firebase is connected.</div>' : ''}`;
  like(el.querySelector('[data-t=post]'), 'post:' + post, be);
  const list = el.querySelector('.cm-list');
  async function render() {
    let cs = []; try { cs = await be.list(post) } catch (e) { list.innerHTML = '<div class="cm-empty">Comments could not be loaded right now.</div>'; return }
    list.innerHTML = cs.length ? '' : '<div class="cm-empty">No comments yet. Be the first to share a thought.</div>';
    cs.forEach(c => {
      const row = document.createElement('div'); row.className = 'cm-c';
      const av = document.createElement('div'); av.className = 'cm-av'; av.textContent = (c.name || '?').trim().charAt(0).toUpperCase();
      const body = document.createElement('div'), head = document.createElement('div'), nm = document.createElement('span'), d = document.createElement('span'), tx = document.createElement('p'), lk = document.createElement('button');
      nm.className = 'cm-n'; nm.textContent = c.name; d.className = 'cm-d'; d.textContent = dt(c.t); tx.className = 'cm-t'; tx.textContent = c.text;
      head.append(nm, d); lk.dataset.sm = 1; like(lk, 'comment:' + c.id, be); body.append(head, tx, lk); row.append(av, body); list.append(row)
    });
  }
  render();

  const f = el.querySelector('form'), msg = el.querySelector('.cm-msg');
  let hideTimer, clearTimer;
  /* say(text, isError, fadeAway): errors stay until the next action; the thank-you fades after THANKS_MS */
  const say = (t, e, fade) => {
    clearTimeout(hideTimer); clearTimeout(clearTimer);
    msg.textContent = t; msg.className = 'cm-msg' + (e ? ' err' : '');
    if (fade) {
      hideTimer = setTimeout(() => {
        msg.classList.add('cm-fade');
        clearTimer = setTimeout(() => { msg.textContent = ''; msg.className = 'cm-msg' }, 600);
      }, THANKS_MS);
    }
  };
  const THANKS = 'Thank you for your comment!';

  f.addEventListener('submit', async e => {
    e.preventDefault(); const v = Object.fromEntries(new FormData(f)), name = (v.name || '').trim(), text = (v.text || '').trim(), email = (v.email || '').trim();
    if (!name || !text) return say('Please add your name and a comment.', 1);
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say('That email address does not look right. You can also leave it empty.', 1);
    if (v.website) return say(THANKS, 0, 1);   // hidden field filled in = bot; look the same, save nothing
    const last = +(ls('cm:last', 0)); if (Date.now() - last < 20000) return say('Please wait a few seconds before posting again.', 1);
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; say('Sending…');
    try {
      await be.add(post, { name, email, text });
      sv('cm:last', Date.now()); f.reset();
      say(THANKS, 0, 1);
      render();
    }
    catch (err) { say('Sorry, that did not go through. Please try again in a moment.', 1) }
    btn.disabled = false
  })
}
/* any element written as <div data-comments="post-name"></div> is filled in automatically */
document.querySelectorAll('[data-comments]').forEach(el => mountComments(el, el.dataset.comments));
