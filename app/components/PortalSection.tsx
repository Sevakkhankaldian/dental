"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

export type PortalSectionName =
  | "inbox"
  | "reviews"
  | "patients"
  | "messages"
  | "appointments"
  | "protocols"
  | "analytics";

type NavItem = {
  icon: string;
  label: string;
  count?: string;
  href: string;
  section?: PortalSectionName;
};

const navItems: NavItem[] = [
  { icon: "✦", label: "همه پرتال‌ها", count: "جدید", href: "/portals" },
  { icon: "⌂", label: "نمای کلی", href: "/" },
  { icon: "▤", label: "صندوق یکپارچه", count: "۵", href: "/inbox", section: "inbox" },
  { icon: "◫", label: "صف بررسی", count: "۱۲", href: "/reviews", section: "reviews" },
  { icon: "◎", label: "بیماران", href: "/patients", section: "patients" },
  { icon: "◌", label: "پیام‌ها", count: "۳", href: "/messages", section: "messages" },
  { icon: "□", label: "نوبت‌ها", href: "/appointments", section: "appointments" },
  { icon: "◇", label: "پروتکل‌ها", href: "/protocols", section: "protocols" },
  { icon: "⌁", label: "گزارش‌ها", href: "/analytics", section: "analytics" },
];

const sectionMeta: Record<PortalSectionName, { eyebrow: string; title: string; description: string }> = {
  inbox: {
    eyebrow: "مرکز اقدام",
    title: "صندوق یکپارچه",
    description: "هشدارهای بالینی، بررسی اسکن، پیام، درخواست نوبت و کارهای امروز در یک جریان",
  },
  reviews: {
    eyebrow: "بررسی انسانی",
    title: "صف بررسی هوشمند",
    description: "اولویت‌بندی سیاست‌محور با دسترسی مستقیم به شواهد، عدم قطعیت و تاریخچه بیمار",
  },
  patients: {
    eyebrow: "پرونده‌های فعال",
    title: "مدیریت بیماران",
    description: "جست‌وجو، فیلتر و مرور وضعیت درمان با رعایت محدوده سازمان و تیم مراقبت",
  },
  messages: {
    eyebrow: "ارتباط امن",
    title: "پیام‌های کلینیک",
    description: "گفت‌وگوی ساختاریافته با بیمار، الگوهای تأییدشده و محتوای حداقلی اعلان",
  },
  appointments: {
    eyebrow: "تقویم کلینیک",
    title: "نوبت‌ها و درخواست‌ها",
    description: "برنامه روزانه، درخواست‌های جدید، منابع و تعارض‌ها با نمایش تاریخ شمسی",
  },
  protocols: {
    eyebrow: "اتوماسیون کنترل‌شده",
    title: "پروتکل‌های پایش",
    description: "نسخه‌بندی، شبیه‌سازی و تأیید دو مرحله‌ای پیش از هر اقدام خودکار",
  },
  analytics: {
    eyebrow: "بینش قابل توضیح",
    title: "گزارش‌ها و تحلیل‌ها",
    description: "شاخص‌های عملیاتی و بالینی همراه با تعریف، بازه و محدودیت تفسیر",
  },
};

const faNumber = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

const avatarTone = (index: number) => ["teal", "coral", "gold", "violet"][index % 4];

function DemoAvatar({ initials, index = 0 }: { initials: string; index?: number }) {
  return <span className={`portal-avatar portal-avatar-${avatarTone(index)}`}>{initials}</span>;
}

function Pill({ tone, children }: { tone: "red" | "gold" | "teal" | "grey" | "violet"; children: ReactNode }) {
  return <span className={`portal-pill portal-pill-${tone}`}>{children}</span>;
}

function SectionHeader({
  section,
  action,
  onAction,
}: {
  section: PortalSectionName;
  action: string;
  onAction: () => void;
}) {
  const meta = sectionMeta[section];
  return (
    <section className="portal-heading">
      <div>
        <p className="eyebrow"><span /> {meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>
      <button className="primary-button" type="button" onClick={onAction}><span>＋</span>{action}</button>
    </section>
  );
}

function Metric({ icon, label, value, detail, tone = "teal" }: { icon: string; label: string; value: string; detail: string; tone?: "teal" | "coral" | "gold" | "violet" }) {
  return (
    <article className="portal-metric">
      <span className={`portal-metric-icon ${tone}`}>{icon}</span>
      <div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div>
    </article>
  );
}

type ToastFn = (message: string) => void;

const inboxSeed = [
  { id: 1, type: "emergency", icon: "!", title: "گزارش درد و آسیب براکت", patient: "امیررضا رضایی", meta: "DM-1082 · ۶ دقیقه پیش", copy: "بیمار شدت درد را ۷ از ۱۰ ثبت کرده است.", tone: "red" as const, label: "فوری" },
  { id: 2, type: "review", icon: "◫", title: "اسکن آماده بررسی", patient: "سارا محمدی", meta: "DM-1048 · ۱۲ دقیقه پیش", copy: "۵ نمای کامل؛ یک پیشنهاد نیازمند بازبینی.", tone: "gold" as const, label: "بررسی" },
  { id: 3, type: "message", icon: "◌", title: "پیام جدید بیمار", patient: "نیلوفر کریمی", meta: "DM-1019 · ۲۸ دقیقه پیش", copy: "آیا زمان تعویض الاینر بعدی تغییری کرده است؟", tone: "teal" as const, label: "پیام" },
  { id: 4, type: "appointment", icon: "□", title: "درخواست جابه‌جایی نوبت", patient: "رها داوودی", meta: "DM-1074 · ۴۵ دقیقه پیش", copy: "درخواست انتقال از شنبه به دوشنبه.", tone: "violet" as const, label: "نوبت" },
  { id: 5, type: "task", icon: "✓", title: "رضایت‌نامه نیازمند پیگیری", patient: "محمد فرهادی", meta: "DM-1104 · ۱ ساعت پیش", copy: "نسخه جدید حریم خصوصی هنوز تأیید نشده است.", tone: "grey" as const, label: "کار" },
];

function InboxSection({ showToast }: { showToast: ToastFn }) {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(inboxSeed[0]);
  const [done, setDone] = useState<number[]>([]);
  const visible = tab === "all" ? inboxSeed : inboxSeed.filter((item) => item.type === tab);

  return (
    <>
      <SectionHeader section="inbox" action="کار جدید" onAction={() => showToast("کار جدید به‌صورت پیش‌نویس ایجاد شد.")} />
      <div className="portal-metrics portal-metrics-3">
        <Metric icon="!" label="رسیدگی فوری" value={faNumber(3)} detail="یک مورد نزدیک SLA" tone="coral" />
        <Metric icon="◫" label="بررسی‌های جدید" value={faNumber(12)} detail="میانگین انتظار ۱۸ دقیقه" />
        <Metric icon="◷" label="کارهای امروز" value={faNumber("۷ / ۱۹")} detail="۳۷٪ تکمیل‌شده" tone="gold" />
      </div>
      <section className="portal-split inbox-workspace">
        <article className="portal-card inbox-list-card">
          <div className="portal-card-head stacked-head">
            <div><h2>ورودی‌های امروز</h2><p>مرتب‌شده بر اساس فوریت و زمان دریافت</p></div>
            <div className="compact-tabs">
              {[["all", "همه"], ["emergency", "فوری"], ["review", "اسکن"], ["message", "پیام"]].map(([value, label]) => (
                <button type="button" key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="inbox-items">
            {visible.map((item, index) => (
              <button type="button" className={`inbox-item ${selected.id === item.id ? "selected" : ""} ${done.includes(item.id) ? "resolved" : ""}`} key={item.id} onClick={() => setSelected(item)}>
                <span className={`inbox-kind kind-${item.tone}`}>{done.includes(item.id) ? "✓" : item.icon}</span>
                <span className="inbox-item-copy"><strong>{item.title}</strong><b>{item.patient}</b><small>{item.meta}</small></span>
                <Pill tone={done.includes(item.id) ? "grey" : item.tone}>{done.includes(item.id) ? "انجام شد" : item.label}</Pill>
                {index === 0 && !done.includes(item.id) && <i className="unread-mark" />}
              </button>
            ))}
            {visible.length === 0 && <EmptyState title="ورودی‌ای در این دسته نیست" copy="با دریافت مورد جدید، این بخش خودکار به‌روز می‌شود." />}
          </div>
        </article>
        <article className="portal-card inbox-detail-card">
          <div className="detail-topline"><Pill tone={selected.tone}>{selected.label}</Pill><span>{selected.meta}</span></div>
          <div className="detail-person"><DemoAvatar initials={selected.patient.split(" ").map((word) => word[0]).join("")} /><div><h2>{selected.patient}</h2><p>بیمار فعال · کلینیک تهران</p></div><button type="button" onClick={() => showToast("پرونده بیمار در نمای امن باز شد.")}>مشاهده پرونده ←</button></div>
          <div className={`inbox-clinical-box clinical-${selected.tone}`}><span>{selected.icon}</span><div><strong>{selected.title}</strong><p>{selected.copy}</p></div></div>
          <div className="detail-timeline"><h3>زمینه مرتبط</h3><div><i /> <span><strong>رویداد جاری</strong><small>{selected.copy}</small></span></div><div><i /> <span><strong>آخرین اسکن امضاشده</strong><small>۲۱ مرداد ۱۴۰۵ · بدون دستور اقدام فوری</small></span></div><div><i /> <span><strong>پروتکل فعال</strong><small>پایش استاندارد · اقدامات بالینی خودکار خاموش</small></span></div></div>
          <div className="safety-inline"><span>i</span><p>این مورد با AI بسته نمی‌شود. تأیید یا ارجاع باید توسط کاربر مجاز انجام شود.</p></div>
          <div className="detail-actions"><button type="button" className="secondary-button" onClick={() => showToast("مورد به دکتر پارسا ارجاع شد.")}>ارجاع</button><button type="button" className="primary-button" disabled={done.includes(selected.id)} onClick={() => { setDone((items) => [...items, selected.id]); showToast("اقدام ثبت و رویداد ممیزی ایجاد شد."); }}>{done.includes(selected.id) ? "ثبت‌شده" : "تأیید و شروع رسیدگی"}</button></div>
        </article>
      </section>
    </>
  );
}

const reviewSeed = [
  { id: 1, initials: "س‌م", name: "سارا محمدی", code: "DM-1048", treatment: "الاینر · مرحله ۱۴", received: "۱۲ دقیقه", priority: "فوری", finding: "احتمال فاصله الاینر در دندان ۱۳", quality: "۹۲٪", tone: "red" as const },
  { id: 2, initials: "ا‌ر", name: "امیررضا رضایی", code: "DM-1082", treatment: "براکت · ماه ۸", received: "۲۶ دقیقه", priority: "فوری", finding: "گزارش جداشدن براکت؛ بررسی تصویر", quality: "۸۶٪", tone: "red" as const },
  { id: 3, initials: "ن‌ک", name: "نیلوفر کریمی", code: "DM-1019", treatment: "الاینر · مرحله ۷", received: "۴۱ دقیقه", priority: "توجه", finding: "تغییر طولی نیازمند مقایسه", quality: "۹۵٪", tone: "gold" as const },
  { id: 4, initials: "م‌ف", name: "محمد فرهادی", code: "DM-1104", treatment: "نگهدارنده · ماه ۳", received: "۱ ساعت", priority: "عادی", finding: "نمای باکال راست ناکافی", quality: "۴۱٪", tone: "grey" as const },
  { id: 5, initials: "ه‌ص", name: "هانیه صادقی", code: "DM-1063", treatment: "الاینر · مرحله ۲۱", received: "۲ ساعت", priority: "عادی", finding: "نیازمند تأیید انسانی", quality: "۹۰٪", tone: "teal" as const },
];

function ReviewSection({ showToast }: { showToast: ToastFn }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [decision, setDecision] = useState("accept");
  const [signed, setSigned] = useState<number[]>([]);
  const filtered = reviewSeed.filter((item) => `${item.name} ${item.code} ${item.finding}`.includes(query));
  const selected = reviewSeed.find((item) => item.id === selectedId);

  return (
    <>
      <SectionHeader section="reviews" action="شروع مورد بعدی" onAction={() => setSelectedId(reviewSeed.find((item) => !signed.includes(item.id))?.id ?? 1)} />
      <div className="portal-metrics portal-metrics-4">
        <Metric icon="◫" label="در انتظار" value={faNumber(12)} detail="۳ مورد فوری" />
        <Metric icon="◷" label="میانگین انتظار" value={faNumber("۱۸ دقیقه")} detail="هدف: کمتر از ۳۰" tone="gold" />
        <Metric icon="✓" label="امضاشده امروز" value={faNumber(23)} detail="بدون تعارض نسخه" tone="teal" />
        <Metric icon="!" label="خودداری مدل" value={faNumber(2)} detail="کیفیت یا OOD" tone="violet" />
      </div>
      <section className="portal-card review-queue-card">
        <div className="portal-card-head queue-tools"><div><h2>صف بازبینی</h2><p>قفل بررسی کوتاه‌مدت و نسخه خوش‌بینانه در نسخه متصل فعال می‌شود.</p></div><label className="section-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="نام، کد یا یافته..." /></label><button type="button" className="filter-button">☷ فیلترها</button></div>
        <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>بیمار</th><th>درمان</th><th>پیشنهاد بررسی</th><th>کیفیت</th><th>اولویت</th><th>زمان انتظار</th><th /></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.id} className={signed.includes(item.id) ? "is-complete" : ""}><td><div className="portal-person"><DemoAvatar initials={item.initials} index={index} /><span><strong>{item.name}</strong><small>{item.code}</small></span></div></td><td><strong>{item.treatment}</strong><small>اسکن دوره‌ای</small></td><td><strong className="wrap-copy">{item.finding}</strong><small>مدل mock · shadow</small></td><td><span className="quality-meter"><i style={{ width: item.quality }} />{faNumber(item.quality)}</span></td><td><Pill tone={item.tone}>{item.priority}</Pill></td><td>{faNumber(item.received)}</td><td><button className="table-action" type="button" onClick={() => setSelectedId(item.id)}>{signed.includes(item.id) ? "مشاهده" : "بررسی"} ←</button></td></tr>)}</tbody></table></div>
      </section>
      {selected && <Modal title={`بررسی اسکن · ${selected.name}`} subtitle={`${selected.code} · ${selected.treatment}`} onClose={() => setSelectedId(null)} wide>
        <div className="review-modal-grid">
          <section className="comparison-viewer">
            <div className="viewer-tabs"><button className="active" type="button">فعلی</button><button type="button">قبلی</button><button type="button">مقایسه</button><button type="button">هم‌پوشانی</button></div>
            <SyntheticScan />
            <div className="viewer-footer"><span>نمای روبه‌رو · کیفیت {faNumber(selected.quality)}</span><span>اصل تصویر بدون تغییر نگهداری می‌شود</span></div>
          </section>
          <section className="review-form-panel">
            <div className="mock-banner"><span>AI</span><p><strong>پیشنهاد سامانه · تشخیص نیست</strong>DM-MOCK-QUALITY v0.1 · عدم قطعیت متوسط</p></div>
            <div className="finding-review"><small>یافته پیشنهادی</small><h3>{selected.finding}</h3><p>شاهد ۱ · نمای فعلی · ناحیه علامت‌گذاری‌شده</p></div>
            <div className="decision-options">{[["accept", "✓", "تأیید"], ["edit", "✎", "ویرایش"], ["reject", "×", "رد"], ["inconclusive", "?", "نامشخص"]].map(([value, icon, label]) => <button key={value} type="button" className={decision === value ? "active" : ""} onClick={() => setDecision(value)}><span>{icon}</span>{label}</button>)}</div>
            <label className="portal-field"><span>دلیل / یادداشت بالینی</span><textarea placeholder="یادداشت یا دلیل تصمیم را ثبت کنید..." /></label>
            <div className="signing-note"><span>⌁</span><p>ثبت نهایی نیازمند امضای کاربر مجاز است و نتیجه جدید جایگزین خروجی تاریخی مدل نمی‌شود.</p></div>
            <button type="button" className="primary-button full-button" onClick={() => { setSigned((items) => [...new Set([...items, selected.id])]); setSelectedId(null); showToast("تصمیم امضا و به‌صورت append-only ثبت شد."); }}>امضا و ثبت تصمیم</button>
          </section>
        </div>
      </Modal>}
    </>
  );
}

type Patient = { id: number; initials: string; name: string; code: string; doctor: string; treatment: string; stage: string; nextScan: string; state: string; risk: "red" | "gold" | "teal" | "grey" };
const initialPatients: Patient[] = [
  { id: 1, initials: "س‌م", name: "سارا محمدی", code: "DM-1048", doctor: "دکتر نادری", treatment: "الاینر شفاف", stage: "مرحله ۱۴ از ۲۸", nextScan: "امروز", state: "نیازمند بررسی", risk: "red" },
  { id: 2, initials: "ن‌ک", name: "نیلوفر کریمی", code: "DM-1019", doctor: "دکتر نادری", treatment: "الاینر شفاف", stage: "مرحله ۷ از ۲۰", nextScan: "۳ روز دیگر", state: "در مسیر درمان", risk: "teal" },
  { id: 3, initials: "ا‌ر", name: "امیررضا رضایی", code: "DM-1082", doctor: "دکتر پارسا", treatment: "براکت ثابت", stage: "ماه ۸", nextScan: "عقب‌افتاده", state: "نیازمند مداخله", risk: "red" },
  { id: 4, initials: "م‌ف", name: "محمد فرهادی", code: "DM-1104", doctor: "دکتر احمدی", treatment: "نگهدارنده", stage: "ماه ۳", nextScan: "۷ روز دیگر", state: "داده ناکافی", risk: "grey" },
  { id: 5, initials: "ه‌ص", name: "هانیه صادقی", code: "DM-1063", doctor: "دکتر نادری", treatment: "الاینر شفاف", stage: "مرحله ۲۱ از ۲۴", nextScan: "۲ روز دیگر", state: "در مسیر درمان", risk: "teal" },
  { id: 6, initials: "ک‌م", name: "کیان مرادی", code: "DM-1091", doctor: "دکتر پارسا", treatment: "براکت ثابت", stage: "ماه ۴", nextScan: "فردا", state: "انحراف خفیف", risk: "gold" },
];

function PatientsSection({ showToast }: { showToast: ToastFn }) {
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState("");
  const [treatment, setTreatment] = useState("all");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [adding, setAdding] = useState(false);
  const visible = patients.filter((patient) => `${patient.name} ${patient.code} ${patient.doctor}`.includes(query) && (treatment === "all" || patient.treatment === treatment));

  const addPatient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "بیمار نمونه");
    const nextId = Math.max(...patients.map((item) => item.id)) + 1;
    setPatients((items) => [{ id: nextId, initials: name.slice(0, 2), name, code: `DM-${1100 + nextId}`, doctor: "دکتر نادری", treatment: String(data.get("treatment")), stage: "شروع درمان", nextScan: "زمان‌بندی نشده", state: "در انتظار دعوت", risk: "grey" }, ...items]);
    setAdding(false);
    showToast("بیمار ساختگی ایجاد و دعوت در حالت پیش‌نویس ذخیره شد.");
  };

  return (
    <>
      <SectionHeader section="patients" action="بیمار جدید" onAction={() => setAdding(true)} />
      <div className="portal-metrics portal-metrics-4"><Metric icon="◎" label="بیماران فعال" value={faNumber(284)} detail="۱۲ پرونده جدید این ماه" /><Metric icon="◫" label="اسکن سر موعد" value={faNumber("۹۱٪")} detail="۲٪ بهتر از ماه قبل" tone="teal" /><Metric icon="◷" label="عقب‌افتاده" value={faNumber(8)} detail="نیازمند پیگیری" tone="gold" /><Metric icon="!" label="نیازمند مداخله" value={faNumber(3)} detail="بر اساس تصمیم پزشک" tone="coral" /></div>
      <section className="portal-card patient-directory">
        <div className="portal-card-head directory-tools"><div><h2>فهرست بیماران</h2><p>{faNumber(patients.length)} پرونده ساختگی در محدوده کلینیک فعال</p></div><label className="section-search wide-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="نام، کد پرونده یا پزشک..." /></label><select value={treatment} onChange={(event) => setTreatment(event.target.value)} aria-label="نوع درمان"><option value="all">همه درمان‌ها</option><option>الاینر شفاف</option><option>براکت ثابت</option><option>نگهدارنده</option></select><button className="filter-button" type="button" onClick={() => showToast("خروجی CSV در نسخه متصل نیازمند مجوز و ممیزی است.")}>↓ خروجی</button></div>
        <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>بیمار</th><th>پزشک</th><th>درمان</th><th>مرحله فعلی</th><th>اسکن بعدی</th><th>وضعیت</th><th /></tr></thead><tbody>{visible.map((patient, index) => <tr key={patient.id}><td><div className="portal-person"><DemoAvatar initials={patient.initials} index={index} /><span><strong>{patient.name}</strong><small>{patient.code}</small></span></div></td><td>{patient.doctor}</td><td><strong>{patient.treatment}</strong><small>فعال</small></td><td>{patient.stage}</td><td><strong>{patient.nextScan}</strong></td><td><Pill tone={patient.risk}>{patient.state}</Pill></td><td><button className="table-action" type="button" onClick={() => setSelected(patient)}>مشاهده ←</button></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="بیماری پیدا نشد" copy="جست‌وجو یا فیلتر درمان را تغییر دهید." />}</div>
      </section>
      {selected && <Modal title={selected.name} subtitle={`${selected.code} · ${selected.treatment}`} onClose={() => setSelected(null)}><div className="patient-overview"><div className="patient-state-card"><Pill tone={selected.risk}>{selected.state}</Pill><h3>{selected.stage}</h3><p>پزشک اصلی: {selected.doctor}</p><div className="stage-progress"><i /></div><small>رویداد بعدی: {selected.nextScan}</small></div><div className="mini-stat-grid"><span><small>اسکن‌ها</small><strong>{faNumber(9)}</strong></span><span><small>پایبندی</small><strong>{faNumber("۸۸٪")}</strong></span><span><small>پیام باز</small><strong>{faNumber(1)}</strong></span></div><div className="detail-timeline"><h3>خط زمانی اخیر</h3><div><i /><span><strong>اسکن دریافت شد</strong><small>۲۱ مرداد · ۵ نمای کامل</small></span></div><div><i /><span><strong>تصمیم پزشک امضا شد</strong><small>۱۴ مرداد · ادامه مرحله فعلی</small></span></div><div><i /><span><strong>پیام بیمار خوانده شد</strong><small>۱۲ مرداد · تأیید دریافت</small></span></div></div><button className="primary-button full-button" type="button" onClick={() => showToast("نمای کامل پرونده در برش درمان و اسکن توسعه می‌یابد.")}>باز کردن پرونده کامل</button></div></Modal>}
      {adding && <Modal title="ایجاد بیمار ساختگی" subtitle="این فرم در نسخه متصل با تطبیق هویت و جلوگیری از تکرار تکمیل می‌شود." onClose={() => setAdding(false)}><form className="portal-form" onSubmit={addPatient}><label className="portal-field"><span>نام و نام خانوادگی</span><input name="name" required placeholder="مثلاً آرمان اکبری" /></label><div className="field-row"><label className="portal-field"><span>نوع درمان</span><select name="treatment"><option>الاینر شفاف</option><option>براکت ثابت</option><option>نگهدارنده</option><option>مشاهده</option></select></label><label className="portal-field"><span>پزشک اصلی</span><select><option>دکتر نادری</option><option>دکتر پارسا</option><option>دکتر احمدی</option></select></label></div><label className="portal-field"><span>شماره همراه نمونه</span><input dir="ltr" placeholder="+989000000000" /></label><div className="safety-inline"><span>i</span><p>دعوت واقعی ارسال نمی‌شود. شماره و اطلاعات این فرم فقط در حافظه همین پیش‌نمایش باقی می‌ماند.</p></div><button className="primary-button full-button" type="submit">ایجاد پیش‌نویس بیمار</button></form></Modal>}
    </>
  );
}

const conversations = [
  { id: 1, initials: "ن‌ک", name: "نیلوفر کریمی", preview: "آیا زمان تعویض الاینر تغییر کرده؟", time: "۱۰:۴۲", unread: 2, treatment: "الاینر · مرحله ۷" },
  { id: 2, initials: "ا‌ر", name: "امیررضا رضایی", preview: "تصویر براکت را ارسال کردم.", time: "۱۰:۲۱", unread: 1, treatment: "براکت · ماه ۸" },
  { id: 3, initials: "ه‌ص", name: "هانیه صادقی", preview: "ممنون از راهنمایی شما.", time: "دیروز", unread: 0, treatment: "الاینر · مرحله ۲۱" },
  { id: 4, initials: "ر‌د", name: "رها داوودی", preview: "برای نوبت آنلاین هماهنگ شد.", time: "دیروز", unread: 0, treatment: "مشاهده" },
];

type ChatMessage = { id: number; own: boolean; text: string; time: string; signed?: boolean };
const initialChat: Record<number, ChatMessage[]> = {
  1: [{ id: 1, own: false, text: "سلام دکتر. امروز باید الاینر را عوض کنم یا تا زمان بررسی اسکن صبر کنم؟", time: "۱۰:۳۹" }, { id: 2, own: true, text: "سلام نیلوفر جان. اسکن شما دریافت شده و در حال بررسی است. نتیجه پس از تأیید پزشک در همین‌جا ارسال می‌شود.", time: "۱۰:۴۰", signed: true }, { id: 3, own: false, text: "ممنون، پس فعلاً همان مرحله قبلی را ادامه می‌دهم.", time: "۱۰:۴۲" }],
  2: [{ id: 1, own: false, text: "سلام، براکت سمت راست کمی لق شده و درد دارم.", time: "۱۰:۱۸" }, { id: 2, own: true, text: "گزارش شما با اولویت بالا ثبت شد. اگر خونریزی شدید، مشکل تنفسی یا آسیب جدی دارید فوراً با خدمات اورژانسی محلی تماس بگیرید.", time: "۱۰:۲۰", signed: true }],
  3: [{ id: 1, own: true, text: "دستور مرحله بعد امضا و در برنامه شما ثبت شد.", time: "دیروز", signed: true }],
  4: [{ id: 1, own: true, text: "نوبت ویدئویی برای دوشنبه ساعت ۱۵:۱۵ ثبت شد.", time: "دیروز", signed: true }],
};

function MessagesSection({ showToast }: { showToast: ToastFn }) {
  const [selectedId, setSelectedId] = useState(1);
  const [chats, setChats] = useState(initialChat);
  const [draft, setDraft] = useState("");
  const selected = conversations.find((item) => item.id === selectedId) ?? conversations[0];
  const send = () => { if (!draft.trim()) return; setChats((items) => ({ ...items, [selectedId]: [...(items[selectedId] ?? []), { id: Date.now(), own: true, text: draft.trim(), time: "اکنون" }] })); setDraft(""); showToast("پیام نمایشی در گفتگو ثبت شد."); };

  return (
    <>
      <SectionHeader section="messages" action="گفتگوی جدید" onAction={() => showToast("فقط بیماران مجاز و مرتبط قابل انتخاب خواهند بود.")} />
      <section className="portal-card messaging-workspace">
        <aside className="conversation-list"><div className="conversation-head"><h2>گفتگوها</h2><button type="button">⌕</button></div><div className="message-filters"><button className="active" type="button">همه</button><button type="button">خوانده‌نشده</button><button type="button">نیازمند پاسخ</button></div>{conversations.map((conversation, index) => <button className={`conversation-item ${selectedId === conversation.id ? "active" : ""}`} type="button" key={conversation.id} onClick={() => setSelectedId(conversation.id)}><DemoAvatar initials={conversation.initials} index={index} /><span><strong>{conversation.name}</strong><small>{conversation.preview}</small></span><time>{conversation.time}</time>{conversation.unread > 0 && <b>{faNumber(conversation.unread)}</b>}</button>)}</aside>
        <section className="chat-panel"><header className="chat-header"><DemoAvatar initials={selected.initials} /><div><h2>{selected.name}</h2><p>{selected.treatment} · پاسخ معمولاً کمتر از ۲ ساعت</p></div><button type="button" onClick={() => showToast("پرونده مرتبط باز شد.")}>پرونده بیمار ←</button></header><div className="chat-safety"><span>●</span> اعلان بیرون از برنامه فقط می‌گوید «پیام جدیدی از کلینیک دارید» و جزئیات درمان را نمایش نمی‌دهد.</div><div className="chat-messages"><div className="chat-date">امروز، ۲۱ مرداد</div>{(chats[selectedId] ?? []).map((message) => <div className={`chat-bubble ${message.own ? "own" : "patient"}`} key={message.id}><p>{message.text}</p><small>{message.time} {message.signed && <b>✓ پیام تأییدشده</b>}</small></div>)}</div><div className="template-row"><button type="button" onClick={() => setDraft("اسکن شما دریافت شد و پس از بررسی پزشک نتیجه اعلام می‌شود.")}>دریافت اسکن</button><button type="button" onClick={() => setDraft("لطفاً یک اسکن مجدد طبق راهنمای داخل برنامه ثبت کنید.")}>درخواست اسکن مجدد</button><button type="button" onClick={() => setDraft("برای بررسی بیشتر، پیشنهاد نوبت حضوری ثبت شده است.")}>پیشنهاد نوبت</button></div><div className="composer"><button type="button" aria-label="افزودن پیوست" onClick={() => showToast("بارگذاری فایل در برش رسانه با بررسی نوع و بدافزار فعال می‌شود.")}>＋</button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="پیام امن بنویسید..." onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} /><button className="send-button" type="button" onClick={send}>ارسال ←</button></div></section>
        <aside className="chat-context"><div className="context-person"><DemoAvatar initials={selected.initials} /><h3>{selected.name}</h3><p>{selected.treatment}</p></div><div className="context-block"><small>وضعیت درمان</small><strong>در مسیر درمان</strong><div className="stage-progress"><i style={{ width: "68%" }} /></div></div><div className="context-block"><small>اسکن بعدی</small><strong>۳ روز دیگر</strong><p>پروتکل الاینر استاندارد</p></div><div className="context-block"><small>تیم مراقبت</small><strong>دکتر مریم نادری</strong><p>دستیار: سارا رستمی</p></div><button type="button" onClick={() => showToast("مکالمه در سابقه بالینی پیوند داده شد.")}>پیوند به یادداشت بالینی</button></aside>
      </section>
    </>
  );
}

const appointmentRequests = [
  { id: 1, initials: "ر‌د", name: "رها داوودی", type: "درخواست جابه‌جایی", requested: "دوشنبه · ۱۵:۱۵", tone: "gold" as const },
  { id: 2, initials: "ا‌ر", name: "امیررضا رضایی", type: "ویزیت براکت فوری", requested: "امروز · نزدیک‌ترین زمان", tone: "red" as const },
  { id: 3, initials: "م‌ف", name: "محمد فرهادی", type: "اسکن مجدد", requested: "شنبه · ۱۰:۰۰", tone: "teal" as const },
];
const dayAppointments = [
  { time: "۰۸:۳۰", duration: "۳۰ د", name: "محمد امینی", type: "تعویض سیم", chair: "صندلی ۱", color: "teal" },
  { time: "۱۰:۰۰", duration: "۴۵ د", name: "الهام خسروی", type: "ویزیت دوره‌ای", chair: "صندلی ۲", color: "violet" },
  { time: "۱۲:۰۰", duration: "۳۰ د", name: "کیان مرادی", type: "بررسی براکت", chair: "فوری", color: "coral" },
  { time: "۱۵:۱۵", duration: "۲۰ د", name: "رها داوودی", type: "مشاوره آنلاین", chair: "ویدئویی", color: "gold" },
];

function AppointmentsSection({ showToast }: { showToast: ToastFn }) {
  const [day, setDay] = useState(2);
  const [handled, setHandled] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);
  return (
    <>
      <SectionHeader section="appointments" action="نوبت جدید" onAction={() => setAdding(true)} />
      <div className="portal-metrics portal-metrics-4"><Metric icon="□" label="نوبت امروز" value={faNumber(14)} detail="۲ جای خالی" /><Metric icon="⌁" label="درخواست جدید" value={faNumber(3)} detail="یک مورد فوری" tone="coral" /><Metric icon="◷" label="میانگین انتظار" value={faNumber("۹ دقیقه")} detail="در محدوده هدف" tone="teal" /><Metric icon="◌" label="ویزیت آنلاین" value={faNumber(2)} detail="در انتظار تأیید" tone="violet" /></div>
      <section className="calendar-layout">
        <article className="portal-card schedule-card"><div className="portal-card-head calendar-head"><div><h2>برنامه هفته</h2><p>۲۱ تا ۲۷ مرداد ۱۴۰۵</p></div><div><button type="button">امروز</button><button type="button">→</button><button type="button">←</button></div></div><div className="week-strip">{[["ش", "۱۸"], ["ی", "۱۹"], ["د", "۲۰"], ["س", "۲۱"], ["چ", "۲۲"], ["پ", "۲۳"], ["ج", "۲۴"]].map(([label, date], index) => <button type="button" key={date} className={day === index ? "active" : ""} onClick={() => setDay(index)}><small>{label}</small><strong>{faNumber(date)}</strong>{index === 3 && <i />}</button>)}</div><div className="day-schedule"><div className="schedule-now"><span>{day === 3 ? "اکنون · ۱۱:۲۰" : `روز انتخاب‌شده: ${faNumber(day + 18)} مرداد`}</span></div>{dayAppointments.map((item) => <button type="button" className="schedule-item" key={item.time} onClick={() => showToast(`جزئیات نوبت ${item.name} باز شد.`)}><time><strong>{item.time}</strong><small>{item.duration}</small></time><span className={`schedule-line ${item.color}`} /><span className={`schedule-block ${item.color}`}><strong>{item.name}</strong><small>{item.type}</small></span><Pill tone={item.color === "coral" ? "red" : item.color === "gold" ? "gold" : item.color === "violet" ? "violet" : "teal"}>{item.chair}</Pill></button>)}</div></article>
        <aside className="portal-card requests-card"><div className="portal-card-head"><div><h2>درخواست‌ها</h2><p>نیازمند تأیید یا پیشنهاد زمان</p></div><Pill tone="red">{faNumber(3)} جدید</Pill></div><div className="request-items">{appointmentRequests.map((request, index) => <div className={`request-item ${handled.includes(request.id) ? "handled" : ""}`} key={request.id}><DemoAvatar initials={request.initials} index={index} /><div><strong>{request.name}</strong><p>{request.type}</p><small>{request.requested}</small></div>{handled.includes(request.id) ? <Pill tone="teal">تأیید شد</Pill> : <div className="request-actions"><button type="button" onClick={() => { setHandled((items) => [...items, request.id]); showToast("درخواست تأیید و اعلان امن زمان‌بندی شد."); }}>✓</button><button type="button" onClick={() => showToast("فرم پیشنهاد زمان جایگزین باز شد.")}>✎</button></div>}</div>)}</div><div className="availability-card"><span>◷</span><div><strong>ظرفیت باقی‌مانده امروز</strong><p>۲ بازه ۳۰ دقیقه‌ای · صندلی ۲</p></div><button type="button">مشاهده</button></div></aside>
      </section>
      {adding && <Modal title="ثبت نوبت ساختگی" subtitle="تعارض منابع و محدوده دسترسی در نسخه متصل بررسی می‌شود." onClose={() => setAdding(false)}><form className="portal-form" onSubmit={(event) => { event.preventDefault(); setAdding(false); showToast("نوبت ساختگی ثبت شد."); }}><label className="portal-field"><span>بیمار</span><input required placeholder="جست‌وجوی بیمار مجاز..." /></label><div className="field-row"><label className="portal-field"><span>نوع نوبت</span><select><option>ویزیت دوره‌ای</option><option>فوری</option><option>تعویض سیم</option><option>اسکن مجدد</option><option>مشاوره</option></select></label><label className="portal-field"><span>منبع</span><select><option>صندلی ۱</option><option>صندلی ۲</option><option>ویدئویی</option></select></label></div><div className="field-row"><label className="portal-field"><span>تاریخ شمسی</span><input value="۱۴۰۵/۰۵/۲۳" readOnly /></label><label className="portal-field"><span>زمان</span><input type="time" defaultValue="10:00" /></label></div><button className="primary-button full-button" type="submit">بررسی تعارض و ثبت</button></form></Modal>}
    </>
  );
}

const protocols = [
  { id: 1, title: "الاینر استاندارد", version: "نسخه ۴", status: "فعال", tone: "teal" as const, patients: 126, rules: 9, changed: "۱۴ مرداد ۱۴۰۵", owner: "دکتر نادری" },
  { id: 2, title: "براکت ثابت", version: "نسخه ۲", status: "در حال بازبینی", tone: "gold" as const, patients: 74, rules: 7, changed: "۱۹ مرداد ۱۴۰۵", owner: "دکتر پارسا" },
  { id: 3, title: "نگهدارنده", version: "نسخه ۳", status: "فعال", tone: "teal" as const, patients: 52, rules: 5, changed: "۲ مرداد ۱۴۰۵", owner: "دکتر احمدی" },
  { id: 4, title: "مشاهده پیش از درمان", version: "پیش‌نویس", status: "پیش‌نویس", tone: "grey" as const, patients: 0, rules: 4, changed: "امروز", owner: "دکتر نادری" },
];

function ProtocolsSection({ showToast }: { showToast: ToastFn }) {
  const [simulation, setSimulation] = useState<(typeof protocols)[number] | null>(null);
  const [clinicalAutomation, setClinicalAutomation] = useState(false);
  return (
    <>
      <SectionHeader section="protocols" action="پروتکل جدید" onAction={() => showToast("پروتکل جدید در حالت پیش‌نویس و بدون اثر بالینی ایجاد شد.")} />
      <div className="protocol-safety-bar"><span className="kill-icon">⊘</span><div><strong>اقدامات بالینی خودکار غیرفعال است</strong><p>پیشنهادها فقط به صف پزشک می‌روند. کلید سراسری و حداقل‌های ایمنی قابل دور زدن نیستند.</p></div><label className="safe-switch"><input type="checkbox" checked={clinicalAutomation} onChange={(event) => { setClinicalAutomation(event.target.checked); if (event.target.checked) window.setTimeout(() => setClinicalAutomation(false), 400); showToast("فعال‌سازی در این محیط مجاز نیست؛ نیازمند شواهد، تأیید و سیاست کلینیک است."); }} /><span /><b>{clinicalAutomation ? "درخواست فعال‌سازی" : "خاموش"}</b></label></div>
      <div className="portal-metrics portal-metrics-4"><Metric icon="◇" label="پروتکل فعال" value={faNumber(3)} detail="۲۵۲ بیمار واجد شرایط" /><Metric icon="⌁" label="ارزیابی امروز" value={faNumber("۱٬۸۴۲")} detail="بدون اجرای تکراری" tone="teal" /><Metric icon="◫" label="منتظر تأیید" value={faNumber(1)} detail="maker-checker" tone="gold" /><Metric icon="⊘" label="اقدام سرکوب‌شده" value={faNumber(6)} detail="ایمنی، رضایت یا cooldown" tone="coral" /></div>
      <div className="protocol-grid">{protocols.map((protocol) => <article className="portal-card protocol-card" key={protocol.id}><header><div className="protocol-icon">◇</div><Pill tone={protocol.tone}>{protocol.status}</Pill><button type="button">•••</button></header><h2>{protocol.title}</h2><p>{protocol.version} · مالک: {protocol.owner}</p><div className="protocol-stats"><span><small>بیمار</small><strong>{faNumber(protocol.patients)}</strong></span><span><small>قانون</small><strong>{faNumber(protocol.rules)}</strong></span><span><small>آخرین تغییر</small><strong>{protocol.changed}</strong></span></div><div className="rule-preview"><div><i>اگر</i><span>اسکن عقب‌افتاده بیش از ۳ روز</span></div><div><i>و</i><span>رضایت اعلان فعال باشد</span></div><div><i>آنگاه</i><span>کار پیگیری برای تیم ایجاد کن</span></div></div><footer><button type="button" onClick={() => setSimulation(protocol)}>شبیه‌سازی</button><button type="button" onClick={() => showToast(`ویرایش ${protocol.title} به‌صورت نسخه جدید باز شد.`)}>مشاهده و ویرایش ←</button></footer></article>)}</div>
      <section className="portal-card protocol-log"><div className="portal-card-head"><div><h2>آخرین اجرای قوانین</h2><p>تمام نتایج idempotent و قابل ممیزی‌اند</p></div><button type="button">مشاهده گزارش کامل ←</button></div><div className="protocol-log-row"><span className="status-dot success" /><strong>پروتکل الاینر استاندارد</strong><span>اسکن عقب‌افتاده · ۱۲ بیمار بررسی شد</span><Pill tone="teal">۲ کار ایجاد شد</Pill><time>۶ دقیقه پیش</time></div><div className="protocol-log-row"><span className="status-dot suppressed" /><strong>پروتکل براکت ثابت</strong><span>پیشنهاد پیام بالینی</span><Pill tone="gold">سرکوب: تأیید مدل</Pill><time>۲۱ دقیقه پیش</time></div></section>
      {simulation && <Modal title={`شبیه‌سازی · ${simulation.title}`} subtitle="نتیجه روی ۱۰۰ پرونده کاملاً ساختگی و تاریخی اجرا می‌شود." onClose={() => setSimulation(null)}><div className="simulation-summary"><span><small>پرونده بررسی‌شده</small><strong>{faNumber(100)}</strong></span><span><small>شرط برقرار</small><strong>{faNumber(18)}</strong></span><span><small>اقدام مجاز</small><strong>{faNumber(11)}</strong></span><span><small>سرکوب ایمنی</small><strong>{faNumber(7)}</strong></span></div><div className="simulation-steps"><div className="pass"><span>✓</span><p><strong>اعتبار ساختار قوانین</strong>همه شرط‌ها و اقدام‌ها نوع معتبر دارند.</p></div><div className="pass"><span>✓</span><p><strong>بررسی اجرای تکراری</strong>هیچ پیام یا کاری دوبار ایجاد نشد.</p></div><div className="warn"><span>!</span><p><strong>هشدار گروه کم‌نمونه</strong>شواهد برای گروه زیر ۱۶ سال کافی نیست.</p></div><div className="blocked"><span>⊘</span><p><strong>اقدام بالینی بیمارمحور</strong>به‌دلیل خاموش بودن گیت اعتبارسنجی اجرا نشد.</p></div></div><div className="detail-actions"><button className="secondary-button" type="button" onClick={() => setSimulation(null)}>بستن</button><button className="primary-button" type="button" onClick={() => showToast("گزارش شبیه‌سازی برای بازبین دوم ارسال شد.")}>ارسال برای تأیید</button></div></Modal>}
    </>
  );
}

function AnalyticsSection({ showToast }: { showToast: ToastFn }) {
  const [period, setPeriod] = useState("30");
  const bars = [48, 62, 55, 74, 68, 81, 72, 88, 79, 92, 84, 96];
  return (
    <>
      <SectionHeader section="analytics" action="گزارش سفارشی" onAction={() => showToast("گزارش سفارشی با تعاریف نسخه‌بندی‌شده ایجاد می‌شود.")} />
      <div className="analytics-toolbar"><div className="compact-tabs">{[["7", "۷ روز"], ["30", "۳۰ روز"], ["90", "۳ ماه"], ["365", "سال جاری"]].map(([value, label]) => <button type="button" key={value} className={period === value ? "active" : ""} onClick={() => setPeriod(value)}>{label}</button>)}</div><span>آخرین به‌روزرسانی: امروز، ۱۱:۲۰</span><button type="button" onClick={() => showToast("خروجی فقط با مجوز، هدف و ثبت ممیزی صادر می‌شود.")}>↓ خروجی گزارش</button></div>
      <div className="portal-metrics portal-metrics-4"><Metric icon="◎" label="بیمار فعال" value={faNumber(284)} detail="↑ ۶٫۲٪ نسبت به دوره قبل" /><Metric icon="◫" label="اسکن تکمیل‌شده" value={faNumber("۱٬۲۴۸")} detail="نرخ تکمیل ۹۱٪" tone="teal" /><Metric icon="◷" label="میانه زمان بررسی" value={faNumber("۱۸ دقیقه")} detail="۶ دقیقه بهبود" tone="gold" /><Metric icon="⌁" label="پاسخ در SLA" value={faNumber("۹۶٫۴٪")} detail="هدف ۹۵٪" tone="violet" /></div>
      <section className="analytics-grid"><article className="portal-card chart-card wide-chart"><div className="portal-card-head"><div><h2>حجم اسکن و زمان بررسی</h2><p>اسکن‌های دریافت‌شده و میانگین زمان بررسی در {faNumber(period)} روز</p></div><div className="chart-legend"><span><i className="teal" /> اسکن</span><span><i className="gold" /> زمان بررسی</span></div></div><div className="bar-chart"><div className="y-labels"><span>{faNumber(120)}</span><span>{faNumber(80)}</span><span>{faNumber(40)}</span><span>۰</span></div><div className="bars">{bars.map((height, index) => <div className="bar-column" key={index}><i style={{ height: `${height}%` }} /><b style={{ bottom: `${Math.max(15, height - 18)}%` }} /><small>{faNumber(index + 1)}</small></div>)}</div></div></article><article className="portal-card adherence-card"><div className="portal-card-head"><div><h2>پایبندی به اسکن</h2><p>تعریف متریک v2.1</p></div><button type="button">i</button></div><div className="large-donut"><div><strong>{faNumber("۹۱٪")}</strong><small>سر موعد</small></div></div><div className="adherence-legend"><p><i className="teal" />سر موعد <strong>{faNumber(258)}</strong></p><p><i className="gold" />با تأخیر <strong>{faNumber(18)}</strong></p><p><i className="grey" />از دست‌رفته <strong>{faNumber(8)}</strong></p></div></article><article className="portal-card clinical-states"><div className="portal-card-head"><div><h2>وضعیت‌های درمان</h2><p>فقط تصمیم‌های امضاشده پزشک</p></div><button type="button">مشاهده روند ←</button></div>{[["در مسیر درمان", 64, "teal"], ["انحراف خفیف", 19, "gold"], ["انحراف متوسط", 10, "orange"], ["نیازمند مداخله", 4, "coral"], ["داده ناکافی", 3, "grey"]].map(([label, value, color]) => <div className="state-bar" key={label}><span>{label}</span><div><i className={String(color)} style={{ width: `${value}%` }} /></div><strong>{faNumber(String(value))}٪</strong></div>)}</article><article className="portal-card response-card"><div className="portal-card-head"><div><h2>زمان پاسخ تیم</h2><p>توزیع بر اساس نوع کار، نه رتبه‌بندی افراد</p></div><Pill tone="teal">در هدف</Pill></div><div className="response-list"><div><span className="response-icon red">!</span><p><strong>گزارش فوری</strong><small>میانه ۷ دقیقه · هدف ۱۰</small></p><b>{faNumber("۹۸٪")}</b></div><div><span className="response-icon teal">◫</span><p><strong>بررسی اسکن</strong><small>میانه ۱۸ دقیقه · هدف ۳۰</small></p><b>{faNumber("۹۶٪")}</b></div><div><span className="response-icon violet">◌</span><p><strong>پیام بیمار</strong><small>میانه ۴۲ دقیقه · هدف ۱۲۰</small></p><b>{faNumber("۹۴٪")}</b></div></div></article></section>
      <section className="portal-card metric-definitions"><div className="portal-card-head"><div><h2>تعاریف و محدودیت‌های متریک</h2><p>هر شاخص نسخه، مالک و تاریخ اثر دارد.</p></div><button type="button">لایه معنایی ←</button></div><div className="definition-row"><strong>پایبندی به اسکن</strong><span>اسکن معتبر ارسال‌شده در بازه مجاز نسبت به کل اسکن‌های موعددار</span><Pill tone="teal">v2.1</Pill><time>از ۱ مرداد</time></div><div className="definition-row"><strong>در مسیر درمان</strong><span>آخرین وضعیت امضاشده پزشک؛ شامل پیشنهاد خام AI نیست</span><Pill tone="grey">v1.4</Pill><time>از ۱۵ تیر</time></div></section>
    </>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="portal-empty"><span>◇</span><strong>{title}</strong><p>{copy}</p></div>;
}

function SyntheticScan() {
  return <div className="synthetic-scan"><span>تصویر کاملاً ساختگی · غیر بالینی</span><div className="synthetic-mouth"><div>{Array.from({ length: 10 }).map((_, index) => <i key={`a-${index}`} />)}</div><div>{Array.from({ length: 10 }).map((_, index) => <i key={`b-${index}`} />)}</div><b>۱</b></div></div>;
}

function Modal({ title, subtitle, onClose, children, wide = false }: { title: string; subtitle: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="portal-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`portal-modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}><header><div><h2>{title}</h2><p>{subtitle}</p></div><button type="button" aria-label="بستن" onClick={onClose}>×</button></header><div className="portal-modal-body">{children}</div></section></div>;
}

export default function PortalSection({ section }: { section: PortalSectionName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [toast, setToast] = useState("");
  const meta = sectionMeta[section];

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const content = useMemo(() => {
    if (section === "inbox") return <InboxSection showToast={showToast} />;
    if (section === "reviews") return <ReviewSection showToast={showToast} />;
    if (section === "patients") return <PatientsSection showToast={showToast} />;
    if (section === "messages") return <MessagesSection showToast={showToast} />;
    if (section === "appointments") return <AppointmentsSection showToast={showToast} />;
    if (section === "protocols") return <ProtocolsSection showToast={showToast} />;
    return <AnalyticsSection showToast={showToast} />;
  // showToast intentionally closes over the current toast setter.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  return <main className="app-shell" dir="rtl"><a className="skip-link" href="#section-content">رفتن به محتوای اصلی</a><aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="ناوبری اصلی"><a className="brand portal-brand" href="/"><div className="brand-mark" aria-hidden="true"><span>د</span></div><div><strong>دنتامانیتور</strong><small>مراقبت پیوسته، تصمیم مطمئن</small></div></a><div className="clinic-switcher"><span className="clinic-avatar">آ</span><div><small>کلینیک فعال</small><strong>ارتودنسی آریا</strong></div><button type="button" aria-label="تغییر کلینیک">⌄</button></div><nav><p className="nav-label">فضای کاری</p>{navItems.map((item) => <a className={`nav-item ${item.section === section ? "active" : ""}`} href={item.href} key={item.label} onClick={() => setMenuOpen(false)}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>{item.count && <b>{item.count}</b>}</a>)}</nav><div className="sidebar-bottom"><button className="help-card" type="button" onClick={() => showToast("مرکز راهنما در نسخه عملیاتی به مستندات نقش‌محور متصل می‌شود.")}><span className="help-icon">؟</span><span><strong>نیاز به راهنمایی دارید؟</strong><small>مرکز راهنما و پشتیبانی</small></span><span>←</span></button><div className="demo-badge"><span>●</span> محیط نمایشی · داده کاملاً ساختگی</div></div></aside>{menuOpen && <button className="sidebar-backdrop" aria-label="بستن منو" onClick={() => setMenuOpen(false)} />}<section className="workspace"><header className="topbar"><div className="topbar-title"><button className="menu-button" type="button" aria-label="باز کردن منو" onClick={() => setMenuOpen(true)}>☰</button><span>دنتامانیتور</span><i>/</i><strong>{meta.title}</strong></div><div className="topbar-actions"><label className="global-search"><span aria-hidden="true">⌕</span><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="جست‌وجوی سراسری..." aria-label="جست‌وجوی سراسری" /><kbd>⌘ K</kbd></label><div className="notification-wrap"><button className="icon-button" type="button" aria-label="اعلان‌ها" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>♢<span className="notification-dot" /></button>{notificationsOpen && <div className="popover notification-popover"><div className="popover-head"><strong>اعلان‌ها</strong><button type="button" onClick={() => showToast("همه اعلان‌ها خوانده شد.")}>خواندن همه</button></div><div className="notification-item urgent"><span>!</span><div><strong>گزارش درد جدید</strong><small>امیررضا رضایی · ۶ دقیقه پیش</small></div></div><div className="notification-item"><span>✓</span><div><strong>پردازش اسکن کامل شد</strong><small>سارا محمدی · ۱۲ دقیقه پیش</small></div></div></div>}</div><div className="profile"><span className="profile-avatar">م‌ن</span><div><strong>دکتر مریم نادری</strong><small>متخصص ارتودنسی</small></div><button type="button" aria-label="منوی حساب">⌄</button></div></div></header><div className="portal-content" id="section-content">{globalSearch && <div className="global-search-note"><span>⌕</span><p>جست‌وجوی سراسری برای «{globalSearch}» در نسخه متصل فقط در محدوده مجاز کاربر اجرا می‌شود.</p><button type="button" onClick={() => setGlobalSearch("")}>×</button></div>}{content}</div></section>{toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}</main>;
}
