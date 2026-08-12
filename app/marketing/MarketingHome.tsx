const roleCards = [
  { icon: "◎", kicker: "برای بیمار", title: "درمان را بین ویزیت‌ها هم دنبال کن", copy: "اسکن هدایت‌شده، پیام مستقیم با کلینیک، نوبت‌ها و مسیر پیشرفت؛ همه در یک تجربه ساده و فارسی.", href: "/patient", action: "دیدن داشبورد بیمار", tone: "patient" },
  { icon: "✦", kicker: "برای پزشک", title: "شواهد بیشتر، تصمیم بالینی در اختیار شما", copy: "صف شخصی بازبینی، مقایسه طولی، ثبت تصمیم و ارتباط با بیمار بدون گم‌شدن در کارهای کلینیک.", href: "/doctor", action: "دیدن داشبورد پزشک", tone: "doctor" },
  { icon: "⌘", kicker: "برای کلینیک", title: "عملیات کلینیک را از یک مرکز اداره کن", copy: "تیم، بیماران، نوبت‌ها، SLA، پروتکل‌ها، گزارش‌ها و رشد کلینیک در یک فضای مدیریتی مستقل.", href: "/clinic", action: "دیدن داشبورد کلینیک", tone: "clinic" },
];

const journey = [
  ["۱", "ثبت اسکن در خانه", "بیمار با راهنمای زنده، نماهای موردنیاز را ثبت و امن ارسال می‌کند."],
  ["۲", "بررسی کیفیت و اولویت", "سامانه کیفیت را می‌سنجد و مورد را بدون تشخیص مستقیم برای پزشک آماده می‌کند."],
  ["۳", "تصمیم پزشک", "پزشک شواهد را می‌بیند، پیشنهاد را تأیید یا اصلاح می‌کند و تصمیم را امضا می‌کند."],
  ["۴", "اقدام روشن بیمار", "فقط دستور تأییدشده به بیمار می‌رسد و رویداد بعدی زمان‌بندی می‌شود."],
];

export default function MarketingHome() {
  return (
    <main className="marketing-site" dir="rtl">
      <header className="marketing-nav">
        <a href="/" className="marketing-brand"><span>د</span><div><strong>دنتامانیتور</strong><small>مراقبت پیوسته، تصمیم مطمئن</small></div></a>
        <nav aria-label="ناوبری سایت معرفی">
          <a href="#solution">راهکار</a><a href="#roles">برای چه کسانی؟</a><a href="#how">نحوه کار</a><a href="#safety">ایمنی</a><a href="/engage">درخواست مشاوره</a>
        </nav>
        <div className="marketing-actions"><a href="/app" className="text-link">ورود به اپ</a><a href="/portals" className="nav-cta">ورود به داشبورد</a></div>
      </header>

      <section className="marketing-hero" id="solution">
        <div className="hero-copy">
          <span className="hero-label"><i /> پلتفرم پایش هوشمند ارتودنسی</span>
          <h1>مراقبت ارتودنسی،<br /><em>بین ویزیت‌ها هم ادامه دارد.</em></h1>
          <p>دنتامانیتور بیمار، پزشک و کلینیک را در یک مسیر امن به هم متصل می‌کند؛ بیمار از خانه اسکن می‌گیرد، پزشک شواهد را بررسی می‌کند و کلینیک جریان مراقبت را منظم نگه می‌دارد.</p>
          <div className="hero-actions"><a className="marketing-primary" href="/app">تجربه اپلیکیشن <span>←</span></a><a className="marketing-secondary" href="#how"><span>▷</span> ببین چطور کار می‌کند</a></div>
          <div className="hero-proof"><span><b>۲۴/۷</b><small>ارتباط با مسیر درمان</small></span><span><b>۵ نما</b><small>اسکن هدایت‌شده</small></span><span><b>۱۰۰٪</b><small>تصمیم نهایی با پزشک</small></span></div>
        </div>
        <div className="hero-product" aria-label="پیش‌نمایش محصول دنتامانیتور">
          <div className="hero-glow" />
          <div className="hero-dashboard-card">
            <header><span className="mini-logo">د</span><div><strong>مرکز بررسی پزشک</strong><small>امروز، ۲۱ مرداد</small></div><i>ن‌ن</i></header>
            <div className="hero-dash-body"><aside><span className="active">⌂</span><span>◫</span><span>◎</span><span>◌</span><span>⌁</span></aside><section><div className="hero-dash-title"><span><small>صبح بخیر دکتر نادری</small><strong>۳ مورد به توجه شما نیاز دارد</strong></span><b>شروع بررسی</b></div><div className="hero-mini-metrics"><i><b>۱۲</b><small>اسکن تازه</small></i><i><b>۳</b><small>فوری</small></i><i><b>۱۸د</b><small>میانگین انتظار</small></i></div><div className="hero-patient-row"><em>س‌م</em><span><strong>سارا محمدی</strong><small>الاینر · مرحله ۱۴</small></span><b>نیازمند بررسی</b><i>←</i></div><div className="hero-patient-row"><em>ا‌ر</em><span><strong>امیررضا رضایی</strong><small>براکت · ماه ۸</small></span><b className="red">فوری</b><i>←</i></div></section></div>
          </div>
          <div className="hero-phone-card"><div className="phone-cut" /><header><span>۹:۴۱</span><span>● 5G ▰</span></header><div className="phone-logo">د</div><small>سلام سارا</small><h3>وقت اسکن امروز است</h3><div className="scan-orb"><span>◉</span><b>آماده ثبت</b><small>حدود ۳ دقیقه</small></div><button>شروع اسکن</button><footer><span>⌂<small>خانه</small></span><span>◷<small>اسکن</small></span><span>◌<small>پیام</small></span></footer></div>
          <div className="floating-safety"><span>✓</span><div><strong>تصمیم پزشک ثبت شد</strong><small>فقط محتوای تأییدشده برای بیمار</small></div></div>
        </div>
      </section>

      <section className="marketing-trust"><span>یک مسیر مشترک برای</span><div><b>بیمار</b><i /> <b>پزشک</b><i /> <b>کلینیک</b><i /> <b>تیم عملیات</b></div><small>تمام داده‌های این دموی محصول ساختگی‌اند.</small></section>

      <section className="marketing-section role-section" id="roles">
        <div className="section-heading"><span>یک پلتفرم، تجربه‌های تخصصی</span><h2>هرکس دقیقاً همان چیزی را می‌بیند که نیاز دارد.</h2><p>پرتال‌های جدا، مرز مسئولیت‌ها را روشن می‌کنند و اجازه نمی‌دهند تجربه بیمار با ابزارهای پیچیده بالینی یا مدیریتی قاطی شود.</p></div>
        <div className="marketing-role-grid">{roleCards.map((card) => <a href={card.href} className={`marketing-role role-${card.tone}`} key={card.title}><header><span>{card.icon}</span><small>{card.kicker}</small></header><h3>{card.title}</h3><p>{card.copy}</p><footer><b>{card.action}</b><span>←</span></footer></a>)}</div>
        <a className="admin-callout" href="/admin"><span className="admin-callout-icon">◈</span><div><small>برای تیم پلتفرم</small><strong>سلامت سرویس، امنیت، ممیزی و چرخه مدل در یک کنسول مستقل</strong></div><b>دیدن داشبورد ادمین ←</b></a>
      </section>

      <section className="marketing-section process-section" id="how">
        <div className="process-visual"><div className="process-ring"><span>د</span><i className="r1">بیمار</i><i className="r2">پزشک</i><i className="r3">کلینیک</i></div><div className="process-message"><span>✓</span><p><strong>دستور امضاشده پزشک</strong>مرحله فعلی را تا اسکن بعدی ادامه دهید.</p></div></div>
        <div><div className="section-heading align-start"><span>از اسکن تا اقدام</span><h2>چهار قدم روشن، بدون میان‌بُر بالینی.</h2><p>هوش مصنوعی به مرتب‌سازی و تحلیل کمک می‌کند، اما هیچ یافته خام یا تصمیم امضانشده مستقیماً به بیمار نمی‌رسد.</p></div><div className="journey-list">{journey.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>
      </section>

      <section className="marketing-section app-promo">
        <div className="app-copy"><span>یک اپ، دو تجربه</span><h2>اول بگو بیمار هستی یا پزشک؛ ادامه مسیر مخصوص توست.</h2><p>اپ مشترک دنتامانیتور در شروع نقش را می‌پرسد. بیمار وارد جریان اسکن و درمان می‌شود؛ پزشک صف بررسی، پیام‌ها و موارد فوری خود را می‌بیند.</p><div><a className="marketing-primary" href="/app">باز کردن اپ نمایشی ←</a><small>بدون نیاز به نصب · ورود کاملاً نمایشی</small></div></div>
        <div className="role-choice-preview"><header><span>د</span><small>دنتامانیتور</small></header><h3>شما چطور از دنتامانیتور استفاده می‌کنید؟</h3><div><span><i>◎</i><b>بیمار هستم</b><small>اسکن و پیگیری درمان</small></span><span><i>✦</i><b>پزشک هستم</b><small>بررسی و تصمیم بالینی</small></span></div></div>
      </section>

      <section className="marketing-section safety-section" id="safety"><div className="section-heading"><span>طراحی‌شده برای اعتماد</span><h2>پیشنهاد هوشمند؛ تصمیم انسانی.</h2><p>مرز نقش‌ها، رضایت نسخه‌دار، ممیزی تغییرناپذیر و کنترل انتشار بالینی از ابتدا در طراحی محصول حضور دارند.</p></div><div className="safety-grid"><article><span>⌁</span><h3>قابل ردیابی</h3><p>هر تصمیم به کاربر، شواهد، نسخه و زمان مشخص متصل است.</p></article><article><span>◈</span><h3>حریم خصوصی نقش‌محور</h3><p>هر نقش فقط داده ضروری و مجاز برای همان هدف را می‌بیند.</p></article><article><span>✦</span><h3>تأیید بالینی</h3><p>خروجی خام AI هرگز جای تصمیم و امضای پزشک را نمی‌گیرد.</p></article><article><span>■</span><h3>توقف امن</h3><p>اتوماسیون بالینی تا عبور از گیت‌های اعتبارسنجی غیرفعال می‌ماند.</p></article></div></section>

      <section className="marketing-cta"><span>آماده‌ای تجربهٔ کامل را ببینی؟</span><h2>از سایت معرفی وارد هر بخش محصول شو.</h2><div><a href="/portals" className="marketing-primary">مرکز ورود داشبوردها ←</a><a href="/engage" className="marketing-secondary">درخواست مشاوره</a></div></section>

      <footer className="marketing-footer"><div className="marketing-brand"><span>د</span><div><strong>دنتامانیتور ایران</strong><small>نمونه نمایشی پلتفرم پایش ارتودنسی</small></div></div><nav><a href="/patient">بیمار</a><a href="/doctor">پزشک</a><a href="/clinic">کلینیک</a><a href="/admin">ادمین</a><a href="/app">اپلیکیشن</a></nav><p>این نسخه یک نمونه محصول است، نه ابزار تشخیص یا سامانه بالینی آماده بهره‌برداری.</p></footer>
    </main>
  );
}
