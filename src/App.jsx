import { useState, useEffect } from 'react';
import './App.css';

const menuItems = [
  { id: 1, name: "Respawn Ramen", emoji: "🍜", desc: "Comeback soup loaded with XP noodles and legendary broth.", price: 12.99, category: "Mains", badge: "Popular" },
  { id: 2, name: "Loot Box Burger", emoji: "🍔", desc: "Mystery toppings change daily. Every bite is a surprise drop.", price: 11.49, category: "Mains", badge: "Chef's Special" },
  { id: 3, name: "Health Potion Smoothie", emoji: "🧃", desc: "+50 HP. Strawberry, mango & rare dragon fruit blend.", price: 6.99, category: "Drinks", badge: "Popular" },
  { id: 4, name: "Final Boss Wings", emoji: "🍗", desc: "Insanely spicy wings. Only attempt if max level.", price: 13.99, category: "Mains", badge: "Chef's Special" },
  { id: 5, name: "Pixel Pizza", emoji: "🍕", desc: "8-bit style margherita with extra cheese power-ups.", price: 14.49, category: "Mains", badge: null },
  { id: 6, name: "Side Quest Salad", emoji: "🥗", desc: "A humble side mission. Greens, croutons & XP dressing.", price: 7.99, category: "Sides", badge: null },
  { id: 7, name: "Mana Mochi", emoji: "🍡", desc: "Restores mana. Green tea, strawberry & sesame flavours.", price: 5.49, category: "Desserts", badge: "Popular" },
  { id: 8, name: "AFK Fries", emoji: "🍟", desc: "Perfect for when you go AFK. Crispy, golden, unstoppable.", price: 4.99, category: "Sides", badge: null },
];

const categories = ["All", "Mains", "Sides", "Drinks", "Desserts"];

export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || {}; } catch { return {}; }
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [step, setStep] = useState('menu');
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', cardName: '' });
  const [errors, setErrors] = useState({});
  const [payErrors, setPayErrors] = useState({});
  const [orderId] = useState(() => Math.floor(Math.random() * 90000 + 10000));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const addToCart = (item) => {
    setCart(prev => ({ ...prev, [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 } }));
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const newQty = (prev[id]?.qty || 0) + delta;
      if (newQty <= 0) { const next = { ...prev }; delete next[id]; return next; }
      return { ...prev, [id]: { ...prev[id], qty: newQty } };
    });
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const validateDelivery = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validatePayment = () => {
    const e = {};
    const rawCard = payment.card.replace(/\s/g, '');
    if (!payment.cardName.trim()) e.cardName = 'Name on card is required';
    if (rawCard.length !== 16) e.card = 'Enter a valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = 'Enter expiry as MM/YY';
    if (!/^\d{3,4}$/.test(payment.cvv)) e.cvv = 'Enter a valid CVV';
    setPayErrors(e);
    return Object.keys(e).length === 0;
  };

  const ThemeToggle = () => (
    <button className="theme-toggle" onClick={() => setDarkMode(p => !p)} title="Toggle theme">
      {darkMode ? '☀️' : '🌙'}
    </button>
  );

  // ── CONFIRMATION ──
  if (step === 'confirmed') return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <ThemeToggle />
      </div>
      <div className="confirmation">
        <div className="confirm-icon">🎮</div>
        <h2>ORDER PLACED!</h2>
        <p>Get ready, <strong style={{ color: '#a855f7' }}>{form.name}</strong>!</p>
        <p>Your food is being prepared by our level 99 chefs.</p>
        <div className="confirm-details">
          <div className="confirm-row"><span>📦 Delivering to</span><span>{form.address}, {form.city}</span></div>
          <div className="confirm-row"><span>📞 Contact</span><span>{form.phone}</span></div>
          <div className="confirm-row"><span>💳 Paid with</span><span>•••• {payment.card.replace(/\s/g,'').slice(-4)}</span></div>
          <div className="confirm-row"><span>💰 Total</span><span style={{ color: '#4ade80' }}>${total.toFixed(2)}</span></div>
          <div className="confirm-row"><span>⏱ ETA</span><span>20–35 minutes</span></div>
          <div className="confirm-row"><span>🔖 Order ID</span><span style={{ color: '#4ade80' }}>#{orderId}</span></div>
        </div>
        <button className="new-order-btn" onClick={() => {
          setStep('menu'); setCart({});
          setForm({ name: '', address: '', city: '', phone: '' });
          setPayment({ card: '', expiry: '', cvv: '', cardName: '' });
        }}>▶ New Order</button>
      </div>
    </div>
  );

  // ── PAYMENT ──
  if (step === 'payment') return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <ThemeToggle />
      </div>
      <div className="checkout-container">
        <div className="checkout-form-box">
          <h2 className="section-title">💳 PAYMENT</h2>

          <div className="card-preview">
            <div className="card-chip">▉▉</div>
            <div className="card-number-display">
              {payment.card ? payment.card.padEnd(19, '·').replace(/ /g, ' ') : '•••• •••• •••• ••••'}
            </div>
            <div className="card-bottom">
              <span>{payment.cardName || 'PLAYER NAME'}</span>
              <span>{payment.expiry || 'MM/YY'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Name on Card</label>
            <input className={payErrors.cardName ? 'input-error' : ''} placeholder="e.g. Jay Gamer"
              value={payment.cardName} onChange={e => setPayment({ ...payment, cardName: e.target.value.toUpperCase() })} />
            {payErrors.cardName && <span className="error-msg">{payErrors.cardName}</span>}
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input className={payErrors.card ? 'input-error' : ''} placeholder="1234 5678 9012 3456"
              value={payment.card} onChange={e => setPayment({ ...payment, card: formatCard(e.target.value) })} />
            {payErrors.card && <span className="error-msg">{payErrors.card}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry</label>
              <input className={payErrors.expiry ? 'input-error' : ''} placeholder="MM/YY"
                value={payment.expiry} onChange={e => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })} />
              {payErrors.expiry && <span className="error-msg">{payErrors.expiry}</span>}
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input className={payErrors.cvv ? 'input-error' : ''} placeholder="123" maxLength={4}
                value={payment.cvv} onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })} />
              {payErrors.cvv && <span className="error-msg">{payErrors.cvv}</span>}
            </div>
          </div>
        </div>

        <div className="checkout-summary">
          <h2 className="section-title">🛒 ORDER SUMMARY</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-row">
              <span>{item.emoji} {item.name} × {item.qty}</span>
              <span style={{ color: '#4ade80' }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
          <button className="checkout-btn" onClick={() => { if (validatePayment()) setStep('confirmed'); }}>
            ⚡ PAY ${total.toFixed(2)}
          </button>
          <button className="back-btn" onClick={() => setStep('checkout')}>← Back</button>
        </div>
      </div>
    </div>
  );

  // ── CHECKOUT ──
  if (step === 'checkout') return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <ThemeToggle />
      </div>
      <div className="checkout-container">
        <div className="checkout-form-box">
          <h2 className="section-title">📋 DELIVERY INFO</h2>
          <div className="form-group">
            <label>Player Name</label>
            <input className={errors.name ? 'input-error' : ''} placeholder="e.g. XxGamerxX"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input className={errors.address ? 'input-error' : ''} placeholder="e.g. 42 Respawn Road"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>
          <div className="form-group">
            <label>City</label>
            <input className={errors.city ? 'input-error' : ''} placeholder="e.g. Noobville"
              value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            {errors.city && <span className="error-msg">{errors.city}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className={errors.phone ? 'input-error' : ''} placeholder="e.g. 07911 123456"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>
        <div className="checkout-summary">
          <h2 className="section-title">🛒 ORDER SUMMARY</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-row">
              <span>{item.emoji} {item.name} × {item.qty}</span>
              <span style={{ color: '#4ade80' }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
          <button className="checkout-btn" onClick={() => { if (validateDelivery()) setStep('payment'); }}>
            ⚡ CONTINUE TO PAYMENT
          </button>
          <button className="back-btn" onClick={() => setStep('menu')}>← Back to Menu</button>
        </div>
      </div>
    </div>
  );

  // ── MENU ──
  return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <p>Gaming-fuelled food delivered to your base</p>
        <ThemeToggle />
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Search menu items..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="clear-search" onClick={() => setSearch('')}>✕</button>}
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.length === 0
          ? <div className="no-results">😢 No items found. Try a different search!</div>
          : filteredItems.map(item => (
            <div key={item.id} className="menu-card">
              {item.badge && (
                <div className={`badge ${item.badge === 'Popular' ? 'badge-popular' : 'badge-chef'}`}>
                  {item.badge === 'Popular' ? '🔥 Popular' : '👨‍🍳 Chef\'s Special'}
                </div>
              )}
              <div className="emoji">{item.emoji}</div>
              <div className="item-category">{item.category}</div>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <div className="price-row">
                <span className="price">${item.price.toFixed(2)}</span>
                <button className="add-btn" onClick={() => addToCart(item)}>+ ADD</button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="cart">
        <h2>🛒 YOUR CART {cartCount > 0 && <span className="cart-count">{cartCount}</span>}</h2>
        {cartItems.length === 0
          ? <p className="empty-cart">No items yet — add something from the menu above!</p>
          : <>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.emoji} {item.name}</span>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                  <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="cart-total"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
              <button className="checkout-btn" onClick={() => setStep('checkout')}>⚡ CHECKOUT</button>
            </>
        }
      </div>
    </div>
  );
}