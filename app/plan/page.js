'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const INTERESTS = [
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'trekking', label: 'Trekking', icon: '🥾' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'food', label: 'Food', icon: '🍜' },
    { id: 'history', label: 'History', icon: '🏛️' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'adventure', label: 'Adventure', icon: '🪂' },
    { id: 'culture', label: 'Culture', icon: '🎭' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
    { id: 'spiritual', label: 'Spiritual', icon: '🕉️' },
    { id: 'wildlife', label: 'Wildlife', icon: '🐘' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
];

export default function PlanPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        budget: '',
        duration: '',
        startLocation: '',
        interests: [],
        groupSize: '',
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const toggleInterest = (id) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id],
        }));
    };

    const canProceed = () => {
        switch (step) {
            case 1: return formData.budget && Number(formData.budget) > 0;
            case 2: return formData.duration && Number(formData.duration) > 0;
            case 3: return formData.startLocation.trim().length > 0;
            case 4: return formData.interests.length > 0;
            case 5: return formData.groupSize && Number(formData.groupSize) > 0;
            default: return false;
        }
    };

    const handleNext = () => {
        if (!canProceed()) return;
        if (step < 5) {
            setStep(step + 1);
        } else {
            handleGenerate();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budget: Number(formData.budget),
                    duration: Number(formData.duration),
                    startLocation: formData.startLocation,
                    interests: formData.interests,
                    groupSize: Number(formData.groupSize),
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to generate itinerary');

            // Store in sessionStorage for the itinerary page
            sessionStorage.setItem('itineraryData', JSON.stringify(data));
            sessionStorage.setItem('tripInput', JSON.stringify(formData));
            router.push('/itinerary');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    <h2>Creating Your Perfect Trip ✨</h2>
                    <p>Our AI is optimizing routes, comparing prices, and building your custom itinerary...</p>
                    <div className={styles.loadingSteps}>
                        <div className={`${styles.loadingStep} ${styles.active}`}>
                            <span className={styles.loadingDot}></span> Analyzing budget
                        </div>
                        <div className={`${styles.loadingStep} ${styles.active}`} style={{ animationDelay: '0.5s' }}>
                            <span className={styles.loadingDot}></span> Finding best routes
                        </div>
                        <div className={`${styles.loadingStep} ${styles.active}`} style={{ animationDelay: '1s' }}>
                            <span className={styles.loadingDot}></span> Generating itinerary
                        </div>
                        <div className={`${styles.loadingStep} ${styles.active}`} style={{ animationDelay: '1.5s' }}>
                            <span className={styles.loadingDot}></span> Discovering discounts
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                {/* Progress bar */}
                <div className={styles.progress}>
                    <div className={styles.progressBar} style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
                <div className={styles.stepIndicator}>Step {step} of 5</div>

                {/* Step 1: Budget */}
                {step === 1 && (
                    <div className={styles.stepContent} key="step1">
                        <div className={styles.stepIcon}>💰</div>
                        <h2>What's your total budget?</h2>
                        <p>Enter the total amount for your entire group</p>
                        <div className={styles.inputGroup}>
                            <span className={styles.inputPrefix}>₹</span>
                            <input
                                type="number"
                                id="budget-input"
                                placeholder="e.g. 4000"
                                value={formData.budget}
                                onChange={(e) => updateField('budget', e.target.value)}
                                className={styles.input}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                        </div>
                        <div className={styles.quickPicks}>
                            {[2000, 4000, 6000, 10000, 15000].map(amt => (
                                <button
                                    key={amt}
                                    className={`${styles.quickPick} ${formData.budget == amt ? styles.selected : ''}`}
                                    onClick={() => updateField('budget', amt.toString())}
                                >
                                    ₹{amt.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Duration */}
                {step === 2 && (
                    <div className={styles.stepContent} key="step2">
                        <div className={styles.stepIcon}>📅</div>
                        <h2>How many days?</h2>
                        <p>Duration of your trip</p>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                id="duration-input"
                                placeholder="e.g. 2"
                                value={formData.duration}
                                onChange={(e) => updateField('duration', e.target.value)}
                                className={styles.input}
                                min="1"
                                max="14"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            <span className={styles.inputSuffix}>days</span>
                        </div>
                        <div className={styles.quickPicks}>
                            {[1, 2, 3, 5, 7].map(d => (
                                <button
                                    key={d}
                                    className={`${styles.quickPick} ${formData.duration == d ? styles.selected : ''}`}
                                    onClick={() => updateField('duration', d.toString())}
                                >
                                    {d} {d === 1 ? 'day' : 'days'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Location */}
                {step === 3 && (
                    <div className={styles.stepContent} key="step3">
                        <div className={styles.stepIcon}>📍</div>
                        <h2>Where are you starting from?</h2>
                        <p>Your city or town of departure</p>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                id="location-input"
                                placeholder="e.g. Coimbatore"
                                value={formData.startLocation}
                                onChange={(e) => updateField('startLocation', e.target.value)}
                                className={styles.input}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                        </div>
                        <div className={styles.quickPicks}>
                            {['Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad', 'Mumbai', 'Delhi'].map(city => (
                                <button
                                    key={city}
                                    className={`${styles.quickPick} ${formData.startLocation === city ? styles.selected : ''}`}
                                    onClick={() => updateField('startLocation', city)}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Interests */}
                {step === 4 && (
                    <div className={styles.stepContent} key="step4">
                        <div className={styles.stepIcon}>🎯</div>
                        <h2>What are you into?</h2>
                        <p>Select all interests that match your vibe</p>
                        <div className={styles.interestGrid}>
                            {INTERESTS.map(interest => (
                                <button
                                    key={interest.id}
                                    id={`interest-${interest.id}`}
                                    className={`${styles.interestChip} ${formData.interests.includes(interest.id) ? styles.selected : ''}`}
                                    onClick={() => toggleInterest(interest.id)}
                                >
                                    <span className={styles.chipIcon}>{interest.icon}</span>
                                    <span>{interest.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Group Size */}
                {step === 5 && (
                    <div className={styles.stepContent} key="step5">
                        <div className={styles.stepIcon}>👥</div>
                        <h2>How many travelers?</h2>
                        <p>Including yourself</p>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                id="group-input"
                                placeholder="e.g. 3"
                                value={formData.groupSize}
                                onChange={(e) => updateField('groupSize', e.target.value)}
                                className={styles.input}
                                min="1"
                                max="20"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            <span className={styles.inputSuffix}>people</span>
                        </div>
                        <div className={styles.quickPicks}>
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <button
                                    key={n}
                                    className={`${styles.quickPick} ${formData.groupSize == n ? styles.selected : ''}`}
                                    onClick={() => updateField('groupSize', n.toString())}
                                >
                                    {n === 1 ? 'Solo' : `${n} people`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div className={styles.error}>⚠️ {error}</div>}

                {/* Navigation */}
                <div className={styles.actions}>
                    {step > 1 && (
                        <button className="btn-secondary" onClick={handleBack}>
                            ← Back
                        </button>
                    )}
                    <button
                        className="btn-primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                        style={{ opacity: canProceed() ? 1 : 0.5, marginLeft: 'auto' }}
                    >
                        {step === 5 ? '✨ Generate Itinerary' : 'Continue →'}
                    </button>
                </div>

                {/* Summary preview */}
                {step >= 2 && (
                    <div className={styles.preview}>
                        <div className={styles.previewTitle}>Your Trip So Far</div>
                        <div className={styles.previewItems}>
                            {formData.budget && <span className={styles.previewChip}>₹{Number(formData.budget).toLocaleString()}</span>}
                            {formData.duration && <span className={styles.previewChip}>{formData.duration} day{formData.duration > 1 ? 's' : ''}</span>}
                            {formData.startLocation && <span className={styles.previewChip}>📍 {formData.startLocation}</span>}
                            {formData.interests.length > 0 && <span className={styles.previewChip}>{formData.interests.length} interests</span>}
                            {formData.groupSize && <span className={styles.previewChip}>👥 {formData.groupSize}</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
