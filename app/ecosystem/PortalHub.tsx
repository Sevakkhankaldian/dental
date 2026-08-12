import Link from "next/link";
import { pagesBySurface, surfaceIds, surfaceMeta } from "./config";

const highlights = {
  patient: ["اسکن هدایت‌شده", "دستور پزشک", "اورژانس"],
  clinic: ["بررسی انسانی", "پرونده و پیام", "پروتکل و تحلیل"],
  admin: ["سلامت سرویس", "چرخه مدل", "ممیزی و رخداد"],
  annotation: ["تصویر و ۳D", "داوری", "انتشار دیتاست"],
  engage: ["جذب متقاضی", "پیش‌غربالگری", "رزرو مشاوره"],
};

export default function PortalHub() {
  const total = surfaceIds.reduce((sum, id) => sum + pagesBySurface[id].length, 0);
  return (
    <main className="ecosystem-hub" dir="rtl">
      <header className="hub-header">
        <Link href="/" className="hub-brand" aria-label="بازگشت به پرتال کلینیک">
          <span className="hub-logo">د</span>
          <span><strong>دنتامانیتور ایران</strong><small>اکوسیستم یکپارچه پایش ارتودنسی</small></span>
        </Link>
        <div className="hub-status"><i /> محیط نمایشی · داده کاملاً ساختگی</div>
      </header>

      <section className="hub-hero">
        <div className="hub-orbit" aria-hidden="true"><span>AI</span><i /><i /><i /></div>
        <div>
          <p className="hub-kicker">سامانه کامل از بیمار تا عملیات مدل</p>
          <h1>پنج تجربه، یک زنجیره مراقبت امن</h1>
          <p>هر نقش فقط همان چیزی را می‌بیند که برای انجام کارش لازم است. AI پیشنهاد می‌دهد؛ افراد مجاز تصمیم می‌گیرند و هیچ خروجی خامی مستقیماً به بیمار نمی‌رسد.</p>
          <div className="hub-summary"><span><strong>{total.toLocaleString("fa-IR")}</strong> مسیر مستقل</span><span><strong>۵</strong> رابط تخصصی</span><span><strong>۱۰۰٪</strong> داده نمایشی</span></div>
        </div>
      </section>

      <section className="surface-grid" aria-label="انتخاب پرتال">
        {surfaceIds.map((id, index) => {
          const meta = surfaceMeta[id];
          return (
            <Link className={`surface-card surface-${id}`} href={`/${id}`} key={id} style={{ "--surface-accent": meta.accent } as React.CSSProperties}>
              <div className="surface-card-top"><span className="surface-number">۰{index + 1}</span><span className="surface-code">{meta.code}</span></div>
              <div className="surface-icon" aria-hidden="true">{["◎", "⌂", "⌘", "⬡", "✦"][index]}</div>
              <h2>{meta.title}</h2>
              <p>{meta.description}</p>
              <div className="surface-highlights">{highlights[id].map((item) => <span key={item}>{item}</span>)}</div>
              <footer><span>{meta.status}</span><b>ورود به پرتال ←</b></footer>
            </Link>
          );
        })}
      </section>

      <section className="hub-safety">
        <span>⌁</span>
        <div><strong>معماری ایمنی در تمام مسیرها جاری است</strong><p>کنترل دسترسی دامنه‌دار، رضایت نسخه‌دار، ممیزی append-only، عدم قطعیت، حق خودداری مدل و گیت امضای انسانی در تجربه محصول منعکس شده‌اند.</p></div>
        <Link href="/clinic/decision-signoff">دیدن گیت تصمیم بالینی</Link>
      </section>
    </main>
  );
}
