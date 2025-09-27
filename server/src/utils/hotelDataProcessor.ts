export function processHotelUpdateData(update: any): any {
  if (
    update.facilities?.languagesSpoken &&
    Array.isArray(update.facilities.languagesSpoken)
  ) {
    update.facilities.languagesSpoken = update.facilities.languagesSpoken.map(
      (item: any) => {
        if (typeof item === "object" && item.name) {
          return item.name;
        }
        return String(item);
      }
    );
  }

  const arrayFields = [
    "facilities.general",
    "facilities.greatForStay",
    "facilities.bathroom",
    "facilities.bedroom",
    "facilities.view",
    "facilities.outdoors",
    "facilities.kitchen",
    "facilities.roomAmenities",
    "facilities.livingArea",
    "facilities.mediaTechnology",
    "facilities.foodDrink",
    "facilities.receptionServices",
    "facilities.safetySecurity",
    "facilities.generalFacilities",
    "mostPopularFacilities",
    "categories",
  ];

  arrayFields.forEach((fieldPath) => {
    const keys = fieldPath.split(".");
    let current = update;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    if (current[lastKey] && Array.isArray(current[lastKey])) {
      current[lastKey] = current[lastKey]
        .map((item: any) => {
          if (typeof item === "object" && item.name) {
            return item.name;
          }
          return String(item);
        })
        .filter((item: any) => item && item.trim());
    }
  });

  if (update.categories && Array.isArray(update.categories)) {
    update.categories = update.categories
      .map((item: any) => {
        if (typeof item === "object" && item.name) {
          return item.name;
        }
        return String(item);
      })
      .filter((item: any) => item && item.trim());
  }

  update.houseRules = fixHouseRulesStructure(update.houseRules);
  update.rooms = fixRoomsStructure(update.rooms);

  return update;
}

export function fixHouseRulesStructure(houseRules: any): any {
  if (!houseRules) {
    return {
      checkIn: {
        time: "15:00",
        note: "Guests are required to show a photo identification and credit card upon check-in",
        advanceNotice:
          "You'll need to let the property know in advance what time you'll arrive.",
      },
      checkOut: {
        time: "11:00",
      },
      cancellation: {
        policy:
          "Cancellation and prepayment policies vary according to accommodation type.",
        conditions:
          "Please check what conditions may apply to each option when making your selection.",
      },
      children: {
        welcome: "Children of any age are welcome.",
        searchNote:
          "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.",
        cotPolicy: {
          ageRange: "0 - 2 years",
          cotPrice: "₪70 per child, per night",
          note: "Cot upon request",
          additionalInfo:
            "Prices for cots are not included in the total price, and will have to be paid for separately during your stay.",
          availability:
            "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information.",
          noExtraBeds: "There are no extra beds available at this property.",
          subjectToAvailability: "All cots are subject to availability.",
        },
      },
      ageRestriction: {
        hasRestriction: false,
        minimumAge: null,
        note: "There is no age requirement for check-in",
      },
      pets: {
        allowed: false,
        note: "Pets are not allowed.",
      },
      paymentMethods: {
        methods: [
          "American Express",
          "Visa",
          "MasterCard",
          "JCB",
          "Maestro",
          "Discover",
          "UnionPay",
          "Cash",
        ],
      },
      parties: {
        allowed: false,
        note: "Parties/events are not allowed",
      },
    };
  }

  if (typeof houseRules === "string") {
    return {
      checkIn: {
        time: "15:00",
        note: "Guests are required to show a photo identification and credit card upon check-in",
        advanceNotice:
          "You'll need to let the property know in advance what time you'll arrive.",
      },
      checkOut: {
        time: "11:00",
      },
      cancellation: {
        policy:
          "Cancellation and prepayment policies vary according to accommodation type.",
        conditions:
          "Please check what conditions may apply to each option when making your selection.",
      },
      children: {
        welcome: "Children of any age are welcome.",
        searchNote:
          "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.",
        cotPolicy: {
          ageRange: "0 - 2 years",
          cotPrice: "₪70 per child, per night",
          note: "Cot upon request",
          additionalInfo:
            "Prices for cots are not included in the total price, and will have to be paid for separately during your stay.",
          availability:
            "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information.",
          noExtraBeds: "There are no extra beds available at this property.",
          subjectToAvailability: "All cots are subject to availability.",
        },
      },
      ageRestriction: {
        hasRestriction: false,
        minimumAge: null,
        note: "There is no age requirement for check-in",
      },
      pets: {
        allowed: false,
        note: "Pets are not allowed.",
      },
      paymentMethods: {
        methods: [
          "American Express",
          "Visa",
          "MasterCard",
          "JCB",
          "Maestro",
          "Discover",
          "UnionPay",
          "Cash",
        ],
      },
      parties: {
        allowed: false,
        note: "Parties/events are not allowed",
      },
    };
  }

  if (typeof houseRules === "object") {
    if (!houseRules.checkIn) {
      houseRules.checkIn = {
        time: "15:00",
        note: "Guests are required to show a photo identification and credit card upon check-in",
        advanceNotice:
          "You'll need to let the property know in advance what time you'll arrive.",
      };
    }
    if (!houseRules.checkOut) {
      houseRules.checkOut = { time: "11:00" };
    }
  }

  return houseRules;
}

export function fixRoomsStructure(rooms: any[]): any[] {
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return [
      {
        name: "Standard Room",
        roomType: "STANDARD",
        capacity: 2,
        maxAdults: 2,
        maxChildren: 0,
        pricePerNight: 100,
        totalRooms: 1,
        totalUnits: 1,
        sizeSqm: 25,
        bedrooms: 1,
        bathrooms: 1,
        features: [],
        amenities: [],
        facilities: [],
        categories: [],
        photos: [],
        media: [],
        reservations: [],
        pricing: {
          basePrice: 100,
          currency: "₪",
          includesBreakfast: false,
          freeCancellation: true,
          noPrepayment: true,
          priceMatch: true,
        },
      },
    ];
  }

  return rooms.map((room: any) => {
    if (!room.roomType) {
      room.roomType = "STANDARD";
    }
    if (!room.totalRooms) {
      room.totalRooms = room.totalUnits || 1;
    }
    if (!room.totalUnits) {
      room.totalUnits = room.totalRooms || 1;
    }
    if (!room.pricing) {
      room.pricing = {
        basePrice: room.pricePerNight || 0,
        currency: "₪",
        includesBreakfast: false,
        freeCancellation: true,
        noPrepayment: true,
        priceMatch: true,
      };
    } else if (!room.pricing.basePrice) {
      room.pricing.basePrice = room.pricePerNight || 0;
    }

    return room;
  });
}
