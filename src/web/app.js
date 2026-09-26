/* =========================================================================
   Vape V4 skin — clipboard demo (app.js)
   同一套 Vape V4 皮肤 + 剪切板数据；纯前端，无网络请求。
   几何/配色按参考截图 (1600x900) 实测复刻：
   面板宽 184 / 间隔 9 / 侧栏 x=54 / 面板 x=247+193k / 行高 33 / 设置行 25
   ========================================================================= */

/* ------------------------------- 图标 ------------------------------- */
const I = {
  stack:'i-stack', text:'i-text', link:'i-link', code:'i-code', star:'i-star',
  starO:'i-star-o', user:'i-user', userF:'i-user-f', sliders:'i-sliders',
  keyboard:'i-keyboard', trash:'i-trash', clock:'i-clock', gear:'i-gear',
  refresh:'i-refresh', chev:'i-chev', chevUp:'i-chev-up', chevDn:'i-chev-dn',
  pencil:'i-pencil', search:'i-search', clipin:'i-clipin', dots:'i-dots',
  keycap:'i-keycap', bars:'i-bars', globe:'i-globe', plus:'i-plus',
  listCheck:'i-list-check', swap:'i-swap', heart:'i-heart', save:'i-save', folder:'i-folder',
  image:'i-image', download:'i-download'
};
const svg = (id, cls) => `<svg${cls ? ` class="${cls}"` : ''}><use href="#${id}"/></svg>`;

/* ------------------------------- 文案 ------------------------------- */
const T = {
  en:{
    all:'All items', text:'Text', link:'Links', code:'Code', fav:'Starred', image:'Images',
    account:'Account', profiles:'Profiles', macros:'Macros', misc:'MISC',
    search:'Search clipboard', local:'LOCAL', cloud:'CLOUD',
    signin:'Sign in required', signinBtn:'SIGN IN', createNew:'CREATE NEW',
    public:'PUBLIC', profilesHint:'Profiles are kept in this browser only (demo).',
    copy:'Copy', paste:'Paste', autoCopy:'Copy sound on click', pin:'Pin to top',
    copyImage:'Copy image', saveImage:'Save image as…', tImgCaptured:'Image captured',
    transform:'Transform', protect:'Delete protection', dedupe:'Dedupe on capture',
    history:'History', quick:'Quick slot', chars:'chars',
    mCopy:'Copy', mPaste:'Paste', mPin:'Pin / unpin', mStar:'Star / unstar',
    mEdit:'Edit text', mDel:'Delete', mQuick:'Assign quick slot', mClearQuick:'Clear quick slot',
    tCopied:'Copied to the system clipboard', tPasted:'Pasted into the app',
    tCaptured:'Clipboard captured', tImported:'Imported from the system clipboard',
    tEmpty:'Nothing here', tEmptyClip:'System clipboard is empty',
    tDenied:'The browser blocked clipboard access — press Ctrl+V instead',
    tDeleted:'Entry deleted', tProtected:'This entry is protected',
    tNew:'Entry created', tDemo:'Demo only — nothing leaves this page',
    tReset:'Demo data restored', tCleared:'All entries cleared', tExists:'Duplicate skipped',
    tLimit:'History cap set to {n}',
    shortcuts:'SHORTCUTS', sc1:'Capture / add entry', sc2:'Focus search',
    sc3:'Quick copy slot', sc4:'Close menus', sc5:'Toggle the All panel',
    macPlaceholder:'Type item name', macAdd:'Store into a quick slot',
    macHint:'Bind an entry to a quick slot (1-9) from its ⋮ menu.',
    emptyAll:'Clipboard is empty — press Ctrl+V to capture',
    emptyCat:'Nothing in this category yet',
    addBtn:'Add / paste content',
    edTitle:'NEW ENTRY', edPlaceholder:'Paste or type here…',
    edPaste:'Paste from clipboard', edSave:'Save', edTip:'Ctrl+Enter save · Esc cancel',
    tAddEmpty:'Type something first', tCollapsed:'Content collapsed', tExpanded:'Content expanded',
    settings:'Settings',
    renameHint:'Double-click a panel title to rename it',
    introOn:'Play inject animation on start',
    tRenamed:'Panel renamed', tNameReset:'Name restored',
    profileTab:'PROFILE', statsTab:'STATS',
    uploadAvatar:'Upload avatar', namePlaceholder:'Your name…', noName:'未命名',
    expBtn:'EXPORT', impBtn:'IMPORT',
    expHint:'Export writes every entry to a .json file · Import merges a file back in.',
    tExported:'Exported {n} entries', tImported2:'Imported {n} entries', tImportNone:'Nothing to import',
    tImportFail:'Import failed',
    statTotal:'Entries', statFav:'Starred', statPin:'Pinned', statLast:'Latest',
    newCat:'New category', catNamePh:'Category name…', catCreate:'Create', catCancel:'Cancel',
    catIcon:'Icon', catDelete:'Delete category', catAskDel:'Delete this category? (entries stay)',
    tCatAdded:'Category created', tCatDeleted:'Category deleted',
    moveTo:'Move into category', moveOut:'Remove from category', tMoved:'Moved',
    donate:'Donate', donateTitle:'DONATE', donateTip:'Thanks for the support — enjoy!',
    saveTo:'Saved to disk', tFileSaved:'Entries saved to disk', tFileLoaded:'Loaded {n} entries from disk',
    dragHint:'Drag a panel headline to move it · right-click a panel to fold its content',
    layout:'LAYOUT', resetLayout:'Reset panel layout', zoomIn:'GUI scale +',
    zoomOut:'GUI scale -', zoomNow:'GUI scale: {n}%',
    theme:'LANGUAGE', backdrop:'BACKDROP', reset:'RESET WINDOW', clear:'CLEAR ALL',
    hideUi:'Hide to tray', quit:'Quit program',
    hideBg:'Hide backdrop', showBg:'Show backdrop',
    plain:'Plain text', trim:'Trim spaces', upper:'UPPER CASE', lower:'lower case',
    json:'Format JSON', b64:'Base64',
    empty:'Nothing captured yet — press Ctrl+V',
    boot:'Vape V4 skin · clipboard demo',
     hotkey:'Hotkey', hotkeyChange:'Change hotkey (click to record)',
     hotkeyPick:'Press a key…',
     hotkeyInvalid:'That key is reserved — pick F1–F12, Insert, Home, End, or Right Shift'
  },
  zh:{
    all:'全部', text:'文本', link:'链接', code:'代码', fav:'收藏', image:'图片',
    account:'账号', profiles:'配置档案', macros:'快捷键', misc:'MISC',
    search:'搜索剪切板', local:'本地', cloud:'云端',
    signin:'需要登录', signinBtn:'登 录', createNew:'新建', public:'公开',
    profilesHint:'演示版的档案只保存在本机浏览器中。',
    copy:'复制', paste:'粘贴', autoCopy:'复制提示音', pin:'固定到顶部',
    copyImage:'复制图片', saveImage:'另存为图片…', tImgCaptured:'已收下图片',
    transform:'转换', protect:'删除保护', dedupe:'捕获时去重',
    history:'历史上限', quick:'快捷槽位', chars:'字符',
    mCopy:'复制', mPaste:'粘贴', mPin:'固定 / 取消固定', mStar:'收藏 / 取消收藏',
    mEdit:'编辑文本', mDel:'删除', mQuick:'绑定快捷槽位', mClearQuick:'清除快捷槽位',
    tCopied:'已复制到系统剪切板', tPasted:'已粘贴到应用',
    tCaptured:'已捕获剪切板内容', tImported:'已从系统剪切板导入',
    tEmpty:'暂无内容', tEmptyClip:'系统剪切板是空的',
    tDenied:'浏览器拒绝了剪切板读取 —— 直接按 Ctrl+V 即可',
    tDeleted:'已删除该条', tProtected:'该条已开启删除保护',
    tNew:'已新建条目', tDemo:'仅演示：不会上传任何数据',
    tReset:'演示数据已还原', tCleared:'已清空全部条目', tExists:'重复内容已跳过',
    tLimit:'历史上限已调整为 {n}',
    shortcuts:'快捷键', sc1:'捕获 / 新增条目', sc2:'聚焦搜索框',
    sc3:'快捷复制槽位', sc4:'关闭菜单', sc5:'收起 / 展开全部面板',
    macPlaceholder:'输入条目名称', macAdd:'存入快捷槽位',
    macHint:'在条目的 ⋮ 菜单里可以把它绑定到 1-9 快捷槽。',
    emptyAll:'剪切板是空的 —— 按 Ctrl+V 捕获内容',
    emptyCat:'这个分类里还没有内容',
    addBtn:'添加 / 粘贴内容',
    edTitle:'添加内容', edPlaceholder:'在这里粘贴或输入内容…',
    edPaste:'粘贴系统剪切板', edSave:'保存', edTip:'Ctrl+Enter 保存 · Esc 取消',
    tAddEmpty:'先输入点内容吧', tCollapsed:'内容已收起', tExpanded:'内容已展开',
    settings:'设置',
    renameHint:'双击面板标题可以改名',
    introOn:'启动时播注入动画',
    tRenamed:'面板已改名', tNameReset:'已恢复默认名',
    profileTab:'资料', statsTab:'统计',
    uploadAvatar:'上传头像', namePlaceholder:'设置名称…', noName:'未命名',
    expBtn:'导出', impBtn:'导入',
    expHint:'导出会把全部条目写成一个 .json 文件；导入会把文件里的条目并回来。',
    tExported:'已导出 {n} 条', tImported2:'已导入 {n} 条', tImportNone:'文件里没有可用内容',
    tImportFail:'导入失败',
    statTotal:'条目总数', statFav:'收藏', statPin:'已固定', statLast:'最近一条',
    newCat:'新建栏目', catNamePh:'栏目名称…', catCreate:'创建', catCancel:'取消',
    catIcon:'图标', catDelete:'删除栏目', catAskDel:'确定删除这个栏目吗？（里面的条目会保留）',
    tCatAdded:'栏目已创建', tCatDeleted:'栏目已删除',
    moveTo:'移入分类', moveOut:'移出分类', tMoved:'已移入分类',
    donate:'打赏', donateTitle:'打 赏', donateTip:'感谢老板！祝你万事如意，平安顺遂，喜乐无忧！',
    saveTo:'保存到本地', tFileSaved:'已保存到本地文件', tFileLoaded:'已从本地文件读回 {n} 条',
    dragHint:'拖面板标题栏可以移动 · 右键面板可以收起内容',
    layout:'布局', resetLayout:'重置面板布局', zoomIn:'界面放大',
    zoomOut:'界面缩小', zoomNow:'界面缩放：{n}%',
    theme:'语言 / LANGUAGE', backdrop:'背景', reset:'重置窗口', clear:'清空全部条目',
    hideUi:'隐藏到托盘', quit:'退出程序',
    hideBg:'隐藏背景', showBg:'显示背景',
    plain:'纯文本', trim:'去除首尾空白', upper:'转大写', lower:'转小写',
    json:'格式化 JSON', b64:'Base64 编码',
    empty:'还没有内容 —— 按 Ctrl+V 捕获',
    boot:'Vape V4 皮肤 · 剪切板 Demo',
     hotkey:'快捷键', hotkeyChange:'修改快捷键（点击录制）',
     hotkeyPick:'请按一个键…',
     hotkeyInvalid:'这个键会干扰正常输入，换一个吧 · 推荐：F1–F12、Insert、Home、End、右Shift'
  }
};
const t = k => (T[state.lang] && T[state.lang][k]) || T.en[k] || k;

/* 是否运行在桌面程序（WebView2 宿主）里 —— 是的话默认背景透明，像桌宠一样浮在桌面上 */
const HOSTED = !!(window.chrome && window.chrome.webview);
const post = msg => { try{ if (HOSTED) window.chrome.webview.postMessage(msg); }catch(e){} };

/* ------------------------------- 分类 ------------------------------- */
const CATS = [
  {id:'all',      icon:I.stack,    x:247,  kind:'list'},
  {id:'text',     icon:I.text,     x:440,  kind:'list'},
  {id:'link',     icon:I.link,     x:633,  kind:'list'},
  {id:'code',     icon:I.code,     x:826,  kind:'list'},
  {id:'fav',      icon:I.starO,    x:1019, kind:'list'},
  {id:'image',    icon:I.image,    x:826,  kind:'list', stackUnder:'code'},   // 默认叠在“代码”下面
  {id:'account',  icon:I.user,     x:1212, kind:'account',  misc:true, gear:true},
  {id:'profiles', icon:I.sliders,  x:1405, kind:'profiles', misc:true, gear:true},
  {id:'macros',   icon:I.keyboard, x:0,    kind:'menu',     misc:true}
];
/* 用户可以自己加的栏目（存在 state.custom 里） */
const CUSTOM_ICONS = [I.stack, I.text, I.link, I.code, I.starO, I.keyboard, I.clock, I.keycap, I.bars, I.globe];
const allCats = () => CATS.concat((state.custom || []).map(c => ({
  id:c.id, icon:c.icon || I.stack, x:c.x || 300, kind:'list', custom:true
})));
const cat = id => allCats().find(c => c.id === id);
const isCustom = id => (state.custom || []).some(c => c.id === id);
/* 栏目名：双击改过的名字 > 自定义栏目自带的名字 > 内置栏目的翻译名 */
const catName = id => {
  if (state.names && state.names[id]) return state.names[id];
  const c = (state.custom || []).find(x => x.id === id);
  if (c && c.name) return c.name;
  return t(id);
};
const TRANSFORMS = ['plain','trim','upper','lower','json','b64'];
const RANGE_LO = 10, RANGE_HI = 200;      // 滑块视觉量程

/* ------------------------------- 状态 ------------------------------- */
const KEY = 'vape_v4_clipboard_v3';          // v3：默认空数据，内容全部由用户添加
const OLD_KEYS = ['vape_v4_clipboard_v2', 'vape_v4_clipboard'];
const DEFAULTS = { side:{x:54,y:58}, all:{x:247,y:77}, text:{x:440,y:77},
         link:{x:633,y:77}, code:{x:826,y:77}, fav:{x:1019,y:77},
         account:{x:1212,y:77}, profiles:{x:1405,y:77} };
let state = {
  lang:'en',
  entries:[],        // 干净启动：没有任何预置内容
  sel:{},            // 每个面板当前展开的条目
  ddCat:null,        // 哪个面板的“转换”下拉是展开的
  pos:{},            // 用户拖拽后的面板位置
  collapsed:{},      // 哪些面板被折叠成只剩标题栏
  names:{},          // 用户自己起的栏目名
  custom:[],         // 用户自己加的栏目
  account:{ name:'', avatar:'' },   // 账户栏目的头像和名称
  zoom:1,            // 界面缩放（在自动适配的基础上再乘）
  q:'',
  limits:{ min:20, max:120 },
  dedupe:true,
  sound:true,           // 复制提示音
  intro:true,           // 启动时播 Vape 注入动画
   hotkeyName:'右Shift', // 当前快捷键名称（显示用，VK 存在宿主侧）
  bg:!HOSTED            // 桌面程序里默认不画背景，直接透出桌面
};
let zTop = 10;
let seq = 1;
const nextId = () => 'e' + Date.now().toString(36) + (seq++);

/* ------------------------------ 小工具 ------------------------------ */
function detectType(text){
  const s = String(text).trim();
  if (/^(https?:\/\/|www\.)\S+$/i.test(s) || /^[\w.-]+\.(com|cn|net|org|io|dev|gg|tv)(\/\S*)?$/i.test(s)) return 'link';
  if (/(^|\s)(git|npm|pnpm|yarn|python|pip|node|curl|ssh|docker|go|cargo|dotnet|cd)\s/.test(s) ||
      /=>|::|<\/\w+>/.test(s) ||
      /^\s*(function|const|let|var|import|from|class|def|public|private|SELECT|INSERT|UPDATE)\b/im.test(s) ||
      /[{};]\s*$/.test(s) || /^[{[]/.test(s)) return 'code';
  return 'text';
}
const oneLine = s => String(s).replace(/\s+/g, ' ').trim();
const fmtTime = ts => new Date(ts).toLocaleTimeString('zh-CN', {hour12:false});
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

function applyTransform(text, mode){
  switch(mode){
    case 'trim':  return text.replace(/[ \t]+$/gm,'').replace(/^\s+|\s+$/g,'');
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'json':  try{ return JSON.stringify(JSON.parse(text), null, 2); }catch(e){ return text; }
    case 'b64':   try{ return btoa(unescape(encodeURIComponent(text))); }catch(e){ return text; }
    default:      return text;
  }
}

/* --------------------------- 剪切板读写 --------------------------- */
async function writeClipboard(text){
  try{
    if (navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text); return true; }
  }catch(e){}
  try{
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }catch(e){ return false; }
}
async function importFromSystem(){
  try{
    if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error('unsupported');
    const text = await navigator.clipboard.readText();
    if (!text || !text.trim()) return toast(t('tEmptyClip'));
    if (addEntry(text)) toast(t('tImported'));
  }catch(e){
    toast(t('tDenied'));
    document.getElementById('q').focus();
  }
}

/* ------------------------------- 存储 ------------------------------- */
/* 状态快照：save() 和落盘共用一份序列化结果 */
function snapshot(){
  return {
    lang:state.lang, entries:state.entries, limits:state.limits,
    dedupe:state.dedupe, bg:state.bg, pos:state.pos, zoom:state.zoom,
    collapsed:state.collapsed, names:state.names, account:state.account, custom:state.custom,
    sound:state.sound, intro:state.intro, hotkeyName:state.hotkeyName
  };
}
let lastSavedJson = '';

/* 写 localStorage 比较贵（图片多的时候几 MB），合并到 250ms 一次，
   而且内容没变就完全不写 */
let saveTimer = null;
function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 250);
  persistToDisk();          // 落盘本来就有防抖
}
function flushSave(){
  clearTimeout(saveTimer);
  try{
    const json = JSON.stringify(snapshot());
    if (json === lastSavedJson) return;      // 没变化，跳过这次写盘
    lastSavedJson = json;
    localStorage.setItem(KEY, json);
  }catch(e){}
}

/* ---------------- 落盘：把数据交给宿主写成 clips.json ---------------- */
let persistTimer = null;
function persistToDisk(){
  if (!HOSTED) return;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    post({ cmd:'persist', text: JSON.stringify({
      app:'vape-v4-clipboard', version:3, saved:new Date().toISOString(),
      lang:state.lang, limits:state.limits, dedupe:state.dedupe,
      pos:state.pos, zoom:state.zoom, collapsed:state.collapsed,
      names:state.names, account:state.account, custom:state.custom,
      entries:state.entries, hotkeyName:state.hotkeyName
    })});
  }, 700);
}
/* 宿主读到本地文件后会发过来；本地为空就顶上 */
function loadFromDisk(text){
  let d = null;
  try{ d = JSON.parse(text); }catch(e){ return; }
  if (!d || !Array.isArray(d.entries)) return;
  if (state.entries.length || !d.entries.length) return;
  state.entries   = d.entries;
  state.names     = d.names || state.names;
  state.account   = d.account || state.account;
  state.custom    = Array.isArray(d.custom) ? d.custom : state.custom;
  state.pos       = d.pos || state.pos;
  state.collapsed = d.collapsed || state.collapsed;
  if (d.limits) state.limits = d.limits;
  if (d.dedupe !== undefined) state.dedupe = d.dedupe !== false;
  render();
  toast(t('tFileLoaded').replace('{n}', state.entries.length));
}
function load(){
  let raw = null;
  try{ raw = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){}
  if (raw && Array.isArray(raw.entries)){
    state.entries = raw.entries;
    state.lang    = (raw.lang !== undefined && raw.lang !== null) ? raw.lang : detectLang();
    state.limits  = raw.limits || state.limits;
    state.dedupe  = raw.dedupe !== false;
    state.bg      = raw.bg !== false;
    state.pos     = raw.pos || {};
    /* 兼容加过 LiquidBounce 皮肤时期的存档：pos 曾是 { vape:{...}, lb:{...} } */
    if (state.pos && state.pos.vape) state.pos = state.pos.vape;
    state.zoom    = raw.zoom || 1;
    state.collapsed = raw.collapsed || {};
    state.names     = raw.names || {};
    state.account   = raw.account || { name:'', avatar:'' };
    state.custom    = Array.isArray(raw.custom) ? raw.custom : [];
    state.sound     = raw.sound !== false;
    state.intro     = raw.intro !== false;   // 启动注入动画（可关）
    state.bg      = (raw.bg === undefined) ? !HOSTED : raw.bg !== false;
    state.hotkeyName = raw.hotkeyName || '右Shift';
  }
  /* 清掉早期带演示数据的老存档 */
  OLD_KEYS.forEach(k => { try{ localStorage.removeItem(k); }catch(e){} });
}
function detectLang(){
  const loc = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return /zh/.test(loc) ? 'zh' : 'en';
}
const panelPos = id => {
  const d = DEFAULTS[id] || DEFAULTS.all;
  const p = state.pos[id];
  return p ? {x:p.x, y:p.y} : {x:d.x, y:d.y};
};

function seed(){
  return [];   // 不再预置任何演示内容，剪切板由用户自己填
}

/* --------------------------- 过滤 / 排序 --------------------------- */
function listFor(catId){
  const q = state.q.trim().toLowerCase();
  let arr;
  if (isCustom(catId))            arr = state.entries.filter(e => e.cat === catId);
  else if (catId === 'fav')       arr = state.entries.filter(e => e.fav);
  else if (catId === 'all')       arr = state.entries.slice();
  else if (catId === 'text')      arr = state.entries.filter(e => e.type === 'text' && !e.img);
  else                            arr = state.entries.filter(e => e.type === catId);
  if (q) arr = arr.filter(e => (e.text || '').toLowerCase().includes(q));
  return arr.sort((a,b) => (b.pin - a.pin) || (b.ts - a.ts));
}
const entry = id => state.entries.find(e => e.id === id);
function addEntry(text, opts){
  text = String(text || '').replace(/\r/g, '');
  if (!text.trim()) return false;
  if (state.dedupe){
    const ex = state.entries.find(e => oneLine(e.text) === oneLine(text));
    if (ex){
      const now = Date.now();
      /* 刚复制过同一条（有些程序会反复刷剪贴板）：直接忽略，不写盘不重绘不弹提示 */
      if (now - ex.ts < 2000 && !(opts && opts.cat)) return false;
      ex.ts = now;
      if (opts && opts.cat) ex.cat = opts.cat;
      save(); render(); toast(t('tExists')); return false;
    }
  }
  state.entries.unshift({
    id:nextId(), text, type:detectType(text), pin:false, quick:0, fav:false,
    fs:12, transform:'plain', auto:true, protect:false, ts:Date.now(),
    cat:(opts && opts.cat) || null
  });
  trimHistory(); save(); render();
  return true;
}
function trimHistory(){
  const max = state.limits.max;
  const keep = state.entries.filter(e => e.pin || e.protect);
  const rest = state.entries.filter(e => !(e.pin || e.protect));
  const room = Math.max(0, max - keep.length);
  const allowed = new Set(keep.concat(rest.slice(0, room)));
  state.entries = state.entries.filter(e => allowed.has(e));
}

/* ------------------------------- 渲染 ------------------------------- */
const _open = { all:true, text:true, link:true, code:true, image:true, fav:true, account:true, profiles:true, macros:true };
const panelIsOpen = id => !!_open[id];
const setPanel = (id, v) => { _open[id] = v; };

function render(){
  document.body.classList.toggle('nobg', !state.bg);
  document.body.style.background = state.bg
    ? '#0d0d0f url("assets/bg.jpg") center center / cover no-repeat fixed'
    : 'transparent';
  document.documentElement.style.background = state.bg ? '#0d0d0f' : 'transparent';
  document.getElementById('q').placeholder = t('search');
  renderSidebar();
  renderPanels();
  hydrateImages();          // 图片的 base64 不进 HTML 字符串，插好 DOM 再塞 src
}

/* 渲染合并：同一帧里被叫多次只跑一遍（搜索输入、自动收内容等高频路径用） */
let renderQueued = false;
function renderSoon(){
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
}

/* 把 <img data-img="条目id"> 补上真正的 data URL */
function hydrateImages(){
  const list = document.querySelectorAll('img[data-img]');
  for (let i = 0; i < list.length; i++){
    const node = list[i];
    if (node.getAttribute('src')) continue;
    const e = entry(node.dataset.img);
    if (e && e.img) node.setAttribute('src', e.img);
  }
}

/* 供宿主（C#）调用的命中测试：鼠标下面是不是有面板 / 菜单 / 搜索条
   返回 false 时宿主会把窗口设成“鼠标穿透”，让桌面照常可以点 */
window.vapeHitTest = function(x, y){
  if (window.__vapeDragging) return true;
  const el = document.elementFromPoint(x, y);
  if (!el) return false;
  return !!el.closest('.panel, .menu, .searchbar, #toast, #inject');
};

function sRow(c, extra){
  return `<div class="srow" data-cat="${c.id}">${svg(c.icon,'ic')}<span class="lbl">${esc(catName(c.id))}</span>${
    extra || ''}${svg(I.chev,'chev')}</div>`;
}
function renderSidebar(){
  const main = allCats().filter(c => !c.misc && c.kind === 'list').map(c => sRow(c)).join('');
  const misc = CATS.filter(c => c.misc).map(c => c.kind === 'menu'
    ? `<div class="srow" data-side="macros">${svg(I.keyboard,'ic')}<span class="lbl">${esc(catName('macros'))}</span>${svg(I.chev,'chev')}</div>`
    : sRow(c)
  ).join('');
  const me = state.account || {};
  const avatar = me.avatar
    ? `<img class="foot-ava" src="${me.avatar}" alt="">`
    : svg(I.userF);
  const sideCol = !!state.collapsed.side;
  document.getElementById('sidebar').className = 'panel side' + (sideCol ? ' collapsed' : '');
  document.getElementById('sidebar').innerHTML = `
    <div class="side-head">
      <div class="logo"><img class="logo-img" src="assets/logo.png" alt="VAPE V4"></div>
      <button class="hicon" data-act="newCat" title="${t('newCat')}">${svg(I.plus)}</button>
      <button class="hicon" data-side="settings" title="${t('theme')}">${svg(I.gear)}</button>
      <button class="hicon" data-side="refresh" title="${t('tImported')}">${svg(I.refresh)}</button>
      <button class="hicon" data-act="sideFold" title="${sideCol ? t('tExpanded') : t('tCollapsed')}">${svg(sideCol ? I.chevDn : I.chevUp)}</button>
    </div>
    ${sideCol ? '' : `<div class="side-body">
      ${main}
      <div class="misc">${t('misc')}</div>
      ${misc}
    </div>
    <div class="side-foot">
      <button class="hicon" data-side="account" title="${esc(me.name || t('account'))}">${avatar}</button>
      <span class="spacer"></span>
      <button class="hicon" data-side="fav" title="${esc(catName('fav'))}">${svg(I.star)}</button>
      <button class="hicon" data-side="shortcuts" title="${t('shortcuts')}">${svg(I.bars)}</button>
      <button class="hicon donate" data-act="donate" title="${t('donate')}">${svg(I.heart)}</button>
    </div>`}`;
  document.querySelectorAll('.srow[data-cat]').forEach(n => {
    /* 只按“面板是否打开”决定深浅：空列表也保持 Vape 的绿色，不发灰 */
    n.classList.toggle('off', !panelIsOpen(n.dataset.cat));
  });
  const sp = panelPos('side');
  const sb = document.getElementById('sidebar');
  sb.style.left = sp.x + 'px';
  sb.style.top  = sp.y + 'px';
}

function renderPanels(){
  const host = document.getElementById('panels');
  host.innerHTML = '';
  allCats().forEach(c => {
    if (c.kind === 'menu' || !panelIsOpen(c.id)) return;
    host.insertAdjacentHTML('beforeend', panelHTML(c));
  });  /* 宏面板（不在 CATS 的 list 里，单独插） */
  if (panelIsOpen('macros')) host.insertAdjacentHTML('beforeend', macrosHTML());

  /* 叠放：image 默认贴在 code 下面，macros 贴在 fav 下面（被拖过就用自己的坐标） */
  [['image','code'], ['macros','fav']].forEach(pair => {
    const [id, under] = pair;
    if (state.pos[id] || !panelIsOpen(id)) return;
    const el2 = host.querySelector(`[data-panel="${id}"]`);
    const up  = host.querySelector(`[data-panel="${under}"]`);
    if (!el2) return;
    const p = panelPos(under);
    el2.style.left = p.x + 'px';
    el2.style.top  = ((up ? up.offsetTop + up.offsetHeight : p.y) + 9) + 'px';
  });
}

function macrosHTML(){
  const bound = state.entries.filter(e => e.quick).sort((a,b) => a.quick - b.quick);
  const slots = bound.length
    ? bound.map(e => `<div class="mac-slot" data-act="macCopy" data-id="${e.id}">
         <span class="n">${e.quick}</span><span class="lbl">${esc(oneLine(e.text))}</span></div>`).join('')
    : `<div class="mac-hint">${t('macHint')}</div>`;
  const mp = panelPos('macros');
  const mcol = !!state.collapsed.macros;
  return `<section class="panel${mcol ? ' collapsed' : ''}" data-panel="macros" style="left:${mp.x}px;top:${mp.y}px">
      <div class="phead">${svg(I.keyboard,'ic')}<span class="ptitle">MACROS</span>
        <button class="hicon" data-act="collapse">${svg(mcol ? I.chevDn : I.chevUp)}</button></div>
      ${mcol ? '' : `<div class="pbody">
        <div class="mac-row">
          <input class="mac-in" type="text" spellcheck="false" placeholder="${t('macPlaceholder')}">
          <button class="mac-add" data-act="macAdd" title="${t('macAdd')}">+</button>
        </div>
        ${slots}
      </div>`}
    </section>`;
}

function panelHTML(c){
  let body = '', headExtra = '';
  if (c.kind === 'list'){
    const arr = listFor(c.id);
    /* 只有用户点过的那一条才展开设置区（和 Vape 点开模块的行为一致） */
    const sel = (state.sel[c.id] && arr.some(e => e.id === state.sel[c.id])) ? state.sel[c.id] : null;
    const hint = c.id === 'all' ? t('emptyAll') : t('emptyCat');
    body = `<div class="addbar"><button class="addbtn" data-act="new" data-cat="${c.id}">${svg(I.plus)}<span>${t('addBtn')}</span></button></div>`
         + (arr.length ? arr.map(e => rowHTML(e, c.id, sel === e.id)).join('')
                       : `<div class="pf-empty">${hint}</div>`);
    headExtra = `<button class="hicon add" data-act="new" data-cat="${c.id}" title="${t('addBtn')}">${svg(I.plus)}</button>`;
  }else if (c.kind === 'account'){
    body = accountHTML();
  }else{
    body = profilesHTML();
  }
  const p = panelPos(c.id);
  const col = !!state.collapsed[c.id];
  return `<section class="panel${col ? ' collapsed' : ''}" data-panel="${c.id}" style="left:${p.x}px;top:${p.y}px">
      <div class="phead">
        ${svg(c.icon,'ic')}<span class="ptitle" data-rename="${c.id}" title="${t('renameHint')}">${esc(catName(c.id))}</span>
        ${c.gear ? `<button class="hicon" data-act="gear">${svg(I.gear)}</button>` : ''}
        ${c.custom ? `<button class="hicon danger" data-act="delCat" title="${t('catDelete')}">${svg(I.trash)}</button>` : ''}
        ${headExtra}
        <button class="hicon" data-act="collapse" title="${col ? t('tExpanded') : t('tCollapsed')}">${svg(col ? I.chevDn : I.chevUp)}</button>
      </div>
      ${col ? '' : `<div class="pbody">${body}</div>`}
    </section>`;
}

/* ------------------------------ 账户栏目 ------------------------------ */
function accountHTML(){
  const me = state.account || { name:'', avatar:'' };
  const total = state.entries.length;
  const fav = state.entries.filter(e => e.fav).length;
  const pin = state.entries.filter(e => e.pin).length;
  const last = state.entries.slice().sort((a,b) => b.ts - a.ts)[0];
  return `<div class="tabs">
      <button class="tab on" data-act="tab">${t('profileTab')}</button>
      <button class="tab" data-act="tab">${t('statsTab')}</button>
    </div>
    <div class="acct">
      <label class="ava-up" title="${t('uploadAvatar')}">
        ${me.avatar ? `<img src="${me.avatar}" alt="">` : svg(I.userF)}
        <input type="file" accept="image/*" data-act="avatarFile" hidden>
        <span class="ava-tip">${svg(I.plus)}</span>
      </label>
      <input class="acct-name" type="text" spellcheck="false"
             value="${esc(me.name || '')}" placeholder="${t('namePlaceholder')}" data-act="acctName">
      <div class="acct-sub">${esc(me.name || t('noName'))}</div>
    </div>
    <div class="acct-stats">
      <div><span>${t('statTotal')}</span><b>${total}</b></div>
      <div><span>${t('statFav')}</span><b>${fav}</b></div>
      <div><span>${t('statPin')}</span><b>${pin}</b></div>
      <div><span>${t('statLast')}</span><b>${last ? fmtTime(last.ts) : '—'}</b></div>
    </div>`;
}

/* ------------------------------ 配置栏目 ------------------------------ */
function profilesHTML(){
  return `<div class="pf-actions">
      <button class="pbtn" data-act="exp">${svg(I.plus)}${t('expBtn')}</button>
      <button class="pbtn" data-act="imp">${svg(I.globe)}${t('impBtn')}</button>
    </div>
    <div class="pf-empty">${t('expHint')}</div>`;
}

function rowHTML(e, catId, selected){
  const keycap = e.quick ? `<button class="key" data-act="quick" title="${t('quick')} ${e.quick}">${svg(I.keycap)}</button>` : '';
  const star   = e.fav   ? `<button class="star on" data-act="fav" title="${t('mStar')}">${svg(I.star)}</button>` : '';
  const inner  = e.img
    ? `<img class="thumb" data-img="${e.id}" alt=""><span class="txt img">${esc(oneLine(e.text))}</span>`
    : `<span class="txt">${esc(oneLine(e.text)) || '&nbsp;'}</span>`;
  return `<div class="row${e.pin ? ' on' : ''}${selected ? ' sel' : ''}${e.img ? ' hasimg' : ''}" data-id="${e.id}" data-act="select">
      ${inner}
      <span class="ctrl">
        ${star}${keycap}
        <button class="dots" data-act="menu" title="⋮">${svg(I.dots)}</button>
      </span>
    </div>` + (selected ? expandHTML(e, catId) : '');
}

const rangePct = v => clamp((v - RANGE_LO) / (RANGE_HI - RANGE_LO), 0, 1) * 100;
function expandHTML(e, catId){
  const out = applyTransform(e.text, e.transform);
  const dd = TRANSFORMS.map(m =>
    `<button data-act="setTf" data-v="${m}" class="${e.transform === m ? 'on' : ''}">${t(m)}</button>`).join('');
  const head = e.img
    ? `<div class="imgprev"><img data-img="${e.id}" alt=""></div>
       <div class="imgmeta">${e.iw && e.ih ? e.iw + ' × ' + e.ih + ' · ' : ''}${Math.round(e.img.length * 0.75 / 1024)} KB</div>
       <div class="set action" data-act="copyimg"><span class="lbl">${t('copyImage')}</span>
         <span class="key">${svg(I.image)}</span></div>
       <div class="set action" data-act="saveimg"><span class="lbl">${t('saveImage')}</span>
         <span class="key">${svg(I.download)}</span></div>`
    : `<div class="preview" style="font-size:${e.fs}px" data-act="edit" title="${t('mEdit')}">${esc(out)}</div>`;
  return `<div class="expand">
    ${head}
    <div class="meta">
      <span>${e.img ? 'IMAGE' : e.type.toUpperCase()}</span>
      <span>${e.img ? (e.iw + '×' + e.ih) : out.length + ' ' + t('chars')}</span>
      <span class="spacer"></span><span>${fmtTime(e.ts)}</span>
    </div>
    <div class="set" data-act="sound"><span class="lbl">${t('autoCopy')}</span>
      <button class="tg${state.sound ? ' on' : ''}" data-act="sound"></button></div>
    <div class="set action" data-act="copy"><span class="lbl">${t('copy')}</span>
      <span class="key" title="Ctrl+C">${svg(I.keycap)}</span></div>
    <div class="set action" data-act="paste"><span class="lbl">${t('paste')}</span>
      <span class="key" title="Ctrl+V">${svg(I.keycap)}</span></div>
    <div class="set" data-act="pin"><span class="lbl">${t('pin')}</span>
      <button class="tg${e.pin ? ' on' : ''}" data-act="pin"></button></div>
    <div class="setline"><span class="lbl">${t('history')}</span>
      <span class="v">${state.limits.min}</span><span class="arw">${svg(I.swap)}</span><span class="v">${state.limits.max}</span></div>
    <div class="slider" data-act="range">
      <div class="track"></div>
      <div class="range">
        <div class="fill" style="left:${rangePct(state.limits.min)}%;width:${rangePct(state.limits.max) - rangePct(state.limits.min)}%"></div>
        <div class="tri l" data-h="min" style="left:${rangePct(state.limits.min)}%"></div>
        <div class="tri r" data-h="max" style="left:${rangePct(state.limits.max)}%"></div>
      </div>
    </div>
    <div class="dd" data-act="tf"><span class="lbl">${t('transform')} · ${t(e.transform)}</span>
      <span class="chev">${svg(I.chevDn)}</span></div>
    ${state.ddCat === catId ? `<div class="ddmenu">${dd}</div>` : ''}
    <div class="set" data-act="protect"><span class="lbl">${t('protect')}</span>
      <span class="mini">${svg(I.listCheck)}</span>
      <button class="tg${e.protect ? ' on' : ''}" data-act="protect"></button></div>
    <div class="set" data-act="dedupe"><span class="lbl">${t('dedupe')}</span>
      <button class="tg${state.dedupe ? ' on' : ''}" data-act="dedupe"></button></div>
  </div>`;
}

/* ------------------------------- 提示 ------------------------------- */
let toastTimer;
function toast(msg){
  const n = document.getElementById('toast');
  n.textContent = msg;
  n.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => n.classList.remove('show'), 1700);
}

/* ------------------------------- 菜单 ------------------------------- */
function closeMenu(){ const m = document.querySelector('.menu'); if (m) m.remove(); }
function openMenu(anchor, items){
  closeMenu();
  const menu = document.createElement('div');
  menu.className = 'menu';
  items.forEach(it => {
    if (it.sep){ menu.insertAdjacentHTML('beforeend', '<div class="sep"></div>'); return; }
    if (it.head){ menu.insertAdjacentHTML('beforeend', `<div class="head">${it.head}</div>`); return; }
    if (it.kv){ menu.insertAdjacentHTML('beforeend', `<div class="kv"><span>${it.kv[0]}</span><b>${it.kv[1]}</b></div>`); return; }
    const b = document.createElement('button');
    b.textContent = it.label;
    if (it.danger) b.className = 'danger';
    b.onclick = ev => { ev.stopPropagation(); closeMenu(); it.run && it.run(); };
    menu.appendChild(b);
  });
  const stage = document.getElementById('stage');
  stage.appendChild(menu);
  const s = effScale();
  const a = anchor.getBoundingClientRect(), st = stage.getBoundingClientRect();
  const left = clamp((a.right - st.left) / s - menu.offsetWidth, 4, 1600 - menu.offsetWidth - 4);
  const top  = clamp((a.bottom - st.top) / s + 3, 4, 900 - menu.offsetHeight - 4);
  menu.style.left = left + 'px';
  menu.style.top  = top + 'px';
}

/* ------------------------------ 交互 ------------------------------ */
async function copyEntry(e, silent){
  playCopySound();          // 先响，确保在用户手势里（浏览器音频策略）
  await writeClipboard(applyTransform(e.text, e.transform));
  if (!silent) toast(t('tCopied'));
}
const nextFreeSlot = () => {
  const used = new Set(state.entries.map(x => x.quick));
  return [1,2,3,4,5,6,7,8,9].find(n => !used.has(n)) || 0;
};

document.addEventListener('click', async ev => {
  const menuHit = ev.target.closest('.menu');
  if (!menuHit) closeMenu();
  if (menuHit) return;

  /* 点编辑器以外的地方就关掉它 */
  if (editorEl() && !ev.target.closest('.editor-panel')){ closeEditor(); }

  /* 侧栏按钮 */
  const side = ev.target.closest('[data-side]');
  if (side){
    const k = side.dataset.side;
    if (k === 'settings') return openMenu(side, [
      {head:t('theme')},
      {label:(state.lang === 'en' ? '中文（简体）' : 'English'), run:() => { state.lang = state.lang === 'en' ? 'zh' : 'en'; save(); render(); }},
      {sep:true},
      {head:t('hotkey')},
      {label:t('hotkeyChange'), run:() => { openHotkeyPicker(); }},
      {sep:true},
      {head:t('layout')},
      {label:t('introOn') + (state.intro !== false ? ' ✓' : ''), run:() => { state.intro = state.intro === false; save(); if (state.intro) playInjectIntro(); }},
      {label:t('resetLayout'), run:() => { state.pos = {}; save(); render(); }},
      {kv:[t('zoomNow').replace('{n}', Math.round(state.zoom * 100)), '']},
      {label:t('zoomIn'), run:() => { state.zoom = Math.min(1.6, +(state.zoom + 0.1).toFixed(2)); fit(); save(); }},
      {label:t('zoomOut'), run:() => { state.zoom = Math.max(0.6, +(state.zoom - 0.1).toFixed(2)); fit(); save(); }},
      {sep:true},
      {head:t('backdrop')},
      {label:(state.bg ? t('hideBg') : t('showBg')), run:() => { state.bg = !state.bg; save(); render(); }},
      {sep:true},
      {label:t('clear'), danger:true, run:() => {
        state.entries = []; state.sel = {}; save(); render(); toast(t('tCleared'));
      }},
      ...(HOSTED ? [
        {sep:true},
        {head:'DESKTOP'},
        {label:t('hideUi'), run:() => post({cmd:'hide'})},
        {label:t('quit'), danger:true, run:() => post({cmd:'quit'})}
      ] : [])
    ]);
    if (k === 'refresh') return importFromSystem();
    if (k === 'account'){ setPanel('account', true); render(); return; }
    if (k === 'fav'){ setPanel('fav', true); render(); return; }
    if (k === 'macros'){
      setPanel('macros', !panelIsOpen('macros'));
      if (panelIsOpen('macros')) setPanel('fav', true);
      render(); return;
    }
    if (k === 'shortcuts') return openMenu(side, [
      {head:t('shortcuts')},
      {kv:[t('sc1'), 'Ctrl+V']},
      {kv:[t('sc2'), 'Ctrl+K']},
      {kv:[t('sc3'), '1 - 9']},
      {kv:[t('sc4'), 'Esc']},
      {kv:[t('sc5'), 'Tab']}
    ]);
    return;
  }

  /* 侧栏分类 */
  const srow = ev.target.closest('.srow[data-cat]');
  if (srow){
    const id = srow.dataset.cat;
    togglePanelAnim(id);
    return;
  }

  /* 面板内动作 */
  const act = ev.target.closest('[data-act]');
  if (!act) return;
  const a = act.dataset.act;
  const panelEl = act.closest('.panel');
  const catId = panelEl ? panelEl.dataset.panel : null;
  const rowEl = act.closest('.row');
  const id = rowEl ? rowEl.dataset.id : state.sel[catId];
  const e = id ? entry(id) : null;

  switch(a){
    case 'collapse': toggleFold(catId); break;
    case 'newCat': openCatEditor(); break;
    case 'donate': openDonate(); break;
    case 'catCreate': createCategory(); break;
    case 'delCat': deleteCategory(catId); break;
    case 'sideFold': toggleSideAnim(); break;
    case 'new': openEditor(act.dataset.cat || catId); break;
    case 'edClose': closeEditor(); break;
    case 'edPaste': pasteIntoEditor(); break;
    case 'edSave': saveEditor(); break;
    case 'select': {
      /* 左键 = 直接复制 + 提示音 + 闪一下；设置区由右键打开 */
      if (!e) break;
      if (e.img) copyImageEntry(e); else copyEntry(e, true);
      if (!e.img) toast(t('tCopied'));
      if (rowEl){
        rowEl.classList.add('flash');
        setTimeout(() => { try{ rowEl.classList.remove('flash'); }catch(x){} }, 280);
      }
      break;
    }
    case 'copyimg': if (e && e.img) copyImageEntry(e); break;
    case 'saveimg': if (e && e.img) saveImageEntry(e); break;
    case 'sound': state.sound = !state.sound; save(); render(); if (state.sound) playCopySound(); break;
    case 'fav':     if (e){ e.fav = !e.fav; save(); render(); } break;
    case 'pin':     if (e){ e.pin = !e.pin; save(); render(); } break;
    case 'protect': if (e){ e.protect = !e.protect; save(); render(); } break;
    case 'dedupe':  state.dedupe = !state.dedupe; save(); render(); break;
    case 'copy':    if (e){ if (e.img) copyImageEntry(e); else copyEntry(e); } break;
    case 'paste':
      if (e){
        const txt = applyTransform(e.text, e.transform);
        await writeClipboard(txt);
        addEntry(txt);
        toast(t('tPasted'));
      }
      break;
    case 'quick': {
      if (!e) break;
      if (e.quick){ e.quick = 0; toast(t('mClearQuick')); }
      else{
        e.quick = nextFreeSlot();
        if (e.quick) toast(t('quick') + ' ' + e.quick);
      }
      save(); render();
      break;
    }
    case 'tf':    state.ddCat = (state.ddCat === catId ? null : catId); render(); break;
    case 'setTf': if (e){ e.transform = act.dataset.v; } state.ddCat = null; save(); render(); break;
    case 'edit': {
      const box = act;
      box.contentEditable = 'true';
      box.style.outline = '1px solid #2b8a6a';
      box.focus();
      const done = () => {
        box.contentEditable = 'false';
        box.style.outline = '';
        const cur = entry(id);
        if (cur){ cur.text = box.innerText; cur.type = detectType(cur.text); }
        save(); render();
      };
      box.addEventListener('blur', done, {once:true});
      box.addEventListener('keydown', k => {
        if (k.key === 'Escape'){ k.preventDefault(); box.blur(); }
        k.stopPropagation();
      });
      break;
    }
    case 'menu': {
      if (!e) break;
      openMenu(act, [        {label:t('mCopy'), run:() => copyEntry(e)},
        {label:t('mPaste'), run:() => {
          const txt = applyTransform(e.text, e.transform);
          writeClipboard(txt); addEntry(txt); toast(t('tPasted'));
        }},
        {sep:true},
        {label:t('mPin'), run:() => { e.pin = !e.pin; save(); render(); }},
        {label:t('mStar'), run:() => { e.fav = !e.fav; save(); render(); }},
        {label:e.quick ? t('mClearQuick') : t('mQuick'), run:() => {
          if (e.quick) e.quick = 0; else e.quick = nextFreeSlot();
          save(); render();
        }},
        {label:t('mEdit'), run:() => {
          state.sel[catId] = e.id; render();
          setTimeout(() => { const p = document.querySelector(`.panel[data-panel="${catId}"] .preview`); if (p) p.click(); }, 30);
        }},
        ...(state.custom.length ? [{sep:true}, {head:t('moveTo')}] : []),
        ...state.custom.map(c => ({
          label:(e.cat === c.id ? '✓ ' : '') + c.name,
          run:() => {
            e.cat = (e.cat === c.id) ? null : c.id;
            save(); render();
            if (e.cat) toast(t('tMoved') + ' · ' + c.name);
          }
        })),
        {sep:true},
        {label:t('mDel'), danger:true, run:() => {
          if (e.protect) return toast(t('tProtected'));
          state.entries = state.entries.filter(x => x.id !== e.id);
          save(); render(); toast(t('tDeleted'));
        }}
      ]);
      break;
    }
    case 'macAdd': {
      const input = panelEl.querySelector('.mac-in');
      const text = ((input && input.value) || '').trim();
      if (!text) return importFromSystem();
      if (addEntry(text)){
        const fresh = state.entries.find(x => oneLine(x.text) === oneLine(text));
        if (fresh){ fresh.quick = nextFreeSlot(); save(); render(); }
      }
      break;
    }
    case 'macCopy': {
      const e2 = entry(act.dataset.id);
      if (e2) copyEntry(e2);
      break;
    }
    case 'signin': toast(t('tDemo')); break;
    case 'exp': exportEntries(); break;
    case 'imp': startImport(); break;
    case 'tab':
      panelEl.querySelectorAll('.tab').forEach(n => n.classList.toggle('on', n === act));
      break;
  }
});

/* 双击：内容框 → 编辑内容；面板标题 → 改栏目名 */
document.addEventListener('dblclick', ev => {
  const p = ev.target.closest('.preview');
  if (p){ p.click(); return; }
  const title = ev.target.closest('[data-rename]');
  if (title) startRename(title);
});

/* --------------------------- 范围滑块拖动 --------------------------- */
(function slider(){
  let drag = null;

  /* 拖动期间只改这条滑块的样式和数字，不重建整个界面（原来每次 mousemove 都 render，
     图片多的时候会明显卡顿） */
  const paint = () => {
    const L = state.limits;
    const lo = (L.min - RANGE_LO) / (RANGE_HI - RANGE_LO) * 100;
    const hi = (L.max - RANGE_LO) / (RANGE_HI - RANGE_LO) * 100;
    document.querySelectorAll('.slider .range').forEach(range => {
      const fill = range.querySelector('.fill');
      const tl = range.querySelector('.tri.l'), tr = range.querySelector('.tri.r');
      if (fill){ fill.style.left = lo + '%'; fill.style.width = Math.max(0, hi - lo) + '%'; }
      if (tl) tl.style.left = lo + '%';
      if (tr) tr.style.left = hi + '%';
    });
    document.querySelectorAll('.setline').forEach(line => {
      const vals = line.querySelectorAll('.v');
      if (vals.length >= 2){ vals[0].textContent = L.min; vals[1].textContent = L.max; }
    });
  };

  const apply = clientX => {
    const node = document.querySelector('.slider .range');
    if (!node) return;
    const r = node.getBoundingClientRect();
    const ratio = clamp((clientX - r.left) / r.width, 0, 1);
    const v = Math.round(RANGE_LO + ratio * (RANGE_HI - RANGE_LO));
    if (drag === 'min') state.limits.min = Math.min(v, state.limits.max - 5);
    else                state.limits.max = Math.max(v, state.limits.min + 5);
    paint();
  };
  document.addEventListener('mousedown', ev => {
    const sel = ev.target.closest('.slider');
    if (!sel) return;
    ev.preventDefault();
    drag = ev.target.dataset.h || 'max';
    apply(ev.clientX);
  });
  document.addEventListener('mousemove', ev => { if (drag) apply(ev.clientX); });
  document.addEventListener('mouseup', () => {
    if (!drag) return;
    drag = null;
    trimHistory(); save(); render();
    toast(t('tLimit').replace('{n}', state.limits.max));
  });
})();

/* ------------------------------ 打赏窗口 ------------------------------ */
function openDonate(){
  closeEditor();
  const wrap = document.createElement('div');
  wrap.className = 'editor-wrap';
  wrap.id = 'editor';
  wrap.innerHTML = `
    <section class="panel donate-panel">
      <div class="phead">${svg(I.heart,'ic')}<span class="ptitle">${t('donateTitle')}</span>
        <button class="hicon" data-act="edClose">${svg(I.chevUp)}</button></div>
      <div class="pbody">
        <img class="donate-img" src="assets/donate.jpg" alt="donate">
        <div class="donate-tip">${t('donateTip')}</div>
      </div>
    </section>`;
  document.getElementById('stage').appendChild(wrap);
}

/* --------------------------- 新建栏目对话框 --------------------------- */
let newCatIcon = null;
let catLastText = '';

function openCatEditor(){
  closeEditor();
  newCatIcon = CUSTOM_ICONS[0];
  catLastText = '';          // 别把上一次输入带进来
  const wrap = document.createElement('div');
  wrap.className = 'editor-wrap';
  wrap.id = 'editor';
  wrap.innerHTML = `
    <section class="panel editor-panel">
      <div class="phead">${svg(I.plus,'ic')}<span class="ptitle">${t('newCat')}</span>
        <button class="hicon" data-act="edClose">${svg(I.chevUp)}</button></div>
      <div class="pbody">
        <input class="cat-name" type="text" spellcheck="false" placeholder="${t('catNamePh')}">
        <div class="cat-iconrow">
          <span class="cat-iconlabel">${t('catIcon')}</span>
          ${CUSTOM_ICONS.map((ic, i) =>
            `<button class="cat-ic${i === 0 ? ' on' : ''}" data-icon="${ic}" data-idx="${i}">${svg(ic)}</button>`).join('')}
        </div>
        <div class="ed-actions">
          <button class="pbtn" data-act="edClose">${t('catCancel')}</button>
          <button class="pbtn acc" data-act="catCreate">${t('catCreate')}</button>
        </div>
        <div class="ed-tip">${t('renameHint')}</div>
      </div>
    </section>`;
  document.getElementById('stage').appendChild(wrap);
  const inp = wrap.querySelector('.cat-name');
  inp.focus();
  let composing = false;
  inp.addEventListener('compositionstart', () => { composing = true; });
  inp.addEventListener('compositionend', () => { composing = false; catLastText = inp.value; });
  /* 组合输入（拼音）中途的 value 不是最终文字，只在非组合态才记缓存 */
  inp.addEventListener('input', () => { if (!composing) catLastText = inp.value; });
  inp.addEventListener('keydown', ev => {
    ev.stopPropagation();
    if (ev.key === 'Escape'){ ev.preventDefault(); closeEditor(); }
    if (ev.key === 'Enter' && !composing){ ev.preventDefault(); createCategory(); }
  });
  wrap.querySelectorAll('.cat-ic').forEach(b => {
    b.addEventListener('click', ev => {
      ev.stopPropagation();
      newCatIcon = b.dataset.icon;
      wrap.querySelectorAll('.cat-ic').forEach(x => x.classList.toggle('on', x === b));
    });
  });
}

function createCategory(){
  const wrap = editorEl();
  const inp = wrap && wrap.querySelector('.cat-name');
  // 以输入框实时值为准，缓存只作兜底（WebView2 IME 提交时序差异）
  const name = (((inp && inp.value) || catLastText) || '').trim() || t('newCat');
  const n = state.custom.length;
  const id = 'c' + Date.now().toString(36);
  state.custom.push({
    id, name, icon: newCatIcon || CUSTOM_ICONS[0],
    x: clamp(320 + n * 26, 60, 1300)
  });
  state.pos[id] = { x: clamp(320 + n * 26, 60, 1300), y: clamp(150 + n * 26, 60, 700) };
  setPanel(id, true);
  save(); render(); closeEditor();
  toast(t('tCatAdded') + ' · ' + name);
}

function deleteCategory(id){
  const cat = (state.custom || []).find(c => c.id === id);
  const name = cat ? esc(catName(id)) : t('catDelete');
  const wrap = document.createElement('div');
  wrap.className = 'editor-wrap';
  wrap.id = 'editor';
  wrap.innerHTML = `
    <section class="panel editor-panel" style="width:320px">
      <div class="phead">${svg(I.trash,'ic')}<span class="ptitle">${t('catDelete')}</span>
        <button class="hicon" data-act="edClose">${svg(I.chevUp)}</button></div>
      <div class="pbody">
        <div class="ed-tip" style="padding:6px 11px 10px;color:#b04949;border-bottom:1px solid #1f1f1f;margin-bottom:8px;line-height:1.5">${name} ${t('catAskDel')}</div>
        <div class="ed-actions">
          <button class="pbtn" data-act="delCancel">${t('catCancel')}</button>
          <button class="pbtn" data-act="delConfirm" style="background:#b04949">${t('catDelete')}</button>
        </div>
      </div>
    </section>`;
  document.getElementById('stage').appendChild(wrap);
  wrap.querySelector('[data-act="delCancel"]').addEventListener('click', ev => {
    ev.stopPropagation(); wrap.remove();
  });
  wrap.querySelector('[data-act="delConfirm"]').addEventListener('click', ev => {
    ev.stopPropagation(); wrap.remove();
    state.custom = state.custom.filter(c => c.id !== id);
    state.entries.forEach(e => { if (e.cat === id) e.cat = null; });
    delete state.pos[id]; delete state.collapsed[id]; delete state.names[id];
    delete _open[id];
    save(); render();
    toast(t('tCatDeleted'));
  });
  wrap.querySelector('[data-act="edClose"]').addEventListener('click', ev => {
    ev.stopPropagation(); wrap.remove();
  });
}

/* --------------------------- 添加内容编辑器 --------------------------- */
function editorEl(){ return document.getElementById('editor'); }

function openEditor(catId){
  closeEditor();
  const wrap = document.createElement('div');
  wrap.className = 'editor-wrap';
  wrap.id = 'editor';
  wrap.dataset.cat = catId || '';
  wrap.innerHTML = `
    <section class="panel editor-panel">
      <div class="phead">${svg(I.plus,'ic')}<span class="ptitle">${t('edTitle')}${catId && cat(catId) && isCustom(catId) ? ' · ' + esc(catName(catId)) : ''}</span>
        <button class="hicon" data-act="edClose">${svg(I.chevUp)}</button></div>
      <div class="pbody">
        <textarea class="ed-text" spellcheck="false" placeholder="${t('edPlaceholder')}"></textarea>
        <div class="ed-actions">
          <button class="pbtn" data-act="edPaste">${t('edPaste')}</button>
          <button class="pbtn acc" data-act="edSave">${t('edSave')}</button>
        </div>
        <div class="ed-tip">${t('edTip')}</div>
      </div>
    </section>`;
  document.getElementById('stage').appendChild(wrap);
  const ta = wrap.querySelector('.ed-text');
  ta.focus();
  ta.addEventListener('keydown', ev => {
    ev.stopPropagation();
    if (ev.key === 'Escape'){ ev.preventDefault(); closeEditor(); }
    if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)){ ev.preventDefault(); saveEditor(); }
  });
}
function closeEditor(){ const e = editorEl(); if (e) e.remove(); }

/* --------------------------- 快捷键录制对话框 --------------------------- */
let hkRecWin = null;
function openHotkeyPicker(){
  closeEditor();
  closeMenu();
  if (hkRecWin){ try { hkRecWin.focus(); } catch(e){} return; }
  const wrap = document.createElement('div');
  wrap.className = 'editor-wrap';
  wrap.id = 'hotkey-picker';
  wrap.innerHTML = `
    <section class="panel editor-panel" style="width:340px">
      <div class="phead">${svg(I.keyboard,'ic')}<span class="ptitle">${t('hotkey')}</span>
        <button class="hicon" data-act="hkClose">${svg(I.chevUp)}</button></div>
      <div class="pbody">
        <div class="hk-status" style="padding:8px 11px;font-size:12px;color:var(--row-txt);text-align:center;border-bottom:1px solid #1f1f1f;margin-bottom:4px">
          ${t('hotkeyPick')}
        </div>
        <div class="ed-actions" style="padding:0 11px 8px">
          <span class="hk-current" style="display:block;font-size:11px;color:#6a6a6a;margin-bottom:6px">当前：${esc(state.hotkeyName||'右Shift')}</span>
          <button class="pbtn acc" data-act="hkPick" style="width:100%">${t('hotkeyChange').split('（')[0]}</button>
        </div>
        <div class="ed-tip" style="padding:0 11px 6px;font-size:10px;color:#4a4a4a;line-height:1.5">${t('hotkeyInvalid').replace(/\n/g,' · ')}</div>
      </div>
    </section>`;
  document.getElementById('stage').appendChild(wrap);
  const status = wrap.querySelector('.hk-status');
  const btn = wrap.querySelector('[data-act="hkPick"]');
  let picking = false;
  let keyHandler = null;

  function clearHandler(){ if (keyHandler){ window.removeEventListener('keydown', keyHandler); keyHandler = null; } }
  function setError(msg){ status.textContent = msg; status.style.color = '#b04949'; }
  function setOK(msg){ status.textContent = msg; status.style.color = '#dff3ec'; }

  btn.addEventListener('click', ev => {
    ev.stopPropagation();
    if (picking) return;
    picking = true;
    status.textContent = '…';
    status.style.color = '#cfcfcf';
    btn.disabled = true;
    btn.style.opacity = '.4';
    clearHandler();
    keyHandler = ev => {
      ev.preventDefault(); ev.stopPropagation();
      const vk = ev.keyCode || ev.which;
      clearHandler();
      picking = false;
      btn.disabled = false;
      btn.style.opacity = '';
      // 只允许：F1-F12、PgUp/PgDn/Home/End/箭头、Ins/Del/Pause/ScrollLock、左右Shift/右Ctrl/右Alt
      const safe = (vk >= 0x70 && vk <= 0x7B) || (vk >= 0x21 && vk <= 0x28) ||
                   [0x2D,0x2E,0x13,0x91,0xA0,0xA1,0xA3,0xA5].indexOf(vk) >= 0;
      if (!safe){ setError(t('hotkeyInvalid')); return; }
      let label = state.hotkeyName || '右Shift';
      if (vk === 0xA1) label = '右Shift';
      else if (vk === 0xA0) label = '左Shift';
      else if (vk === 0xA3) label = '右Ctrl';
      else if (vk === 0xA5) label = '右Alt';
      else if (vk === 0x2D) label = 'Insert';
      else if (vk === 0x2E) label = 'Delete';
      else if (vk === 0x24) label = 'Home';
      else if (vk === 0x23) label = 'End';
      else if (vk === 0x21) label = 'PageUp';
      else if (vk === 0x22) label = 'PageDown';
      else if (vk === 0x13) label = 'Pause';
      else if (vk === 0x91) label = 'ScrollLock';
      else if (vk >= 0x70 && vk <= 0x7B) label = 'F' + (vk - 0x6F);
      else label = 'VK' + vk;
      state.hotkeyName = label;
      setOK('✓ ' + label);
      toast(t('tExpanded') === 'Content expanded' ? 'Hotkey → ' + label : '快捷键 → ' + label);
      post({ cmd:'hotkey', text: label });
      // 写 VK 给宿主（通过 post 一个特殊命令）
      post({ cmd:'setHotkey', vk: vk });
      setTimeout(() => { closeHotkeyPicker(); }, 800);
    };
    window.addEventListener('keydown', keyHandler);
  });

  wrap.querySelector('[data-act="hkClose"]').addEventListener('click', ev => {
    ev.stopPropagation();
    clearHandler();
    closeHotkeyPicker();
  });

  // Esc 关闭
  const escHandler = ev => {
    if (ev.key === 'Escape'){ clearHandler(); closeHotkeyPicker(); window.removeEventListener('keydown', escHandler); }
  };
  window.addEventListener('keydown', escHandler);
  hkRecWin = wrap;
  wrap._escHandler = escHandler;
  wrap._clearHandler = clearHandler;
}

function closeHotkeyPicker(){
  const wrap = document.getElementById('hotkey-picker');
  if (!wrap) return;
  if (wrap._escHandler) window.removeEventListener('keydown', wrap._escHandler);
  if (wrap._clearHandler) wrap._clearHandler();
  wrap.remove();
  hkRecWin = null;
}
function saveEditor(){
  const wrap = editorEl();
  const ta = wrap && wrap.querySelector('.ed-text');
  const text = ta ? ta.value : '';
  if (!text.trim()){ toast(t('tAddEmpty')); return; }
  const catId = wrap && wrap.dataset.cat;
  addEntry(text, catId && isCustom(catId) ? {cat: catId} : null);
  closeEditor();
  toast(t('tNew'));
}
async function pasteIntoEditor(){
  const ta = editorEl() && editorEl().querySelector('.ed-text');
  if (!ta) return;
  try{
    if (navigator.clipboard && navigator.clipboard.readText){
      const txt = await navigator.clipboard.readText();
      if (txt && txt.trim()){ ta.value = txt; ta.focus(); return; }
    }
  }catch(e){}
  ta.focus();
  toast(t('tDenied'));
}

/* =========================================================================
   Vape V4 注入动画 —— 数值照 controller_ui.cpp 还原
   · 画布 824×484，底色 #1A191A
   · logo: 111×22 @x=352.5，Y = 179 - 80*logoPos，logoPos += (t-pos)*(1-e^(-8*dt))
   · 进度: 目标 = max(stage/29, 0.05)，每帧 p += 0.01*(1 - p/目标)，共 30 阶段
   · 蒙版: 0.45s，左 x:-154→0，右 x:713→824，透明度 1→0
   ========================================================================= */
const INJ_STAGES = 30;
let injRAF = 0, injRunning = false;

function injEl(){ return document.getElementById('inject'); }

function buildInject(){
  const host = injEl();
  if (!host || host.dataset.built) return host;
  host.dataset.built = '1';
  host.innerHTML = `
    <div class="inj-card">
      <img class="inj-logo" src="assets/logo.png" alt="VAPE">
      <div class="inj-track"><div class="inj-fill"></div></div>
      <div class="inj-stage"></div>
      <div class="inj-slow">It is taking abnormally long to load this stage<br>Contact support for assistance</div>
      <div class="inj-mask inj-mask-l"></div>
      <div class="inj-mask inj-mask-r"></div>
      <div class="inj-done">
        <div class="inj-done-title">Vape has finished loading</div>
        <div class="inj-done-sub">Press RIGHT SHIFT(Default) while in game to open the GUI</div>
        <button class="inj-close" data-act="injClose">Close Window</button>
      </div>
    </div>`;
  return host;
}

/* 页面蒙版：0.45s，按源码的位移与淡出 */
function playMasks(host){
  const l = host.querySelector('.inj-mask-l'), r = host.querySelector('.inj-mask-r');
  if (!l || !r) return;
  const t0 = performance.now();
  const step = now => {
    const t = Math.min(1, (now - t0) / 450);
    l.style.transform = `translateX(${-154 * t}px)`;
    r.style.transform = `translateX(${111 * t}px)`;
    l.style.opacity = r.style.opacity = String(1 - t);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function playInjectIntro(){
  if (injRunning) return;
  const host = buildInject();
  if (!host) return;
  injRunning = true;
  const gui = document.getElementById('guiWrap');
  document.body.classList.add('intro-mode');        // 动画期间藏住面板、搜索条和提示气泡
  if (HOSTED) post({ cmd:'intro', text:'on' });     // 告诉宿主：动画中，强制可交互 + 抢焦点
  host.classList.add('on');
  const card = host.querySelector('.inj-card');
  const logo = host.querySelector('.inj-logo');
  const fill = host.querySelector('.inj-fill');
  const stageTxt = host.querySelector('.inj-stage');
  const slowTxt = host.querySelector('.inj-slow');
  const done = host.querySelector('.inj-done');

  let logoPos = 0;          // 0 = 上方（隐藏），1 = 落到位
  let progress = 0.05;      // 起始 5%
  let stage = 0;
  let animStart = 0;        // 整体进度基准
  let stageChangedAt = 0;   // 当前阶段开始时间（只给 5s/10s 提示用）
  let last = performance.now();
  const introStart = last;
  let finished = 0;
  const STAGE_MS = 55;      // 30 段 ≈ 1.65s
  const CHASE = 0.06;       // 追赶系数（源码是 0.01/帧，这里加快一点让动画别拖太久）

  const close = () => {
    if (!injRunning) return;
    cancelAnimationFrame(injRAF);
    injRunning = false;
    playMasks(host);                       // 关窗也走一次蒙版
    host.classList.remove('show');
    setTimeout(() => {
      host.classList.remove('on');
      host.style.display = 'none';
      document.body.classList.remove('intro-mode');
      if (gui) guiAnim('in');                       // 面板淡入
      if (HOSTED){ post({ cmd:'introDone' }); post({ cmd:'intro', text:'off' }); }
    }, 240);
  };
  window.__injClose = close;

  /* 点一下就走：整块遮罩都能点（含卡片、背景、Close Window 按钮） */
  const clickSkip = ev => {
    if (!injRunning) return;
    if (performance.now() - introStart < 250) return;   // 防手滑
    ev.preventDefault();
    close();
  };
  host.addEventListener('mousedown', clickSkip);
  /* 键盘任意键跳过（宿主在动画期间会把焦点抢过来） */
  const keySkip = e => {
    if (!injRunning) return;
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
    e.preventDefault();
    document.removeEventListener('keydown', keySkip, true);
    close();
  };
  document.addEventListener('keydown', keySkip, true);

  requestAnimationFrame(() => host.classList.add('show'));
  playMasks(host);                          // 开场也来一次

  const frame = now => {
    if (!injRunning) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    /* logo 位移：指数缓动 */
    logoPos += (1 - logoPos) * (1 - Math.exp(-8 * dt));
    logo.style.top = (179 - 80 * logoPos).toFixed(2) + 'px';

    if (!finished){
      if (!animStart) { animStart = now; stageChangedAt = now; }
      /* 阶段推进：模拟真实注入的 30 段 */
      const st = Math.min(INJ_STAGES - 1, Math.floor((now - animStart) / STAGE_MS));
      if (st !== stage){ stage = st; stageChangedAt = now; }
      const target = Math.max(stage / (INJ_STAGES - 1), 0.05);
      if (progress < target){
        progress += CHASE * (1 - progress / target);   // 源码里的追赶公式
        progress = Math.min(progress, target);
      }
      fill.style.width = (Math.max(0.05, Math.min(1, progress)) * 100).toFixed(2) + '%';

      /* 单阶段 ≥5s 才显示阶段号，≥10s 才警告（源码行为） */
      const stuck = now - stageChangedAt;
      stageTxt.classList.toggle('on', stuck >= 5000);
      if (stuck >= 5000) stageTxt.textContent = `Stage ${stage + 1}/30`;
      slowTxt.classList.toggle('on', stuck >= 10000);

      if (stage >= INJ_STAGES - 1 && progress > 0.99){
        progress = 1;
        fill.style.width = '100%';
        finished = now;
        const track = host.querySelector('.inj-track');
        if (track) track.classList.add('off');   // 切到完成页：进度条淡出
        done.classList.add('on');
      }
    } else if (now - finished > 1200){
      close();                                 // 显示 1.2s 后自动关闭
      return;
    }
    injRAF = requestAnimationFrame(frame);
  };
  window.__injFrame = frame;                // 调试/测试用：可手动喂时间戳
  injRAF = requestAnimationFrame(frame);
}

/* 供测试/调试：停住动画并定格到某个进度（0..1） */
window.injectIntroStop = function(){
  injRunning = false;
  cancelAnimationFrame(injRAF);
};
window.injectIntroSeek = function(p){
  window.injectIntroStop();
  const host = buildInject();
  host.classList.add('on','show');
  host.querySelector('.inj-logo').style.top = (179 - 80 * Math.min(1, p * 2)) + 'px';
  host.querySelector('.inj-fill').style.width = (Math.max(0.05, p) * 100).toFixed(1) + '%';
  if (p >= 1) host.querySelector('.inj-done').classList.add('on');
};

/* ---------------------------- 图片条目 ---------------------------- */
const IMAGE_MAX = 24;                       // 最多留多少张图片（图片占空间大）

function addImage(dataUrl, w, h, silent){
  if (!dataUrl || dataUrl.indexOf('data:image') !== 0) return false;
  const sig = dataUrl.slice(-96) + '|' + dataUrl.length;   // 简易去重指纹
  if (state.imgSig === sig){ return false; }               // 同一张图反复上报：静默忽略
  state.imgSig = sig;
  const label = '[图片 ' + (w && h ? w + '×' + h : 'image') + ']';
  state.entries.unshift({
    id:nextId(), text:label, type:'image', img:dataUrl, iw:w||0, ih:h||0,
    pin:false, quick:0, fav:false, fs:12, transform:'plain',
    auto:true, protect:false, ts:Date.now(), cat:null
  });
  limitImages();
  save(); render();
  if (!silent) toast(t('tImgCaptured'));
  return true;
}
function limitImages(){
  const imgs = state.entries.filter(e => e.img && !e.pin && !e.protect)
                           .sort((a,b) => b.ts - a.ts);
  if (imgs.length <= IMAGE_MAX) return;
  const drop = new Set(imgs.slice(IMAGE_MAX).map(e => e.id));
  state.entries = state.entries.filter(e => !drop.has(e.id));
}
function copyImageEntry(e){
  playCopySound();
  if (HOSTED){ post({ cmd:'copyImage', data:e.img }); toast(t('tCopied')); return; }
  try{
    const bin = atob(e.img.split(',')[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const blob = new Blob([arr], {type: e.img.slice(5, e.img.indexOf(';'))});
    navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]);
    toast(t('tCopied'));
  }catch(err){ toast(t('tImportFail')); }
}
function saveImageEntry(e){
  if (HOSTED){ post({ cmd:'saveImage', data:e.img, name:'clip-image-' + Date.now() + (e.img.indexOf('png') > 0 ? '.png' : '.jpg') }); return; }
  try{
    const a = document.createElement('a');
    a.href = e.img;
    a.download = 'clip-image-' + Date.now() + (e.img.indexOf('png') > 0 ? '.png' : '.jpg');
    document.body.appendChild(a); a.click(); a.remove();
  }catch(err){}
}

/* =========================================================================
   折叠 / 展开 / 开关面板的动画（max-height + preserve-scroll，丝滑优先）
   ========================================================================= */
const ANIM_MS = 180;
const ANIM_EASE = 'cubic-bezier(.4,0,.2,1)';     // Material standard ease：快起慢收
let foldBusy = {};

/* 谁叠在谁下面（动画时要跟着一起滑） */
const STACK_UNDER = { image:'code', macros:'fav' };

/* 上层面板高度变了，下面叠着的面板跟着平移，不用等重排 */
function glideStacked(changedId, delta, ms){
  Object.keys(STACK_UNDER).forEach(id => {
    if (STACK_UNDER[id] !== changedId || state.pos[id]) return;   // 用户拖过就不动
    const p = document.querySelector('.panel[data-panel="' + id + '"]');
    if (!p) return;
    const from = parseFloat(p.style.top) || 0;
    p.style.transition = 'top ' + ms + 'ms ' + ANIM_EASE;
    requestAnimationFrame(() => { p.style.top = (from + delta) + 'px'; });
    setTimeout(() => { p.style.transition = ''; }, ms + 40);
  });
}

/* 折叠状态直接改 DOM（不整体重绘，避免动画结束瞬间卡一下） */
function applyFoldDOM(id, collapsed){
  const panel = document.querySelector('.panel[data-panel="' + id + '"]');
  if (!panel) return false;
  const body = panel.querySelector('.pbody');
  if (!body) return false;
  panel.classList.toggle('collapsed', collapsed);
  body.style.display = collapsed ? 'none' : '';
  if (!collapsed){
    /* 清掉上次收起留下的 max-height / overflow，让自然高度重新生效 */
    body.style.maxHeight = '';
    body.style.overflowY = '';
    body.style.transition = '';
  }
  const chev = panel.querySelector('[data-act="collapse"]');
  if (chev) chev.innerHTML = svg(collapsed ? I.chevDn : I.chevUp);
  return true;
}

/* 收起一个容器：固定当前 max-height → 0，同时保存滚动位置 */
function animCollapse(el, ms, done){
  if (!el){ done && done(); return; }
  /* 保存滚动位置，展开后恢复，避免内容跳变 */
  const scrollY = el.scrollTop;
  el.classList.add('animating');
  el.style.overflowY = 'hidden';
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.transition = 'none';
  void el.getBoundingClientRect();   // 强制回流，确保 max-height 初始值生效
  el.style.transition = 'max-height ' + ms + 'ms ' + ANIM_EASE;
  requestAnimationFrame(() => {
    el.style.maxHeight = '0px';
  });
  setTimeout(() => {
    el.classList.remove('animating');
    el.style.transition = '';
    el.scrollTop = scrollY;          // 恢复滚动位置（此时 display 已变，滚动位置已无用但保险）
    done && done();
  }, ms + 10);
}

/* 展开一个容器：从 0 → 自然高度，结束后清掉内联样式 */
function animExpand(el, ms){
  if (!el) return;
  const h = el.scrollHeight;
  if (h <= 0){                       // 没有内容就没什么可动画的
    el.style.maxHeight = ''; el.style.overflowY = '';
    el.style.transition = '';
    el.classList.remove('animating');
    return;
  }
  el.classList.add('animating');
  el.style.overflowY = 'hidden';
  el.style.maxHeight = '0px';
  el.style.transition = 'none';
  void el.getBoundingClientRect();   // 强制回流，从 0 开始展开
  el.style.transition = 'max-height ' + ms + 'ms ' + ANIM_EASE;
  requestAnimationFrame(() => {
    el.style.maxHeight = h + 'px';
  });
  setTimeout(() => {
    el.style.maxHeight = ''; el.style.overflowY = '';
    el.style.transition = '';
    el.classList.remove('animating');
  }, ms + 40);
}

/* 展开某条内容的设置区（右键）——换条目时先收旧的再展新的，衔接自然 */
function selectEntry(catId, id){
  const panel = document.querySelector('.panel[data-panel="' + catId + '"]');
  const same = state.sel[catId] === id;
  const oldExpand = panel && panel.querySelector('.expand');

  if (same){                                   // 再右键 = 收起（不重绘，直接移除这一块）
    const ex = oldExpand;
    state.sel[catId] = null; state.ddCat = null; save();
    if (ex) animCollapse(ex, 160, () => { ex.remove(); }); else render();
    return;
  }
  const openNew = () => {
    state.sel[catId] = id; state.ddCat = null;
    render();
    animExpand(document.querySelector('.panel[data-panel="' + catId + '"] .expand'), 210);
  };
  if (oldExpand) animCollapse(oldExpand, 130, openNew); else openNew();
}

/* 栏目：收起 / 展开（右键、⌃ 按钮、侧栏右键都走这里） */
function toggleFold(id){
  if (foldBusy[id]) return;
  const panel = document.querySelector('.panel[data-panel="' + id + '"]');
  const body  = panel && panel.querySelector('.pbody');
  const willCollapse = !state.collapsed[id];

  if (!panel || !body){                       // 面板没开：直接切状态
    state.collapsed[id] = willCollapse;
    save(); render();
    return;
  }
  foldBusy[id] = true;
  state.collapsed[id] = willCollapse;
  save();                                     // 不再整体重绘，动画期间只动这一块

  if (willCollapse){
    const h = body.offsetHeight;
    glideStacked(id, -h, ANIM_MS);            // 下面的面板同步上移
    animCollapse(body, ANIM_MS, () => {
      applyFoldDOM(id, true);                 // 动画结束才真正隐藏，全程不重排
      foldBusy[id] = false;
    });
    toast(t('tCollapsed'));
  }else{
    applyFoldDOM(id, false);
    const h = body.offsetHeight;
    glideStacked(id, h, ANIM_MS);             // 下面的面板同步下移
    animExpand(body, ANIM_MS);
    setTimeout(() => { foldBusy[id] = false; }, ANIM_MS + 40);
    toast(t('tExpanded'));
  }
}

/* 整个面板（侧栏左键）：淡出缩小 / 淡入放大 */
function togglePanelAnim(id){
  const el = document.querySelector('.panel[data-panel="' + id + '"]');
  const open = panelIsOpen(id);
  if (open && el){
    el.style.transformOrigin = 'left top';
    el.style.transition = 'opacity 140ms ease, transform 140ms ' + ANIM_EASE;
    el.style.opacity = '0';
    el.style.transform = 'scale(.965)';
    setTimeout(() => { setPanel(id, false); render(); }, 140);
    return;
  }
  setPanel(id, true);
  render();
  const el2 = document.querySelector('.panel[data-panel="' + id + '"]');
  if (el2){
    el2.style.transformOrigin = 'left top';
    el2.style.opacity = '0';
    el2.style.transform = 'scale(.965)';
    el2.style.transition = 'opacity 170ms ease, transform 170ms ' + ANIM_EASE;
    requestAnimationFrame(() => { el2.style.opacity = '1'; el2.style.transform = 'none'; });
    setTimeout(() => { el2.style.transition = ''; el2.style.transform = ''; el2.style.opacity = ''; }, 220);
  }
}

/* 侧栏那一整列分类（右键 VAPE 标题栏 / ⌃ 按钮） */
function toggleSideAnim(){
  const sb = document.getElementById('sidebar');
  const body = sb && sb.querySelector('.side-body');
  const foot = sb && sb.querySelector('.side-foot');
  const willCollapse = !state.collapsed.side;
  if (!sb || !body){ state.collapsed.side = willCollapse; save(); render(); return; }
  if (willCollapse){
    animCollapse(body, ANIM_MS, () => {});
    if (foot) animCollapse(foot, ANIM_MS - 40, () => {});
    setTimeout(() => {
      state.collapsed.side = true; save(); render();
      toast(t('tCollapsed'));
    }, ANIM_MS + 10);
  }else{
    /* 先 render 出侧栏，然后用 max-height 从 0 展开，避免内容瞬间出现再缩小。 */
    state.collapsed.side = false;
    save();
    render();
    const b2 = document.querySelector('#sidebar .side-body');
    const f2 = document.querySelector('#sidebar .side-foot');
    if (b2) animExpand(b2, ANIM_MS);
    if (f2) animExpand(f2, ANIM_MS - 40);
    toast(t('tExpanded'));
  }
}

/* --------------------------- 复制提示音 --------------------------- */
let audioCtx = null;
function playCopySound(){
  if (!state.sound) return;
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, t);
    o.frequency.exponentialRampToValueAtTime(1320, t + 0.07);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + 0.19);
  }catch(e){}
}

/* -------------------- 导出 / 导入（配置栏目） -------------------- */
function exportEntries(){
  const payload = {
    app:'vape-v4-clipboard', version:3, exported:new Date().toISOString(),
    account: state.account, names: state.names, limits: state.limits,
    entries: state.entries
  };
  const json = JSON.stringify(payload, null, 2);
  if (HOSTED){ post({cmd:'export', text: json}); return; }   // 交给宿主弹“另存为”
  try{
    const blob = new Blob([json], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vape-clipboard-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(t('tExported').replace('{n}', state.entries.length));
  }catch(e){ toast(t('tImportFail')); }
}
function startImport(){
  if (HOSTED){ post({cmd:'import'}); return; }               // 交给宿主弹“打开”
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json,text/plain';
  inp.addEventListener('change', () => { if (inp.files[0]) readImportFile(inp.files[0]); });
  inp.click();
}
function readImportFile(file){
  const fr = new FileReader();
  fr.onload = () => mergeImport(String(fr.result));
  fr.onerror = () => toast(t('tImportFail'));
  fr.readAsText(file);
}
function mergeImport(text){
  let data = null;
  try{ data = JSON.parse(text); }catch(e){ return toast(t('tImportFail')); }
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.entries) ? data.entries : null);
  if (!arr) return toast(t('tImportFail'));
  let n = 0;
  arr.forEach(it => {
    const txt = typeof it === 'string' ? it : ((it && it.text) || '');
    if (!String(txt).trim()) return;
    if (state.entries.some(e => oneLine(e.text) === oneLine(txt))) return;
    state.entries.push({
      id: nextId(), text: String(txt), type: (it && it.type) || detectType(String(txt)),
      pin: !!(it && it.pin), fav: !!(it && it.fav), quick: (it && it.quick) || 0,
      fs: (it && it.fs) || 12, transform: (it && it.transform) || 'plain',
      auto: !(it && it.auto === false), protect: !!(it && it.protect),
      ts: (it && it.ts) || Date.now()
    });
    n++;
  });
  if (!n){ toast(t('tImportNone')); return; }
  trimHistory(); save(); render();
  toast(t('tImported2').replace('{n}', n));
}

/* ---------------------- 账户栏目：头像 / 名称 ---------------------- */
function pickAvatar(file, done){
  const fr = new FileReader();
  fr.onload = () => {
    const img = new Image();
    img.onload = () => {
      try{
        const S = 128;
        const cv = document.createElement('canvas');
        cv.width = cv.height = S;
        const g = cv.getContext('2d');
        const k = Math.max(S / img.width, S / img.height);
        const w = img.width * k, h = img.height * k;
        g.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        done(cv.toDataURL('image/png'));
      }catch(e){ toast(t('tImportFail')); }
    };
    img.onerror = () => toast(t('tImportFail'));
    img.src = String(fr.result);
  };
  fr.onerror = () => toast(t('tImportFail'));
  fr.readAsDataURL(file);
}
document.addEventListener('change', ev => {
  const f = ev.target.closest('[data-act="avatarFile"]');
  if (f && f.files && f.files[0]){
    pickAvatar(f.files[0], url => { state.account.avatar = url; save(); render(); toast(t('tRenamed')); });
    return;
  }
});
document.addEventListener('input', ev => {
  const n = ev.target.closest('[data-act="acctName"]');
  if (!n) return;
  state.account.name = n.value;
  save();
  const sub = n.parentElement.querySelector('.acct-sub');
  if (sub) sub.textContent = n.value || t('noName');
});
document.addEventListener('focusout', ev => {
  if (ev.target.closest('[data-act="acctName"]')) render();
});

/* ---------------------- 双击面板标题：改栏目名 ---------------------- */
function startRename(node){
  const id = node.dataset.rename;
  let cancelled = false;
  node.contentEditable = 'true';
  node.classList.add('renaming');
  window.__vapeEditing = true;
  try{
    const r = document.createRange();
    r.selectNodeContents(node);
    const s = window.getSelection();
    s.removeAllRanges(); s.addRange(r);
  }catch(e){}
  const finish = () => {
    node.contentEditable = 'false';
    node.classList.remove('renaming');
    window.__vapeEditing = false;
    const v = (node.textContent || '').trim();
    if (cancelled){ save(); render(); return; }
    if (v && v !== t(id)){ state.names[id] = v; toast(t('tRenamed')); }
    save(); render();
  };
  node.addEventListener('blur', finish, {once:true});
  node.addEventListener('keydown', k => {
    k.stopPropagation();
    if (k.key === 'Enter'){ k.preventDefault(); node.blur(); }
    if (k.key === 'Escape'){ k.preventDefault(); cancelled = true; node.textContent = catName(id); node.blur(); }
  });
}

/* --------------------------- 面板拖拽（Vape 式） --------------------------- */
(function dragging(){
  let drag = null;
  document.addEventListener('mousedown', ev => {
    if (ev.button !== 0) return;
    if (window.__vapeEditing) return;                    // 正在改栏目名，不要拖
    const head = ev.target.closest('.phead, .side-head');
    if (!head || ev.target.closest('button') || ev.target.closest('[contenteditable="true"]')) return;
    const panel = head.closest('.panel');
    if (!panel) return;
    ev.preventDefault();
    const s = effScale();
    const r = panel.getBoundingClientRect();
    drag = {
      id: panel.dataset.panel || 'side',
      panel,
      offX: (ev.clientX - r.left) / s,
      offY: (ev.clientY - r.top) / s,
      w: r.width / s,
      x: parseFloat(panel.style.left) || 0,
      y: parseFloat(panel.style.top) || 0
    };
    panel.style.zIndex = ++zTop;
    panel.classList.add('dragging');
    window.__vapeDragging = true;
  });
  document.addEventListener('mousemove', ev => {
    if (!drag) return;
    const s = effScale();
    const st = document.getElementById('stage').getBoundingClientRect();
    drag.x = clamp((ev.clientX - st.left) / s - drag.offX, -drag.w + 70, 1600 - 70);
    drag.y = clamp((ev.clientY - st.top) / s - drag.offY, 0, 900 - 26);
    drag.panel.style.left = Math.round(drag.x) + 'px';
    drag.panel.style.top  = Math.round(drag.y) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!drag) return;
    state.pos[drag.id] = { x: Math.round(drag.x), y: Math.round(drag.y) };
    drag.panel.classList.remove('dragging');
    drag = null;
    window.__vapeDragging = false;
    save();
  });
  window.addEventListener('blur', () => {
    if (drag){ drag.panel.classList.remove('dragging'); drag = null; }
    window.__vapeDragging = false;
  });
})();

/* ---------- 右键：条目 → 打开它的设置；面板 → 折叠内容 ---------- */
document.addEventListener('contextmenu', ev => {
  /* 1) 条目：右键开设置（再右键收起）；点 ⋮ 仍是菜单 */
  const row = ev.target.closest('.row');
  if (row){
    ev.preventDefault();
    if (ev.target.closest('.dots')){
      const d = row.querySelector('.dots');
      if (d) d.click();
      return;
    }
    if (ev.target.closest('.star') || ev.target.closest('.key')) return;
    const panel = row.closest('.panel');
    const catId = panel ? panel.dataset.panel : null;
    const id = row.dataset.id;
    if (!catId || !id) return;
    selectEntry(catId, id);
    if (state.sel[catId]) toast(t('settings'));
    return;
  }
  if (ev.target.closest('button') && !ev.target.closest('[data-act="sideFold"]')) return;

  /* 0) 侧栏标题栏（VAPE 那一行）→ 折叠 / 展开整个分类列表 */
  if (ev.target.closest('.side-head')){
    if (ev.target.closest('button')) return;
    ev.preventDefault();
    state.collapsed.side = !state.collapsed.side;
    save(); render();
    toast(state.collapsed.side ? t('tCollapsed') : t('tExpanded'));
    return;
  }

  /* 2) 面板任意位置（标题栏/内容空白）→ 折叠或展开它的内容 */
  const panel = ev.target.closest('.panel[data-panel]');
  if (panel){
    ev.preventDefault();
    toggleFold(panel.dataset.panel);
    return;
  }
  /* 3) 侧栏分类行 → 同样折叠/展开对应面板的内容 */
  const srow = ev.target.closest('.srow[data-cat]');
  if (srow){
    ev.preventDefault();
    const id = srow.dataset.cat;
    setPanel(id, true);
    toggleFold(id);
  }
});

/* --------------------------- 宿主来的消息 --------------------------- */
if (HOSTED){
  window.chrome.webview.addEventListener('message', ev => {
    const d = ev.data;
    if (typeof d === 'string'){                       // 兼容纯文本：当成剪切板内容
      if (d.trim() && addEntry(d)) toast(t('tCaptured'));
      return;
    }
    if (!d || !d.cmd) return;
    if (d.cmd === 'clip'){ if (d.text && addEntry(d.text)) toast(t('tCaptured')); }
    else if (d.cmd === 'clipImage'){ addImage(d.data, d.w, d.h); }
    else if (d.cmd === 'imageData'){ addImage(d.data, d.w, d.h); }
    else if (d.cmd === 'import'){ mergeImport(d.text || ''); }
    else if (d.cmd === 'fileData'){ loadFromDisk(d.text || ''); }
    else if (d.cmd === 'anim'){ guiAnim(d.dir || 'in'); }
    else if (d.cmd === 'hotkey'){
      state.hotkeyName = d.text || '';
      const sub = document.querySelector('.inj-done-sub');
      if (sub) sub.textContent = 'Press ' + (state.hotkeyName || 'RIGHT SHIFT') + ' while in game to open the GUI';
    }
    else if (d.cmd === 'saved'){ toast(t('tFileSaved')); }
    else if (d.cmd === 'toast'){ toast(d.text || ''); }
  });
}

/* ------------------------------ 搜索框 ------------------------------ */
const qInput = document.getElementById('q');
qInput.addEventListener('input', () => {
  state.q = qInput.value;
  if (state.q.trim()) setPanel('all', true);
  renderSoon();          // 打字时同一帧只重绘一次
});
qInput.addEventListener('keydown', ev => ev.stopPropagation());
document.getElementById('btnImport').addEventListener('click', importFromSystem);
document.getElementById('btnSearch').addEventListener('click', () => { render(); qInput.focus(); });

/* --------------------------- 系统剪切板事件 --------------------------- */
document.addEventListener('paste', ev => {
  const tag = (ev.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  /* 图片优先：直接读剪贴板里的文件 */
  const items = (ev.clipboardData && ev.clipboardData.items) || [];
  for (let i = 0; i < items.length; i++){
    if (items[i].type && items[i].type.indexOf('image') === 0){
      const file = items[i].getAsFile();
      if (file){
        ev.preventDefault();
        const fr = new FileReader();
        fr.onload = () => {
          const im = new Image();
          im.onload = () => addImage(String(fr.result), im.naturalWidth, im.naturalHeight);
          im.onerror = () => addImage(String(fr.result), 0, 0);
          im.src = String(fr.result);
        };
        fr.readAsDataURL(file);
        return;
      }
    }
  }
  const text = (ev.clipboardData || window.clipboardData).getData('text');
  if (text){ ev.preventDefault(); if (addEntry(text)) toast(t('tCaptured')); return; }
  if (HOSTED) post({ cmd:'grabImage' });       // 文本也没有，问问宿主是不是图片
});

/* 拖图片进来 */
document.addEventListener('dragover', ev => { if (ev.dataTransfer) ev.preventDefault(); });
document.addEventListener('drop', ev => {
  const files = (ev.dataTransfer && ev.dataTransfer.files) || [];
  for (let i = 0; i < files.length; i++){
    if (/^image\//.test(files[i].type)){
      ev.preventDefault();
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => addImage(String(fr.result), im.naturalWidth, im.naturalHeight);
        im.onerror = () => addImage(String(fr.result), 0, 0);
        im.src = String(fr.result);
      };
      fr.readAsDataURL(files[i]);
      return;
    }
  }
});
document.addEventListener('copy', () => {
  const sel = String((window.getSelection && window.getSelection()) || '');
  if (sel.trim()){ addEntry(sel.trim()); toast(t('tCaptured')); }
});
document.addEventListener('keydown', ev => {
  const typing = /input|textarea/i.test(ev.target.tagName || '');
  if (typing && ev.key !== 'Escape') return;
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k'){ ev.preventDefault(); qInput.focus(); return; }
  if (ev.key === 'Escape'){
    closeMenu();
    if (state.ddCat){ state.ddCat = null; render(); }
    return;
  }
  if (ev.key === 'Tab' && document.activeElement !== qInput){
    ev.preventDefault(); setPanel('all', !panelIsOpen('all')); render(); return;
  }
  const n = parseInt(ev.key, 10);
  if (n >= 1 && n <= 9){
    const e = state.entries.find(x => x.quick === n);
    if (e) copyEntry(e);
  }
});
window.addEventListener('beforeunload', function(){ try{ flushSave(); }catch(e){} });

/* ------------------------------- 缩放 ------------------------------- */
const baseScale = () => Math.min(window.innerWidth / 1600, window.innerHeight / 900);
const effScale  = () => baseScale() * state.zoom;
function fit(){ document.getElementById('stage').style.setProperty('--s', effScale()); }
window.addEventListener('resize', fit);

/* 界面开合动画（宿主隐藏/显示窗口时播放） */
function guiAnim(dir){
  const w = document.getElementById('guiWrap');
  if (!w) return;
  w.classList.remove('anim-in','anim-out');
  void w.offsetWidth;                       // 重启动画
  w.classList.add(dir === 'out' ? 'anim-out' : 'anim-in');
  if (HOSTED){
    const ms = dir === 'out' ? 230 : 280;
    setTimeout(() => post({ cmd:'animDone', dir }), ms);
  }
}
window.guiAnim = guiAnim;

/* ------------------------------- 启动 ------------------------------- */
load();
fit();
render();
setTimeout(() => {
  toast(state.entries.length ? t('dragHint') : t('emptyAll'));
  if (state.intro !== false) playInjectIntro();     // 启动时播一遍注入动画
}, 400);

