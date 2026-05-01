import { useState, useRef, useEffect } from "react";

// ══════════════════════════════════════════════════
// 🧠 BRAINBOOST v4 - FINAL WITH FLUTTERWAVE PAYMENTS
// ══════════════════════════════════════════════════

const C = {
  bg: "#0F172A",
  surface: "#1A2847",
  card: "#1F3559",
  border: "rgba(124,58,237,0.2)",
  purple: "#7C3AED",
  gold: "#F59E0B",
  teal: "#10B981",
  text: "#F0F4F8",
  muted: "rgba(240,244,248,0.45)",
  sub: "rgba(240,244,248,0.65)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body,#root{width:100%;background:#0F172A}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.3);border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
`;

// ══════════════════════════════════════════════════
// FLUTTERWAVE PAYMENT LINKS
// ══════════════════════════════════════════════════

const FLUTTERWAVE = {
  PRO_LINK: "https://sandbox.flutterwave.com/pay/diegr3we86xm",
  PREMIUM_LINK: "https://sandbox.flutterwave.com/pay/oxlzddcromff",
};

const OWNER_EMAIL = "admin@brainboost.io";
const OWNER_PASSWORD = "admin123";

// ══════════════════════════════════════════════════
// AI RESPONSE GENERATOR
// ══════════════════════════════════════════════════

const generateAIResponse = (query, variation = 0) => {
  const responses = {
    writing: [
      `Great essay topic: "${query}"!\n\nThis subject represents a significant area of study worthy of detailed examination. The foundational concepts provide crucial context for understanding broader implications. Throughout history, this topic has evolved considerably with diverse perspectives emerging.\n\nKey sections to include:\n• Introduction with clear thesis\n• Historical background and context\n• Main arguments (2-3 major points)\n• Supporting evidence and examples\n• Counterarguments and rebuttals\n• Real-world applications\n• Conclusion with broader significance\n\nRemember: Each response is paraphrased uniquely for you - no plagiarism detection!`,
      `Perfect topic for an essay: "${query}"!\n\nThis concept has been central to numerous scholarly investigations. The development reflects changing priorities and technological advancement. Scholars have identified several enduring principles that remain relevant.\n\nStructure recommendations:\n1. Hook with interesting fact\n2. Background information\n3. Thesis statement\n4. Body paragraphs (develop main ideas)\n5. Evidence and citations\n6. Counterarguments\n7. Strong conclusion\n\nTip: This answer is unique to you - completely different wording from other students!`,
    ],

    code: [
      `Great coding question: "${query}"!\n\nHere's a solution that works across all programming languages:\n\n**Python Example:**\n\`\`\`python\ndef solve(data):\n    result = []\n    for item in data:\n        processed = process_item(item)\n        result.append(processed)\n    return result\n\`\`\`\n\n**JavaScript Example:**\n\`\`\`javascript\nfunction solve(data) {\n    return data.map(item => processItem(item));\n}\n\`\`\`\n\nWorks in ANY language - Python, Java, C++, Rust, Go, SQL, PHP, Ruby, TypeScript, Kotlin, Swift, and 40+ more!`,
      `Perfect coding request: "${query}"!\n\n**The pattern works universally:**\n1. Define input\n2. Process each item\n3. Return result\n\n**Java:**\n\`\`\`java\npublic List<T> solve(List<T> input) {\n    List<T> result = new ArrayList<>();\n    for (T item : input) {\n        result.add(processItem(item));\n    }\n    return result;\n}\n\`\`\`\n\nImplement the same logic in any language you prefer!`,
    ],

    question: [
      `Excellent question: "${query}"!\n\nThis requires understanding multiple interconnected concepts. The foundational principles establish a framework for deeper analysis. Research indicates that successful approaches balance analytical thinking with creative problem-solving.\n\n**Key points to understand:**\n- Core mechanisms and how they work\n- Different perspectives and approaches\n- Real-world applications and examples\n- Critical thinking about the topic\n- How to apply this knowledge\n\nRemember: This answer is completely paraphrased uniquely for you!`,
      `Perfect question for study: "${query}"!\n\nThe subject encompasses various important dimensions deserving careful consideration. Scholarly analysis reveals several critical principles. When approaching systematically, one discovers intricate relationships.\n\n**Study strategy:**\n- Read this answer carefully\n- Look up any unfamiliar terms\n- Try to explain it in your own words\n- Create a summary\n- Review after a few days\n\nThis paraphrased response is unique to you!`,
    ],

    study: [
      `Great topic to study: "${query}"!\n\n**Comprehensive Study Plan:**\n\n**Week 1: Foundation**\n- Learn key concepts and definitions\n- Understand core principles\n- Make flashcards\n\n**Week 2: Application**\n- Study real-world examples\n- Practice problems\n- Review tricky concepts\n\n**Week 3: Mastery**\n- Solve complex problems\n- Take practice tests\n- Teach concepts to others\n\n**Daily Routine:**\n- 25-min focused study sessions\n- 5-min breaks\n- Active recall practice\n- Spaced repetition\n\nSuccess metric: Can you explain it simply AND solve related problems?`,
      `Perfect study topic: "${query}"!\n\n**Smart Learning Strategy:**\n\nPhase 1 (Days 1-3): Understanding\n- What is it?\n- How does it work?\n- Why is it important?\n\nPhase 2 (Days 4-6): Application\n- How is it used?\n- What are the examples?\n- Practice problems\n\nPhase 3 (Days 7+): Mastery\n- Can you teach it?\n- Can you solve advanced problems?\n- Can you apply it creatively?\n\nTips: Use multiple resources, take notes, practice consistently!`,
    ],

    default: [
      `Hi! I can help with:\n\n**📝 Writing** - Essays, assignments, articles, stories\n**💻 Code** - Any programming language\n**❓ Questions** - Homework, WAEC, NECO, exams\n**📚 Study** - Study guides, practice problems\n**🎨 Images** - Create images from descriptions\n\nJust ask me anything! Examples:\n- "Write an essay about climate change"\n- "Code a Python function to..."\n- "Study guide for biology"\n- "Explain photosynthesis"\n- "Image of a futuristic city"`,
    ],
  };

  const type = query.toLowerCase().includes("code") || query.toLowerCase().includes("function") || query.toLowerCase().includes("write code") ? "code"
    : query.toLowerCase().includes("essay") || query.toLowerCase().includes("write about") ? "writing"
    : query.toLowerCase().includes("study") || query.toLowerCase().includes("exam") ? "study"
    : "question";

  const responseArray = responses[type] || responses.default;
  return responseArray[variation % responseArray.length];
};

// ══════════════════════════════════════════════════
// UI COMPONENTS
// ══════════════════════════════════════════════════

function Btn({ children, onClick, variant = "primary", sm, full, disabled }) {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${C.purple}, #a855f7)`, color: "#fff", boxShadow: `0 8px 24px rgba(124,58,237,0.3)` },
    ghost: { background: `rgba(124,58,237,0.1)`, color: C.purple, border: `1px solid ${C.purple}50` },
    muted: { background: `rgba(240,244,248,0.05)`, color: C.muted, border: `1px solid ${C.border}` },
  };

  return (
    <button disabled={disabled} onClick={onClick} style={{ ...styles[variant], borderRadius: 12, padding: sm ? "8px 16px" : "12px 24px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: sm ? 13 : 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", transition: "all 0.3s", width: full ? "100%" : "auto", whiteSpace: "nowrap" }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.opacity = "1")}
    >{children}</button>
  );
}

function Tag({ children, color = C.purple }) {
  return <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{children}</span>;
}

// ══════════════════════════════════════════════════
// PAYMENT MODAL
// ══════════════════════════════════════════════════

function PaymentModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(12px)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 700, background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 40, animation: "fadeIn 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Upgrade Your Brain 🧠</div>
          <p style={{ color: C.sub, fontSize: 15 }}>Choose your plan and unlock unlimited possibilities</p>
        </div>

        {/* PRICING CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {/* PRO PLAN */}
          <div style={{ background: C.surface, border: `1px solid ${C.purple}40`, borderRadius: 16, padding: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>PRO</div>
            <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: C.purple, marginBottom: 4 }}>₦5,000</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>/month • Auto-renews</div>
            
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              {["✓ Unlimited questions", "✓ No ads", "✓ Premium responses", "✓ Advanced coding help"].map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>
                  <span style={{ color: C.purple, fontWeight: 700 }}>{f}</span>
                </div>
              ))}
            </div>

            <Btn onClick={() => window.open(FLUTTERWAVE.PRO_LINK, "_blank")} full>
              Pay ₦5,000 Now
            </Btn>
          </div>

          {/* PREMIUM PLAN */}
          <div style={{ background: `linear-gradient(160deg, ${C.surface}, #0a2a4a)`, border: `1px solid ${C.gold}40`, borderRadius: 16, padding: 24, textAlign: "center", boxShadow: `0 0 30px ${C.gold}15` }}>
            <Tag color={C.gold} style={{ marginBottom: 12 }}>⭐ MOST VALUE</Tag>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>PREMIUM</div>
            <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 800, color: C.gold, marginBottom: 4 }}>₦15,000</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>/month • Auto-renews</div>
            
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              {["✓ Everything in Pro", "✓ Personal AI tutor", "✓ Exam practice tests", "✓ 24/7 Support", "✓ API access"].map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>
                  <span style={{ color: C.gold, fontWeight: 700 }}>{f}</span>
                </div>
              ))}
            </div>

            <Btn onClick={() => window.open(FLUTTERWAVE.PREMIUM_LINK, "_blank")} full style={{ background: `linear-gradient(135deg, ${C.gold}, #d97706)` }}>
              Pay ₦15,000 Now
            </Btn>
          </div>
        </div>

        {/* INFO */}
        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}20`, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
            💳 <strong style={{ color: C.text }}>Secure payment via Flutterwave</strong><br />
            Your bank account is safe · No hidden fees · Cancel anytime
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Btn variant="muted" onClick={onClose}>Maybe Later</Btn>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════

function Landing({ onLogin, onSignup }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit', sans-serif", color: C.text, display: "flex", flexDirection: "column" }}>
      <style>{FONTS}</style>

      {/* NAV */}
      <nav style={{ width: "100%", background: `${C.bg}E8`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${C.purple}, ${C.gold})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800 }}>BrainBoost</span>
          <Tag color={C.gold}>LIVE</Tag>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={onLogin} sm>Log In</Btn>
          <Btn onClick={onSignup} sm>Start Free →</Btn>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 50, left: "10%", width: 400, height: 400, background: `radial-gradient(circle, ${C.purple}15, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 150, right: "10%", width: 300, height: 300, background: `radial-gradient(circle, ${C.gold}10, transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 600, position: "relative", zIndex: 1 }}>
          <Tag color={C.gold}>✨ AI Learning Made Simple</Tag>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, lineHeight: 1.1, margin: "24px 0 18px", background: `linear-gradient(135deg, ${C.text}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your AI Brain<br />
            One Simple Chat
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: C.sub, margin: "0 0 36px", lineHeight: 1.8 }}>
            Essays · Code (50+ languages) · Homework · Study guides · Images<br />
            Everything in one clean chat interface
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={onSignup}>🚀 Get Started Free</Btn>
            <Btn variant="ghost" onClick={onLogin}>Try Demo</Btn>
          </div>

          <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>10 free questions daily · Paraphrased answers · Upgrade to unlimited</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, background: C.surface, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: C.gold }}>🧠 BrainBoost</div>
        <div style={{ fontSize: 12, color: C.muted }}>© 2025 • AI Learning Platform • Payments by Flutterwave</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// AUTH PAGE
// ══════════════════════════════════════════════════

function AuthPage({ mode, onAuth, onSwitch, onBack }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");
    
    if (email === OWNER_EMAIL && pw === OWNER_PASSWORD) {
      onAuth({ email, name: "Owner", plan: "business", isOwner: true, dailyUsed: 0 });
      return;
    }

    if (mode === "login") {
      return setErr("Create account first or use owner login");
    } else {
      if (!name || !email || !pw) return setErr("Fill all fields");
      onAuth({ email, name, plan: "free", isOwner: false, dailyUsed: 0 });
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", padding: 20 }}>
      <style>{FONTS}</style>
      <div style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.purple, marginBottom: 8 }}>🧠</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</div>
          <div style={{ color: C.muted, fontSize: 13 }}>{mode === "login" ? "Log in" : "10 free daily"}</div>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", marginTop: 6, background: `rgba(124,58,237,0.05)`, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", color: C.text, fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none" }} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>EMAIL</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", marginTop: 6, background: `rgba(124,58,237,0.05)`, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", color: C.text, fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>PASSWORD</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" style={{ width: "100%", marginTop: 6, background: `rgba(124,58,237,0.05)`, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", color: C.text, fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none" }} />
        </div>

        {err && <div style={{ color: C.gold, fontSize: 12, marginBottom: 14, textAlign: "center", background: `${C.gold}10`, padding: "8px 10px", borderRadius: 8 }}>{err}</div>}

        <Btn onClick={submit} full>{mode === "login" ? "Log In" : "Create Account"}</Btn>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: C.muted }}>
          {mode === "login" ? "New? " : "Have account? "}
          <span onClick={onSwitch} style={{ color: C.purple, cursor: "pointer", fontWeight: 700 }}>{mode === "login" ? "Sign up" : "Log in"}</span>
        </div>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span onClick={onBack} style={{ fontSize: 12, color: C.muted, cursor: "pointer" }}>← Back</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// CHAT INTERFACE
// ══════════════════════════════════════════════════

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: `Hi ${user.name}! 👋\n\nI can help with:\n\n📝 **Writing** - Essays, assignments, articles\n💻 **Code** - 50+ languages (Python, JavaScript, Java, C++, etc.)\n❓ **Questions** - Homework, exams, WAEC, NECO\n📚 **Study** - Study guides, practice problems\n🎨 **Images** - Create images from descriptions\n\nWhat do you need help with?` }
  ]);
  const [input, setInput] = useState("");
  const [dailyUsed, setDailyUsed] = useState(user.dailyUsed || 0);
  const [variation, setVariation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const messagesEnd = useRef(null);
  const isPro = user.plan !== "free" || user.isOwner;
  const dailyLimit = isPro ? 999 : 10;
  const remaining = dailyLimit - dailyUsed;

  const scrollToBottom = () => messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!isPro && remaining <= 0) {
      setShowPayment(true);
      return;
    }

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMsg, variation);
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setDailyUsed(dailyUsed + 1);
      setVariation((v) => v + 1);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ width: "100%", height: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif", color: C.text }}>
      <style>{FONTS}</style>
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}

      {/* NAV */}
      <nav style={{ width: "100%", background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.purple }}>🧠 BrainBoost</span>
          <Tag color={user.isOwner ? C.gold : isPro ? C.teal : C.muted}>{user.isOwner ? "OWNER" : isPro ? "PRO" : "FREE"}</Tag>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isPro && <div style={{ fontSize: 12, color: remaining <= 2 ? C.gold : C.sub, fontWeight: 700, padding: "6px 12px", background: `${remaining <= 2 ? C.gold + "15" : C.purple + "08"}`, borderRadius: 8, border: `1px solid ${remaining <= 2 ? C.gold + "30" : C.border}` }}>{remaining} left</div>}
          <Btn variant="muted" sm onClick={onLogout}>Log Out</Btn>
        </div>
      </nav>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16, animation: "fadeIn 0.4s ease" }}>
            {msg.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: `linear-gradient(135deg, ${C.purple}, #a855f7)`, color: "#fff", borderRadius: 14, padding: "12px 16px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ fontSize: 24 }}>🧠</div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", maxWidth: "80%", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ fontSize: 24 }}>🧠</div>
            <div style={{ background: C.card, borderRadius: 14, padding: "12px 16px", display: "flex", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple, animation: `pulse 1.4s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* REVVO AD */}
      <div style={{ padding: "0 20px", marginBottom: 14, maxWidth: 900, margin: "0 auto 14px", width: "100%" }}>
        <div style={{ background: `linear-gradient(135deg, rgba(124,58,237,0.08), rgba(245,158,11,0.08))`, border: `1px solid ${C.gold}30`, borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18 }}>💰</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: C.gold }}>Sell Online? Track Revenue with Revvo ⚡</div>
            <div style={{ fontSize: 11, color: C.sub }}>Shopify analytics dashboard</div>
          </div>
          <Btn variant="ghost" sm onClick={() => window.open("https://finance-dashboard--moshoodroqeeb.replit.app", "_blank")}>Try →</Btn>
        </div>
      </div>

      {/* INPUT */}
      <div style={{ borderTop: `1px solid ${C.border}`, background: C.surface, padding: "16px 20px", flexShrink: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", display: "flex", gap: 10 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={!isPro && remaining === 0 ? "Daily limit reached. Upgrade to Pro!" : "Ask anything..."}
            disabled={loading || (!isPro && remaining <= 0)}
            style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", color: C.text, fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none", opacity: loading || (!isPro && remaining <= 0) ? 0.5 : 1, cursor: loading || (!isPro && remaining <= 0) ? "not-allowed" : "text" }}
          />
          <Btn onClick={handleSend} disabled={loading || !input.trim() || (!isPro && remaining <= 0)} sm>→</Btn>
        </div>
        {!isPro && <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>{remaining === 0 ? "Upgrade to continue" : `${remaining} questions left`}</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  const login = (u) => { setUser(u); setScreen("chat"); };
  const logout = () => { setUser(null); setScreen("landing"); };

  if (screen === "landing") return <Landing onLogin={() => setScreen("login")} onSignup={() => setScreen("signup")} />;
  if (screen === "login") return <AuthPage mode="login" onAuth={login} onSwitch={() => setScreen("signup")} onBack={() => setScreen("landing")} />;
  if (screen === "signup") return <AuthPage mode="signup" onAuth={login} onSwitch={() => setScreen("login")} onBack={() => setScreen("landing")} />;
  if (screen === "chat") return <Chat user={user} onLogout={logout} />;
}
