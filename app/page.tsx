const pipeline = [
  ['01', 'Story', 'Generate or bring your own script.'],
  ['02', 'Voice', 'Fit narration timing scene by scene.'],
  ['03', 'Visuals', 'Keep characters and style consistent.'],
  ['04', 'Render', 'Export a finished, upload-ready video.'],
];

const faq = [
  ['Is AutoVid a web app?', 'No. AutoVid is a desktop production system. Your project files, account sessions, generated media, and renders stay on your computer.'],
  ['What happens when a generation account reaches its limit?', 'AutoVid checkpoints completed scenes, switches to another prepared account, and retries the interrupted scene instead of restarting the project.'],
  ['Does it support character references?', 'Yes. Character sheets are handled separately from generated scene results so references are not mistaken for finished artwork.'],
  ['Which platforms are supported?', 'The focused beta starts on Windows. macOS builds for Intel and Apple Silicon are on the release path after signing and notarization are funded.'],
  ['Do I need my own AI provider keys?', 'During beta, creators bring their own supported AI provider credentials and generation accounts. Keys are encrypted by the operating system inside the production app.'],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="AutoVid home">
          <span className="brand-mark"><span /></span>
          <span>AutoVid</span>
        </a>
        <div className="nav-links">
          <a href="#workflow">How it works</a>
          <a href="#reliability">Why AutoVid</a>
          <a href="#early-access">Early access</a>
        </div>
        <a className="button button-small" href="#early-access">Join the beta</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Creator production system</div>
          <h1>Turn a story into a finished video—<em>without losing progress.</em></h1>
          <p className="hero-lede">
            AutoVid connects script, voice, consistent AI visuals, and rendering
            in one resilient desktop workflow built for long-form faceless content.
          </p>
          <div className="hero-actions">
            <a className="button" href="#early-access">Get early access <span>↗</span></a>
            <a className="text-link" href="#workflow">See the workflow <span>↓</span></a>
          </div>
          <div className="trust-row">
            <span>Windows beta</span><i />
            <span>Local-first workflow</span><i />
            <span>Resume-safe pipeline</span>
          </div>
        </div>

        <div className="product-stage" aria-label="AutoVid production dashboard preview">
          <div className="glow" />
          <div className="app-window">
            <div className="window-bar">
              <div className="traffic"><span /><span /><span /></div>
              <div className="window-title">AUTOVID / PRODUCTION PIPELINE</div>
              <div className="live-dot">LIVE</div>
            </div>
            <div className="app-body">
              <aside className="app-sidebar">
                <div className="mini-brand"><span className="brand-mark"><span /></span></div>
                {['Project', 'Pipeline', 'Visuals', 'Accounts', 'Export'].map((label, index) => (
                  <div className={`side-item ${index === 1 ? 'active' : ''}`} key={label}>
                    <b>{index + 1}</b><span>{label}</span>
                  </div>
                ))}
              </aside>
              <div className="dashboard">
                <div className="dashboard-head">
                  <div><span className="tiny-label">CURRENT PROJECT</span><h3>The Last Empress</h3></div>
                  <span className="status-pill">● Generating</span>
                </div>
                <div className="stats">
                  <div><span>SCENES</span><strong>37 / 60</strong></div>
                  <div><span>VOICE READY</span><strong>60</strong></div>
                  <div><span>RENDER</span><strong>Pending</strong></div>
                </div>
                <div className="progress-card">
                  <div className="progress-copy"><span>Visual generation</span><b>62%</b></div>
                  <div className="progress-track"><span /></div>
                  <div className="scene-grid">
                    {Array.from({length: 12}, (_, index) => (
                      <div className={index < 7 ? 'done' : index === 7 ? 'current' : ''} key={index}>
                        <span>{String(index + 31).padStart(3, '0')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="resume-note"><b>Progress protected.</b> Completed scenes stay saved if an account hits its limit.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow shell" id="workflow">
        <div className="section-heading">
          <span className="kicker">ONE CONNECTED WORKFLOW</span>
          <h2>From blank page to final cut.</h2>
          <p>Each stage hands clean, verified work to the next—without a maze of folders and tabs.</p>
        </div>
        <div className="pipeline-grid">
          {pipeline.map(([number, title, copy]) => (
            <article key={number}>
              <span className="step-number">{number}</span>
              <div className="step-line" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reliability" id="reliability">
        <div className="shell reliability-inner">
          <div>
            <span className="kicker">BUILT FOR THE LONG RUN</span>
            <h2>Your production should survive real-world interruptions.</h2>
          </div>
          <div className="reliability-list">
            <p><b>Resume where it stopped.</b><span>Finished scenes are checkpointed instead of generated twice.</span></p>
            <p><b>Switch accounts safely.</b><span>Continue the failed scene when a generation account reaches its limit.</span></p>
            <p><b>Protect character consistency.</b><span>Reference images stay separate from scene results throughout generation.</span></p>
          </div>
        </div>
      </section>

      <section className="proof shell">
        <div className="proof-intro">
          <span className="kicker">DESIGNED AROUND FAILURE</span>
          <h2>A generator makes a clip.<br />A production system finishes the project.</h2>
        </div>
        <div className="proof-grid">
          <article><strong>01</strong><h3>Verified assets</h3><p>Every scene is checked before it can move downstream to rendering.</p></article>
          <article><strong>02</strong><h3>Durable checkpoints</h3><p>Finished work stays finished across account changes, retries, and restarts.</p></article>
          <article><strong>03</strong><h3>Local ownership</h3><p>Your media, project state, account sessions, and export remain on your machine.</p></article>
        </div>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="shell roadmap-layout">
          <div className="roadmap-heading">
            <span className="kicker">PUBLIC PRODUCT ROADMAP</span>
            <h2>Built in focused stages.</h2>
            <p>We prioritize reliable output before adding breadth. Early creators directly influence what moves next.</p>
          </div>
          <div className="roadmap-list">
            <article className="now"><span>NOW</span><div><h3>Reliable production beta</h3><p>Long-scene resilience, safe account handoff, references, voice timing, and final render.</p></div></article>
            <article><span>NEXT</span><div><h3>Project library & diagnostics</h3><p>Multiple workspaces, project history, backup/restore, and shareable support reports.</p></div></article>
            <article><span>LATER</span><div><h3>Templates, updates & growth tools</h3><p>Style packs, channel presets, automatic updates, usage forecasting, and creator analytics.</p></div></article>
          </div>
        </div>
      </section>

      <section className="beta-plan shell">
        <div>
          <span className="kicker">FOUNDING CREATOR BETA</span>
          <h2>Start narrow.<br />Build the right product.</h2>
        </div>
        <div className="beta-card">
          <p className="beta-label">EARLY ACCESS</p>
          <strong>Invite-based</strong>
          <p>Focused onboarding, direct feedback, transparent release notes, and founder-level support while pricing is validated.</p>
          <ul><li>Windows desktop beta</li><li>All current video styles</li><li>Priority bug triage</li><li>Influence the roadmap</li></ul>
          <a className="button" href="#early-access">Join the waitlist <span>↓</span></a>
        </div>
      </section>

      <section className="faq shell" id="faq">
        <div className="faq-heading"><span className="kicker">QUESTIONS, ANSWERED</span><h2>Before you join.</h2></div>
        <div className="faq-list">
          {faq.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="early-access shell" id="early-access">
        <span className="kicker">EARLY ACCESS</span>
        <h2>Build more videos.<br />Spend less time babysitting tabs.</h2>
        <p>AutoVid is entering a focused Windows beta. Join the first group of creators shaping what ships next.</p>
        <WaitlistForm />
        <small>No spam. Product updates and beta invitations only.</small>
      </section>

      <footer className="shell footer">
        <a className="brand" href="#top"><span className="brand-mark"><span /></span><span>AutoVid</span></a>
        <div className="footer-links"><a href="#roadmap">Roadmap</a><a href="#faq">FAQ</a><a href="/changelog">Changelog</a></div>
        <span>© 2026 AutoVid</span>
      </footer>
    </main>
  );
}

import {WaitlistForm} from './components/WaitlistForm';
