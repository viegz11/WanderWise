import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
    title: 'WanderWise — AI Student Travel Planner',
    description: 'Plan budget-optimized trips with AI-generated itineraries, smart route planning, student discounts, and group expense splitting. Built for students, by intelligence.',
    keywords: 'student travel, budget travel, AI trip planner, itinerary generator, student discounts, group travel',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
