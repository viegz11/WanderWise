/**
 * Student Discount Finder
 * Detects available discounts for students traveling in India.
 */

const STUDENT_DISCOUNTS = [
    {
        category: 'Railways',
        icon: '🚂',
        discounts: [
            { name: 'Railway Concession (Student)', discount: '25-50%', description: 'Show valid student ID at booking counter', applicable: true },
            { name: 'Tatkal Student Quota', discount: '10%', description: 'Available on select trains', applicable: true },
        ],
    },
    {
        category: 'Museums & Heritage',
        icon: '🏛️',
        discounts: [
            { name: 'ASI Monuments', discount: '50%', description: 'Valid student ID required at ticketed ASI sites', applicable: true },
            { name: 'State Museums', discount: '30-50%', description: 'Most state-run museums offer student rates', applicable: true },
            { name: 'National Parks', discount: '25%', description: 'Student rate at many national parks', applicable: true },
        ],
    },
    {
        category: 'Accommodation',
        icon: '🏨',
        discounts: [
            { name: 'YHA India Hostels', discount: '20%', description: 'Youth Hostel Association membership card', applicable: true },
            { name: 'Hostelworld Student Deals', discount: '10-15%', description: 'Use .edu email for student pricing', applicable: true },
        ],
    },
    {
        category: 'Transport',
        icon: '🚌',
        discounts: [
            { name: 'State Bus Concession', discount: '25-50%', description: 'Student bus pass in most states', applicable: true },
            { name: 'Metro Student Pass', discount: '30%', description: 'Available in Delhi, Bangalore, Chennai metros', applicable: true },
        ],
    },
    {
        category: 'Food & Cafes',
        icon: '☕',
        discounts: [
            { name: 'Campus Canteen Rates', discount: 'Up to 60%', description: 'Visit university canteens for cheap meals', applicable: true },
            { name: 'Zomato Student Plan', discount: '15%', description: 'Student subscription available on some platforms', applicable: true },
        ],
    },
    {
        category: 'Group Deals',
        icon: '👥',
        discounts: [
            { name: 'Group Booking (5+)', discount: '10-20%', description: 'Most hotels and transport offer group rates', applicable: true },
            { name: 'Shared Activities', discount: '15-30%', description: 'Group pricing for adventure activities, treks, tours', applicable: true },
        ],
    },
];

/**
 * Finds applicable discounts based on interests and group size
 * @param {string[]} interests - User selected interests
 * @param {number} groupSize - Number of travelers
 * @returns {object[]} Applicable discounts
 */
export function findDiscounts(interests = [], groupSize = 1) {
    let results = [...STUDENT_DISCOUNTS];

    // Boost relevance for certain categories based on interests
    if (interests.includes('history') || interests.includes('culture')) {
        results = results.map(cat => cat.category === 'Museums & Heritage'
            ? { ...cat, highlighted: true }
            : cat
        );
    }

    if (interests.includes('trekking') || interests.includes('adventure')) {
        results = results.map(cat => cat.category === 'Group Deals'
            ? { ...cat, highlighted: true }
            : cat
        );
    }

    // Add group-specific discounts
    if (groupSize >= 5) {
        results = results.map(cat => cat.category === 'Group Deals'
            ? { ...cat, highlighted: true, discounts: cat.discounts.map(d => ({ ...d, applicable: true })) }
            : cat
        );
    }

    return results;
}

/**
 * Estimates total potential savings from student discounts
 * @param {number} totalBudget - Original budget
 * @param {string[]} interests - Selected interests
 * @returns {object} Estimated savings
 */
export function estimateSavings(totalBudget, interests = []) {
    // Conservative estimate: 10-15% savings from student discounts
    const savingsPercent = interests.includes('history') ? 0.15 : 0.10;
    const estimated = Math.round(totalBudget * savingsPercent);

    return {
        estimatedSavings: estimated,
        savingsPercent: Math.round(savingsPercent * 100),
        tip: `With your student ID, you could save approximately ₹${estimated} on this trip!`,
    };
}
