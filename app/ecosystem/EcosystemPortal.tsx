"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pagesBySurface, PortalPage, SurfaceId, surfaceIds, surfaceMeta } from "./config";

const fa = (value: string | number) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const metrics: Record<SurfaceId, [string, string, string, string][]> = {
  patient: [["◷", "اسکن بعدی", "امروز", "تا ساعت ۲۱"], ["✓", "پایبندی هفتگی", "۹۱٪", "۶ روز کامل"], ["◌", "پیام تازه", "۱", "از کلینیک"], ["□", "نوبت بعدی", "۲۵ مرداد", "ساعت ۱۷:۳۰"]],
  clinic: [["!", "رسیدگی فوری", "۳", "یک مورد نزدیک SLA"], ["◫", "اسکن تازه", "۱۲", "میانگین ۱۸ دقیقه"], ["◎", "بیمار فعال", "۲۸۴", "۱۲ پرونده تازه"], ["✓", "SLA پاسخ", "۹۴٪", "هدف بالاتر از ۹۰٪"]],
  admin: [["♥", "سرویس‌های سالم", "۴۲ / ۴۴", "دو مورد degraded"], ["⇅", "صف جاری", "۱٬۲۴۸", "p95 برابر ۴٫۲ دقیقه"], ["⬡", "مدل Production", "۳", "همه زیر گیت"], ["!", "Incident باز", "۲", "هیچ‌کدام بحرانی نیست"]],
  annotation: [["☑", "کار تخصیص‌یافته", "۱۸", "۵ مورد امروز"], ["⚖", "نیازمند داوری", "۷", "۲ مورد high-impact"], ["✓", "Agreement", "۰٫۸۷", "بالاتر از آستانه"], ["▤", "نسخه schema", "v2.4", "تأییدشده"]],
  engage: [["♢", "متقاضی تازه", "۴۱", "این هفته"], ["◉", "عکس ارسال‌شده", "۲۶", "کیفیت مناسب ۸۵٪"], ["□", "مشاوره رزروشده", "۱۴", "۳ مورد امروز"], ["✓", "تبدیل", "۳۲٪", "بدون ادعای درمان"]],
};

function StatusPill({ tone = "teal", children }: { tone?: string; children: React.ReactNode }) {
  return <span className={`eco-pill eco-pill-${tone}`}>{children}</span>;
}

function ShellNav({ surface, page, open, close }: { surface: SurfaceId; page: PortalPage; open: boolean; close: () => void }) {
  const meta = surfaceMeta[surface];
  const grouped = useMemo(() => Object.entries(pagesBySurface[surface].reduce<Record<string, PortalPage[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {})), [surface]);

  return (
    <aside className={`eco-sidebar eco-sidebar-${surface} ${open ? "is-open" : ""}`} style={{ "--surface-accent": meta.accent } as React.CSSProperties}>
      <div className="eco-brand"><Link href="/portals"><span>د</span><div><strong>دنتامانیتور</strong><small>{meta.shortTitle}</small></div></Link><button type="button" onClick={close} aria-label="بستن منو">×</button></div>
      <Link className="eco-role" href="/portals"><span>{meta.code}</span><div><small>تجربه فعال</small><strong>{meta.audience}</strong></div><b>⌄</b></Link>
      <nav className="eco-nav" aria-label={`مسیرهای ${meta.shortTitle}`}>
        {grouped.map(([group, items]) => <section key={group}><p>{group}</p>{items.map((item) => <Link key={item.id} href={`/${surface}/${item.slug}`} className={item.slug === page.slug ? "active" : ""} onClick={close}><span>{item.icon}</span><b>{item.title}</b><small>{fa(item.id.split("-")[1])}</small></Link>)}</section>)}
      </nav>
      <div className="eco-sidebar-foot"><span>●</span> محیط نمایشی امن <small>{meta.status}</small></div>
    </aside>
  );
}

function PatientVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const [checked, setChecked] = useState([true, true, false]);
  const capture = ["guided-capture", "capture-review", "scan-tutorial", "device-check", "pre-scan"].includes(page.slug);
  const communication = ["messages", "instruction", "emergency", "appointments"].includes(page.slug);
  return (
    <div className="patient-stage">
      <section className="phone-mock">
        <div className="phone-speaker" /><div className="phone-status"><span>۹:۴۱</span><span>◒ 5G ▰</span></div>
        <div className="phone-app-head"><button type="button">→</button><span><strong>{page.title}</strong><small>{fa(page.id)}</small></span><i>د</i></div>
        <div className="phone-body">
          {capture ? <>
            <div className="camera-preview"><div className="capture-guide"><span /><span /><span /><span /></div><div className="mouth-guide"><i /><i /><i /><i /><i /><i /></div><p>صورت را روبه‌روی قاب نگه دارید</p></div>
            <div className="capture-progress"><span>نمای روبه‌رو</span><b>۳ از ۵</b><i><em /></i></div>
            <button className="capture-button" type="button" onClick={() => notify("نمای ساختگی ثبت شد؛ هیچ تصویر واقعی ذخیره نشد.")}><span /></button>
          </> : communication ? <>
            <div className={`patient-alert ${page.slug === "emergency" ? "urgent" : ""}`}><span>{page.slug === "emergency" ? "!" : "✓"}</span><div><strong>{page.slug === "instruction" ? "دستور امضاشده دکتر نادری" : page.title}</strong><p>{page.description}</p></div></div>
            <div className="phone-chat"><span className="incoming">سلام سارا، تصاویر شما بررسی شد. فعلاً مرحله فعلی را ادامه دهید.<small>دکتر نادری · ۱۰:۳۱</small></span><span className="outgoing">ممنون، دریافت کردم.<small>خوانده شد</small></span></div>
          </> : <>
            <div className="patient-welcome"><span>سلام سارا،</span><strong>{page.title}</strong><p>{page.description}</p></div>
            <div className="treatment-ring"><div><strong>۱۴</strong><small>از ۲۸ مرحله</small></div></div>
            <div className="next-action"><span>اسکن بعدی</span><strong>امروز تا ساعت ۲۱</strong><button type="button" onClick={() => notify("جریان اسکن آماده شد.")}>شروع اسکن</button></div>
          </>}
        </div>
        <div className="phone-tabs"><span className="active">⌂<small>خانه</small></span><span>◷<small>اسکن</small></span><span>◌<small>پیام</small></span><span>◎<small>پروفایل</small></span></div>
      </section>
      <section className="patient-companion">
        <span className="page-id">{page.id}</span><h2>این صفحه چه چیزی را امن می‌کند؟</h2><p>{page.description}</p>
        <div className="feature-checks">{page.features.map((item, index) => <button type="button" key={item} onClick={() => setChecked((values) => values.map((value, idx) => idx === index ? !value : value))}><i className={checked[index] ? "done" : ""}>{checked[index] ? "✓" : index + 1}</i><span><strong>{item}</strong><small>{checked[index] ? "کنترل فعال است" : "برای بررسی انتخاب کنید"}</small></span></button>)}</div>
        <div className="patient-privacy"><span>◈</span><p><strong>حریم خصوصی در طراحی</strong>اعلان صفحه قفل، جزئیات بیماری یا درمان را نمایش نمی‌دهد.</p></div>
      </section>
    </div>
  );
}

function MouthScene({ annotated = false }: { annotated?: boolean }) {
  return <div className="eco-mouth"><div className="eco-teeth top">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div><div className="eco-teeth bottom">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>{annotated && <><span className="annotation-box">FDI ۱۳</span><span className="annotation-point">۱</span></>}</div>;
}

function ClinicVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const viewer = ["scan-viewer", "compare-viewer", "findings-review", "decision-signoff", "3d-viewer", "smartstl"].includes(page.slug);
  const [decision, setDecision] = useState("accept");
  if (viewer) return <section className="eco-work-grid viewer-grid"><article className="eco-panel dark-viewer"><header><div className="segmented"><button className="active">فعلی</button><button>قبلی</button><button>مقایسه</button></div><StatusPill tone="gold">AI · SHADOW</StatusPill></header><MouthScene annotated /><footer><span>نمای روبه‌رو · کیفیت {fa("۹۲٪")}</span><span>تصویر خام تغییر نمی‌کند</span></footer></article><article className="eco-panel decision-panel"><span className="page-id">{page.id}</span><h2>{page.title}</h2><div className="ai-proposal"><b>AI</b><p><strong>پیشنهاد سامانه · تشخیص نیست</strong>احتمال فاصله الاینر در ناحیه دندان ۱۳ · عدم قطعیت متوسط</p></div><div className="decision-choices">{[["accept", "✓", "تأیید"], ["edit", "✎", "ویرایش"], ["reject", "×", "رد"], ["unknown", "?", "نامشخص"]].map(([value, icon, label]) => <button className={decision === value ? "active" : ""} onClick={() => setDecision(value)} key={value}><span>{icon}</span>{label}</button>)}</div><label className="eco-field"><span>دلیل تصمیم</span><textarea placeholder="یادداشت بالینی ساختگی..." /></label><button className="eco-primary full" onClick={() => notify("تصمیم نمایشی امضا و در ممیزی ساختگی ثبت شد.")}>امضا و ثبت تصمیم</button></article></section>;
  return <section className="eco-work-grid"><article className="eco-panel wide"><header className="panel-title"><div><span className="page-id">{page.id}</span><h2>{page.title}</h2><p>موارد جاری در محدوده کلینیک تهران</p></div><div className="segmented"><button className="active">همه</button><button>فوری</button><button>من</button></div></header><div className="eco-list">{[["سارا محمدی", "DM-1048", "اسکن نیازمند بازبینی", "فوری"], ["امیررضا رضایی", "DM-1082", "گزارش درد و براکت", "SLA ۱۲ دقیقه"], ["نیلوفر کریمی", "DM-1019", "پیام درباره مرحله بعد", "جدید"], ["محمد فرهادی", "DM-1104", "کیفیت اسکن ناکافی", "پیگیری"]].map((row, index) => <button key={row[1]} onClick={() => notify(`پرونده ساختگی ${row[0]} باز شد.`)}><i>{row[0].split(" ").map((x) => x[0]).join("")}</i><span><strong>{row[0]}</strong><small>{row[1]}</small></span><b>{row[2]}</b><StatusPill tone={index < 2 ? "red" : index === 2 ? "teal" : "grey"}>{row[3]}</StatusPill><em>←</em></button>)}</div></article><article className="eco-panel side-insight"><span className="page-id">کنترل‌های فعال</span><h2>محدوده و ایمنی</h2>{page.features.map((feature, index) => <div className="control-row" key={feature}><i>{index + 1}</i><span><strong>{feature}</strong><small>{index === 0 ? "کنترل‌شده با نقش و هدف" : "ثبت در سابقه ممیزی"}</small></span><b>فعال</b></div>)}<div className="safety-box"><span>i</span><p>هر اقدام بالینی نیازمند کاربر مجاز و شواهد قابل مشاهده است.</p></div></article></section>;
}

function AdminVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const model = ["model-registry", "deployments", "model-monitoring", "datasets", "experiments", "taxonomy"].includes(page.slug);
  return <section className="admin-console"><article className="eco-panel admin-main"><header className="console-head"><div><span className="page-id">{page.id}</span><h2>{page.title}</h2><p>{page.description}</p></div><StatusPill tone={model ? "violet" : "teal"}>{model ? "GATED" : "OPERATIONAL"}</StatusPill></header><div className="service-map">{(model ? [["Candidate", "DM-QA v1.8", "آماده ارزیابی"], ["Shadow", "DM-VIEW v2.4", "۱۴ روز پایدار"], ["Canary", "DM-ALIGN v1.3", "۵٪ cohort"], ["Production", "DM-QUALITY v3.1", "کالیبره"]] : [["API Gateway", "99.98%", "Healthy"], ["Scan Pipeline", "99.94%", "Healthy"], ["Inference Queue", "p95 4.2m", "Degraded"], ["Audit Store", "100%", "Healthy"]]).map((row, index) => <button key={row[0]} onClick={() => notify(`جزئیات نمایشی ${row[0]} باز شد.`)}><span className={`service-signal s${index}`}><i /></span><b>{row[0]}</b><strong>{row[1]}</strong><small>{row[2]}</small><em>•••</em></button>)}</div><div className="console-chart"><header><strong>{model ? "پایش drift و calibration" : "سلامت ۲۴ ساعت گذشته"}</strong><span>آخرین به‌روزرسانی: اکنون</span></header><div className="line-chart"><i /><i /><i /><i /><i /><i /><i /><i /><svg viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 118 C70 112,100 80,155 92 S250 130,310 78 S390 52,445 68 S540 112,600 74 S700 40,800 52" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M0 118 C70 112,100 80,155 92 S250 130,310 78 S390 52,445 68 S540 112,600 74 S700 40,800 52 L800 160 L0 160 Z" fill="currentColor" opacity=".08" /></svg></div></div></article><aside className="eco-panel control-stack"><span className="page-id">گیت انتشار</span><h2>کنترل‌های اجباری</h2>{page.features.map((feature, index) => <div key={feature} className="gate-item"><span>{index < 2 ? "✓" : "◷"}</span><p><strong>{feature}</strong><small>{index < 2 ? "تأیید شده" : "نیازمند تأیید دوم"}</small></p></div>)}<button className="danger-control" onClick={() => notify("Kill switch در محیط نمایشی آزمایش شد؛ اقدامی در تولید انجام نشد.")}><span>■</span><p><strong>Kill switch</strong><small>آزمایش کنترل توقف امن</small></p></button></aside></section>;
}

function AnnotationVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const [tool, setTool] = useState("box");
  return <section className="annotation-studio"><div className="annotation-tools">{[["cursor", "↖"], ["box", "□"], ["point", "·"], ["mask", "◒"], ["tooth", "FDI"]].map(([value, icon]) => <button key={value} className={tool === value ? "active" : ""} onClick={() => setTool(value)}>{icon}</button>)}</div><article className="annotation-canvas"><header><span>CASE-IR-DEMO-00482</span><div><button>قبلی</button><button className="active">فعلی</button><button>Overlay</button></div><StatusPill tone="gold">DE-IDENTIFIED</StatusPill></header><MouthScene annotated /><footer><span>ابزار: {tool}</span><span>بزرگ‌نمایی ۱۰۰٪</span><span>schema {fa("v2.4")}</span></footer></article><aside className="eco-panel annotation-form"><span className="page-id">{page.id}</span><h2>{page.title}</h2><label className="eco-field"><span>Observation</span><select><option>Aligner gap</option><option>Bracket issue</option><option>Image quality</option></select></label><div className="field-duo"><label className="eco-field"><span>دندان</span><select><option>FDI 13</option><option>FDI 12</option></select></label><label className="eco-field"><span>شدت</span><select><option>متوسط</option><option>خفیف</option></select></label></div><label className="eco-field"><span>عدم قطعیت</span><input type="range" min="0" max="100" defaultValue="32" /></label><div className="annotation-check">{page.features.map((x) => <span key={x}>✓ {x}</span>)}</div><button className="eco-primary full" onClick={() => notify("Annotation ساختگی با نسخه schema ثبت شد.")}>ثبت و مورد بعدی</button></aside></section>;
}

function EngageVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const steps = pagesBySurface.engage;
  const active = steps.findIndex((x) => x.slug === page.slug);
  return <section className="engage-stage"><article className="engage-preview"><div className="engage-brand"><span>د</span><strong>لبخند بعدی شما، با یک گفت‌وگوی آگاهانه شروع می‌شود.</strong></div><span className="non-diagnostic">پیش‌غربالگری غیرتشخیصی</span><h2>{page.title}</h2><p>{page.description}</p><div className="engage-form"><label><span>نام و نام خانوادگی</span><input placeholder="مثلاً سارا محمدی" /></label><div><label><span>شهر</span><select><option>تهران</option><option>شیراز</option><option>مشهد</option></select></label><label><span>نوع مشاوره</span><select><option>حضوری</option><option>آنلاین</option></select></label></div><label className="consent-line"><input type="checkbox" /> با تماس کلینیک برای همین درخواست موافقم.</label><button onClick={() => notify("مرحله نمایشی ثبت شد؛ هیچ داده واقعی ارسال نشد.")}>{page.action} ←</button></div><small className="engage-disclaimer">این ابزار تشخیص پزشکی یا تضمین نتیجه درمان نیست. تصمیم پس از معاینه توسط پزشک گرفته می‌شود.</small></article><aside className="funnel-card"><span className="page-id">مسیر متقاضی</span><h2>وضعیت این درخواست</h2>{steps.map((step, index) => <Link href={`/engage/${step.slug}`} className={`${index === active ? "active" : ""} ${index < active ? "done" : ""}`} key={step.id}><i>{index < active ? "✓" : index + 1}</i><span><strong>{step.title}</strong><small>{index < active ? "تکمیل‌شده" : index === active ? "مرحله جاری" : "در انتظار"}</small></span></Link>)}</aside></section>;
}

export default function EcosystemPortal({ surface, page }: { surface: SurfaceId; page: PortalPage }) {
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const meta = surfaceMeta[surface];
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  return <main className={`ecosystem-shell theme-${surface}`} style={{ "--surface-accent": meta.accent } as React.CSSProperties} dir="rtl">
    <ShellNav surface={surface} page={page} open={menu} close={() => setMenu(false)} />
    <section className="eco-workspace">
      <header className="eco-topbar"><button className="eco-menu" onClick={() => setMenu(true)}>☰</button><div className="eco-breadcrumb"><Link href="/portals">اکوسیستم</Link><span>›</span><Link href={`/${surface}`}>{meta.shortTitle}</Link><span>›</span><strong>{page.title}</strong></div><div className="eco-top-actions"><label><span>⌕</span><input placeholder="جست‌وجوی امن..." /></label><button onClick={() => notify("همه اعلان‌های ساختگی خوانده شدند.")}>♢<i /></button><span className="eco-user">{surface === "patient" ? "س‌م" : surface === "annotation" ? "ر‌ک" : "ن‌ن"}</span></div></header>
      <div className="eco-content">
        <section className="eco-page-head"><div><p><span /> {meta.title} · {fa(page.id)}</p><h1>{page.title}</h1><p>{page.description}</p></div><button className="eco-primary" onClick={() => notify(`${page.action} در محیط نمایشی اجرا شد.`)}><span>＋</span>{page.action}</button></section>
        <div className="eco-metrics">{metrics[surface].map(([icon, label, value, detail], index) => <article key={label}><span className={`metric-tone tone-${index}`}>{icon}</span><div><small>{label}</small><strong>{fa(value)}</strong><p>{detail}</p></div></article>)}</div>
        {surface === "patient" && <PatientVisual page={page} notify={notify} />}
        {surface === "clinic" && <ClinicVisual page={page} notify={notify} />}
        {surface === "admin" && <AdminVisual page={page} notify={notify} />}
        {surface === "annotation" && <AnnotationVisual page={page} notify={notify} />}
        {surface === "engage" && <EngageVisual page={page} notify={notify} />}
        <section className="eco-trace"><span>⌁</span><p><strong>ردیابی و ایمنی این مسیر</strong>کنش‌ها در این نمونه فقط نمایشی‌اند. در نسخه متصل، actor، purpose، tenant، evidence، نسخه و زمان در ممیزی append-only ثبت می‌شوند.</p><div>{page.features.map((feature) => <span key={feature}>✓ {feature}</span>)}</div></section>
      </div>
    </section>
    {menu && <button className="eco-backdrop" aria-label="بستن منو" onClick={() => setMenu(false)} />}
    {toast && <div className="eco-toast"><span>✓</span>{toast}</div>}
  </main>;
}
