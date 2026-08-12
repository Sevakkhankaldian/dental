"use client";

import { FormEvent, useState } from "react";

type Role = "patient" | "doctor";
type Step = "role" | "login" | "dashboard";

export default function AppGateway() {
  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState<Step>("role");
  const [toast, setToast] = useState("");

  const chooseRole = (nextRole: Role) => { setRole(nextRole); setStep("login"); };
  const login = (event: FormEvent) => { event.preventDefault(); setStep("dashboard"); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };

  return (
    <main className={`unified-app role-${role ?? "none"}`} dir="rtl">
      <section className="app-device">
        <div className="app-device-top"><span>۹:۴۱</span><i /><span>● 5G ▰</span></div>
        {step === "role" && <section className="role-gateway">
          <a href="/" className="app-logo"><span>د</span><b>دنتامانیتور</b></a>
          <div className="role-hero"><span>خوش آمدید</span><h1>شما چطور از دنتامانیتور استفاده می‌کنید؟</h1><p>نقش خود را انتخاب کنید تا محیط مناسب شما نمایش داده شود.</p></div>
          <div className="role-options">
            <button type="button" onClick={() => chooseRole("patient")}><i>◎</i><span><strong>بیمار هستم</strong><small>اسکن، پیام و پیگیری درمان</small></span><b>←</b></button>
            <button type="button" onClick={() => chooseRole("doctor")}><i>✦</i><span><strong>پزشک هستم</strong><small>بررسی اسکن و تصمیم بالینی</small></span><b>←</b></button>
          </div>
          <div className="role-security"><span>◈</span><p>ورود امن و تجربه اختصاصی بر اساس نقش شما</p></div>
        </section>}

        {step === "login" && role && <section className="app-login">
          <button className="app-back" type="button" onClick={() => { setStep("role"); setRole(null); }}>→</button>
          <div className="login-role-icon">{role === "patient" ? "◎" : "✦"}</div>
          <span>{role === "patient" ? "ورود بیمار" : "ورود پزشک"}</span>
          <h1>{role === "patient" ? "به مسیر درمانت برگرد" : "به فضای بالینی خود برگردید"}</h1>
          <p>{role === "patient" ? "شماره‌ای را وارد کن که دعوت کلینیک برای آن ارسال شده است." : "با حساب سازمانی و احراز هویت چندمرحله‌ای وارد شوید."}</p>
          <form onSubmit={login}>
            {role === "patient" ? <label><span>شماره موبایل</span><div className="app-input"><b>+۹۸</b><input required inputMode="tel" defaultValue="۹۱۲ ۱۲۳ ۴۵۶۷" /><i>◌</i></div></label> : <label><span>ایمیل سازمانی</span><div className="app-input"><input required type="email" defaultValue="doctor@demo.clinic" dir="ltr" /><i>@</i></div></label>}
            <button type="submit">{role === "patient" ? "دریافت رمز یک‌بارمصرف" : "ادامه با ورود امن"} ←</button>
          </form>
          <small>این یک ورود نمایشی است؛ اطلاعات واردشده ذخیره یا ارسال نمی‌شود.</small>
        </section>}

        {step === "dashboard" && role === "patient" && <section className="mobile-dashboard patient-mobile">
          <header><div><small>سلام سارا،</small><strong>امروز وقت اسکن توست</strong></div><button onClick={() => notify("اعلان‌های نمایشی خوانده شدند.")}>♢<i /></button><span>س‌م</span></header>
          <div className="mobile-stage-card"><small>درمان الاینر شفاف</small><div><span><strong>۱۴</strong><i>از ۲۸</i></span><p><b>مرحله فعلی</b><small>شروع: ۲۱ تیر ۱۴۰۵</small></p></div><em><i /></em></div>
          <button className="mobile-scan-cta" onClick={() => notify("جریان اسکن نمایشی آماده شد.")}><span>◉</span><div><small>اسکن دوره‌ای</small><strong>امروز تا ساعت ۲۱</strong><p>حدود ۳ دقیقه · ۵ نما</p></div><b>شروع ←</b></button>
          <h2>امروز</h2><div className="mobile-action-grid"><button><span>◌</span><b>پیام پزشک</b><small>۱ پیام تازه</small></button><button><span>□</span><b>نوبت بعدی</b><small>۲۵ مرداد</small></button></div>
          <div className="signed-mobile-note"><span>✓</span><p><small>دستور تأییدشده</small><strong>مرحله فعلی را تا اسکن امروز ادامه بده.</strong><i>دکتر نادری · ۱۰:۳۱</i></p></div>
          <nav><button className="active">⌂<small>خانه</small></button><button>◷<small>اسکن</small></button><button>◌<small>پیام</small></button><button>◎<small>پروفایل</small></button></nav>
        </section>}

        {step === "dashboard" && role === "doctor" && <section className="mobile-dashboard doctor-mobile">
          <header><div><small>صبح بخیر،</small><strong>دکتر نادری</strong></div><button onClick={() => notify("اعلان‌های بالینی ساختگی خوانده شدند.")}>♢<i /></button><span>ن‌ن</span></header>
          <div className="doctor-mobile-summary"><span><small>منتظر بررسی</small><strong>۱۲</strong></span><span><small>فوری</small><strong>۳</strong></span><span><small>پیام جدید</small><strong>۵</strong></span></div>
          <div className="doctor-next"><header><span>مورد بعدی</span><small>SLA · ۱۲ دقیقه</small></header><div><i>س‌م</i><p><strong>سارا محمدی</strong><small>الاینر · مرحله ۱۴</small></p><b>فوری</b></div><p>احتمال فاصله الاینر در ناحیه دندان ۱۳؛ بررسی انسانی لازم است.</p><button onClick={() => notify("نمای بررسی ساختگی باز شد.")}>شروع بررسی ←</button></div>
          <h2>صف امروز</h2><div className="doctor-mobile-list">{[["ا‌ر","امیررضا رضایی","گزارش درد","فوری"],["ن‌ک","نیلوفر کریمی","اسکن دوره‌ای","توجه"],["م‌ف","محمد فرهادی","کیفیت ناکافی","پیگیری"]].map((item,index)=><button key={item[1]}><i>{item[0]}</i><span><strong>{item[1]}</strong><small>{item[2]}</small></span><b className={index===0?"urgent":""}>{item[3]}</b><em>←</em></button>)}</div>
          <nav><button className="active">⌂<small>امروز</small></button><button>◫<small>بررسی</small></button><button>◌<small>پیام</small></button><button>◎<small>حساب</small></button></nav>
        </section>}
      </section>
      <aside className="app-side-copy"><a href="/">← بازگشت به سایت معرفی</a><span>اپلیکیشن یکپارچه دنتامانیتور</span><h2>{step === "role" ? "یک نقطه ورود، دو تجربه کاملاً متفاوت." : role === "patient" ? "بیمار، فقط مسیر درمان خودش را می‌بیند." : "پزشک، ابزار تصمیم‌گیری شخصی خود را دارد."}</h2><p>انتخاب نقش تنها ظاهر را عوض نمی‌کند؛ ناوبری، زبان، اولویت‌ها و سطح دسترسی متناسب با مسئولیت کاربر تغییر می‌کند.</p><div><i>✓</i><span><strong>ورود نقش‌محور</strong><small>بیمار با OTP، پزشک با MFA سازمانی</small></span></div><div><i>✓</i><span><strong>مرز داده روشن</strong><small>بدون نمایش خروجی خام AI به بیمار</small></span></div><div><i>✓</i><span><strong>ادامه روی وب</strong><small>داشبوردهای کامل در مرورگر هم در دسترس‌اند</small></span></div><nav><a href="/patient">داشبورد وب بیمار</a><a href="/doctor">داشبورد وب پزشک</a></nav></aside>
      {toast && <div className="app-toast">✓ {toast}</div>}
    </main>
  );
}
