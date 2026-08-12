const portals = [
  { id: "patient", code: "PATIENT", icon: "◎", title: "داشبورد بیمار", copy: "درمان، اسکن‌ها، دستورهای پزشک، پیام‌ها، نوبت‌ها و پیشرفت شخصی بیمار.", detail: "۲۸ جریان بیمار", href: "/patient", accent: "#287d91" },
  { id: "doctor", code: "DOCTOR", icon: "✦", title: "داشبورد پزشک", copy: "صف بررسی شخصی، شواهد، مقایسه طولی، تصمیم و امضای بالینی پزشک.", detail: "۱۴ جریان تخصصی", href: "/doctor", accent: "#2766a8" },
  { id: "clinic", code: "CLINIC", icon: "⌘", title: "داشبورد کلینیک", copy: "عملیات تیم، بیماران، نوبت‌ها، پروتکل‌ها، SLA، تحلیل و مدیریت شعب.", detail: "۳۲ ماژول عملیاتی", href: "/clinic", accent: "#19736a" },
  { id: "admin", code: "PLATFORM", icon: "◈", title: "داشبورد ادمین پلتفرم", copy: "مستاجران، سلامت سرویس، امنیت، ممیزی، مدل‌ها، دیتاست‌ها و رخدادها.", detail: "۱۶ کنسول مدیریتی", href: "/admin", accent: "#6750a4" },
];

export default function PortalHub() {
  return (
    <main className="access-center" dir="rtl">
      <header className="access-header"><a href="/" className="hub-brand"><span className="hub-logo">د</span><span><strong>دنتامانیتور</strong><small>مرکز ورود امن</small></span></a><a href="/">بازگشت به سایت معرفی ←</a></header>
      <section className="access-intro"><span>انتخاب فضای کاری</span><h1>از کدام بخش وارد می‌شوید؟</h1><p>هر داشبورد برای یک نقش و مسئولیت مشخص طراحی شده است. این نسخه نمایشی است و به داده واقعی متصل نیست.</p></section>
      <section className="access-grid">{portals.map((portal, index) => <a href={portal.href} key={portal.id} className="access-card" style={{ "--access-accent": portal.accent } as React.CSSProperties}><header><span>۰{index + 1}</span><b>{portal.code}</b></header><i>{portal.icon}</i><h2>{portal.title}</h2><p>{portal.copy}</p><footer><small>{portal.detail}</small><strong>ورود به داشبورد ←</strong></footer></a>)}</section>
      <section className="access-app"><div className="access-app-visual"><span>◎</span><i>یا</i><span>✦</span></div><div><small>اپلیکیشن مشترک</small><h2>بیمار هستید یا پزشک؟</h2><p>اپ نقش شما را در شروع می‌پرسد و بعد از ورود، تجربه مخصوص همان نقش را نمایش می‌دهد.</p></div><a href="/app">باز کردن اپلیکیشن ←</a></section>
      <footer className="access-utilities"><span>فضاهای تخصصی تیم داخلی:</span><a href="/annotation">Annotation و داده</a><i /> <a href="/engage">Engage و متقاضیان</a></footer>
    </main>
  );
}
