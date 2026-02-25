'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

const CATEGORIES = ['Transport', 'Food', 'Accommodation', 'Activity', 'Shopping', 'Other'];

export default function SplitPage() {
    const [members, setMembers] = useState(['']);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: '', category: 'Other', splitAmong: [] });
    const [settlements, setSettlements] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const validMembers = members.filter(m => m.trim());

    const addMember = () => setMembers([...members, '']);
    const updateMember = (idx, val) => {
        const updated = [...members];
        updated[idx] = val;
        setMembers(updated);
    };
    const removeMember = (idx) => {
        if (members.length <= 1) return;
        setMembers(members.filter((_, i) => i !== idx));
    };

    const toggleSplitMember = (name) => {
        setNewExpense(prev => ({
            ...prev,
            splitAmong: prev.splitAmong.includes(name)
                ? prev.splitAmong.filter(m => m !== name)
                : [...prev.splitAmong, name],
        }));
    };

    const addExpense = () => {
        if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) return;
        const expense = {
            ...newExpense,
            amount: Number(newExpense.amount),
            splitAmong: newExpense.splitAmong.length > 0 ? newExpense.splitAmong : validMembers,
            id: Date.now(),
        };
        setExpenses([...expenses, expense]);
        setNewExpense({ description: '', amount: '', paidBy: '', category: 'Other', splitAmong: [] });
        setShowForm(false);
    };

    const removeExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    // Calculate settlements whenever expenses or members change
    useEffect(() => {
        if (expenses.length === 0 || validMembers.length < 2) {
            setSettlements(null);
            return;
        }

        const calculate = async () => {
            try {
                const res = await fetch('/api/split-expenses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ expenses, members: validMembers }),
                });
                const data = await res.json();
                setSettlements(data);
            } catch {
                // Fallback: calculate locally
                const balances = {};
                validMembers.forEach(m => { balances[m] = 0; });
                expenses.forEach(exp => {
                    const split = exp.splitAmong.length > 0 ? exp.splitAmong : validMembers;
                    const share = exp.amount / split.length;
                    if (balances[exp.paidBy] !== undefined) balances[exp.paidBy] += exp.amount;
                    split.forEach(m => { if (balances[m] !== undefined) balances[m] -= share; });
                });
                setSettlements({
                    balances,
                    settlements: [],
                    totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
                    perPerson: Math.round(expenses.reduce((s, e) => s + e.amount, 0) / validMembers.length),
                });
            }
        };
        calculate();
    }, [expenses, members]);

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    const categoryIcon = {
        Transport: '🚌', Food: '🍜', Accommodation: '🏨',
        Activity: '🎯', Shopping: '🛍️', Other: '📝',
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>👥 Group Expense Splitter</h1>
                <p>Track expenses, split fairly, settle easily.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.mainCol}>
                    {/* Members */}
                    <div className={`${styles.card} glass-card`}>
                        <h3>👤 Group Members</h3>
                        <div className={styles.membersList}>
                            {members.map((m, idx) => (
                                <div key={idx} className={styles.memberRow}>
                                    <div className={styles.memberAvatar}>
                                        {m ? m.charAt(0).toUpperCase() : (idx + 1)}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Member ${idx + 1}`}
                                        value={m}
                                        onChange={(e) => updateMember(idx, e.target.value)}
                                        className={styles.memberInput}
                                    />
                                    {members.length > 1 && (
                                        <button className={styles.removeBtn} onClick={() => removeMember(idx)}>✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className={styles.addBtn} onClick={addMember}>+ Add Member</button>
                    </div>

                    {/* Expenses */}
                    <div className={`${styles.card} glass-card`}>
                        <div className={styles.cardHeader}>
                            <h3>💳 Expenses</h3>
                            {validMembers.length >= 2 && (
                                <button className={styles.addExpenseBtn} onClick={() => setShowForm(!showForm)}>
                                    {showForm ? '✕ Cancel' : '+ Add Expense'}
                                </button>
                            )}
                        </div>

                        {validMembers.length < 2 && (
                            <p className={styles.hint}>Add at least 2 members to start tracking expenses.</p>
                        )}

                        {/* Add Expense Form */}
                        {showForm && validMembers.length >= 2 && (
                            <div className={styles.expenseForm}>
                                <input
                                    type="text"
                                    placeholder="What was it for?"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className={styles.formInput}
                                />
                                <div className={styles.formRow}>
                                    <div className={styles.amountInput}>
                                        <span>₹</span>
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={newExpense.amount}
                                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        />
                                    </div>
                                    <select
                                        value={newExpense.paidBy}
                                        onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                        className={styles.formSelect}
                                    >
                                        <option value="">Paid by...</option>
                                        {validMembers.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formRow}>
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        className={styles.formSelect}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{categoryIcon[c]} {c}</option>)}
                                    </select>
                                </div>
                                <div className={styles.splitSection}>
                                    <span className={styles.splitLabel}>Split among:</span>
                                    <div className={styles.splitChips}>
                                        {validMembers.map(m => (
                                            <button
                                                key={m}
                                                className={`${styles.splitChip} ${newExpense.splitAmong.includes(m) || newExpense.splitAmong.length === 0 ? styles.selected : ''}`}
                                                onClick={() => toggleSplitMember(m)}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                    <span className={styles.splitHint}>
                                        {newExpense.splitAmong.length === 0 ? 'Split equally among everyone' : `Split among ${newExpense.splitAmong.length} people`}
                                    </span>
                                </div>
                                <button className="btn-primary" onClick={addExpense} style={{ width: '100%' }}>
                                    Add Expense
                                </button>
                            </div>
                        )}

                        {/* Expense List */}
                        {expenses.length > 0 && (
                            <div className={styles.expenseList}>
                                {expenses.map(exp => (
                                    <div key={exp.id} className={styles.expenseItem}>
                                        <div className={styles.expenseIcon}>{categoryIcon[exp.category]}</div>
                                        <div className={styles.expenseInfo}>
                                            <span className={styles.expenseName}>{exp.description}</span>
                                            <span className={styles.expenseMeta}>Paid by {exp.paidBy} • {exp.category}</span>
                                        </div>
                                        <span className={styles.expenseAmount}>₹{exp.amount.toLocaleString()}</span>
                                        <button className={styles.removeBtn} onClick={() => removeExpense(exp.id)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {expenses.length === 0 && validMembers.length >= 2 && !showForm && (
                            <p className={styles.hint}>No expenses yet. Add your first expense to get started!</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Summary */}
                    <div className={`${styles.card} glass-card`}>
                        <h3>📊 Summary</h3>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Total Expenses</span>
                                <span className={styles.summaryValue}>₹{totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Per Person</span>
                                <span className={styles.summaryValue}>
                                    ₹{validMembers.length > 0 ? Math.round(totalExpenses / validMembers.length).toLocaleString() : 0}
                                </span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Members</span>
                                <span className={styles.summaryValue}>{validMembers.length}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Transactions</span>
                                <span className={styles.summaryValue}>{expenses.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Balances */}
                    {settlements && settlements.balances && (
                        <div className={`${styles.card} glass-card`}>
                            <h3>⚖️ Balances</h3>
                            <div className={styles.balanceList}>
                                {Object.entries(settlements.balances).map(([person, balance]) => (
                                    <div key={person} className={styles.balanceItem}>
                                        <div className={styles.balanceAvatar}>{person.charAt(0).toUpperCase()}</div>
                                        <span className={styles.balanceName}>{person}</span>
                                        <span
                                            className={styles.balanceAmount}
                                            style={{ color: balance > 0.5 ? '#10b981' : balance < -0.5 ? '#ef4444' : 'var(--text-muted)' }}
                                        >
                                            {balance > 0.5 ? '+' : ''}₹{Math.round(balance).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settlements */}
                    {settlements && settlements.settlements && settlements.settlements.length > 0 && (
                        <div className={`${styles.card} glass-card`} style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                            <h3>🤝 Settlements</h3>
                            <p className={styles.settlementSubtitle}>Minimum transactions to settle up</p>
                            <div className={styles.settlementList}>
                                {settlements.settlements.map((s, i) => (
                                    <div key={i} className={styles.settlementItem}>
                                        <span className={styles.settlementFrom}>{s.from}</span>
                                        <span className={styles.settlementArrow}>→</span>
                                        <span className={styles.settlementTo}>{s.to}</span>
                                        <span className={styles.settlementAmount}>₹{s.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
