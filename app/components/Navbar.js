'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✈️</span>
                    <span className={styles.logoText}>Wander<span className={styles.logoAccent}>Wise</span></span>
                </Link>

                <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                    <Link href="/" className={styles.link} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link href="/plan" className={styles.link} onClick={() => setMenuOpen(false)}>Plan Trip</Link>
                    <Link href="/split" className={styles.link} onClick={() => setMenuOpen(false)}>Split Expenses</Link>
                    <Link href="/plan" className={styles.ctaLink} onClick={() => setMenuOpen(false)}>
                        Get Started <span>→</span>
                    </Link>
                </div>

                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
