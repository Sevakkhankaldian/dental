const pillars = [
  {
    number: "01",
    eyebrow: "کنترل بالینی",
    title: "درمان را به‌جای تقویم، با نیاز بیمار هماهنگ کنید.",
    copy: "اسکن‌های دوره‌ای، مقایسه طولی و صف اولویت‌دار کمک می‌کنند پزشک در زمان درست، شواهد درست را ببیند.",
    href: "/doctor",
    tone: "blue",
  },
  {
    number: "02",
    eyebrow: "تجربه بیمار",
    title: "یک همراه ساده برای هر روز درمان.",
    copy: "راهنمای ثبت اسکن، پیام‌های تأییدشده، یادآوری‌ها و نمایش پیشرفت، بیمار را بین ویزیت‌ها در مسیر نگه می‌دارد.",
    href: "/patient",
    tone: "aqua",
  },
  {
    number: "03",
    eyebrow: "عملیات و رشد",
    title: "از صف بررسی تا عملکرد تیم؛ همه‌چیز در یک تصویر.",
    copy: "کلینیک می‌تواند بار کاری، SLA، نوبت‌ها، پیام‌ها و شاخص‌های مراقبت را بدون ورود به فضای شخصی پزشک مدیریت کند.",
    href: "/clinic",
    tone: "mint",
  },
];

const journey = [
  ["۱", "اسکن هدایت‌شده", "بیمار با راهنمای مرحله‌به‌مرحله پنج نمای استاندارد را ثبت می‌کند."],
  ["۲", "کنترل کیفیت", "کیفیت تصاویر بررسی و پرونده برای بازبینی پزشک آماده می‌شود."],
  ["۳", "بازبینی پزشک", "پزشک مقایسه‌ها را می‌بیند، تصمیم می‌گیرد و نتیجه را امضا می‌کند."],
  ["۴", "اقدام روشن", "پیام تأییدشده و زمان اقدام بعدی به بیمار و کلینیک می‌رسد."],
];

const solutions = [
  ["DM", "پایش درمان", "ثبت اسکن، مقایسه طولی و بازبینی بالینی", "/doctor/review-queue"],
  ["EN", "جذب و پیش‌ارزیابی", "یک مسیر شفاف برای درخواست مشاوره و پیگیری سرنخ", "/engage"],
  ["IN", "بینش کلینیک", "نمایش روندها، بار تیم و کیفیت عملیات", "/clinic/analytics"],
  ["AI", "کنترل پلتفرم", "حاکمیت مدل، ممیزی و سلامت سرویس", "/admin"],
];

export default function MarketingHome() {
  return (
    <main className="dmx-site" dir="rtl">
      <a className="dmx-skip" href="#main-content">رفتن به محتوای اصلی</a>

      <div className="dmx-announcement">
        <p><span>نسخه نمایشی محصول</span> چهار تجربه مستقل برای بیمار، پزشک، کلینیک و مدیر پلتفرم</p>
        <a href="/portals">مشاهده همه بخش‌ها <b>←</b></a>
      </div>

      <header className="dmx-header">
        <a className="dmx-brand" href="/" aria-label="دنتامانیتور ایران، صفحه اصلی">
          <span className="dmx-brand-mark"><i /><i /></span>
          <span><strong>دنتامانیتور</strong><small>DENTAMONITOR IRAN</small></span>
        </a>
        <nav aria-label="ناوبری اصلی">
          <a href="#platform">پلتفرم</a>
          <a href="#solutions">راهکارها</a>
          <a href="#journey">مسیر مراقبت</a>
          <a href="#trust">ایمنی و اعتماد</a>
          <a href="/engage">منابع</a>
        </nav>
        <div className="dmx-header-actions">
          <a className="dmx-login" href="/portals">ورود <span>⌄</span></a>
          <a className="dmx-button dmx-button-small" href="/engage">درخواست دمو <span>←</span></a>
        </div>
      </header>

      <section className="dmx-hero" id="main-content">
        <div className="dmx-hero-noise" />
        <div className="dmx-hero-copy">
          <div className="dmx-kicker"><i /> پلتفرم یکپارچه پایش ارتودنسی</div>
          <h1>مراقبت هوشمند،<br /><em>فراتر از صندلی درمان.</em></h1>
          <p>بیمار، پزشک و تیم کلینیک را در یک مسیر پیوسته به هم متصل کنید؛ از اسکن خانگی تا تصمیم بالینی و اقدام بعدی.</p>
          <div className="dmx-hero-actions">
            <a className="dmx-button" href="/portals">کشف تجربه محصول <span>←</span></a>
            <a className="dmx-ghost-button" href="#journey"><i>▶</i> ببینید چطور کار می‌کند</a>
          </div>
          <div className="dmx-hero-note"><span>✓</span><p><strong>هوش مصنوعی در نقش دستیار</strong> تصمیم نهایی و انتشار پیام بالینی همیشه با پزشک است.</p></div>
        </div>

        <div className="dmx-hero-stage" aria-label="پیش‌نمایش داشبورد پزشک و اپ بیمار">
          <div className="dmx-orbit dmx-orbit-one" />
          <div className="dmx-orbit dmx-orbit-two" />
          <div className="dmx-dashboard">
            <div className="dmx-dash-top">
              <div><span className="dmx-mini-mark">د</span><strong>مرکز کنترل بالینی</strong></div>
              <div className="dmx-window-dots"><i /><i /><i /></div>
            </div>
            <div className="dmx-dash-layout">
              <aside><b>د</b><span className="active">⌂</span><span>◫</span><span>◎</span><span>◌</span><span>⌁</span></aside>
              <section>
                <div className="dmx-dash-welcome"><div><small>صبح بخیر، دکتر نادری</small><h3>مرکز بررسی امروز</h3></div><button>شروع بررسی</button></div>
                <div className="dmx-dash-stats"><article><span>اسکن تازه</span><strong>۱۲</strong><i className="good">+۳ امروز</i></article><article><span>نیازمند توجه</span><strong>۰۳</strong><i>اولویت بالا</i></article><article><span>زمان پاسخ</span><strong>۱۸<small>دقیقه</small></strong><i className="good">در محدوده هدف</i></article></div>
                <div className="dmx-queue-head"><div><strong>صف بازبینی</strong><small>مرتب‌شده بر اساس اولویت</small></div><span>مشاهده همه</span></div>
                <div className="dmx-queue-row urgent"><b>س‌م</b><span><strong>سارا محمدی</strong><small>الاینر · مرحله ۱۴</small></span><p>حرکت دندان ۱۲ نیازمند بررسی</p><i>فوری</i><em>←</em></div>
                <div className="dmx-queue-row"><b>ا‌ر</b><span><strong>امیررضا رضایی</strong><small>براکت · ماه ۸</small></span><p>اسکن دوره‌ای دریافت شد</p><i>امروز</i><em>←</em></div>
                <div className="dmx-queue-row"><b>ن‌ک</b><span><strong>نیلا کریمی</strong><small>ریتینر · ماه ۲</small></span><p>کیفیت اسکن تأیید شد</p><i className="calm">عادی</i><em>←</em></div>
              </section>
            </div>
          </div>

          <div className="dmx-phone">
            <div className="dmx-phone-cut" />
            <header><span>۹:۴۱</span><span>● 5G ▰</span></header>
            <div className="dmx-phone-brand"><b>د</b><span>دنتامانیتور</span><i>•••</i></div>
            <div className="dmx-phone-copy"><small>سلام سارا،</small><h3>امروز وقت اسکن است.</h3><p>با یک اسکن سه‌دقیقه‌ای مسیر درمانت را به‌روز نگه دار.</p></div>
            <div className="dmx-scan-card"><div className="dmx-scan-ring"><span>◉</span></div><strong>آماده ثبت</strong><small>۵ نما · حدود ۳ دقیقه</small><button>شروع اسکن <span>←</span></button></div>
            <footer><span className="active">⌂<small>خانه</small></span><span>◉<small>اسکن</small></span><span>◌<small>پیام‌ها</small></span></footer>
          </div>

          <div className="dmx-float-card dmx-float-ai"><span>AI</span><p><strong>پرونده آماده بررسی است</strong><small>کیفیت هر ۵ نما تأیید شد</small></p><i>✓</i></div>
          <div className="dmx-float-card dmx-float-care"><span>ن‌ن</span><p><strong>دکتر نادری</strong><small>پیام جدید برای بیمار</small></p><i>←</i></div>
        </div>
      </section>

      <section className="dmx-capability-strip" aria-label="توانمندی‌های اصلی">
        <span>یک پلتفرم برای</span>
        <div><b>پایش از راه دور</b><i /> <b>کنترل بالینی</b><i /> <b>تجربه بیمار</b><i /> <b>بهینه‌سازی کلینیک</b></div>
      </section>

      <section className="dmx-section dmx-platform" id="platform">
        <div className="dmx-section-intro">
          <span>ارتودنسی هوشمند از اینجا شروع می‌شود</span>
          <h2>یک تصویر کامل‌تر از درمان،<br />برای تصمیم‌های مطمئن‌تر.</h2>
          <p>دنتامانیتور فاصله بین ویزیت‌ها را به بخشی فعال از مراقبت تبدیل می‌کند؛ هر نقش ابزار خودش را دارد و همه روی یک مسیر مشترک حرکت می‌کنند.</p>
        </div>
        <div className="dmx-pillar-grid">
          {pillars.map((pillar) => (
            <a className={`dmx-pillar dmx-pillar-${pillar.tone}`} href={pillar.href} key={pillar.number}>
              <div className="dmx-pillar-top"><span>{pillar.number}</span><i>↗</i></div>
              <small>{pillar.eyebrow}</small>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <div className="dmx-pillar-art"><i /><i /><i /><b>{pillar.number === "01" ? "بازبینی" : pillar.number === "02" ? "همراه درمان" : "نمای کلینیک"}</b></div>
            </a>
          ))}
        </div>
      </section>

      <section className="dmx-feature dmx-feature-clinical">
        <div className="dmx-feature-copy">
          <span>کنترل بالینی</span>
          <h2>تغییرات را زودتر ببینید؛<br />تصمیم را خودتان بگیرید.</h2>
          <p>نمای مقایسه‌ای، یافته‌های اولویت‌بندی‌شده و سابقه تصمیم‌ها، شواهد را منظم می‌کنند تا زمان پزشک صرف قضاوت بالینی شود.</p>
          <ul><li><i>✓</i> مقایسه اسکن فعلی با خط مبنا</li><li><i>✓</i> صف شخصی براساس فوریت و زمان انتظار</li><li><i>✓</i> ثبت دلیل تصمیم و امضای دیجیتال</li></ul>
          <a href="/doctor">تجربه داشبورد پزشک <b>←</b></a>
        </div>
        <div className="dmx-clinical-visual">
          <div className="dmx-case-head"><span><b>س‌م</b><i><strong>سارا محمدی</strong><small>پرونده ۱۴۰۳-۰۲۸ · مرحله ۱۴</small></i></span><em>نیازمند بررسی</em></div>
          <div className="dmx-compare"><article><span>اسکن فعلی</span><div className="dmx-mouth"><i /><i /><i /><i /><i /><i /><i /><i /></div><small>۲۱ مرداد ۱۴۰۵</small></article><article><span>اسکن قبلی</span><div className="dmx-mouth old"><i /><i /><i /><i /><i /><i /><i /><i /></div><small>۱۴ مرداد ۱۴۰۵</small></article></div>
          <div className="dmx-finding"><span>!</span><p><small>پیشنهاد برای بازبینی</small><strong>حرکت دندان ۱۲ کمتر از مسیر مورد انتظار است.</strong></p><button>باز کردن پرونده ←</button></div>
        </div>
      </section>

      <section className="dmx-numbers">
        <div><span>۴</span><p><strong>تجربه تخصصی</strong><small>برای بیمار، پزشک، کلینیک و مدیر پلتفرم</small></p></div>
        <div><span>۵</span><p><strong>نمای هدایت‌شده</strong><small>در یک جریان ساده ثبت اسکن</small></p></div>
        <div><span>۱</span><p><strong>مسیر مشترک</strong><small>از ثبت شواهد تا اقدام تأییدشده</small></p></div>
        <div><span>۲۴/۷</span><p><strong>دسترسی به مسیر درمان</strong><small>برای پیگیری، پیام و یادآوری</small></p></div>
      </section>

      <section className="dmx-section dmx-solutions" id="solutions">
        <div className="dmx-section-intro dmx-intro-row"><div><span>راهکارهای یک پلتفرم هوشمند</span><h2>هر ابزار، درست در جای خودش.</h2></div><p>از نخستین درخواست مشاوره تا پایش درمان و تحلیل عملکرد؛ ماژول‌ها به‌هم متصل‌اند اما مرز مسئولیت‌ها شفاف می‌ماند.</p></div>
        <div className="dmx-solution-grid">
          {solutions.map(([code, title, copy, href], index) => (
            <a href={href} className={`dmx-solution-card solution-${index + 1}`} key={code}>
              <header><span>{code}</span><i>↗</i></header><div><small>راهکار {String(index + 1).padStart(2, "0")}</small><h3>{title}</h3><p>{copy}</p></div>
            </a>
          ))}
        </div>
      </section>

      <section className="dmx-journey" id="journey">
        <div className="dmx-journey-copy"><span>از خانه تا کلینیک</span><h2>چهار قدم روشن،<br />بدون میان‌بُر بالینی.</h2><p>هر رویداد قابل پیگیری است و بیمار فقط پیام یا دستور تأییدشده پزشک را دریافت می‌کند.</p><a href="/app">باز کردن اپ نمایشی <b>←</b></a></div>
        <div className="dmx-journey-list">
          {journey.map(([number, title, copy], index) => <article key={number}><span>{number}</span><div><small>مرحله {index + 1}</small><h3>{title}</h3><p>{copy}</p></div><i>←</i></article>)}
        </div>
      </section>

      <section className="dmx-role-showcase">
        <div className="dmx-role-copy"><span>یک اپلیکیشن، دو تجربه</span><h2>نقش خود را انتخاب کنید؛<br />محصول با شما هماهنگ می‌شود.</h2><p>بیمار وارد مسیر اسکن و درمان می‌شود و پزشک صف بازبینی، پیام‌ها و موارد فوری خود را می‌بیند.</p><div><a className="dmx-button" href="/app">تجربه اپلیکیشن <b>←</b></a><a href="/portals">همه داشبوردها</a></div></div>
        <div className="dmx-role-device">
          <div className="dmx-role-logo"><span className="dmx-brand-mark"><i /><i /></span><b>دنتامانیتور</b></div>
          <small>خوش آمدید</small><h3>چطور از دنتامانیتور استفاده می‌کنید؟</h3>
          <a href="/app"><span className="patient">◎</span><p><strong>بیمار هستم</strong><small>اسکن، پیام و پیگیری درمان</small></p><i>←</i></a>
          <a href="/app"><span className="doctor">✦</span><p><strong>پزشک هستم</strong><small>بازبینی، تصمیم و ارتباط</small></p><i>←</i></a>
          <p className="dmx-role-footnote">این ورود برای نمایش تجربه محصول است و اطلاعات واقعی دریافت نمی‌کند.</p>
        </div>
      </section>

      <section className="dmx-trust" id="trust">
        <div className="dmx-trust-orb"><span>✓</span><i className="t1">ممیزی</i><i className="t2">رضایت</i><i className="t3">دسترسی</i><i className="t4">امضا</i></div>
        <div className="dmx-trust-copy"><span>اعتماد، بخشی از معماری محصول</span><h2>پیشنهاد هوشمند؛<br />تصمیم انسانی.</h2><p>کنترل دسترسی نقش‌محور، رضایت نسخه‌دار، ثبت رویدادها و توقف امن، از ابتدا در تجربه محصول دیده شده‌اند.</p><div className="dmx-trust-points"><article><b>01</b><span><strong>مرز روشن نقش‌ها</strong><small>هر کاربر فقط داده و ابزار ضروری برای مسئولیت خود را می‌بیند.</small></span></article><article><b>02</b><span><strong>خروجی قابل ردیابی</strong><small>تصمیم‌ها به شواهد، نسخه، زمان و کاربر مشخص متصل می‌شوند.</small></span></article><article><b>03</b><span><strong>انتشار پس از تأیید</strong><small>هیچ یافته خام یا تصمیم امضانشده مستقیماً به بیمار نمی‌رسد.</small></span></article></div></div>
      </section>

      <section className="dmx-final-cta">
        <div><span>آماده کشف محصول هستید؟</span><h2>هر نقش، یک تجربه کامل.<br />همه در یک پلتفرم متصل.</h2></div>
        <div><a className="dmx-button dmx-button-light" href="/portals">ورود به مرکز تجربه‌ها <b>←</b></a><a href="/engage">درخواست مشاوره</a></div>
      </section>

      <footer className="dmx-footer">
        <div className="dmx-footer-top">
          <div><a className="dmx-brand dmx-brand-footer" href="/"><span className="dmx-brand-mark"><i /><i /></span><span><strong>دنتامانیتور ایران</strong><small>DENTAMONITOR IRAN</small></span></a><p>یک نمونه نمایشی از پلتفرم متصل پایش ارتودنسی برای بازار ایران.</p></div>
          <nav><strong>محصول</strong><a href="/patient">داشبورد بیمار</a><a href="/doctor">داشبورد پزشک</a><a href="/clinic">داشبورد کلینیک</a><a href="/admin">مدیریت پلتفرم</a></nav>
          <nav><strong>تجربه‌ها</strong><a href="/app">اپلیکیشن مشترک</a><a href="/engage">درخواست مشاوره</a><a href="/annotation">فضای حاشیه‌نویسی</a><a href="/portals">مرکز ورود</a></nav>
          <nav><strong>چارچوب</strong><a href="#trust">ایمنی</a><a href="#journey">نحوه کار</a><a href="#platform">معرفی پلتفرم</a><a href="#solutions">راهکارها</a></nav>
        </div>
        <div className="dmx-footer-bottom"><p>این وب‌سایت یک دموی محصول است و ابزار تشخیص، توصیه درمانی یا سامانه آماده بهره‌برداری بالینی نیست.</p><span>© ۱۴۰۵ دنتامانیتور ایران</span></div>
      </footer>
    </main>
  );
}
