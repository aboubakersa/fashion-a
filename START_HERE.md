# 🚀 دليل تشغيل المشروع

## أولاً: تثبيت Backend

```bash
cd backend
pip install -r requirements.txt

# إنشاء قاعدة البيانات
python manage.py makemigrations
python manage.py migrate

# إنشاء حساب Admin
python manage.py createsuperuser

# تشغيل السيرفر
python manage.py runserver
```
السيرفر يعمل على: http://localhost:8000

---

## ثانياً: تثبيت Frontend

```bash
cd frontend
npm install
npm start
```
الموقع يعمل على: http://localhost:3000

---

## الروابط الجاهزة (API Endpoints)

### المستخدمين
| الطريقة | الرابط | الوظيفة |
|---------|--------|---------|
| POST | /api/auth/register/ | إنشاء حساب |
| POST | /api/auth/login/ | تسجيل دخول |
| POST | /api/auth/logout/ | تسجيل خروج |
| GET/PUT | /api/auth/profile/ | بيانات المستخدم |

### التصاميم
| الطريقة | الرابط | الوظيفة |
|---------|--------|---------|
| GET | /api/designs/ | كل التصاميم |
| POST | /api/designs/ | إضافة تصميم |
| GET | /api/designs/my/ | تصاميمي |
| GET/PUT/DELETE | /api/designs/1/ | تصميم محدد |

### الذكاء الاصطناعي
| الطريقة | الرابط | الوظيفة |
|---------|--------|---------|
| POST | /api/ai/generate/ | توليد تصميم |
| POST | /api/ai/variations/ | تنويعات التصميم |

### الطلبات
| الطريقة | الرابط | الوظيفة |
|---------|--------|---------|
| GET/POST | /api/orders/ | طلباتي |
| GET | /api/orders/1/ | طلب محدد |

---

## ⚠️ الأشياء التي تحتاج تغييرها

في `backend/config/settings.py`:
- `SECRET_KEY` ← غيّره لأي نص عشوائي
- `OPENAI_API_KEY` ← مفتاحك من openai.com

---

## لوحة الإدارة
http://localhost:8000/admin/
(سجل بالحساب الذي أنشأته بـ createsuperuser)
