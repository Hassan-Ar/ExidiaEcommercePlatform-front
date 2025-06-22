# دليل استكشاف الأخطاء وإصلاحها - Exidia Ecommerce Platform

## مشاكل التحقق من صحة البيانات (Validation Errors)

### 1. خطأ "The value 'top' is not valid"

**السبب المحتمل:**
- قيمة غير صحيحة في أحد الحقول
- مشكلة في تنسيق البيانات المرسلة للخادم
- خطأ في التحقق من صحة البيانات في النموذج

**الحلول:**

#### أ. التحقق من قيم الحقول
```typescript
// تأكد من أن جميع القيم صحيحة قبل الإرسال
const dto: CreateUpdateProductDto = {
  name: formValue.name?.trim(),
  description: formValue.description?.trim() || '',
  price: Number(formValue.price) || 0,
  discountPercent: Number(formValue.discountPercent) || 0,
  stockQuantity: Number(formValue.stockQuantity) || 0,
  sku: formValue.sku?.trim(),
  categoryId: formValue.categoryId,
  isActive: Boolean(formValue.isActive)
};
```

#### ب. إضافة تحقق من صحة البيانات في النموذج
```typescript
this.form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  description: ['', [Validators.maxLength(500)]],
  price: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  discountPercent: [0, [Validators.min(0), Validators.max(100), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  stockQuantity: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
  sku: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
  categoryId: ['', Validators.required],
  isActive: [true]
});
```

#### ج. معالجة الأخطاء بشكل صحيح
```typescript
private handleError(error: any): void {
  if (error.error?.error?.message) {
    this.errorMessage = error.error.error.message;
  } else if (error.error?.message) {
    this.errorMessage = error.error.message;
  } else if (error.message) {
    this.errorMessage = error.message;
  } else {
    this.errorMessage = 'An unexpected error occurred. Please try again.';
  }
}
```

### 2. مشاكل في تحميل البيانات

**الأعراض:**
- عدم ظهور البيانات في القوائم
- أخطاء في تحميل الفئات أو المنتجات

**الحلول:**

#### أ. التحقق من استجابة الخادم
```typescript
loadCategories(): void {
  this.categoryService.getList({ maxResultCount: 1000 }).subscribe({
    next: (response) => {
      console.log('Categories response:', response);
      this.categories = response.items || [];
    },
    error: (error) => {
      console.error('Error loading categories:', error);
      this.errorMessage = 'Failed to load categories. Please try again.';
    }
  });
}
```

#### ب. إضافة معالجة للأخطاء
```typescript
// في كل استدعاء للخدمة
.subscribe({
  next: (data) => {
    // معالجة البيانات
  },
  error: (error) => {
    this.errorHandler.logError(error, 'ComponentName');
    this.errorMessage = this.errorHandler.getUserFriendlyMessage(error);
  }
});
```

### 3. مشاكل في رفع الملفات

**الأعراض:**
- عدم رفع الصور
- أخطاء في حجم الملف

**الحلول:**

#### أ. التحقق من نوع وحجم الملف
```typescript
onFileSelected(event: any): void {
  const file = event.target.files[0];
  this.fileError = '';
  
  if (file) {
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      this.fileError = 'Please select a valid image file.';
      return;
    }
    
    // التحقق من حجم الملف (أقل من 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'Image file size must be less than 5MB.';
      return;
    }
    
    this.selectedFile = file;
  }
}
```

### 4. مشاكل في الاتصال بالخادم

**الأعراض:**
- أخطاء شبكة
- عدم استجابة الخادم

**الحلول:**

#### أ. التحقق من إعدادات البيئة
```typescript
// في environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://your-api-url.com',
  // تأكد من صحة عنوان API
};
```

#### ب. إضافة معالجة لأخطاء الشبكة
```typescript
if (this.errorHandler.isNetworkError(error)) {
  this.errorMessage = 'Network error. Please check your internet connection and try again.';
}
```

## خطوات التشخيص العامة

### 1. فحص وحدة التحكم (Console)
```javascript
// افتح وحدة التحكم في المتصفح (F12)
// ابحث عن الأخطاء الحمراء
console.error('Error details:', error);
```

### 2. فحص شبكة الاتصال (Network Tab)
```javascript
// في أدوات المطور، انتقل إلى Network
// تحقق من طلبات HTTP الفاشلة
// ابحث عن رموز الحالة 400, 422, 500
```

### 3. فحص البيانات المرسلة
```typescript
// أضف سجلات للبيانات قبل الإرسال
console.log('Data being sent:', dto);
```

### 4. اختبار API مباشرة
```bash
# استخدم Postman أو curl لاختبار API
curl -X POST https://your-api-url.com/api/app/product \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":10}'
```

## نصائح للوقاية

### 1. التحقق من صحة البيانات
- استخدم Validators في النماذج
- تحقق من نوع البيانات قبل الإرسال
- نظف البيانات (trim, sanitize)

### 2. معالجة الأخطاء
- استخدم try-catch blocks
- أضف معالجة للأخطاء في كل استدعاء للخدمة
- اعرض رسائل خطأ واضحة للمستخدم

### 3. اختبار شامل
- اختبر النماذج مع بيانات صحيحة وخاطئة
- اختبر حدود الحقول (الحد الأدنى والأقصى)
- اختبر رفع الملفات

### 4. مراقبة الأداء
- استخدم أدوات المراقبة
- سجل الأخطاء للتحليل
- راقب استجابة الخادم

## روابط مفيدة

- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [Angular HTTP Error Handling](https://angular.io/guide/http#error-handling)
- [ABP Framework Documentation](https://docs.abp.io/)
- [Bootstrap Form Validation](https://getbootstrap.com/docs/5.0/forms/validation/) 