import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGlow}></div>
                <div className={styles.heroGlow2}></div>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <span className={styles.badgeDot}></span>
                        AI-Powered Travel Planning
                    </div>
                    <h1 className={styles.title}>
                        Travel <span className={styles.gradient}>Smarter</span>,<br />
                        Spend <span className={styles.gradient2}>Less</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Plan budget-optimized trips with AI-generated itineraries, smart route planning,
                        student discounts, and group expense splitting. Built for students who want to explore more.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/plan" className="btn-primary">
                            ✨ Plan Your Trip
                        </Link>
                        <Link href="/split" className="btn-secondary">
                            👥 Split Expenses
                        </Link>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>₹0</span>
                            <span className={styles.statLabel}>Platform Cost</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>30%</span>
                            <span className={styles.statLabel}>Avg. Savings</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>AI</span>
                            <span className={styles.statLabel}>Powered</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>Features</span>
                        <h2>Everything You Need for the <span className={styles.gradient}>Perfect Trip</span></h2>
                        <p>From planning to splitting costs — we've got you covered.</p>
                    </div>

                    <div className={styles.featureGrid}>
                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>🧠</div>
                            <h3>AI Itinerary Engine</h3>
                            <p>Generates day-wise schedules with time blocks, costs, and backup plans — all tailored to your interests.</p>
                        </div>

                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>💰</div>
                            <h3>Budget Optimizer</h3>
                            <p>Compares transport, stays, and meals to find the best value. Every rupee counts when you're a student.</p>
                        </div>

                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>🗺️</div>
                            <h3>Smart Route Planner</h3>
                            <p>Optimized travel routes with Google Maps integration, travel time estimates, and public transport suggestions.</p>
                        </div>

                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #6366f1)' }}>🎓</div>
                            <h3>Student Discounts</h3>
                            <p>Auto-detect railway concessions, museum discounts, group pricing, and hostel deals with your student ID.</p>
                        </div>

                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}>👥</div>
                            <h3>Group Split</h3>
                            <p>Track expenses, split costs fairly, and see who owes whom — no more awkward money conversations.</p>
                        </div>

                        <div className={`${styles.featureCard} glass-card`}>
                            <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>📋</div>
                            <h3>Export & Share</h3>
                            <p>Download your itinerary as a PDF or share it with friends. Your entire trip plan in one beautiful document.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>How It Works</span>
                        <h2>Plan in <span className={styles.gradient2}>3 Simple Steps</span></h2>
                    </div>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>01</div>
                            <div className={styles.stepContent}>
                                <h3>Tell Us Your Vibe</h3>
                                <p>Enter your budget, trip duration, starting location, interests, and group size.</p>
                            </div>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>02</div>
                            <div className={styles.stepContent}>
                                <h3>AI Does the Magic</h3>
                                <p>Our engine optimizes routes, compares prices, and generates a custom day-wise itinerary.</p>
                            </div>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>03</div>
                            <div className={styles.stepContent}>
                                <h3>Go Explore!</h3>
                                <p>Get your cost breakdown, route map, student discounts, and export everything as a PDF.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaGlow}></div>
                <div className={styles.container}>
                    <div className={styles.ctaCard}>
                        <h2>Ready to Plan Your Next Adventure?</h2>
                        <p>Join thousands of students who travel smarter, not harder.</p>
                        <Link href="/plan" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
                            🚀 Start Planning — It's Free
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
