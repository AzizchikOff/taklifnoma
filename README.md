# Bir umr birga
Build talab qilmaydigan HTML/CSS/JS to‘y taklifnomasi.

`config.js` ichida haqiqiy ismlar, sana, vaqt, to‘yxona, manzil va xarita havolasini kiriting. Sana suhbatdagi ertaga asosida 2026-10-16, qolgan ma’lumotlar hali tasdiqlanmagan. Vaqt bo‘sh bo‘lsa taymer va taqvim faol emas. Vaqt zonasi +05:00 (O‘zbekiston). Musiqa manzili ixtiyoriy va faqat konvert bosilganda ijro qilinadi.

- `/`: umumiy taklif; barcha mehmonlar uchun bitta havola.
- `/links.html`: ism va tur tanlab havola yaratish, ko‘rish va nusxalash.
- `/?guest=Anvar%20aka&type=honor`: ehtiromli matn va yashil konvert.

Sayt mehmon ismini avtomatik bilmaydi. Ism kiritish ixtiyoriy, havoladagi ism ochiq ko‘rinadi. Maxsus tur shaxsni tasdiqlamaydi yoki kirishni cheklamaydi. Ismlar textContent orqali xavfsiz ko‘rsatiladi. RSVP yig‘ilmaydi.

Mahalliy ishga tushirish: `python3 -m http.server 8080`.
Netlify: build command bo‘sh, publish directory `.`.
O‘zbek/rus tili, mobil maket, kamaytirilgan animatsiya va ICS taqvim bor. Google Fonts ishlamasa tizim shriftlari ishlaydi. Tashqi JS kutubxonalari talab qilinmaydi.
