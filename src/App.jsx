import { useState } from 'react';
import './App.css';

const menuItems = [
  { id: 1, name: "Respawn Ramen", emoji: "🍜", desc: "Comeback soup loaded with XP noodles and legendary broth.", price: 12.99, category: "Mains" },
  { id: 2, name: "Loot Box Burger", emoji: "🍔", desc: "Mystery toppings change daily. Every bite is a surprise drop.", price: 11.49, category: "Mains" },
  { id: 3, name: "Health Potion Smoothie", emoji: "🧃", desc: "+50 HP. Strawberry, mango & rare dragon fruit blend.", price: 6.99, category: "Drinks" },
  { id: 4, name: "Final Boss Wings", emoji: "🍗", desc: "Insanely spicy wings. Only attempt if max level.", price: 13.99, category: "Mains" },
  { id: 5, name: "Pixel Pizza", emoji: "🍕", desc: "8-bit style margherita with extra cheese power-ups.", price: 14.49, category: "Mains" },
  { id: 6, name: "Side Quest Salad", emoji: "🥗", desc: "A humble side mission. Greens, croutons & XP dressing.", price: 7.99, category: "Sides" },
  { id: 7, name: "Mana Mochi", emoji: "🍡", desc: "Restores mana. Green tea, strawberry & sesame flavours.", price: 5.49, category: "Desserts" },
  { id: 8, name: "AFK Fries", emoji: "🍟", desc: "Perfect for when you go AFK. Crispy, golden, unstoppable.", price: 4.99, category: "Sides" },
];

const categories = ["All", "Mains", "Sides", "Drinks", "Desserts"];

export default function App() {
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [step, setStep] = useState('menu'); // 'menu' | 'checkout' | 'confirmed'
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '' });
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) setStep('confirmed');
  };

  // ── CONFIRMATION SCREEN ──
  if (step === 'confirmed') return (
    <div className="app">
      <div className="confirmation">
        <div className="confirm-icon">🎮</div>
        <h2>ORDER PLACED!</h2>
        <p>Get ready, <strong style={{ color: '#a855f7' }}>{form.name}</strong>!</p>
        <p>Your food is being prepared by our level 99 chefs.</p>
        <div className="confirm-details">
          <div className="confirm-row"><span>📦 Delivering to</span><span>{form.address}, {form.city}</span></div>
          <div className="confirm-row"><span>📞 Contact</span><span>{form.phone}</span></div>
          <div className="confirm-row"><span>💰 Total</span><span style={{ color: '#4ade80' }}>${total.toFixed(2)}</span></div>
          <div className="confirm-row"><span>⏱ ETA</span><span>20–35 minutes</span></div>
          <div className="confirm-row"><span>🔖 Order ID</span><span style={{ color: '#4ade80' }}>#{Math.floor(Math.random() * 90000 + 10000)}</span></div>
        </div>
        <button className="new-order-btn" onClick={() => { setStep('menu'); setCart({}); setForm({ name: '', address: '', city: '', phone: '' }); }}>
          ▶ New Order
        </button>
      </div>
    </div>
  );

  // ── CHECKOUT SCREEN ──
  if (step === 'checkout') return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <p>Gaming-fuelled food delivered to your base</p>
      </div>
      <div className="checkout-container">
        <div className="checkout-form-box">
          <h2 className="section-title">📋 DELIVERY INFO</h2>

          <div className="form-group">
            <label>Player Name</label>
            <input
              className={errors.name ? 'input-error' : ''}
              placeholder="e.g. XxGamerxX"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              className={errors.address ? 'input-error' : ''}
              placeholder="e.g. 42 Respawn Road"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              className={errors.city ? 'input-error' : ''}
              placeholder="e.g. Noobville"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
            {errors.city && <span className="error-msg">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              className={errors.phone ? 'input-error' : ''}
              placeholder="e.g. 07911 123456"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
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
          <div className="summary-total">
            <span>TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleConfirm}>⚡ CONFIRM ORDER</button>
          <button className="back-btn" onClick={() => setStep('menu')}>← Back to Menu</button>
        </div>
      </div>
    </div>
  );

  // ── MENU SCREEN ──
  return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <p>Gaming-fuelled food delivered to your base</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          placeholder="Search menu items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="clear-search" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Category Filter */}
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.length === 0
          ? <div className="no-results">😢 No items found. Try a different search!</div>
          : filteredItems.map(item => (
            <div key={item.id} className="menu-card">
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

      {/* Cart */}
      <div className="cart">
        <h2>🛒 YOUR CART</h2>
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