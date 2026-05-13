const herbService = require('../src/services/herbService');
const herbRepository = require('../src/repositories/herbRepository');

describe('herbService unit tests', () => {
  beforeEach(() => {
    herbRepository.reset();
  });

  test('TU25 imports valid herbs from CSV', () => {
    const herbs = herbService.importCatalog(
      'name,scientificName,wateringFrequencyDays,sunlight,harvestDays\nBasil,Ocimum basilicum,2,full sun,60'
    );

    expect(herbs).toEqual([{
      id: '1',
      name: 'Basil',
      scientificName: 'Ocimum basilicum',
      wateringFrequencyDays: 2,
      sunlight: 'full sun',
      harvestDays: 60
    }]);
  });

  test('TU26 lists imported herbs', () => {
    herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nMint,3,45'
    );

    expect(herbService.listHerbs()).toHaveLength(1);
    expect(herbService.listHerbs()[0].name).toBe('Mint');
  });

  test('TU27 rejects empty import', () => {
    expect(() => herbService.importCatalog('')).toThrow('Catalog import must be CSV text');
  });

  test.each([
    ['TU28', 'name,wateringFrequencyDays,harvestDays\n,2,60'],
    ['TU29', 'name,harvestDays\nParsley,60'],
    ['TU30', 'name,wateringFrequencyDays\nParsley,2']
  ])('%s rejects missing required herb fields', (testId, csv) => {
    expect(() => herbService.importCatalog(csv)).toThrow(
      'Name, wateringFrequencyDays, and harvestDays are required'
    );
  });

  test('TU31 rejects duplicate herb names', () => {
    herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nRosemary,7,90'
    );

    expect(() => herbService.importCatalog(
      'name,wateringFrequencyDays,harvestDays\nRosemary,7,90'
    )).toThrow(expect.objectContaining({
      statusCode: 409
    }));
  });

  test('TU32 imports herbs from semicolon-delimited CSV text', () => {
    const herbs = herbService.importCatalog(
      'name;scientificName;wateringFrequencyDays;sunlight;harvestDays\nOregano;Origanum vulgare;4;full sun;80'
    );

    expect(herbs[0]).toEqual({
      id: '1',
      name: 'Oregano',
      scientificName: 'Origanum vulgare',
      wateringFrequencyDays: 4,
      sunlight: 'full sun',
      harvestDays: 80
    });
  });
});
