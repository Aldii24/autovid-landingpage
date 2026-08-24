const releases = [
  {version: '0.1.0 beta', date: 'August 2026', items: ['Resume-safe scene generation', 'Multi-account Google Flow handoff', 'Character-reference isolation', 'Edge TTS timing and external audio import', 'Windows installer and portable release']},
  {version: 'Next', date: 'In progress', items: ['Project library and workspace history', 'Exportable diagnostic reports', 'Native update checks', 'Expanded long-project regression suite']},
];

export default function Changelog() {
  return <main className="subpage"><nav className="nav shell"><Link className="brand" href="/"><span className="brand-mark"><span /></span><span>AutoVid</span></Link><Link className="text-link" href="/">Back home</Link></nav><header className="subpage-head shell"><span className="kicker">PRODUCT CHANGELOG</span><h1>What’s shipping.</h1><p>A transparent record of reliability fixes, product improvements, and platform progress.</p></header><section className="release-list shell">{releases.map((release) => <article key={release.version}><div><span>{release.date}</span><h2>{release.version}</h2></div><ul>{release.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section></main>;
}
import Link from 'next/link';
