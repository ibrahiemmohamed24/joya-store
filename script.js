document.addEventListener("DOMContentLoaded", function () {
    /* ========= Slider ========= */
    const sets = document.querySelectorAll('.slide-set');
    let currentSet = 0;

    if (sets.length > 0) {
        function changeSet() {
            sets[currentSet].classList.remove('active');
            currentSet = (currentSet + 1) % sets.length;
            sets[currentSet].classList.add('active');
        }
        setInterval(changeSet, 3000);
    }

    /* ========= اختيار اللون - مع تأثير بصري ========= */
    document.querySelectorAll('.colors .color').forEach(color => {
        color.addEventListener('click', () => {
            // إزالة active من جميع الألوان في نفس المجموعة
            const siblings = color.parentElement.querySelectorAll('.color');
            siblings.forEach(sib => {
                sib.classList.remove('active');
                sib.style.transform = 'scale(1)';
                sib.style.border = '2px solid #ddd';
            });
            
            // إضافة active للون المختار
            color.classList.add('active');
            color.style.transform = 'scale(1.3)';
            color.style.border = '3px solid #ff69b4';
            
            // إظهار رسالة اختيار اللون
            console.log('تم اختيار اللون:', color.dataset.color);
        });
    });

    /* ========= الذهاب لصفحة السلة ========= */
    const cartBtn = document.getElementById('cartOut');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    /* ========= زر Shop Now ========= */
    const shopBtn = document.getElementById('shopNow');
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            // التمرير إلى قسم المنتجات
            const productsSection = document.querySelector('.product');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ========= تحديث عداد السلة عند التحميل ========= */
    updateCartCount();
});

/* =========================
   التحكم في الكمية
========================= */
function increaseQty(button) {
    const qty = button.parentElement.querySelector('.qty');
    qty.textContent = parseInt(qty.textContent) + 1;
}

function decreaseQty(button) {
    const qty = button.parentElement.querySelector('.qty');
    const current = parseInt(qty.textContent);
    if (current > 1) {
        qty.textContent = current - 1;
    }
}

/* =========================
   إضافة للسلة مع LocalStorage
========================= */
function addToCart(button, productName) {
    const product = button.closest('.product');
    const qty = parseInt(product.querySelector('.qty').textContent);
    
    // التأكد من اختيار اللون
    const selectedColor = product.querySelector('.color.active');
    if (!selectedColor) {
        alert('⚠️ يرجى اختيار اللون أولاً!');
        return;
    }
    
    const color = selectedColor.dataset.color;
    const img = product.querySelector('.product-images img')?.src || '';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // البحث عن المنتج بنفس الاسم واللون
    const existing = cart.find(item => item.name === productName && item.color === color);
    
    if (existing) {
        existing.quantity += qty;
        alert(`✅ تم تحديث الكمية!\n${qty} قطعة إضافية من ${productName}\nاللون: ${color}`);
    } else {
        cart.push({ 
            name: productName, 
            color: color, 
            quantity: qty, 
            img: img 
        });
        alert(`✅ تمت الإضافة للسلة!\n${qty} قطعة من ${productName}\nاللون: ${color}`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // إعادة تعيين الكمية إلى 1
    product.querySelector('.qty').textContent = '1';
}

/* =========================
   شراء الآن
========================= */
function buyNow(button, productName) {
    const product = button.closest('.product');
    
    // التأكد من اختيار اللون
    const selectedColor = product.querySelector('.color.active');
    if (!selectedColor) {
        alert('⚠️ يرجى اختيار اللون أولاً!');
        return;
    }
    
    // إضافة للسلة أولاً
    addToCart(button, productName);
    
    // الانتقال لصفحة السلة
    setTimeout(() => {
        window.location.href = "checkout.html";
    }, 500);
}

/* =========================
   تحديث عداد السلة
========================= */
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = total;
    }
    
    // تحديث نص زر السلة
    const cartBtn = document.getElementById('cartOut');
    if (cartBtn && total > 0) {
        cartBtn.textContent = `السلة (${total})`;
    } else if (cartBtn) {
        cartBtn.textContent = 'السلة 🛒';
    }
}
