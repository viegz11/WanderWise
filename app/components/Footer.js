import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span>✈️</span>
                            <span className={styles.logoText}>Wander<span className={styles.accent}>Wise</span></span>
                        </div>
                        <p className={styles.tagline}>AI-powered travel planning for students. Explore more, spend less.</p>
                    </div>

                    <div className={styles.linksGrid}>
                        <div className={styles.linkGroup}>
                            <h4>Features</h4>
                            <a href="/plan">Smart Itinerary</a>
                            <a href="/plan">Budget Optimizer</a>
                            <a href="/split">Expense Splitter</a>
                        </div>
                        <div className={styles.linkGroup}>
                            <h4>Resources</h4>
                            <a href="#">Student Discounts</a>
                            <a href="#">Travel Tips</a>
                            <a href="#">Safety Guide</a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 WanderWise. Built with 💜 for student travelers.</p>
                    <div className={styles.socials}>
                        <a href="#" aria-label="Twitter">𝕏</a>
                        <a href="#" aria-label="Instagram">📷</a>
                        <a href="#" aria-label="GitHub">⚙️</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
