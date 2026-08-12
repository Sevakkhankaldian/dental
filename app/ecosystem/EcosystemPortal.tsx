"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pagesBySurface, PortalPage, SurfaceId, surfaceIds, surfaceMeta } from "./config";

const fa = (value: string | number) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const metrics: Record<SurfaceId, [string, string, string, string][]> = {
  patient: [["◷", "اسکن بعدی", "امروز", "تا ساعت ۲۱"], ["✓", "پایبندی هفتگی", "۹۱٪", "۶ روز کامل"], ["◌", "پیام تازه", "۱", "از کلینیک"], ["□", "نوبت بعدی", "۲۵ مرداد", "ساعت ۱۷:۳۰"]],
  doctor: [["◫", "منتظر بررسی", "۱۲", "۳ مورد فوری"], ["◷", "میانگین انتظار", "۱۸ دقیقه", "هدف زیر ۳۰ دقیقه"], ["✓", "امضاشده امروز", "۲۳", "بدون تعارض نسخه"], ["◌", "پیام بالینی", "۵", "۲ مورد خوانده‌نشده"]],
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
  const capture = ["guided-capture", "capture-review", "scan-tutorial", "device-check", "pre-scan"].includes(page.slug);
  const communication = ["messages", "instruction", "emergency", "appointments"].includes(page.slug);
  return (
    <div className="patient-web-dashboard">
      <section className="patient-web-main">
        {capture ? <article className="eco-panel patient-capture-panel"><header><div><span className="page-id">اسکن هدایت‌شده وب</span><h2>{page.title}</h2></div><StatusPill tone="teal">۳ از ۵ نما</StatusPill></header><div className="web-camera"><div className="capture-guide"><span /><span /><span /><span /></div><div className="mouth-guide"><i /><i /><i /><i /><i /><i /></div><p>صورت را روبه‌روی قاب نگه دارید · نور مناسب است</p></div><footer><div><span>نمای روبه‌رو</span><i><em /></i></div><button className="eco-primary" onClick={() => notify("نمای ساختگی ثبت شد؛ هیچ تصویر واقعی ذخیره نشد.")}>ثبت این نما</button></footer></article> : communication ? <article className="eco-panel patient-web-communication"><header><span className="page-id">{page.id}</span><h2>{page.title}</h2><p>{page.description}</p></header><div className={`patient-web-alert ${page.slug === "emergency" ? "urgent" : ""}`}><span>{page.slug === "emergency" ? "!" : "✓"}</span><p><small>{page.slug === "instruction" ? "دستور امضاشده دکتر نادری" : "ارتباط امن با کلینیک"}</small><strong>{page.slug === "emergency" ? "اگر مشکل تنفسی یا خونریزی شدید دارید، فوراً با اورژانس تماس بگیرید." : "مرحله فعلی را تا اسکن امروز ادامه دهید."}</strong><i>امروز · ۱۰:۳۱</i></p></div><div className="patient-web-thread"><span>سلام سارا، تصاویر قبلی شما بررسی شد. لطفاً اسکن امروز را تا ساعت ۲۱ ثبت کنید.<small>دکتر نادری</small></span><span>حتماً، ممنون از یادآوری.<small>خوانده شد</small></span></div></article> : <article className="patient-treatment-hero"><div><span>سلام سارا، مسیر درمانت منظم پیش می‌رود.</span><h2>مرحله ۱۴ از ۲۸</h2><p>الاینر شفاف · شروع درمان ۲۱ تیر ۱۴۰۵</p><div className="patient-progress"><i /></div><small>۵۰٪ مسیر درمان ثبت‌شده</small></div><div className="patient-progress-ring"><span><strong>۱۴</strong><small>مرحله فعلی</small></span></div></article>}
        {!capture && !communication && <><article className="patient-scan-banner"><span>◉</span><div><small>کار امروز</small><strong>اسکن دوره‌ای تا ساعت ۲۱</strong><p>حدود ۳ دقیقه · رترکتور و نور مناسب را آماده کنید</p></div><button onClick={() => notify("جریان اسکن بیمار آماده شد.")}>شروع اسکن ←</button></article><div className="patient-web-grid"><article className="eco-panel patient-timeline"><header><div><span className="page-id">رویدادهای اخیر</span><h2>خط زمانی درمان</h2></div><a href="/patient/timeline">مشاهده همه</a></header>{[["✓","تصمیم پزشک امضا شد","امروز · ادامه مرحله فعلی"],["◉","اسکن با موفقیت دریافت شد","۱۴ مرداد · ۵ نمای کامل"],["□","نوبت بعدی ثبت شد","۲۵ مرداد · ساعت ۱۷:۳۰"]].map((item,index)=><div key={item[1]}><i className={`t${index}`}>{item[0]}</i><span><strong>{item[1]}</strong><small>{item[2]}</small></span></div>)}</article><article className="eco-panel patient-upcoming"><header><span className="page-id">این هفته</span><h2>یادآوری‌ها</h2></header><div><span>امروز</span><p><strong>ثبت اسکن دوره‌ای</strong><small>تا ساعت ۲۱</small></p><b>فوری</b></div><div><span>شنبه</span><p><strong>تعویض الاینر</strong><small>پس از تأیید پزشک</small></p><b className="muted">منتظر</b></div><div><span>دوشنبه</span><p><strong>ویزیت حضوری</strong><small>ساعت ۱۷:۳۰</small></p><b className="muted">رزرو</b></div></article></div></>}
      </section>
      <aside className="patient-web-side"><article className="eco-panel patient-doctor-card"><div><span>ن‌ن</span><i>● آنلاین</i></div><h3>دکتر نیلوفر نادری</h3><p>پزشک درمانگر · کلینیک لبخند تهران</p><button onClick={() => notify("گفت‌وگوی امن نمایشی باز شد.")}>◌ پیام به تیم درمان</button></article><article className="eco-panel patient-feature-card"><span className="page-id">کنترل‌های این بخش</span><h3>{page.title}</h3>{page.features.map((item)=><p key={item}><i>✓</i>{item}</p>)}</article><a className="patient-app-invite" href="/app"><span>▣</span><div><strong>همراهت روی موبایل</strong><small>اپ بیمار را همین‌جا امتحان کن</small></div><b>←</b></a></aside>
    </div>
  );
}

function MouthScene({ annotated = false }: { annotated?: boolean }) {
  return <div className="eco-mouth"><div className="eco-teeth top">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div><div className="eco-teeth bottom">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>{annotated && <><span className="annotation-box">FDI ۱۳</span><span className="annotation-point">۱</span></>}</div>;
}

function DoctorVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const clinicalViewer = ["scan-viewer", "compare", "findings", "signoff"].includes(page.slug);
  if (clinicalViewer) return <ClinicVisual page={page} notify={notify} />;
  return <section className="doctor-dashboard-grid"><article className="eco-panel doctor-day"><header className="panel-title"><div><span className="page-id">صف شخصی پزشک</span><h2>{page.title}</h2><p>موارد تخصیص‌یافته به دکتر نادری</p></div><div className="segmented"><button className="active">اولویت</button><button>جدیدترین</button></div></header><div className="doctor-review-cards">{[["س‌م","سارا محمدی","الاینر · مرحله ۱۴","احتمال فاصله الاینر · دندان ۱۳","فوری","۱۲ دقیقه"],["ا‌ر","امیررضا رضایی","براکت · ماه ۸","گزارش درد و آسیب براکت","فوری","۲۶ دقیقه"],["ن‌ک","نیلوفر کریمی","الاینر · مرحله ۷","تغییر طولی نیازمند مقایسه","توجه","۴۱ دقیقه"]].map((item,index)=><button key={item[1]} onClick={()=>notify(`مورد ساختگی ${item[1]} برای بررسی باز شد.`)}><i>{item[0]}</i><span><strong>{item[1]}</strong><small>{item[2]}</small></span><p>{item[3]}</p><b className={index<2?"urgent":""}>{item[4]}</b><em>{item[5]} ←</em></button>)}</div></article><aside><article className="eco-panel doctor-schedule"><header><span className="page-id">برنامه من</span><h2>امروز</h2></header>{[["۱۱:۰۰","مشاوره آنلاین","رها داوودی"],["۱۴:۳۰","ویزیت مرحله‌ای","هانیه صادقی"],["۱۷:۰۰","شروع درمان","کیان مرادی"]].map((item)=><div key={item[0]}><time>{item[0]}</time><i /><span><strong>{item[1]}</strong><small>{item[2]}</small></span></div>)}<a href="/doctor/calendar">تقویم کامل ←</a></article><article className="eco-panel doctor-safety"><span>✦</span><p><strong>دستیار هوشمند در حالت Shadow</strong>پیشنهادها فقط برای بررسی شما هستند و هیچ اقدام بیمارمحور خودکاری فعال نیست.</p></article></aside></section>;
}

function ClinicVisual({ page, notify }: { page: PortalPage; notify: (message: string) => void }) {
  const viewer = ["scan-viewer", "compare-viewer", "findings-review", "decision-signoff", "3d-viewer", "smartstl"].includes(page.slug);
  const [decision, setDecision] = useState("accept");
  if (viewer) return <section className="eco-work-grid viewer-grid"><article className="eco-panel dark-viewer"><header><div className="segmented"><button className="active">فعلی</button><button>قبلی</button><button>مقایسه</button></div><StatusPill tone="gold">AI · SHADOW</StatusPill></header><MouthScene annotated /><footer><span>نمای روبه‌رو · کیفیت {fa("۹۲٪")}</span><span>تصویر خام تغییر نمی‌کند</span></footer></article><article className="eco-panel decision-panel"><span className="page-id">{page.id}</span><h2>{page.title}</h2><div className="ai-proposal"><b>AI</b><p><strong>پیشنهاد سامانه · تشخیص نیست</strong>احتمال فاصله الاینر در ناحیه دندان ۱۳ · عدم قطعیت متوسط</p></div><div className="decision-choices">{[["accept", "✓", "تأیید"], ["edit", "✎", "ویرایش"], ["reject", "×", "رد"], ["unknown", "?", "نامشخص"]].map(([value, icon, label]) => <button className={decision === value ? "active" : ""} onClick={() => setDecision(value)} key={value}><span>{icon}</span>{label}</button>)}</div><label className="eco-field"><span>دلیل تصمیم</span><textarea placeholder="یادداشت بالینی ساختگی..." /></label><button className="eco-primary full" onClick={() => notify("تصمیم نمایشی امضا و در ممیزی ساختگی ثبت شد.")}>امضا و ثبت تصمیم</button></article></section>;
  return <section className="eco-work-grid"><article className="eco-panel wide"><header className="panel-title"><div><span className="page-id">عملیات کلینیک تهران</span><h2>{page.title}</h2><p>کارهای تیم، پذیرش و هماهنگی درمان در یک نمای عملیاتی</p></div><div className="segmented"><button className="active">همه تیم</button><button>نیازمند اقدام</button><button>امروز</button></div></header><div className="eco-list">{[["پذیرش", "۱۲ درخواست", "درخواست‌های نوبت جدید", "۴ فوری"], ["تیم درمان", "۳ پزشک", "بار بررسی امروز", "۷۶٪"], ["هماهنگی", "۸ بیمار", "اسکن‌های عقب‌افتاده", "پیگیری"], ["پشتیبانی", "۵ گفتگو", "پیام‌های پاسخ‌داده‌نشده", "SLA"]].map((row, index) => <button key={row[0]} onClick={() => notify(`نمای عملیاتی ${row[0]} باز شد.`)}><i>{row[0].slice(0,2)}</i><span><strong>{row[0]}</strong><small>{row[1]}</small></span><b>{row[2]}</b><StatusPill tone={index === 0 ? "red" : index === 1 ? "teal" : "gold"}>{row[3]}</StatusPill><em>←</em></button>)}</div></article><article className="eco-panel side-insight"><span className="page-id">کنترل‌های کلینیک</span><h2>دامنه و عملیات</h2>{page.features.map((feature, index) => <div className="control-row" key={feature}><i>{index + 1}</i><span><strong>{feature}</strong><small>{index === 0 ? "سطح کلینیک و شعبه" : "ثبت در سابقه ممیزی"}</small></span><b>فعال</b></div>)}<div className="safety-box"><span>i</span><p>مدیر کلینیک جریان کار را مدیریت می‌کند؛ تصمیم بالینی همچنان در اختیار پزشک است.</p></div></article></section>;
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
      <header className="eco-topbar"><button className="eco-menu" onClick={() => setMenu(true)}>☰</button><div className="eco-breadcrumb"><Link href="/portals">مرکز ورود</Link><span>›</span><Link href={`/${surface}`}>{meta.shortTitle}</Link><span>›</span><strong>{page.title}</strong></div><div className="eco-top-actions"><label><span>⌕</span><input placeholder="جست‌وجوی امن..." /></label><button onClick={() => notify("همه اعلان‌های ساختگی خوانده شدند.")}>♢<i /></button><span className="eco-user">{surface === "patient" ? "س‌م" : surface === "annotation" ? "ر‌ک" : surface === "clinic" ? "ک‌ت" : "ن‌ن"}</span></div></header>
      <div className="eco-content">
        <section className="eco-page-head"><div><p><span /> {meta.title} · {fa(page.id)}</p><h1>{page.title}</h1><p>{page.description}</p></div><button className="eco-primary" onClick={() => notify(`${page.action} در محیط نمایشی اجرا شد.`)}><span>＋</span>{page.action}</button></section>
        <div className="eco-metrics">{metrics[surface].map(([icon, label, value, detail], index) => <article key={label}><span className={`metric-tone tone-${index}`}>{icon}</span><div><small>{label}</small><strong>{fa(value)}</strong><p>{detail}</p></div></article>)}</div>
        {surface === "patient" && <PatientVisual page={page} notify={notify} />}
        {surface === "doctor" && <DoctorVisual page={page} notify={notify} />}
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
