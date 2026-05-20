const herbRepository = require('../repositories/herbRepository');
const auditService = require('./auditService');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  const number = Number(value);
  return Number.isNaN(number) ? value : number;
}

function normalizeHerb(herb) {
  return {
    name: herb.name,
    scientificName: herb.scientificName || null,
    wateringFrequencyDays: toNumber(herb.wateringFrequencyDays),
    sunlight: herb.sunlight || null,
    harvestDays: toNumber(herb.harvestDays)
  };
}

function parseDelimitedLine(line, delimiter) {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      current += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === delimiter && !insideQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCatalogCsv(csvText) {
  if (typeof csvText !== 'string' || !csvText.trim()) {
    throw createError('Catalog import must be CSV text', 400);
  }

  const lines = csvText.trim().split(/\r?\n/).filter((line) => line.trim());
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = parseDelimitedLine(lines[0], delimiter);

  return lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter);

    return headers.reduce((herb, header, index) => ({
      ...herb,
      [header]: values[index]
    }), {});
  });
}

function validateHerb(herb) {
  if (!herb || typeof herb !== 'object') {
    throw createError('Invalid herb data', 400);
  }

  if (!herb.name || !isPositiveNumber(herb.wateringFrequencyDays) || !isPositiveNumber(herb.harvestDays)) {
    throw createError('Name, wateringFrequencyDays, and harvestDays are required', 400);
  }
}

function importCatalog(csvText, user) {
  const herbs = parseCatalogCsv(csvText).map(normalizeHerb);

  if (herbs.length === 0) {
    throw createError('CSV import must include at least one herb', 400);
  }

  herbs.forEach(validateHerb);

  herbs.forEach((herb) => {
    if (herbRepository.findByName(herb.name)) {
      throw createError('Herb name already exists', 409);
    }
  });

  return herbs.map((herb) => {
    const createdHerb = herbRepository.create(herb);

    auditService.recordAudit({
      userId: user && user.id,
      username: user && user.username,
      action: 'create',
      resource: 'herbs',
      resourceId: createdHerb.id
    });

    return createdHerb;
  });
}

function listHerbs() {
  return herbRepository.findAll();
}

function getHerbById(id) {
  return herbRepository.findById(id);
}

module.exports = {
  importCatalog,
  listHerbs,
  getHerbById
};
