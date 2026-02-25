/**
 * Budget Optimization Engine
 * Analyzes budget constraints and recommends optimal allocation
 * for transport, accommodation, food, and activities.
 */

const TRANSPORT_MODES = {
    bus: { costPerKm: 1.2, label: 'Public Bus', icon: '🚌', comfort: 2 },
    train_sleeper: { costPerKm: 0.8, label: 'Train (Sleeper)', icon: '🚂', comfort: 3 },
    train_ac: { costPerKm: 2.0, label: 'Train (AC)', icon: '🚆', comfort: 4 },
    shared_cab: { costPerKm: 4.0, label: 'Shared Cab', icon: '🚕', comfort: 5 },
};

const ACCOMMODATION_TIERS = [
    { tier: 'hostel', label: 'Hostel/Dormitory', costPerNight: 300, icon: '🏨', comfort: 2 },
    { tier: 'homestay', label: 'Homestay', costPerNight: 600, icon: '🏡', comfort: 3 },
    { tier: 'budget_hotel', label: 'Budget Hotel', costPerNight: 1000, icon: '🏢', comfort: 4 },
    { tier: 'mid_hotel', label: 'Mid-Range Hotel', costPerNight: 2000, icon: '🏨', comfort: 5 },
];

const MEAL_COSTS = {
    street_food: { perMeal: 50, label: 'Street Food', icon: '🍜' },
    local_restaurant: { perMeal: 120, label: 'Local Restaurant', icon: '🍽️' },
    cafe: { perMeal: 200, label: 'Café', icon: '☕' },
    restaurant: { perMeal: 400, label: 'Restaurant', icon: '🍴' },
};

/**
 * Optimizes budget allocation across categories
 * @param {number} totalBudget - Total budget in INR
 * @param {number} duration - Trip duration in days
 * @param {number} groupSize - Number of people
 * @param {number} estimatedDistance - Estimated travel distance in km
 * @returns {object} Optimized budget breakdown
 */
export function optimizeBudget(totalBudget, duration, groupSize, estimatedDistance = 200) {
    const perPersonBudget = totalBudget / groupSize;
    const nights = Math.max(duration - 1, 0);

    // Budget allocation ratios (optimized for students)
    const allocations = {
        transport: 0.30,
        accommodation: 0.25,
        food: 0.30,
        activities: 0.15,
    };

    const transportBudget = perPersonBudget * allocations.transport;
    const accommodationBudget = perPersonBudget * allocations.accommodation;
    const foodBudget = perPersonBudget * allocations.food;
    const activitiesBudget = perPersonBudget * allocations.activities;

    // Find best transport mode
    const transportOptions = Object.entries(TRANSPORT_MODES)
        .map(([key, mode]) => ({
            ...mode,
            key,
            totalCost: mode.costPerKm * estimatedDistance,
            affordable: mode.costPerKm * estimatedDistance <= transportBudget,
        }))
        .sort((a, b) => b.comfort - a.comfort);

    const bestTransport = transportOptions.find(t => t.affordable) || transportOptions[transportOptions.length - 1];

    // Find best accommodation
    const accommodationOptions = ACCOMMODATION_TIERS
        .map(tier => ({
            ...tier,
            totalCost: tier.costPerNight * nights,
            affordable: tier.costPerNight * nights <= accommodationBudget,
        }))
        .sort((a, b) => b.comfort - a.comfort);

    const bestAccommodation = accommodationOptions.find(a => a.affordable) || accommodationOptions[accommodationOptions.length - 1];

    // Calculate meal plan
    const mealsPerDay = 3;
    const mealBudgetPerMeal = foodBudget / (duration * mealsPerDay);
    const mealOptions = Object.entries(MEAL_COSTS)
        .map(([key, meal]) => ({
            ...meal,
            key,
            affordable: meal.perMeal <= mealBudgetPerMeal,
        }));

    const bestMealPlan = mealOptions.filter(m => m.affordable).pop() || mealOptions[0];

    return {
        perPersonBudget,
        breakdown: {
            transport: {
                budget: Math.round(transportBudget),
                recommendation: bestTransport,
                options: transportOptions,
            },
            accommodation: {
                budget: Math.round(accommodationBudget),
                recommendation: bestAccommodation,
                options: accommodationOptions,
                nights,
            },
            food: {
                budget: Math.round(foodBudget),
                recommendation: bestMealPlan,
                perMeal: Math.round(mealBudgetPerMeal),
                mealsPerDay,
            },
            activities: {
                budget: Math.round(activitiesBudget),
                perDay: Math.round(activitiesBudget / duration),
            },
        },
        totalEstimated: Math.round(
            bestTransport.totalCost +
            bestAccommodation.totalCost +
            bestMealPlan.perMeal * mealsPerDay * duration
        ),
        savings: Math.round(perPersonBudget - (
            bestTransport.totalCost +
            bestAccommodation.totalCost +
            bestMealPlan.perMeal * mealsPerDay * duration
        )),
    };
}

/**
 * Generates cost comparison table for different travel styles
 */
export function generateCostComparison(totalBudget, duration, groupSize) {
    const styles = [
        { name: 'Backpacker', transportKey: 'bus', accommodationTier: 0, mealKey: 'street_food' },
        { name: 'Budget Traveler', transportKey: 'train_sleeper', accommodationTier: 1, mealKey: 'local_restaurant' },
        { name: 'Comfort Seeker', transportKey: 'train_ac', accommodationTier: 2, mealKey: 'cafe' },
    ];

    return styles.map(style => {
        const nights = Math.max(duration - 1, 0);
        const transport = TRANSPORT_MODES[style.transportKey];
        const accommodation = ACCOMMODATION_TIERS[style.accommodationTier];
        const meal = MEAL_COSTS[style.mealKey];

        const total = transport.costPerKm * 200 + accommodation.costPerNight * nights + meal.perMeal * 3 * duration;
        const perPerson = total;
        const groupTotal = total * groupSize;

        return {
            style: style.name,
            transport: transport.label,
            accommodation: accommodation.label,
            meals: meal.label,
            perPerson: Math.round(perPerson),
            groupTotal: Math.round(groupTotal),
            withinBudget: groupTotal <= totalBudget,
        };
    });
}
