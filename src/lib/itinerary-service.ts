import type { Itinerary } from "./types";

const ITINERARY_STORAGE_KEY = "traveller_connect_itinerary";

//Get itinerary from local storage
export function getItinerary(userId: string): Itinerary | null {
  if (typeof window === "undefined") return null;

  const storedItinerary = localStorage.getItem(ITINERARY_STORAGE_KEY);
  if (!storedItinerary) {
    const samepleItinerary = generateSampleItinerary(userId);
    return samepleItinerary;
  }

  try {
    const allItineraries = JSON.parse(storedItinerary) as Record<
      string,
      Itinerary
    >;

    return allItineraries[userId] || null;
  } catch (error) {
    console.log("Failed to parse stored itinerary: ", error);
    return null;
  }
}

//save itinerary to local storage
function saveItinerary(userId: string, itinerary: Itinerary): void {
  if (typeof window === "undefined") return;

  const storedItinerary = localStorage.getItem(ITINERARY_STORAGE_KEY);
  let allItineraries: Record<string, Itinerary> = {};

  if (storedItinerary) {
    try {
      allItineraries = JSON.parse(storedItinerary);
    } catch (error) {
      console.error("Failed to parse stored itinerary:", error);
    }
  }

  allItineraries[userId] = itinerary;
  localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(allItineraries));
}

// Generate sample itinerary for testing
export function generateSampleItinerary(userId: string): Itinerary {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 1); // Trip started yesterday

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4); // 5-day trip

  const itinerary: Itinerary = {
    id: `itin-${Date.now()}`,
    userId,
    title: "Bali Adventure Package",
    destination: "Bali, Indonesia",
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    hotel: {
      name: "Ubud Tropical Resort & Spa",
      location: "Jl. Monkey Forest, Ubud, Bali",
      checkIn: "14:00",
      checkOut: "12:00",
      roomType: "Deluxe Garden View",
      amenities: [
        "Free Wi-Fi",
        "Swimming Pool",
        "Spa",
        "Restaurant",
        "Airport Shuttle",
      ],
    },
    inclusions: [
      "Daily breakfast",
      "Airport transfers",
      "Guided tours as per itinerary",
      "All entrance fees",
      "Welcome drink on arrival",
    ],
    exclusions: [
      "Personal expenses",
      "Travel insurance",
      "Optional activities",
      "Meals not mentioned",
    ],
    driverInfo: {
      name: "Wayan Sudiarta",
      photoUrl: "https://api.dicebear.com/7.x/micah/svg?seed=driver123",
      phoneNumber: "+62 812 3456 7890",
      carModel: "Toyota Avanza",
      carNumber: "DK 1234 AB",
      languages: ["English", "Indonesian"],
      rating: 4.9,
    },
    days: [
      {
        id: "day1",
        title: "Arrival & Welcome",
        date: (() => {
          const date = new Date(startDate);
          return date.toISOString();
        })(),
        description: "Arrive in Bali and transfer to your hotel in Ubud",
        activities: [
          {
            time: "14:00",
            title: "Airport Pickup",
            description:
              "Meet your driver at the arrival hall and transfer to your hotel",
            type: "transport",
            location: "Ngurah Rai International Airport",
          },
          {
            time: "16:00",
            title: "Hotel Check-in",
            description: "Check in to your room and freshen up",
            type: "leisure",
            location: "Ubud Tropical Resort & Spa",
          },
          {
            time: "19:00",
            title: "Welcome Dinner",
            description:
              "Enjoy a traditional Balinese dinner at the hotel restaurant",
            type: "meal",
            location: "Hotel Restaurant",
          },
        ],
      },
      {
        id: "day2",
        title: "Ubud Exploration",
        date: (() => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + 1);
          return date.toISOString();
        })(),
        description: "Explore the cultural heart of Bali",
        activities: [
          {
            time: "08:00",
            title: "Breakfast",
            description: "Enjoy breakfast at the hotel",
            type: "meal",
            location: "Hotel Restaurant",
          },
          {
            time: "09:30",
            title: "Ubud Monkey Forest",
            description: "Visit the sacred monkey forest sanctuary",
            type: "sightseeing",
            location: "Monkey Forest Road, Ubud",
          },
          {
            time: "12:30",
            title: "Lunch",
            description: "Traditional Balinese lunch at a local restaurant",
            type: "meal",
            location: "Warung Babi Guling Ibu Oka",
          },
          {
            time: "14:00",
            title: "Ubud Art Market & Palace",
            description:
              "Explore the traditional art market and visit the royal palace",
            type: "sightseeing",
            location: "Ubud Center",
          },
          {
            time: "16:30",
            title: "Tegallalang Rice Terraces",
            description:
              "Visit the famous rice terraces and take stunning photos",
            type: "sightseeing",
            location: "Tegallalang",
          },
          {
            time: "19:00",
            title: "Dinner",
            description:
              "Dinner at a local restaurant with traditional dance performance",
            type: "meal",
            location: "Lotus Cafe",
          },
        ],
      },
      {
        id: "day3",
        title: "Beach & Temple Tour",
        date: (() => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + 2);
          return date.toISOString();
        })(),
        description: "Explore Bali's beautiful beaches and ancient temples",
        activities: [
          {
            time: "07:30",
            title: "Breakfast",
            description: "Enjoy breakfast at the hotel",
            type: "meal",
            location: "Hotel Restaurant",
          },
          {
            time: "09:00",
            title: "Tanah Lot Temple",
            description: "Visit the iconic sea temple perched on a rock",
            type: "sightseeing",
            location: "Tabanan Regency",
          },
          {
            time: "12:00",
            title: "Lunch",
            description: "Seafood lunch with ocean view",
            type: "meal",
            location: "Jimbaran Bay",
          },
          {
            time: "14:00",
            title: "Uluwatu Temple",
            description: "Visit the cliff-top temple with stunning ocean views",
            type: "sightseeing",
            location: "Uluwatu",
          },
          {
            time: "17:30",
            title: "Kecak Fire Dance",
            description:
              "Watch the traditional Kecak dance performance at sunset",
            type: "leisure",
            location: "Uluwatu Temple",
          },
          {
            time: "19:30",
            title: "Dinner",
            description: "Beachside dinner at Jimbaran Bay",
            type: "meal",
            location: "Jimbaran Beach",
          },
        ],
      },
      {
        id: "day4",
        title: "Water Activities Day",
        date: (() => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + 3);
          return date.toISOString();
        })(),
        description: "Enjoy water sports and activities in Nusa Dua",
        activities: [
          {
            time: "08:00",
            title: "Breakfast",
            description: "Enjoy breakfast at the hotel",
            type: "meal",
            location: "Hotel Restaurant",
          },
          {
            time: "09:30",
            title: "Transfer to Nusa Dua",
            description: "Drive to Nusa Dua Beach for water activities",
            type: "transport",
            location: "Nusa Dua",
          },
          {
            time: "10:30",
            title: "Water Sports",
            description: "Enjoy parasailing, jet ski, and banana boat rides",
            type: "leisure",
            location: "Nusa Dua Beach",
          },
          {
            time: "13:00",
            title: "Lunch",
            description: "Beachside lunch at a local restaurant",
            type: "meal",
            location: "Nusa Dua Beach Club",
          },
          {
            time: "14:30",
            title: "Snorkeling Trip",
            description: "Boat trip to a nearby reef for snorkeling",
            type: "leisure",
            location: "Nusa Dua Reef",
          },
          {
            time: "17:00",
            title: "Return to Hotel",
            description: "Transfer back to your hotel in Ubud",
            type: "transport",
          },
          {
            time: "19:30",
            title: "Dinner",
            description: "Dinner at the hotel or nearby restaurant",
            type: "meal",
            location: "Hotel or Local Restaurant",
          },
        ],
      },
      {
        id: "day5",
        title: "Departure Day",
        date: (() => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + 4);
          return date.toISOString();
        })(),
        description: "Check out and departure",
        activities: [
          {
            time: "07:30",
            title: "Breakfast",
            description: "Final breakfast at the hotel",
            type: "meal",
            location: "Hotel Restaurant",
          },
          {
            time: "10:00",
            title: "Check-out",
            description: "Check out from the hotel",
            type: "leisure",
            location: "Hotel Reception",
          },
          {
            time: "11:00",
            title: "Last-minute Shopping",
            description: "Visit local shops for souvenirs",
            type: "leisure",
            location: "Ubud Market",
          },
          {
            time: "13:00",
            title: "Lunch",
            description: "Farewell lunch at a local restaurant",
            type: "meal",
            location: "Cafe Wayan",
          },
          {
            time: "15:00",
            title: "Airport Transfer",
            description: "Transfer to the airport for your departure flight",
            type: "transport",
            location: "Ngurah Rai International Airport",
          },
        ],
      },
    ],
  };

  saveItinerary(userId, itinerary);
  return itinerary;
}
