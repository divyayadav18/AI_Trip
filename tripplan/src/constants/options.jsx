export const SelectTravelesList=[
    {
        id:1,
        title:'Solo Adventure',
        desc:'Charting my own path',
        icon:'🧍',
        people:'1'

    },
    {
        id:2,
        title:'Dynamic Duo',
        desc:'Double the fun',
        icon:'🧑‍🤝‍🧑',
        people:'2 people'
    },
    {
        id:3,
        title:'Family Vibes',
        desc:'Memory-making with fam',
        icon:'👨‍👩‍👧‍👦',
        people:'3 to 5 people'
    },
    {
        id:4,
        title:'Buddies',
        desc:'Adventures with the squad',
        icon:'🧑‍🤝‍🧑🧑‍🤝‍🧑🧑‍🤝‍🧑',
        people:'5 to 10 people'
    },
]

export const SelectBudgetOptions=[
{
  id:1,
  title:'Budget-Friendly',
  desc:'Save more, travel smart',
  icon:'💰',
},
{
    id:2,
    title:'Balanced Budget',
    desc:'A sweet spot of comfort & cost',
    icon:'💳',
},
{
    id:3,
    title:'Luxury Escape',
    desc:'Live the high life',
    icon:'💎',
},
]
export const AI_PROMPT='Please provide at least 10 {budget} budget hotel options for a {traveler}visiting {location} for {totalDays} days. Each hotel should include the following details: Hotel Name, Hotel Address, Price per night, Hotel Image link(real image link from hotel booking sites like Booking.com, Agoda, or Expedia) , Geo Coordinates (Latitude, Longitude), Ratings (out of 5), and a brief description of the hotel’s quality. And suggest  itineary as array with placeName, Place Details, Place image url, Geo coordinates , Ticket pricing , Time t travel each of the location for {totalDays} days with each day plan with best  time to visit in JSON format. and merge both hotels and itinerary in one.'
