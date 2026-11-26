'use client';

import { useState } from 'react';
import { AirlockMark } from '@/assets/icons/AirlockMark';

interface FlowNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status: 'active' | 'warning' | 'neutral';
  x: string;
  y: string;
  tag: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'agent',
    title: 'Autonomous Trader Agent',
    subtitle: 'Sign request: 125 USDC Swap',
    icon: '🤖',
    status: 'active',
    x: '6%',
    y: '14%',
    tag: 'SOLANA AGENT',
  },
  {
    id: 'airlock',
    title: 'Airlock Firewall Gateway',
    subtitle: 'Pre-flight decode & AST parse',
    icon: '🛡️',
    status: 'active',
    x: '38%',
    y: '42%',
    tag: 'SECURITY CORE',
  },
  {
    id: 'litesvm',
    title: 'LiteSVM State Simulation',
    subtitle: 'Effects diff: -125 USDC +SOL',
    icon: '⚡',
    status: 'active',
    x: '68%',
    y: '16%',
    tag: 'ONCHAIN VM',
  },
  {
    id: 'rules',
    title: 'Policy Guardrails Engine',
    subtitle: 'Cap: $2,000 / tx · Whitelist PASS',
    icon: '📋',
    status: 'active',
    x: '68%',
    y: '68%',
    tag: 'RULES EVAL',
  },
  {
    id: 'vault',
    title: 'Anchor Multisig Vault',
    subtitle: 'Co-signature granted & broadcast',
    icon: '🔐',
    status: 'active',
    x: '6%',
    y: '70%',
    tag: 'AUTHORITY PDA',
  },
];

export function ProductMockup() {
  const [activeNode, setActiveNode] = useState<string>('airlock');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [trafficCount, setTrafficCount] = useState<number>(37);

  const selectedNode = FLOW_NODES.find((n) => n.id === activeNode) || FLOW_NODES[1];

  return (
    <div
      id="demo"
      className="mockup-frame airlock-dashboard"
      role="region"
      aria-label="Airlock Interactive Architecture Flow Diagram"
    >
      <div className="mockup-flow-window">
        {/* SIDEBAR NAVIGATION - Purely visual with hover effects as requested */}
        <aside className="mockup-sidebar">
          <div className="mockup-brand">
            <div className="brand-logo-glow">
              <AirlockMark size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-name">AIRLOCK</span>
              <span className="brand-badge">FIREWALL</span>
            </div>
          </div>

          <div className="mockup-nav-group">
            <span className="mockup-label">WORKSPACE</span>
            {[
              { label: 'Overview', active: true },
              { label: 'Agent Fleet', active: false },
              { label: 'Integrations', active: false },
              { label: 'Policy Rules', active: false },
              { label: 'Audit Trail', active: false },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className={`mockup-nav-item ${item.active ? 'is-active' : ''}`}
                aria-label={`Open ${item.label} view`}
                onClick={() => {
                  const map: Record<string, string> = {
                    Overview: 'airlock',
                    'Agent Fleet': 'agent',
                    Integrations: 'litesvm',
                    'Policy Rules': 'rules',
                    'Audit Trail': 'rules',
                  };
                  setActiveNode(map[item.label] || 'airlock');
                }}
                title={`${item.label} (Overview visual mode)`}
              >
                <span className="nav-icon-glyph" />
                <span className="nav-item-title">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mockup-sidebar-foot">
            <div className="agent-avatar-badge">
              <span className="avatar-dot" />
              <span>T1</span>
            </div>
            <div className="agent-foot-details">
              <strong>Trader-01</strong>
              <small>Solana Mainnet</small>
            </div>
          </div>
        </aside>

        {/* MAIN CANVAS - Visual Architecture Flow with Interactive Pulse & Nodes */}
        <div className="mockup-main">
          {/* TOPBAR */}
          <div className="mockup-topbar">
            <div className="mockup-crumbs">
              <span className="crumb-root">Airlock Firewall</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-view">Autonomous Pipeline</span>
              <span className="crumb-tag">Live · Simulated</span>
            </div>

            <div className="mockup-topbar-actions">
              <button
                type="button"
                className={`flow-play-btn ${isPlaying ? 'is-playing' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
                title="Pause or Resume Flow Animation"
              >
                <span className="play-icon">{isPlaying ? '⏸ Pause' : '▶ Play'}</span>
              </button>
              <div className="mock-live-badge">
                <span className={`pulse-dot ${isPlaying ? 'animate-pulse' : ''}`} />
                <span>INTERCEPTOR ONLINE</span>
              </div>
            </div>
          </div>

          {/* DIAGRAM CANVAS WITH CONNECTING SVG WIRES & NODES */}
          <div className="mockup-canvas diagram-canvas">
            {/* SVG Connecting Wires */}
            <svg
              className="mockup-wires"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Line: Agent -> Airlock Gateway */}
              <path
                d="M 18,24 C 28,24 28,52 38,52"
                className={`wire-path ${isPlaying ? 'is-live' : ''}`}
              />
              {/* Line: Airlock Gateway -> LiteSVM */}
              <path
                d="M 58,52 C 68,52 58,26 68,26"
                className={`wire-path ${isPlaying ? 'is-live' : ''}`}
              />
              {/* Line: LiteSVM -> Policy Rules */}
              <path
                d="M 78,26 C 88,26 88,78 78,78"
                className={`wire-path ${isPlaying ? 'is-live' : ''}`}
              />
              {/* Line: Policy Rules -> Anchor Vault */}
              <path
                d="M 68,78 C 48,78 38,78 18,78"
                className={`wire-path ${isPlaying ? 'is-live' : ''}`}
              />
            </svg>

            {/* FLOW NODES */}
            {FLOW_NODES.map((node) => {
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  className={`mock-node ${isSelected ? 'is-focus' : ''}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setActiveNode(node.id)}
                  onMouseEnter={() => setActiveNode(node.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mock-node-head">
                    <span className="mock-node-icon">{node.icon}</span>
                    <div className="mock-node-text">
                      <span className="mock-node-tag">{node.tag}</span>
                      <strong className="mock-node-title">{node.title}</strong>
                    </div>
                    <span className={`mock-node-indicator ${node.status}`} />
                  </div>
                  <p className="mock-node-meta">{node.subtitle}</p>
                  <div className="mock-bar">
                    <div
                      className={`mock-bar-fill ${isPlaying ? 'is-animated' : ''}`}
                      style={{ width: isSelected ? '100%' : '65%' }}
                    />
                  </div>
                </div>
              );
            })}

            {/* LIVE INSPECTOR SUMMARY BAR */}
            <div className="diagram-footer-pill">
              <span className="info-icon">⚡</span>
              <span>
                Inspecting: <strong>{selectedNode.title}</strong> — {selectedNode.subtitle}
              </span>
              <span className="verified-chip">Verified Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
