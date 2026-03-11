import { useState } from 'react';
import './App.css';

const menuItems = [
  { id: 1, name: "Respawn Ramen", emoji: "🍜", desc: "Comeback soup loaded with XP noodles and legendary broth.", price: 12.99 },
  { id: 2, name: "Loot Box Burger", emoji: "🍔", desc: "Mystery toppings change daily. Every bite is a surprise drop.", price: 11.49 },
  { id: 3, name: "Health Potion Smoothie", emoji: "🧃", desc: "+50 HP. Strawberry, mango & rare dragon fruit blend.", price: 6.99 },
  { id: 4, name: "Final Boss Wings", emoji: "🍗", desc: "Insanely spicy wings. Only attempt if max level.", price: 13.99 },
  { id: 5, name: "Pixel Pizza", emoji: "🍕", desc: "8-bit style margherita with extra cheese power-ups.", price: 14.49 },
  { id: 6, name: "Side Quest Salad", emoji: "🥗", desc: "A humble side mission. Greens, croutons & XP dressing.", price: 7.99 },
  { id: 7, name: "Mana Mochi", emoji: "🍡", desc: "Restores mana. Green tea, strawberry & sesame flavours.", price: 5.49 },
  { id: 8, name: "AFK Fries", emoji: "🍟", desc: "Perfect for when you go AFK. Crispy, golden, unstoppable.", price: 4.99 },
];

export default function App() {
  const [cart, setCart] = useState({});
  const [ordered, setOrdered] = useState(false);

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

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (ordered) return (
    <div className="app">
      <div className="confirmation">
        <h2>🎮 ORDER PLACED!</h2>
        <p>Your food is being prepared by our level 99 chefs.<br />
        Estimated delivery: <strong style={{color:'#a855f7'}}>20–35 minutes</strong><br />
        Order ID: <strong style={{color:'#4ade80'}}>#{Math.floor(Math.random()*90000+10000)}</strong></p>
        <button className="new-order-btn" onClick={() => { setOrdered(false); setCart({}); }}>
          ▶ New Order
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="header">
        <h1>🎮 LEVEL UP EATS</h1>
        <p>Gaming-fuelled food delivered to your base</p>
      </div>

      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-card">
            <div className="emoji">{item.emoji}</div>
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <div className="price-row">
              <span className="price">${item.price.toFixed(2)}</span>
              <button className="add-btn" onClick={() => addToCart(item)}>+ ADD</button>
            </div>
          </div>
        ))}
      </div>

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
              <button className="checkout-btn" onClick={() => setOrdered(true)}>⚡ CHECKOUT</button>
            </>
        }
      </div>
    </div>
  );
}