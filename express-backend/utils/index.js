const { faker } = require('@faker-js/faker');
const crypto = require('crypto');
const dns = require('node:dns');
const domains = require('disposable-email-domains');

/**
 * Generates random data for a given structure.
 *
 * @param {any} structure - The structure for which random data needs to be generated.
 * @return {Promise<any>} - A promise that resolves to the generated random data.
 */
async function generateRandomDataForStructure(structure) {
  // Check if the structure is a string
  if (typeof structure === 'string') {
    // If it is a string, generate a random value based on the type of string
    return generateRandomValueByType(structure);
  }

  // Check if the structure is an array
  if (Array.isArray(structure)) {
    // Extract the object structure and config from the array
    const [objectStructure, config] = structure;
    // Determine the length of the array
    const arrayLength =
      config && config.arrayLength
        ? parseInt(config.arrayLength)
        : objectStructure.arrayLength;

    // Generate random data for each element in the array
    return await Promise.all(
      Array.from({ length: arrayLength }, () =>
        generateRandomDataForStructure(objectStructure)
      )
    );
  }

  // Check if the structure is an object
  if (typeof structure === 'object') {
    // Create an empty object to store the generated random data
    const result = {};
    // Iterate over each key in the structure object
    for (const key in structure) {
      if (structure.hasOwnProperty(key)) {
        // Generate random data for the value associated with the key
        result[key] = await generateRandomDataForStructure(structure[key]);
      }
    }
    // Return the generated random data object
    return result;
  }

  // Throw an error for unhandled cases
  throw new Error(`Unhandled case for structure: ${structure}`);
}

/**
 * Generates a random value based on the given type.
 *
 * @param {string} type - The type of value to generate.
 * @return {Promise<any>} - A promise that resolves to the generated value.
 */
async function generateRandomValueByType(type) {
  // Define an object that maps each type to its generator function
  const typeGenerators = {
    string: () => generateRandomString(),
    number: async () => await getRandomNumber(1, 100),
    boolean: () => Math.random() < 0.5,
    uuid: () => crypto.randomUUID(),
    arrayOfString: async () => await generateArrayOfStrings(),
    arrayOfNumber: async () => await generateArrayOfNumbers(),
    arrayOfArray: async () => await generateArrayOfArrays(),
    date: () => faker.date.past(),
    email: () => faker.internet.email(),
    address: () => ({
      street: faker.location.buildingNumber(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
    }),
    name: () => faker.person.firstName(),
    fullName: () => faker.person.fullName(),
    slug: () => faker.lorem.slug(),
    longText: () => faker.lorem.paragraphs(3),
    website: () => faker.internet.url(),
    ip: () => faker.internet.ip(),
    contact: () => faker.phone.number(),
  };

  // If the type is valid, call the corresponding generator function and return the generated value
  if (typeGenerators[type]) {
    return await typeGenerators[type]();
  }

  // If the type is invalid, throw an error
  throw new Error(`Invalid type: ${type}`);
}

/**
 * Generates an array of arrays asynchronously.
 *
 * @return {Promise<Array<Array<type>>>} A promise that resolves to an array of arrays,
 * where each inner array contains random values of various types.
 */
async function generateArrayOfArrays() {
  // Generate a random length between 1 and 5
  const length = getRandomNumber(1, 5);

  // Use Promise.all and Array.from to generate an array of promises
  const promises = Array.from({ length }, async () => {
    // Generate a random type
    const randomType = getRandomType();

    // If the random type is 'arrayOfArray', recursively call generateArrayOfArrays
    // Otherwise, call generateRandomValueByType to generate a random value of the type
    return randomType === 'arrayOfArray'
      ? await generateArrayOfArrays()
      : await generateRandomValueByType(randomType);
  });

  // Wait for all promises to resolve and return the resulting array
  return await Promise.all(promises);
}

/**
 * Generates an array of random strings.
 * The length of the array is a random number between 1 and 5.
 * Each element in the array is a random string.
 * @returns {Promise<Array<string>>} The array of random strings.
 */
async function generateArrayOfStrings() {
  // Generate a random number between 1 and 5
  const length = getRandomNumber(1, 5);

  // Create an array with the specified length and fill it with random strings
  const arrayOfStrings = Array.from({ length }, generateRandomString);

  // Return the array of random strings
  return await Promise.all(arrayOfStrings);
}

/**
 * Generates an array of random numbers.
 *
 * @returns {Promise<Array<number>>} A promise that resolves to an array of random numbers.
 */
async function generateArrayOfNumbers() {
  // Generate a random length between 1 and 5
  const length = getRandomNumber(1, 5);

  // Create an array of promises using Array.from
  const promises = Array.from({ length }, async () => {
    // Generate a random number between 1 and 100
    return getRandomNumber(1, 100);
  });

  // Wait for all promises to resolve
  return await Promise.all(promises);
}

/**
 * Generates a random string with a length between 5 and 15 characters.
 * The string can contain uppercase letters, lowercase letters, and digits.
 *
 * @returns {string} The randomly generated string.
 */
function generateRandomString() {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';

  let result = '';
  let useVowel = Math.random() < 0.5;
  const length = Math.floor(Math.random() * 20) + Math.random() * 10; // Generates a random length between 1 and 15

  for (let i = 0; i < length; i++) {
    const source = useVowel ? vowels : consonants;
    const nextChar = source.charAt(Math.floor(Math.random() * source.length));
    result += nextChar;
    useVowel = !useVowel; // Switch between vowels and consonants
  }

  return result;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomType() {
  const types = [
    'string',
    'number',
    'arrayOfArray',
    'arrayOfString',
    'arrayOfNumber',
    'date',
    'email',
    'address',
    'name',
    'fullName',
    'slug',
    'longText',
    'website',
    'ip',
  ];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
}
/**
 * Checks if a domain has an A record.
 *
 * @param {string} domain - The domain to check.
 * @returns {boolean} - True if the domain has an A record, false otherwise.
 */
const hasARecord = async (domain) => {
  try {
    await dns.promises.resolve(domain, 'A');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * Checks if the given domain is a disposable email domain.
 *
 * @param {string} domain - The domain to be checked.
 * @return {boolean} Returns true if the domain is disposable, false otherwise.
 */
const isDisposableEmail = async (domain) => {
  // Check if the domain is in the list of disposable email domains
  return domains.includes(domain.toLowerCase());
};
/**
 * Validates an email address.
 *
 * @param {string} email - The email address to be validated.
 * @return {Promise<Object>} A promise that resolves to an object representing the result of the validation. The object has the following properties:
 *   - valid: A boolean indicating whether the email is valid or not.
 *   - reason: A string describing the reason for the validation result.
 *   - message: A string providing additional information about the validation result.
 */
const validateEmail = async (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email syntax is valid
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      reason: 'Invalid email syntax',
      message: 'Invalid email syntax',
    };
  }

  // Extract domain from email
  const [, domain] = email.split('@');

  try {
    // Resolve MX records for the domain
    const address = await dns.resolveMx(domain, (_err, addresses) => {
      if (!addresses || addresses.length === 0) {
        return false;
      }
      return true;
    });

    // Check if domain does not have MX records
    if (address === false) {
      return {
        valid: false,
        reason: 'Domain does not exist',
        message: 'Invalid email',
      };
    }

    // Check if domain has an A record
    const domainHasARecord = await hasARecord(domain);

    if (!domainHasARecord) {
      return {
        valid: false,
        reason: 'Domain does not have an A record',
        message: 'Invalid email',
      };
    }

    // Check if email domain is a disposable email service
    const isDisposable = await isDisposableEmail(domain);

    if (isDisposable) {
      return {
        valid: false,
        reason: 'Disposable email address',
        message: 'Invalid email',
      };
    }

    // Email is valid
    return { valid: true, reason: null, message: null };
  } catch (error) {
    // Error in DNS lookup
    return {
      valid: false,
      reason: 'Error in DNS lookup',
      message: error.message,
    };
  }
};
const resetLimit = async () => {
    try {
      const userCollection = sails.getDatastore().manager.collection('user');
      await userCollection.updateMany(
        { apiKey: { $exists: true, $ne: null } },
        { $set: { total: 1000 } }
      );
      console.log('\x1b[32m%s\x1b[0m', '--> Limit reset successfully <--');
    } catch (error) {
      console.log(error);
    }
  };
  
  
module.exports = {
  generateRandomValueByType,
  generateArrayOfArrays,
  generateArrayOfStrings,
  generateArrayOfNumbers,
  generateRandomString,
  getRandomNumber,
  getRandomType,
  generateRandomDataForStructure,
  validateEmail,
  resetLimit
};