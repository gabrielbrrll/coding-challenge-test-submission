const postCodeToCityMapping = {
  1: 'Brisbane',
  2: 'Sydney',
  3: 'Melbourne',
  4: 'Gold Coast',
  5: 'Toowomba',
  6: 'Burleigh',
  7: 'Byron Bay',
  8: 'Geelong',
  9: 'Warrnambool'
};

const streetNumberToStreetMapping = {
  1: 'Mary Street',
  2: 'Edward Street',
  3: 'Francesco Street',
  4: 'Docklands Drive',
  5: 'Elizabeth Street',
  6: 'Black Spur Drive',
  7: 'Grand Pacific Drive',
  8: 'Paddys River Road',
  9: 'Red Centre Way'
};

const generateMockAddresses = (postcode: string, streetNumber: string) => {
  const postcodeFirstChar = parseInt(postcode.substring(0, 1));
  const streetNumberFirstChar = parseInt(streetNumber.substring(0, 1));
  const postcodeMapping: string = (postCodeToCityMapping as any)[postcodeFirstChar];
  const streetMapping: string = (streetNumberToStreetMapping as any)[streetNumberFirstChar];

  if (postcodeMapping) {
    const baseNumber = parseInt(streetNumber);
    return [
      {
        city: postcodeMapping,
        houseNumber: streetNumber,
        postcode,
        street: `${streetNumber} ${streetMapping}`,
        lat: Math.random().toString(),
        lon: Math.random().toString()
      },
      {
        city: postcodeMapping,
        houseNumber: (baseNumber + 2).toString(),
        postcode,
        street: `${baseNumber + 2} ${streetMapping}`,
        lat: Math.random().toString(),
        lon: Math.random().toString()
      },
      {
        city: postcodeMapping,
        houseNumber: (baseNumber + 4).toString(),
        postcode,
        street: `${baseNumber + 4} ${streetMapping}`,
        lat: Math.random().toString(),
        lon: Math.random().toString()
      }
    ];
  }

  return null;
};

export default generateMockAddresses;
