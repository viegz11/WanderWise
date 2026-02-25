'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function ItineraryPage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [tripInput, setTripInput] = useState(null);
    const [activeDay, setActiveDay] = useState(1);
    const [showDiscounts, setShowDiscounts] = useState(false);
    const printRef = useRef(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('itineraryData');
        const input = sessionStorage.getItem('tripInput');
        if (stored) {
            setData(JSON.parse(stored));
        }
        if (input) {
            setTripInput(JSON.parse(input));
        }
    }, []);

    const handleExportPDF = async () => {
        if (typeof window === 'undefined') return;
        try {
            // Load html2pdf via script tag to avoid webpack bundling issues
            if (!window.html2pdf) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            const el = printRef.current;
            if (!el || !window.html2pdf) { window.print(); return; }
            window.html2pdf().set({
                margin: 10,
                filename: 'WanderWise_Itinerary.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            }).from(el).save();
        } catch {
            window.print();
        }
    };

    if (!data) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyContent}>
                    <span className={styles.emptyIcon}>🗺️</span>
                    <h2>No Itinerary Found</h2>
                    <p>Plan a trip first to see your custom itinerary here.</p>
                    <Link href="/plan" className="btn-primary">✨ Plan Your Trip</Link>
                </div>
            </div>
        );
    }

    const { itinerary, budgetBreakdown, discounts, savings, safetyTips, rainBackup, bestPhotoTimes, isDemo } = data;
    const currentDay = itinerary.days.find(d => d.day === activeDay) || itinerary.days[0];

    const costByType = {};
    itinerary.days.forEach(day => {
        day.activities.forEach(act => {
            if (!costByType[act.type]) costByType[act.type] = 0;
            costByType[act.type] += act.cost;
        });
    });

    const typeColors = {
        transport: '#6366f1',
        accommodation: '#06b6d4',
        food: '#10b981',
        activity: '#f59e0b',
    };

    const typeLabels = {
        transport: '🚌 Transport',
        accommodation: '🏨 Stay',
        food: '🍜 Food',
        activity: '🎯 Activities',
    };

    const totalCost = Object.values(costByType).reduce((s, v) => s + v, 0);

    return (
        <div className={styles.page} ref={printRef}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.headerContent}>

                    <h1>{itinerary.title}</h1>
                    <div className={styles.headerMeta}>
                        {tripInput && (
                            <>
                                <span className={styles.metaChip}>💰 ₹{Number(tripInput.budget).toLocaleString()}</span>
                                <span className={styles.metaChip}>📅 {tripInput.duration} day{tripInput.duration > 1 ? 's' : ''}</span>
                                <span className={styles.metaChip}>📍 {tripInput.startLocation}</span>
                                <span className={styles.metaChip}>👥 {tripInput.groupSize} people</span>
                            </>
                        )}
                    </div>
                    <div className={styles.headerActions}>
                        <button className="btn-primary" onClick={handleExportPDF}>📋 Export PDF</button>
                        <Link href="/split" className="btn-secondary">👥 Split Expenses</Link>
                        <Link href="/plan" className="btn-secondary">🔄 New Trip</Link>
                    </div>
                </div>
            </section>

            <div className={styles.content}>
                <div className={styles.mainCol}>
                    {/* Day Tabs */}
                    <div className={styles.dayTabs}>
                        {itinerary.days.map(day => (
                            <button
                                key={day.day}
                                className={`${styles.dayTab} ${activeDay === day.day ? styles.activeTab : ''}`}
                                onClick={() => setActiveDay(day.day)}
                            >
                                <span className={styles.dayNum}>Day {day.day}</span>
                                <span className={styles.dayLocation}>{day.location}</span>
                            </button>
                        ))}
                    </div>

                    {/* Day Timeline */}
                    <div className={styles.timeline}>
                        <div className={styles.dayHeader}>
                            <h2>{currentDay.title}</h2>
                            <span className={styles.dayCost}>₹{currentDay.totalCost.toLocaleString()}</span>
                        </div>

                        {currentDay.activities.map((act, idx) => (
                            <div key={idx} className={styles.timelineItem}>
                                <div className={styles.timelineLine}>
                                    <div className={styles.timelineDot} style={{ background: typeColors[act.type] || '#6366f1' }}></div>
                                    {idx < currentDay.activities.length - 1 && <div className={styles.timelineConnector}></div>}
                                </div>
                                <div className={styles.timelineCard}>
                                    <div className={styles.timelineTop}>
                                        <span className={styles.timelineTime}>{act.time}</span>
                                        <span className={styles.timelineType} style={{ color: typeColors[act.type] }}>
                                            {typeLabels[act.type] || act.type}
                                        </span>
                                    </div>
                                    <div className={styles.timelineBody}>
                                        <span className={styles.timelineIcon}>{act.icon}</span>
                                        <p>{act.activity}</p>
                                    </div>
                                    {act.cost > 0 && (
                                        <div className={styles.timelineCost}>₹{act.cost.toLocaleString()}/person</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Cost Breakdown */}
                    <div className={`${styles.sideCard} glass-card`}>
                        <h3>💰 Cost Breakdown</h3>
                        <div className={styles.costBreakdown}>
                            {Object.entries(costByType).map(([type, cost]) => (
                                <div key={type} className={styles.costRow}>
                                    <div className={styles.costLabel}>
                                        <div className={styles.costDot} style={{ background: typeColors[type] }}></div>
                                        <span>{typeLabels[type] || type}</span>
                                    </div>
                                    <span className={styles.costValue}>₹{cost.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className={styles.costDivider}></div>
                            <div className={styles.costRow}>
                                <span className={styles.costTotalLabel}>Per Person</span>
                                <span className={styles.costTotal}>₹{totalCost.toLocaleString()}</span>
                            </div>
                            {tripInput && Number(tripInput.groupSize) > 1 && (
                                <div className={styles.costRow}>
                                    <span className={styles.costTotalLabel}>Group Total</span>
                                    <span className={styles.costTotal}>₹{(totalCost * Number(tripInput.groupSize)).toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Bar chart */}
                        <div className={styles.costChart}>
                            {Object.entries(costByType).map(([type, cost]) => (
                                <div
                                    key={type}
                                    className={styles.costBar}
                                    style={{
                                        width: `${(cost / totalCost) * 100}%`,
                                        background: typeColors[type],
                                    }}
                                    title={`${typeLabels[type]}: ₹${cost}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Savings */}
                    {savings && (
                        <div className={`${styles.sideCard} glass-card`} style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                            <h3>🎓 Student Savings</h3>
                            <p className={styles.savingsAmount}>Up to ₹{savings.estimatedSavings.toLocaleString()} ({savings.savingsPercent}%)</p>
                            <p className={styles.savingsTip}>{savings.tip}</p>
                            <button className={styles.discountToggle} onClick={() => setShowDiscounts(!showDiscounts)}>
                                {showDiscounts ? 'Hide' : 'Show'} All Discounts ↓
                            </button>
                            {showDiscounts && discounts && (
                                <div className={styles.discountList}>
                                    {discounts.map((cat, i) => (
                                        <div key={i} className={styles.discountCategory}>
                                            <h4>{cat.icon} {cat.category} {cat.highlighted ? '⭐' : ''}</h4>
                                            {cat.discounts.map((d, j) => (
                                                <div key={j} className={styles.discountItem}>
                                                    <span className={styles.discountName}>{d.name}</span>
                                                    <span className={styles.discountPercent}>{d.discount}</span>
                                                    <span className={styles.discountDesc}>{d.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Map */}
                    <div className={`${styles.sideCard} glass-card`}>
                        <h3>🗺️ Route Map</h3>
                        <div className={styles.mapContainer}>
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(tripInput?.startLocation || 'India')}&destination=${encodeURIComponent(currentDay.location || 'India')}&mode=transit`}
                                width="100%"
                                height="250"
                                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    {safetyTips && safetyTips.length > 0 && (
                        <div className={`${styles.sideCard} glass-card`}>
                            <h3>🛡️ Safety Tips</h3>
                            <ul className={styles.tipList}>
                                {safetyTips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Rain Backup */}
                    {rainBackup && rainBackup.length > 0 && (
                        <div className={`${styles.sideCard} glass-card`}>
                            <h3>🌧️ Rain Backup Plan</h3>
                            <ul className={styles.tipList}>
                                {rainBackup.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Photography */}
                    {bestPhotoTimes && bestPhotoTimes.length > 0 && (
                        <div className={`${styles.sideCard} glass-card`}>
                            <h3>📸 Best Photo Times</h3>
                            <ul className={styles.tipList}>
                                {bestPhotoTimes.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
