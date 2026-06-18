import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPage = () => {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            let current = '';
            const sections = document.querySelectorAll('.section[id]');
            sections.forEach((s) => {
                if (window.scrollY >= s.offsetTop - 120) {
                    current = s.id;
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set initial active section
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 flex flex-col">
            {/* Header */}
            <header className="bg-[#185fa5] sticky top-0 z-50 shadow-md h-16 flex items-center shrink-0">
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="text-white/80 hover:text-white transition">
                            <ChevronLeft size={24} />
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 text-white no-underline">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">Bz</div>
                            <span className="text-xl font-bold tracking-tight">Bizzua</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="bg-gradient-to-br from-[#0c447c] via-[#185fa5] to-[#378add] pt-10 pb-8 shrink-0 shadow-inner">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Privacy Policy</h1>
                    <p className="text-sm text-white/80">How Bizzua collects, uses, and protects your personal information.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
                {/* Table of Contents */}
                <aside className="sticky top-24 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hidden lg:block">
                    <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">On this page</div>
                    <nav className="space-y-1">
                        {[
                            { id: 's1', title: '1. Who we are' },
                            { id: 's2', title: '2. Data we collect' },
                            { id: 's3', title: '3. How we use data' },
                            { id: 's4', title: '4. Legal basis' },
                            { id: 's5', title: '5. Data sharing' },
                            { id: 's6', title: '6. Cookies' },
                            { id: 's7', title: '7. Data retention' },
                            { id: 's8', title: '8. Security' },
                            { id: 's9', title: '9. Your rights' },
                            { id: 's10', title: "10. Children's privacy" },
                            { id: 's11', title: '11. International transfers' },
                            { id: 's12', title: '12. Policy changes' },
                            { id: 's13', title: '13. Contact & DPO' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`block w-full text-left text-sm py-1.5 pl-3 border-l-2 transition-colors ${activeSection === item.id
                                    ? 'border-[#185fa5] text-[#185fa5] font-semibold'
                                    : 'border-transparent text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                        Last updated: <strong className="text-slate-700">1 June 2026</strong> &nbsp;·&nbsp; Effective
                        date: <strong className="text-slate-700">1 June 2026</strong> &nbsp;·&nbsp; Version 2.0
                    </div>

                    <div className="bg-[#e6f1fb] border-l-4 border-[#185fa5] rounded-r-lg p-4 mb-6 text-sm text-[#0c447c]">
                        <strong>In plain English:</strong> We collect only what we need to run
                        Bizzua. We never sell your personal data to advertisers. You can
                        request, correct, or delete your data at any time.
                    </div>

                    <div className="section space-y-4" id="s1">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">1</span> Who We Are
                        </h2>
                        <p>
                            Bizzua Technologies Pvt. Ltd. ("Bizzua", "we", "us") operates the
                            Bizzua platform — a professional networking and business
                            collaboration platform for BNI and Rotary Club members.
                        </p>
                        <p>
                            This Privacy Policy applies to all data collected through our
                            website, mobile apps, and services. We are the data controller for
                            personal data processed under this policy.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s2">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">2</span> Data We Collect
                        </h2>
                        <p>
                            We collect different types of information depending on how you use
                            our platform:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse mt-4 text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Examples</th>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">When collected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Account data</td>
                                        <td className="p-3 text-slate-700">Name, email, phone, password (hashed)</td>
                                        <td className="p-3 text-slate-700">Registration</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Profile data</td>
                                        <td className="p-3 text-slate-700">Job title, company, industry, city, bio, photo</td>
                                        <td className="p-3 text-slate-700">Profile setup</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Usage data</td>
                                        <td className="p-3 text-slate-700">Pages viewed, features used, session duration</td>
                                        <td className="p-3 text-slate-700">Automatically</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Transaction data</td>
                                        <td className="p-3 text-slate-700">
                                            Event tickets, payment records (card details held by payment
                                            processor)
                                        </td>
                                        <td className="p-3 text-slate-700">Purchases</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Communication data</td>
                                        <td className="p-3 text-slate-700">Messages sent via platform, support emails</td>
                                        <td className="p-3 text-slate-700">When you communicate</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-3 font-semibold text-slate-800">Device data</td>
                                        <td className="p-3 text-slate-700">IP address, browser type, OS, device ID</td>
                                        <td className="p-3 text-slate-700">Automatically</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-slate-800">Third-party data</td>
                                        <td className="p-3 text-slate-700">LinkedIn/Google profile info (if you connect)</td>
                                        <td className="p-3 text-slate-700">On OAuth connection</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="section space-y-4" id="s3">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">3</span> How We Use Your Data
                        </h2>
                        <p>We use your personal data to:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>Create and manage your Bizzua account and profile.</li>
                            <li>
                                Connect you with other members, mentors, and business
                                opportunities.
                            </li>
                            <li>Process event registrations and payments.</li>
                            <li>
                                Send you platform notifications, updates, and (with consent)
                                marketing communications.
                            </li>
                            <li>Improve the Platform through analytics and user feedback.</li>
                            <li>
                                Detect, prevent, and investigate fraud, abuse, or security
                                incidents.
                            </li>
                            <li>Comply with legal obligations under Indian law.</li>
                        </ul>
                    </div>

                    <div className="section space-y-4" id="s4">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">4</span> Legal Basis for Processing
                        </h2>
                        <p>
                            Under the Digital Personal Data Protection Act 2023 (India) and
                            applicable regulations, we process your data on these bases:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                <strong>Consent</strong> — for marketing emails, optional profile
                                features, and third-party integrations.
                            </li>
                            <li>
                                <strong>Contract performance</strong> — to deliver our services
                                you have signed up for.
                            </li>
                            <li>
                                <strong>Legitimate interests</strong> — for platform security,
                                fraud prevention, and service improvement.
                            </li>
                            <li>
                                <strong>Legal obligation</strong> — where required by applicable
                                Indian law.
                            </li>
                        </ul>
                    </div>

                    <div className="section space-y-4" id="s5">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">5</span> Data Sharing
                        </h2>
                        <p>
                            We do not sell your personal data. We share data only in these
                            circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                <strong>Other members</strong> — your public profile (name, title,
                                industry, city) is visible to other Bizzua members. You control
                                what is shown via your privacy settings.
                            </li>
                            <li>
                                <strong>Service providers</strong> — payment processors (Razorpay,
                                Stripe), email services, cloud hosting, analytics providers —
                                bound by data processing agreements.
                            </li>
                            <li>
                                <strong>Legal requirements</strong> — if required by a court
                                order, government authority, or applicable law.
                            </li>
                            <li>
                                <strong>Business transfers</strong> — in the event of a merger,
                                acquisition, or sale of our business, your data may be transferred
                                to the successor entity.
                            </li>
                        </ul>
                        <p>
                            We do not share your data with advertisers or unrelated third
                            parties for their own marketing purposes.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s6">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">6</span> Cookies &amp; Tracking
                        </h2>
                        <p>
                            We use cookies and similar technologies to operate and improve the
                            Platform:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                <strong>Essential cookies</strong> — required for login sessions
                                and core functionality. Cannot be disabled.
                            </li>
                            <li>
                                <strong>Analytics cookies</strong> — help us understand how the
                                Platform is used (e.g., Google Analytics). You can opt out via
                                your browser settings.
                            </li>
                            <li>
                                <strong>Preference cookies</strong> — remember your settings and
                                language preferences.
                            </li>
                        </ul>
                        <p>
                            You can manage cookie preferences through your browser. Disabling
                            essential cookies may affect Platform functionality.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s7">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">7</span> Data Retention
                        </h2>
                        <p>
                            We retain your personal data for as long as your account is active,
                            plus a period thereafter as required by law or legitimate business
                            need:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Account and profile data: retained for the duration of your
                                membership plus 3 years after account closure.
                            </li>
                            <li>
                                Transaction records: 7 years (as required under Indian tax law).
                            </li>
                            <li>Communication logs: 2 years from the date of communication.</li>
                            <li>
                                Usage/analytics data: 18 months in identifiable form, then
                                aggregated.
                            </li>
                        </ul>
                        <p>
                            You may request earlier deletion of your data (see Your Rights
                            below), subject to our legal obligations.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s8">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">8</span> Security
                        </h2>
                        <p>
                            We take data security seriously and implement industry-standard
                            measures including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>TLS/SSL encryption for all data in transit.</li>
                            <li>AES-256 encryption for data at rest.</li>
                            <li>
                                Bcrypt password hashing — we never store plain-text passwords.
                            </li>
                            <li>Two-factor authentication (2FA) available for all accounts.</li>
                            <li>Regular security audits and penetration testing.</li>
                            <li>Role-based access controls for staff.</li>
                        </ul>
                        <p>
                            Despite these measures, no system is 100% secure. Please report any
                            suspected security vulnerabilities to
                            <a href="mailto:security@bizzua.in" className="text-[#185fa5] hover:underline">security@bizzua.in</a>.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s9">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">9</span> Your Rights
                        </h2>
                        <p>
                            Under applicable data protection law, you have the following rights:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Access</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Request a copy of all personal data we hold about you.
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Correction</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Correct inaccurate or incomplete personal data.
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Deletion</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Request erasure of your data (subject to legal obligations).
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-raised"><path d="M7 10V5.5C7 4.01 8.12 3 9.5 3c1.49 0 2.5 1.5 2.5 3.5v6.5c0 1.49 1.5 2.5 3.5 2.5h1c1.82 0 3 1.18 3 3v2c0 1.1-.9 2-2 2h-6c-1.1 0-2-.9-2-2v-2.5c0-1.49-1.5-2.5-3.5-2.5H7c-1.82 0-3-1.18-3-3V7c0-1.1.9-2 2-2h1.5C8.99 5 10 6.51 10 8.5v1.5" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Object</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Object to processing based on legitimate interests or for
                                        marketing.
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Portability</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Receive your data in a structured, machine-readable format.
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Withdraw consent</div>
                                    <div className="text-xs text-slate-600 mt-1">
                                        Withdraw consent for consent-based processing at any time.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4">
                            To exercise any of these rights, email us at
                            <a href="mailto:privacy@bizzua.in" className="text-[#185fa5] hover:underline">privacy@bizzua.in</a>. We will
                            respond within 30 days.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s10">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">10</span> Children's Privacy
                        </h2>
                        <p>
                            The Bizzua Platform is not directed at individuals under the age of
                            18. We do not knowingly collect personal data from minors. If we
                            become aware that we have collected data from a child under 18, we
                            will delete it promptly. Please contact us at
                            <a href="mailto:privacy@bizzua.in" className="text-[#185fa5] hover:underline">privacy@bizzua.in</a> if you
                            believe we hold data about a minor.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s11">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">11</span> International Data Transfers
                        </h2>
                        <p>
                            Our primary servers are located in India. However, some of our
                            service providers (such as cloud hosting and analytics tools) may
                            process data outside India. When this occurs, we ensure appropriate
                            safeguards are in place — including standard contractual clauses or
                            equivalent protections — to protect your data in accordance with
                            applicable law.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s12">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">12</span> Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time to reflect
                            changes in our practices or applicable law. We will notify you of
                            material changes by:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>Sending an email to the address registered on your account.</li>
                            <li>Displaying a prominent notice on the Platform.</li>
                        </ul>
                        <p>
                            Continued use of the Platform after the effective date of an updated
                            policy constitutes acceptance of the changes.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s13">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">13</span> Contact &amp; Data Protection Officer
                        </h2>
                        <p>
                            For any privacy-related queries, requests, or concerns, please
                            contact our Data Protection Officer:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">Data Protection Officer — Bizzua</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Email:
                                    <a href="mailto:privacy@bizzua.in" className="text-[#185fa5] hover:underline">privacy@bizzua.in</a>
                                    &nbsp;·&nbsp; Security:
                                    <a href="mailto:security@bizzua.in" className="text-[#185fa5] hover:underline">security@bizzua.in</a><br />
                                    Address: Bizzua Technologies Pvt. Ltd., Civil Lines, Prayagraj,
                                    UP 211001, India<br />
                                    We respond to all privacy requests within
                                    <strong>30 days</strong>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;