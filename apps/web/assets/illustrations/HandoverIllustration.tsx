const people = [
  { initials: "T1", tone: "var(--color-blue)" },
  { initials: "PB", tone: "var(--color-navy)" },
  { initials: "SR", tone: "#0e7fbf" },
];

const steps = [
  { label: "Prompt received", dot: "var(--color-blue)", bar: "78%", left: "6%", top: "6%" },
  { label: "Transaction built", dot: "var(--color-cyan)", bar: "56%", left: "42%", top: "30%" },
  { label: "Policy check", dot: "var(--color-navy)", bar: "68%", left: "6%", top: "54%" },
  { label: "Vault", dot: "var(--color-blue)", bar: "48%", left: "42%", top: "78%" },
];

function Cursor({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M3 2 17 9.5l-6.2 1.6L7.6 17Z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Decorative agent-request board. */
export function HandoverIllustration() {
  return (
    <div
      className="collab-card"
      role="img"
      aria-label="A shared agent request board showing prompt receipt, transaction building, policy checks and vault enforcement"
    >
      <div className="collab-header">
        <div>
          <p className="collab-title">Agent request</p>
          <p className="collab-meta">Trader-01 · Prompt → Vault</p>
        </div>
        <div className="avatar-stack">
          {people.map((p) => (
            <span key={p.initials} className="avatar" style={{ background: p.tone }}>
              {p.initials}
            </span>
          ))}
        </div>
      </div>

      <div className="collab-board">
        <svg className="collab-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M28 21 V30 Q28 34 32 34 H42" />
          <path d="M64 46 V52 Q64 58 58 58 H50" />
          <path d="M28 70 V78 Q28 82 32 82 H42" />
        </svg>

        {steps.map((s) => (
          <div key={s.label} className="collab-node" style={{ left: s.left, top: s.top }}>
            <span className="collab-node-dot" style={{ background: s.dot }} />
            <span className="collab-node-body">
              <span className="collab-node-label">{s.label}</span>
              <span className="collab-node-bar" style={{ width: s.bar }} />
            </span>
          </div>
        ))}

        <div className="collab-cursor" style={{ left: "78%", top: "22%" }}>
          <Cursor color="var(--color-navy)" />
          <span className="avatar" style={{ background: "var(--color-navy)" }}>
            PB
          </span>
        </div>

        <div className="collab-cursor" style={{ left: "38%", top: "62%" }}>
          <Cursor color="var(--color-blue)" />
          <span className="avatar" style={{ background: "var(--color-blue)" }}>
            T1
          </span>
        </div>

        <div className="chat-bubble" style={{ right: "4%", top: "60%" }}>
          <span className="avatar" style={{ background: "#0e7fbf" }}>
            SR
          </span>
          drain blocked!
        </div>
      </div>
    </div>
  );
}
