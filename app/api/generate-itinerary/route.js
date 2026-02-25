import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { optimizeBudget } from '@/lib/budgetOptimizer';
import { findDiscounts, estimateSavings } from '@/lib/discountFinder';

// Demo itinerary fallback when no API key is set
function generateDemoItinerary(input) {
    const { budget, duration, startLocation, interests, groupSize } = input;
    const budgetOpt = optimizeBudget(budget, duration, groupSize);
    const discounts = findDiscounts(interests, groupSize);
    const savings = estimateSavings(budget, interests);

    const interestLabels = {
        beach: 'Beach', trekking: 'Trekking', photography: 'Photography',
        food: 'Food', history: 'History', nature: 'Nature', adventure: 'Adventure',
        culture: 'Culture', nightlife: 'Nightlife', spiritual: 'Spiritual',
        wildlife: 'Wildlife', shopping: 'Shopping',
    };

    const destinations = {
        'Coimbatore': ['Ooty', 'Coonoor', 'Kotagiri', 'Valparai', 'Pollachi'],
        'Chennai': ['Pondicherry', 'Mahabalipuram', 'Yelagiri', 'Tiruvannamalai'],
        'Bangalore': ['Coorg', 'Mysore', 'Chikmagalur', 'Nandi Hills', 'Hampi'],
        'Hyderabad': ['Warangal', 'Nagarjuna Sagar', 'Srisailam', 'Ananthagiri Hills'],
        'Mumbai': ['Lonavala', 'Alibaug', 'Matheran', 'Panchgani', 'Goa'],
        'Delhi': ['Agra', 'Jaipur', 'Rishikesh', 'Mussoorie', 'Nainital'],
    };

    const nearbyPlaces = destinations[startLocation] || ['Nearby Hill Station', 'Scenic Lake', 'Heritage Town', 'Nature Reserve', 'Cultural Village'];
    const perPerson = Math.round(budget / groupSize);

    const days = [];
    for (let d = 1; d <= duration; d++) {
        const place = nearbyPlaces[(d - 1) % nearbyPlaces.length];
        const activities = [];

        if (d === 1) {
            activities.push(
                { time: '06:00 AM', activity: `Depart from ${startLocation} by ${budgetOpt.breakdown.transport.recommendation.label}`, cost: Math.round(budgetOpt.breakdown.transport.recommendation.totalCost / duration), type: 'transport', icon: '🚌' },
                { time: '10:00 AM', activity: `Arrive at ${place} — Check into ${budgetOpt.breakdown.accommodation.recommendation.label}`, cost: budgetOpt.breakdown.accommodation.recommendation.costPerNight, type: 'accommodation', icon: '🏨' },
                { time: '12:00 PM', activity: `Lunch at local ${budgetOpt.breakdown.food.recommendation.label}`, cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '🍜' },
                { time: '02:00 PM', activity: `Explore ${place} — ${interests.includes('photography') ? 'Best light for photography' : 'Sightseeing'}`, cost: Math.round(budgetOpt.breakdown.activities.perDay / 2), type: 'activity', icon: interests.includes('photography') ? '📸' : '🏞️' },
                { time: '05:00 PM', activity: `${interests.includes('nature') ? 'Sunset viewpoint walk' : 'Local market exploration'}`, cost: 0, type: 'activity', icon: '🌅' },
                { time: '08:00 PM', activity: 'Dinner', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '🍽️' },
            );
        } else if (d === duration) {
            activities.push(
                { time: '07:00 AM', activity: `${interests.includes('photography') ? 'Early morning photography session' : 'Morning walk'} at ${place}`, cost: 0, type: 'activity', icon: '📸' },
                { time: '09:00 AM', activity: 'Breakfast', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '☕' },
                { time: '10:30 AM', activity: `Visit ${nearbyPlaces[(d) % nearbyPlaces.length] || 'nearby attraction'} — ${interests.includes('history') ? 'Heritage walk' : 'Nature trail'}`, cost: Math.round(budgetOpt.breakdown.activities.perDay / 2), type: 'activity', icon: '🏛️' },
                { time: '01:00 PM', activity: 'Lunch', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '🍜' },
                { time: '03:00 PM', activity: `Return to ${startLocation}`, cost: Math.round(budgetOpt.breakdown.transport.recommendation.totalCost / duration), type: 'transport', icon: '🚌' },
            );
        } else {
            const nextPlace = nearbyPlaces[d % nearbyPlaces.length];
            activities.push(
                { time: '08:00 AM', activity: 'Breakfast', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '☕' },
                { time: '09:30 AM', activity: `Travel to ${nextPlace}`, cost: Math.round(budgetOpt.breakdown.transport.recommendation.totalCost / duration / 2), type: 'transport', icon: '🚌' },
                { time: '11:00 AM', activity: `Explore ${nextPlace}`, cost: budgetOpt.breakdown.activities.perDay, type: 'activity', icon: '🏞️' },
                { time: '01:00 PM', activity: 'Lunch at local spot', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '🍜' },
                { time: '03:00 PM', activity: `${interests.includes('trekking') ? 'Trek through scenic trails' : 'Visit local attractions'}`, cost: 0, type: 'activity', icon: '🥾' },
                { time: '06:00 PM', activity: 'Evening relaxation', cost: 0, type: 'activity', icon: '🧘' },
                { time: '08:00 PM', activity: 'Dinner', cost: budgetOpt.breakdown.food.recommendation.perMeal, type: 'food', icon: '🍽️' },
            );
        }

        const dayCost = activities.reduce((sum, a) => sum + a.cost, 0);

        days.push({
            day: d,
            title: d === 1 ? `Departure & ${place}` : d === duration ? `${place} & Return` : `Exploring ${nearbyPlaces[d % nearbyPlaces.length] || place}`,
            location: place,
            activities,
            totalCost: dayCost,
        });
    }

    const totalEstimated = days.reduce((sum, d) => sum + d.totalCost, 0);

    return {
        itinerary: {
            title: `${duration}-Day Trip from ${startLocation}`,
            days,
            totalEstimatedCost: totalEstimated,
            perPersonCost: Math.round(totalEstimated),
            groupTotal: totalEstimated * groupSize,
            currency: 'INR',
        },
        budgetBreakdown: budgetOpt,
        discounts,
        savings,
        safetyTips: [
            'Always carry a photocopy of your student ID',
            'Share your live location with family',
            'Keep emergency numbers saved offline',
            'Carry a basic first-aid kit',
            'Download offline maps of the area',
        ],
        rainBackup: [
            `Visit ${nearbyPlaces[0]} indoor museum or gallery`,
            'Find a cozy café and plan the next adventure',
            `Explore ${startLocation} city attractions instead`,
        ],
        bestPhotoTimes: interests.includes('photography') ? [
            'Golden hour: 6:00–7:30 AM for misty mountain shots',
            'Blue hour: 5:45–6:15 PM for dramatic sky colors',
            'Night: 8:00–10:00 PM for star photography (if clear skies)',
        ] : [],
        mapQuery: `${nearbyPlaces[0]}+to+${nearbyPlaces[Math.min(1, nearbyPlaces.length - 1)]}`,
        isDemo: true,
    };
}

export async function POST(request) {
    try {
        const input = await request.json();
        const { budget, duration, startLocation, interests, groupSize } = input;

        // Validate inputs
        if (!budget || !duration || !startLocation || !interests?.length || !groupSize) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key or placeholder, use demo mode
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            const demoData = generateDemoItinerary(input);
            return NextResponse.json(demoData);
        }

        // Use Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const budgetOpt = optimizeBudget(budget, duration, groupSize);
        const discounts = findDiscounts(interests, groupSize);
        const savingsInfo = estimateSavings(budget, interests);

        const prompt = `You are an expert student travel planner for India. Create a detailed ${duration}-day trip itinerary.

INPUT:
- Budget: ₹${budget} total for ${groupSize} people (₹${Math.round(budget / groupSize)} per person)
- Duration: ${duration} days
- Starting from: ${startLocation}
- Interests: ${interests.join(', ')}
- Group size: ${groupSize}

Budget allocation per person:
- Transport: ₹${budgetOpt.breakdown.transport.budget}
- Accommodation: ₹${budgetOpt.breakdown.accommodation.budget}
- Food: ₹${budgetOpt.breakdown.food.budget}
- Activities: ₹${budgetOpt.breakdown.activities.budget}

RESPOND IN VALID JSON ONLY. No markdown, no explanation. Use this exact structure:
{
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "location": "Main location name",
      "activities": [
        {
          "time": "06:00 AM",
          "activity": "Description",
          "cost": 150,
          "type": "transport|food|accommodation|activity",
          "icon": "emoji"
        }
      ],
      "totalCost": 1200
    }
  ],
  "totalEstimatedCost": 3850,
  "safetyTips": ["tip1", "tip2", "tip3"],
  "rainBackup": ["backup1", "backup2"],
  "bestPhotoTimes": ["time1", "time2"],
  "mapQuery": "place1+to+place2"
}

RULES:
- Stay within budget ₹${Math.round(budget / groupSize)} per person
- Use cheapest transport (buses, trains) unless budget allows more
- Suggest hostels/homestays for accommodation
- Include 3 meals per day
- Add specific local food recommendations
- Include free activities where possible
- Add photography timing tips if relevant
- Provide rain backup plans
- Mention student discount opportunities
- Use real, specific places near ${startLocation}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON from the response
        let parsed;
        try {
            // Try to extract JSON from the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseErr) {
            console.error('Failed to parse Gemini response:', parseErr);
            // Fall back to demo
            const demoData = generateDemoItinerary(input);
            return NextResponse.json(demoData);
        }

        return NextResponse.json({
            itinerary: {
                title: `${duration}-Day Trip from ${startLocation}`,
                days: parsed.days,
                totalEstimatedCost: parsed.totalEstimatedCost,
                perPersonCost: parsed.totalEstimatedCost,
                groupTotal: parsed.totalEstimatedCost * groupSize,
                currency: 'INR',
            },
            budgetBreakdown: budgetOpt,
            discounts,
            savings: savingsInfo,
            safetyTips: parsed.safetyTips || [],
            rainBackup: parsed.rainBackup || [],
            bestPhotoTimes: parsed.bestPhotoTimes || [],
            mapQuery: parsed.mapQuery || `${startLocation}+tourist+places`,
            isDemo: false,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to generate itinerary. Please try again.' }, { status: 500 });
    }
}
