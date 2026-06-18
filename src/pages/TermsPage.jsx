import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsPage = () => {
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
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Terms & Conditions</h1>
                    <p className="text-sm text-white/80">Please read these terms carefully before using the Bizzua platform.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
                {/* Table of Contents */}
                <aside className="sticky top-24 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hidden lg:block">
                    <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">On this page</div>
                    <nav className="space-y-1">
                        {[
                            { id: 's1', title: '1. Acceptance' },
                            { id: 's2', title: '2. Eligibility' },
                            { id: 's3', title: '3. Account responsibilities' },
                            { id: 's4', title: '4. Acceptable use' },
                            { id: 's5', title: '5. Deals & transactions' },
                            { id: 's6', title: '6. Events & ticketing' },
                            { id: 's7', title: '7. Mentorship' },
                            { id: 's8', title: '8. Intellectual property' },
                            { id: 's9', title: '9. Privacy & data' },
                            { id: 's10', title: '10. Disclaimers' },
                            { id: 's11', title: '11. Limitation of liability' },
                            { id: 's12', title: '12. Termination' },
                            { id: 's13', title: '13. Governing law' },
                            { id: 's14', title: '14. Contact us' },
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
                        date: <strong className="text-slate-700">1 June 2026</strong> &nbsp;·&nbsp; Version 2.1
                    </div>

                    <div className="bg-[#e6f1fb] border-l-4 border-[#185fa5] rounded-r-lg p-4 mb-6 text-sm text-[#0c447c]">
                        <strong>Summary:</strong> By using Bizzua you agree to these terms. We
                        connect professionals — we are not a party to deals, transactions, or
                        mentorship outcomes between members. Use the platform responsibly and
                        in good faith.
                    </div>

                    <div className="section space-y-4" id="s1">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">1</span> Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using the Bizzua platform ("Platform"), including
                            its website, mobile applications, and related services, you ("User"
                            or "Member") agree to be legally bound by these Terms &amp;
                            Conditions ("Terms"). If you do not agree to these Terms, you must
                            not use the Platform.
                        </p>
                        <p>
                            These Terms constitute a binding agreement between you and Bizzua
                            Technologies Pvt. Ltd. ("Bizzua", "we", "us", or "our"), a company
                            incorporated under the laws of India.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s2">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">2</span> Eligibility
                        </h2>
                        <p>To register and use the Platform, you must:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>Be at least 18 years of age.</li>
                            <li>
                                Be a registered business owner, entrepreneur, professional, or
                                individual with a legitimate business purpose.
                            </li>
                            <li>Have the legal authority to enter into a binding agreement.</li>
                            <li>
                                Not be prohibited from using the Platform under any applicable
                                laws of India or your jurisdiction.
                            </li>
                        </ul>
                        <p>
                            We reserve the right to verify your eligibility and reject or
                            suspend any account that does not meet these criteria.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s3">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">3</span> Account Responsibilities
                        </h2>
                        <p>When you create an account on Bizzua, you agree to:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Provide accurate, current, and complete information during
                                registration.
                            </li>
                            <li>
                                Keep your login credentials confidential and not share them with
                                any third party.
                            </li>
                            <li>
                                Notify us immediately at
                                <a href="mailto:support@bizzua.in" className="text-[#185fa5] hover:underline">support@bizzua.in</a> if you
                                suspect unauthorised access to your account.
                            </li>
                            <li>
                                Be solely responsible for all activity that occurs under your
                                account.
                            </li>
                        </ul>
                        <p>
                            You may not create multiple accounts or impersonate any person or
                            entity. One individual or business may maintain only one active
                            account unless expressly authorised by Bizzua.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s4">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">4</span> Acceptable Use Policy
                        </h2>
                        <p>
                            You agree to use the Platform only for lawful purposes. You must
                            not:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Post false, misleading, or fraudulent business information or deal
                                proposals.
                            </li>
                            <li>Harass, threaten, or abuse other members.</li>
                            <li>
                                Send unsolicited commercial messages (spam) to other members.
                            </li>
                            <li>
                                Scrape, crawl, or extract data from the Platform using automated
                                tools.
                            </li>
                            <li>
                                Attempt to gain unauthorised access to any part of the Platform or
                                its infrastructure.
                            </li>
                            <li>
                                Upload malicious code, viruses, or any content that disrupts
                                Platform functionality.
                            </li>
                            <li>
                                Use the Platform for pyramid schemes, multi-level marketing
                                without disclosure, or any unlawful financial activity.
                            </li>
                            <li>
                                Violate any applicable law, regulation, or the rights of any third
                                party.
                            </li>
                        </ul>
                        <div className="bg-[#faeeda] border-l-4 border-[#ba7517] rounded-r-lg p-4 mt-4 text-sm text-[#633806]">
                            Violations of this policy may result in immediate account suspension
                            or permanent termination without refund.
                        </div>
                    </div>

                    <div className="section space-y-4" id="s5">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">5</span> Deals &amp; Transactions
                        </h2>
                        <p>
                            The Bizzua Deal Room is a facilitation tool for members to connect
                            and collaborate. Bizzua is not a party to any deal, agreement,
                            contract, or transaction entered into between members.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Members are solely responsible for conducting due diligence on
                                counterparties.
                            </li>
                            <li>
                                Bizzua does not guarantee the accuracy of deal information posted
                                by members.
                            </li>
                            <li>
                                Any disputes arising from member-to-member transactions must be
                                resolved directly between the parties.
                            </li>
                            <li>
                                Bizzua may, at its sole discretion, remove deal listings that
                                violate these Terms.
                            </li>
                        </ul>
                    </div>

                    <div className="section space-y-4" id="s6">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">6</span> Events &amp; Ticketing
                        </h2>
                        <p>
                            Events listed on the Platform may be hosted by Bizzua or by
                            third-party organisers. When you purchase a ticket:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Payments are processed securely via our payment partners (Razorpay
                                / Stripe).
                            </li>
                            <li>
                                Refund policies are set by the event organiser and communicated at
                                the time of registration.
                            </li>
                            <li>
                                Bizzua is not liable for event cancellations, changes, or quality
                                of third-party events.
                            </li>
                            <li>
                                Recording of events without explicit permission from the organiser
                                is prohibited.
                            </li>
                        </ul>
                    </div>

                    <div className="section space-y-4" id="s7">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">7</span> Mentorship
                        </h2>
                        <p>
                            The mentorship programme connects mentors and mentees for
                            professional guidance. By participating:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>
                                Mentors confirm they have the experience and qualifications they
                                represent on their profile.
                            </li>
                            <li>
                                Mentees understand that advice is personal guidance, not
                                professional legal, financial, or medical advice.
                            </li>
                            <li>Sessions must be conducted respectfully and professionally.</li>
                            <li>
                                Bizzua is not liable for outcomes of mentorship relationships.
                            </li>
                        </ul>
                    </div>

                    <div className="section space-y-4" id="s8">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">8</span> Intellectual Property
                        </h2>
                        <p>
                            All content on the Platform created by Bizzua — including logos,
                            design, text, software, and graphics — is owned by or licensed to
                            Bizzua and protected under applicable intellectual property laws.
                        </p>
                        <p>
                            Content you upload remains your property. By posting it, you grant
                            Bizzua a non-exclusive, royalty-free licence to display, reproduce,
                            and distribute it solely for operating and improving the Platform.
                        </p>
                        <p>
                            You must not reproduce, distribute, or create derivative works from
                            Bizzua's proprietary content without prior written consent.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s9">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">9</span> Privacy &amp; Data
                        </h2>
                        <p>
                            Your privacy is important to us. Our
                            <Link to="/privacy" className="text-[#185fa5] hover:underline">Privacy Policy</Link> explains how we collect,
                            use, and protect your personal data in compliance with the
                            Information Technology Act, 2000, and the Digital Personal Data
                            Protection Act, 2023 (India).
                        </p>
                        <p>
                            By using the Platform, you consent to the collection and use of your
                            data as described in the Privacy Policy.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s10">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">10</span> Disclaimers
                        </h2>
                        <p>
                            The Platform is provided on an "as is" and "as available" basis.
                            Bizzua makes no warranties, express or implied, including but not
                            limited to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>Uninterrupted or error-free access to the Platform.</li>
                            <li>
                                Accuracy or completeness of member profiles or deal listings.
                            </li>
                            <li>
                                Fitness of the Platform for any particular business purpose.
                            </li>
                        </ul>
                        <p>
                            We do not endorse any member, product, service, or deal featured on
                            the Platform.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s11">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">11</span> Limitation of Liability
                        </h2>
                        <p>
                            To the maximum extent permitted by law, Bizzua shall not be liable
                            for any indirect, incidental, special, consequential, or punitive
                            damages arising from your use of the Platform, including but not
                            limited to loss of business, revenue, data, or goodwill.
                        </p>
                        <p>
                            Our total liability to you for any claim arising out of these Terms
                            shall not exceed the amount you paid to Bizzua in the 3 months
                            preceding the claim.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s12">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">12</span> Termination
                        </h2>
                        <p>
                            We may suspend or terminate your account at any time, with or
                            without notice, if we determine that you have violated these Terms
                            or for any other reason at our sole discretion.
                        </p>
                        <p>
                            You may close your account at any time by contacting
                            <a href="mailto:support@bizzua.in" className="text-[#185fa5] hover:underline">support@bizzua.in</a>. Upon
                            termination, your right to use the Platform ceases immediately.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s13">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">13</span> Governing Law &amp; Disputes
                        </h2>
                        <p>
                            These Terms are governed by the laws of India. Any dispute arising
                            out of or relating to these Terms shall be subject to the exclusive
                            jurisdiction of the courts of Prayagraj, Uttar Pradesh, India.
                        </p>
                        <p>
                            We encourage members to first attempt to resolve disputes informally
                            by contacting us at
                            <a href="mailto:legal@bizzua.in" className="text-[#185fa5] hover:underline">legal@bizzua.in</a>.
                        </p>
                    </div>

                    <div className="section space-y-4" id="s14">
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#e6f1fb] text-[#185fa5] text-xs font-bold flex items-center justify-center shrink-0">14</span> Contact Us
                        </h2>
                        <p>If you have any questions about these Terms, please contact us:</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#e6f1fb] text-[#185fa5] flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">Bizzua Legal Team</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Email:
                                    <a href="mailto:legal@bizzua.in" className="text-[#185fa5] hover:underline">legal@bizzua.in</a>
                                    &nbsp;·&nbsp; Support:
                                    <a href="mailto:support@bizzua.in" className="text-[#185fa5] hover:underline">support@bizzua.in</a><br />
                                    Address: Bizzua Technologies Pvt. Ltd., Civil Lines,
                                    Prayagraj, UP 211001, India
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;