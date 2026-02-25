/**
 * Group Expense Splitter
 * Calculates optimal settlements using the minimum transactions algorithm.
 */

/**
 * Calculates who owes whom using a greedy algorithm for minimum transactions.
 * @param {object[]} expenses - Array of { paidBy, amount, description, splitAmong }
 * @param {string[]} members - Array of member names
 * @returns {object} Settlement details
 */
export function calculateSettlements(expenses, members) {
    if (!expenses.length || !members.length) {
        return { balances: {}, settlements: [], totalExpenses: 0 };
    }

    // Calculate net balance for each member
    const balances = {};
    members.forEach(m => { balances[m] = 0; });

    let totalExpenses = 0;

    expenses.forEach(expense => {
        const splitMembers = expense.splitAmong && expense.splitAmong.length > 0
            ? expense.splitAmong
            : members;
        const share = expense.amount / splitMembers.length;

        // Person who paid gets credited
        if (balances[expense.paidBy] !== undefined) {
            balances[expense.paidBy] += expense.amount;
        }

        // Everyone who was part of the split gets debited
        splitMembers.forEach(member => {
            if (balances[member] !== undefined) {
                balances[member] -= share;
            }
        });

        totalExpenses += expense.amount;
    });

    // Round balances
    Object.keys(balances).forEach(k => {
        balances[k] = Math.round(balances[k] * 100) / 100;
    });

    // Calculate minimum transactions using greedy approach
    const settlements = minimizeTransactions(balances);

    return {
        balances,
        settlements,
        totalExpenses: Math.round(totalExpenses),
        perPerson: Math.round(totalExpenses / members.length),
    };
}

/**
 * Greedy algorithm to minimize the number of transactions
 */
function minimizeTransactions(balances) {
    const debtors = []; // people who owe money (negative balance)
    const creditors = []; // people who are owed money (positive balance)

    Object.entries(balances).forEach(([person, amount]) => {
        if (amount < -0.01) {
            debtors.push({ person, amount: Math.abs(amount) });
        } else if (amount > 0.01) {
            creditors.push({ person, amount });
        }
    });

    // Sort both by amount (descending)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const transferAmount = Math.min(debtors[i].amount, creditors[j].amount);

        if (transferAmount > 0.01) {
            settlements.push({
                from: debtors[i].person,
                to: creditors[j].person,
                amount: Math.round(transferAmount),
            });
        }

        debtors[i].amount -= transferAmount;
        creditors[j].amount -= transferAmount;

        if (debtors[i].amount < 0.01) i++;
        if (creditors[j].amount < 0.01) j++;
    }

    return settlements;
}

/**
 * Generates a summary of expenses by category
 */
export function categorizeExpenses(expenses) {
    const categories = {};

    expenses.forEach(expense => {
        const cat = expense.category || 'Other';
        if (!categories[cat]) {
            categories[cat] = { total: 0, count: 0, items: [] };
        }
        categories[cat].total += expense.amount;
        categories[cat].count += 1;
        categories[cat].items.push(expense);
    });

    return categories;
}
