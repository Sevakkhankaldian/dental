"use client";

import { useMemo, useState } from "react";

type Priority = "critical" | "attention" | "routine";
type QueueStatus = "در انتظار بررسی" | "در حال بررسی" | "کیفیت ناکافی";

type QueueItem = {
  id: number;
  initials: string;
  name: string;
  meta: string;
  treatment: string;
  scan: string;
  received: string;
  priority: Priority;
  status: QueueStatus;
  finding: string;
  confidence: string;
};

const queueItems: QueueItem[] = [
  {
    id: 1,
    initials: "س‌م",
    name: "سارا محمدی",
    meta: "۲۸ ساله · DM-1048",
    treatment: "الاینر شفاف · مرحله ۱۴",
    scan: "اسکن دوره‌ای",
    received: "۱۲ دقیقه پیش",
    priority: "critical",
    status: "در انتظار بررسی",
    finding: "احتمال فاصله الاینر در ناحیه دندان ۱۳",
    confidence: "عدم قطعیت: متوسط",
  },
  {
    id: 2,
    initials: "ا‌ر",
    name: "امیررضا رضایی",
    meta: "۱۷ ساله · DM-1082",
    treatment: "براکت ثابت · ماه ۸",
    scan: "گزارش علامت",
    received: "۲۶ دقیقه پیش",
    priority: "critical",
    status: "در انتظار بررسی",
    finding: "گزارش درد و احتمال جداشدن براکت",
    confidence: "ثبت‌شده توسط بیمار",
  },
  {
    id: 3,
    initials: "ن‌ک",
    name: "نیلوفر کریمی",
    meta: "۳۴ ساله · DM-1019",
    treatment: "الاینر شفاف · مرحله ۷",
    scan: "اسکن دوره‌ای",
    received: "۴۱ دقیقه پیش",
    priority: "attention",
    status: "در حال بررسی",
    finding: "کیفیت مناسب؛ تغییر نیازمند مقایسه طولی",
    confidence: "عدم قطعیت: پایین",
  },
  {
    id: 4,
    initials: "م‌ف",
    name: "محمد فرهادی",
    meta: "۲۳ ساله · DM-1104",
    treatment: "نگهدارنده · ماه ۳",
    scan: "پیگیری نگهدارنده",
    received: "۱ ساعت پیش",
    priority: "routine",
    status: "کیفیت ناکافی",
    finding: "نمای باکال راست کامل نیست؛ درخواست تکرار",
    confidence: "خودداری مدل: کیفیت ورودی",
  },
  {
    id: 5,
    initials: "ه‌ص",
    name: "هانیه صادقی",
    meta: "۳۰ ساله · DM-1063",
    treatment: "الاینر شفاف · مرحله ۲۱",
    scan: "اسکن دوره‌ای",
    received: "۲ ساعت پیش",
    priority: "routine",
    status: "در انتظار بررسی",
    finding: "یافته پرخطر مشاهده نشد؛ تأیید انسانی لازم است",
    confidence: "عدم قطعیت: پایین",
  },
];

const navItems = [
  ["⌂", "نمای کلی", "", "/"],
  ["▤", "صندوق یکپارچه", "۵", "/inbox"],
  ["◫", "صف بررسی", "۱۲", "/reviews"],
  ["◎", "بیماران", "", "/patients"],
  ["◌", "پیام‌ها", "۳", "/messages"],
  ["□", "نوبت‌ها", "", "/appointments"],
  ["◇", "پروتکل‌ها", "", "/protocols"],
  ["⌁", "گزارش‌ها", "", "/analytics"],
];

const faNumber = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

function PriorityPill({ priority }: { priority: Priority }) {
  const labels = {
    critical: "فوری",
    attention: "نیازمند توجه",
    routine: "عادی",
  };
  return <span className={`priority priority-${priority}`}>{labels[priority]}</span>;
}

function Sparkline({ variant = "teal" }: { variant?: "teal" | "coral" | "gold" }) {
  return (
    <span className={`sparkline sparkline-${variant}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<"all" | Priority>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<QueueItem | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [decision, setDecision] = useState<"accept" | "edit" | "reject" | "inconclusive">("accept");
  const [signedIds, setSignedIds] = useState<number[]>([]);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return queueItems.filter((item) => {
      const matchesFilter = filter === "all" || item.priority === filter;
      const matchesSearch =
        !normalized ||
        `${item.name} ${item.meta} ${item.treatment} ${item.finding}`
          .toLowerCase()
          .includes(normalized);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const openReview = (item: QueueItem) => {
    setSelected(item);
    setDecision("accept");
  };

  const signDecision = () => {
    if (!selected) return;
    setSignedIds((ids) => [...new Set([...ids, selected.id])]);
    setSelected(null);
    showToast("تصمیم با موفقیت امضا و در سابقه ممیزی ثبت شد.");
  };

  return (
    <main className="app-shell" dir="rtl">
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="ناوبری اصلی">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><span>د</span></div>
          <div>
            <strong>دنتامانیتور</strong>
            <small>مراقبت پیوسته، تصمیم مطمئن</small>
          </div>
        </div>

        <div className="clinic-switcher">
          <span className="clinic-avatar">آ</span>
          <div>
            <small>کلینیک فعال</small>
            <strong>ارتودنسی آریا</strong>
          </div>
          <button type="button" aria-label="تغییر کلینیک">⌄</button>
        </div>

        <nav>
          <p className="nav-label">فضای کاری</p>
          {navItems.map(([icon, label, count, path], index) => (
            <button
              className={`nav-item ${index === 0 ? "active" : ""}`}
              key={label}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                if (index !== 0) window.location.assign(path);
              }}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              {count && <b>{faNumber(count)}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="help-card" type="button" onClick={() => showToast("راهنمای نسخه نمایشی به‌زودی اضافه می‌شود.")}>
            <span className="help-icon">؟</span>
            <span><strong>نیاز به راهنمایی دارید؟</strong><small>مرکز راهنما و پشتیبانی</small></span>
            <span>←</span>
          </button>
          <div className="demo-badge"><span>●</span> محیط نمایشی · داده کاملاً ساختگی</div>
        </div>
      </aside>

      {menuOpen && <button className="sidebar-backdrop" aria-label="بستن منو" onClick={() => setMenuOpen(false)} />}

      <section className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button className="menu-button" type="button" aria-label="باز کردن منو" onClick={() => setMenuOpen(true)}>☰</button>
            <span>نمای کلی</span><i>/</i><strong>امروز</strong>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی بیمار یا پرونده..." aria-label="جست‌وجوی بیمار یا پرونده" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="notification-wrap">
              <button className="icon-button" type="button" aria-label="اعلان‌ها" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>
                ♢<span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover-head"><strong>اعلان‌ها</strong><button type="button" onClick={() => showToast("همه اعلان‌ها خوانده شد.")}>خواندن همه</button></div>
                  <div className="notification-item urgent"><span>!</span><div><strong>گزارش درد جدید</strong><small>امیررضا رضایی · ۶ دقیقه پیش</small></div></div>
                  <div className="notification-item"><span>✓</span><div><strong>پردازش اسکن کامل شد</strong><small>سارا محمدی · ۱۲ دقیقه پیش</small></div></div>
                  <div className="notification-item"><span>◷</span><div><strong>۳ بررسی نزدیک SLA</strong><small>کمتر از ۳۰ دقیقه باقی مانده</small></div></div>
                </div>
              )}
            </div>
            <div className="profile">
              <span className="profile-avatar">م‌ن</span>
              <div><strong>دکتر مریم نادری</strong><small>متخصص ارتودنسی</small></div>
              <button type="button" aria-label="منوی حساب">⌄</button>
            </div>
          </div>
        </header>

        <div className="content" id="main-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow"><span /> وضعیت امروز کلینیک</p>
              <h1>صبح بخیر، دکتر نادری</h1>
              <p>چهارشنبه ۲۱ مرداد ۱۴۰۵ · یک مرور سریع پیش از شروع بررسی‌ها</p>
            </div>
            <div className="welcome-actions">
              <button className="secondary-button" type="button" onClick={() => showToast("فرم بیمار جدید در برش بنیاد بیماران اضافه می‌شود.")}><span>＋</span> بیمار جدید</button>
              <button className="primary-button" type="button" onClick={() => openReview(queueItems[0])}><span>◫</span> شروع بررسی <b>{faNumber(12)}</b></button>
            </div>
          </section>

          <section className="safety-note" aria-label="یادآوری ایمنی بالینی">
            <span className="safety-icon">i</span>
            <div><strong>یادآوری ایمنی بالینی</strong><p>اولویت‌ها و یافته‌ها پیشنهاد سامانه‌اند. هیچ خروجی بدون بررسی و امضای پزشک برای بیمار نمایش داده نمی‌شود.</p></div>
            <button type="button" onClick={() => showToast("سیاست ایمنی: PR-CLIN-003 و Safety Invariant 6")}>مشاهده سیاست ←</button>
          </section>

          <section className="stats-grid" aria-label="آمار امروز">
            <article className="stat-card critical-card">
              <div className="stat-top"><span className="stat-icon">!</span><span className="trend up">↑ ۲</span></div>
              <p>نیازمند رسیدگی فوری</p><div className="stat-value"><strong>{faNumber(3)}</strong><Sparkline variant="coral" /></div><small>یک مورد نزدیک زمان پاسخ</small>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon teal">◫</span><span className="trend">امروز</span></div>
              <p>اسکن‌های جدید</p><div className="stat-value"><strong>{faNumber(12)}</strong><Sparkline /></div><small>از ۹ بیمار فعال</small>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon gold">◷</span><span className="trend down">↓ ۱۲٪</span></div>
              <p>اسکن‌های عقب‌افتاده</p><div className="stat-value"><strong>{faNumber(8)}</strong><Sparkline variant="gold" /></div><small>بهبود نسبت به هفته قبل</small>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon violet">⌁</span><span className="trend good">در محدوده هدف</span></div>
              <p>میانگین زمان بررسی</p><div className="stat-value"><strong>{faNumber(18)}<em>دقیقه</em></strong><Sparkline /></div><small>هدف کلینیک: کمتر از ۳۰ دقیقه</small>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel attention-panel">
              <header className="panel-header">
                <div><span className="section-kicker">اولویت بالینی</span><h2>نیازمند توجه شما</h2><p>موارد مرتب‌شده بر اساس سیاست کلینیک و زمان پاسخ</p></div>
                <button type="button" onClick={() => { setFilter("critical"); document.getElementById("review-queue")?.scrollIntoView({ behavior: "smooth" }); }}>مشاهده همه <span>←</span></button>
              </header>
              <div className="attention-list">
                {queueItems.slice(0, 3).map((item) => (
                  <button className="attention-row" key={item.id} type="button" onClick={() => openReview(item)}>
                    <span className={`avatar avatar-${item.priority}`}>{item.initials}</span>
                    <span className="patient-copy"><strong>{item.name}</strong><small>{item.treatment}</small></span>
                    <span className="finding-copy"><strong>{item.finding}</strong><small><i className={`dot dot-${item.priority}`} /> {item.received}</small></span>
                    <PriorityPill priority={item.priority} />
                    <span className="row-arrow">←</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel workload-panel">
              <header className="panel-header"><div><span className="section-kicker">ظرفیت امروز</span><h2>بار کاری تیم</h2></div><button type="button" onClick={() => showToast("گزارش کامل تیم در بخش گزارش‌ها فعال می‌شود.")}>جزئیات</button></header>
              <div className="workload-main">
                <div className="donut"><div><strong>{faNumber(68)}٪</strong><small>تکمیل‌شده</small></div></div>
                <div className="workload-legend">
                  <p><span className="legend-dot teal-bg" /> بررسی‌شده <strong>{faNumber(23)}</strong></p>
                  <p><span className="legend-dot gold-bg" /> در انتظار <strong>{faNumber(12)}</strong></p>
                  <p><span className="legend-dot grey-bg" /> ارجاع‌شده <strong>{faNumber(4)}</strong></p>
                </div>
              </div>
              <div className="team-row"><span className="team-avatars"><i>م‌ن</i><i>پ‌ا</i><i>س‌ر</i></span><span><strong>۳ پزشک آنلاین</strong><small>آخرین همگام‌سازی: همین حالا</small></span><button type="button" aria-label="مشاهده تیم">←</button></div>
            </article>
          </section>

          <section className="panel queue-panel" id="review-queue">
            <header className="queue-header">
              <div><span className="section-kicker">صف زنده</span><h2>اسکن‌های منتظر بررسی</h2><p>یافته‌های زیر خام و صرفاً برای بررسی افراد مجاز هستند.</p></div>
              <div className="filter-tabs" aria-label="فیلتر صف">
                {([
                  ["all", "همه", 12],
                  ["critical", "فوری", 3],
                  ["attention", "نیازمند توجه", 4],
                  ["routine", "عادی", 5],
                ] as const).map(([value, label, count]) => (
                  <button type="button" key={value} className={filter === value ? "selected" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label} <span>{faNumber(count)}</span></button>
                ))}
              </div>
            </header>
            <div className="table-wrap">
              <table>
                <thead><tr><th>بیمار</th><th>درمان و نوع اسکن</th><th>پیشنهاد برای بررسی</th><th>اولویت</th><th>وضعیت</th><th><span className="sr-only">اقدام</span></th></tr></thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className={signedIds.includes(item.id) ? "signed-row" : ""}>
                      <td><div className="patient-cell"><span className={`avatar avatar-${item.priority}`}>{item.initials}</span><span><strong>{item.name}</strong><small>{item.meta}</small></span></div></td>
                      <td><strong className="cell-title">{item.treatment}</strong><small>{item.scan} · {item.received}</small></td>
                      <td><strong className="finding-title">{item.finding}</strong><small>{item.confidence}</small></td>
                      <td><PriorityPill priority={item.priority} /></td>
                      <td>{signedIds.includes(item.id) ? <span className="signed-status">✓ امضاشده</span> : <span className="queue-status"><i />{item.status}</span>}</td>
                      <td><button className="review-button" type="button" onClick={() => openReview(item)}>{signedIds.includes(item.id) ? "مشاهده" : "بررسی"} <span>←</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state"><span>⌕</span><strong>موردی پیدا نشد</strong><p>عبارت جست‌وجو یا فیلتر را تغییر دهید.</p></div>}
            </div>
            <footer className="queue-footer"><span>نمایش {faNumber(filtered.length)} از {faNumber(12)} مورد</span><button type="button" onClick={() => showToast("صف کامل در صفحه اختصاصی صف بررسی باز می‌شود.")}>رفتن به صف کامل ←</button></footer>
          </section>

          <section className="bottom-grid">
            <article className="panel appointments-panel">
              <header className="panel-header"><div><span className="section-kicker">تقویم امروز</span><h2>نوبت‌های پیش رو</h2></div><button type="button" onClick={() => showToast("تقویم کامل در برش زمان‌بندی اضافه می‌شود.")}>مشاهده تقویم ←</button></header>
              <div className="appointment-row"><time><strong>{faNumber("۱۰:۳۰")}</strong><small>۴۵ دقیقه</small></time><span className="time-line" /><span className="avatar avatar-routine">ا‌خ</span><span><strong>الهام خسروی</strong><small>ویزیت دوره‌ای · صندلی ۲</small></span><span className="appointment-tag">حضوری</span></div>
              <div className="appointment-row"><time><strong>{faNumber("۱۲:۰۰")}</strong><small>۳۰ دقیقه</small></time><span className="time-line" /><span className="avatar avatar-attention">ک‌م</span><span><strong>کیان مرادی</strong><small>بررسی براکت · صندلی ۱</small></span><span className="appointment-tag online">فوری</span></div>
              <div className="appointment-row"><time><strong>{faNumber("۱۵:۱۵")}</strong><small>۲۰ دقیقه</small></time><span className="time-line" /><span className="avatar avatar-routine">ر‌د</span><span><strong>رها داوودی</strong><small>مشاوره آنلاین</small></span><span className="appointment-tag video">ویدئویی</span></div>
            </article>
            <article className="panel activity-panel">
              <header className="panel-header"><div><span className="section-kicker">ردپای قابل ممیزی</span><h2>فعالیت اخیر</h2></div><button type="button" aria-label="مشاهده همه فعالیت‌ها" onClick={() => showToast("نمای ممیزی تفصیلی برای نقش مجاز اضافه می‌شود.")}>•••</button></header>
              <ul className="activity-list">
                <li><span className="activity-icon success">✓</span><div><strong>تصمیم اسکن امضا شد</strong><p>دکتر نادری · پرونده DM-1031</p><small>۸ دقیقه پیش</small></div></li>
                <li><span className="activity-icon">◫</span><div><strong>اسکن جدید دریافت شد</strong><p>سارا محمدی · ۵ نمای کامل</p><small>۱۲ دقیقه پیش</small></div></li>
                <li><span className="activity-icon message">◌</span><div><strong>پیام بیمار دریافت شد</strong><p>امیررضا رضایی · نیازمند پاسخ</p><small>۲۶ دقیقه پیش</small></div></li>
              </ul>
            </article>
          </section>
        </div>
      </section>

      {selected && (
        <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <aside className="review-drawer" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <header className="drawer-header"><div><span className="drawer-label">بررسی بالینی · داده ساختگی</span><h2 id="review-title">{selected.name}</h2><p>{selected.treatment} · {selected.meta}</p></div><button type="button" aria-label="بستن پنل بررسی" onClick={() => setSelected(null)}>×</button></header>
            <div className="drawer-content">
              <div className="review-alert"><span>!</span><p><strong>این یافته تشخیص نیست.</strong> تصویر منبع و عدم قطعیت را پیش از ثبت تصمیم بررسی کنید.</p></div>
              <section className="scan-preview">
                <div className="mouth-placeholder" aria-label="جایگاه تصویر ساختگی اسکن دهان">
                  <span className="scan-watermark">تصویر نمونه · غیر بالینی</span>
                  <div className="teeth-row top-teeth">{Array.from({ length: 10 }).map((_, i) => <i key={`t-${i}`} />)}</div>
                  <div className="teeth-row bottom-teeth">{Array.from({ length: 10 }).map((_, i) => <i key={`b-${i}`} />)}</div>
                  <span className="evidence-marker">۱</span>
                </div>
                <div className="scan-toolbar"><button type="button">نمای روبه‌رو</button><button type="button">مقایسه با قبل</button><button type="button">نمایش شواهد</button></div>
              </section>
              <section className="finding-card">
                <div className="finding-card-head"><span><i /> پیشنهاد سامانه</span><PriorityPill priority={selected.priority} /></div>
                <h3>{selected.finding}</h3>
                <p>{selected.confidence} · مدل نمایشی DM-MOCK-QUALITY v0.1 · خروجی فقط برای سایه/آزمایش</p>
                <div className="evidence-box"><span>۱</span><p><strong>شاهد مرتبط</strong>نمای روبه‌رو · ناحیه علامت‌گذاری‌شده · کیفیت قابل قبول</p><button type="button">تمرکز روی شاهد</button></div>
              </section>
              <section className="decision-section">
                <div className="section-title-row"><h3>نظر پزشک</h3><small>PR-CLIN-002</small></div>
                <div className="decision-grid">
                  {([
                    ["accept", "✓", "تأیید", "یافته درست است"],
                    ["edit", "✎", "ویرایش", "نیاز به اصلاح دارد"],
                    ["reject", "×", "رد", "یافته درست نیست"],
                    ["inconclusive", "?", "نامشخص", "داده کافی نیست"],
                  ] as const).map(([value, icon, title, copy]) => (
                    <button type="button" key={value} className={decision === value ? "selected" : ""} onClick={() => setDecision(value)}><span>{icon}</span><strong>{title}</strong><small>{copy}</small></button>
                  ))}
                </div>
                <label className="clinical-note"><span>یادداشت بالینی <small>(اختیاری)</small></span><textarea placeholder="مشاهده یا دلیل تصمیم را ثبت کنید..." /></label>
              </section>
            </div>
            <footer className="drawer-footer"><button className="secondary-button" type="button" onClick={() => setSelected(null)}>ذخیره پیش‌نویس</button><button className="primary-button sign-button" type="button" onClick={signDecision}><span>✓</span> امضا و ثبت تصمیم</button><small>امضا در این نمونه شبیه‌سازی شده است</small></footer>
          </aside>
        </div>
      )}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
