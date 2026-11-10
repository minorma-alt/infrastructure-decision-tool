// Infrastructure Decision Tool
// INFO 300 - Node.js assignment
// Part A: Subnet Host Checker
// Part B: Compute Environment Selector

const readlineSync = require('readline-sync');

const AWS_RESERVED_IPS = 5;

// ---------- Input helpers (validation) ----------

// Ask for a CIDR prefix like "/24" or "24" and make sure it is between /16 and /30
function getCidr(label) {
  while (true) {
    let input = readlineSync.question(label + ' (e.g., /24): ').trim();
    if (input.startsWith('/')) {
      input = input.substring(1);
    }
    const prefix = Number(input);
    if (input !== '' && Number.isInteger(prefix) && prefix >= 16 && prefix <= 30) {
      return prefix;
    }
    console.log('Invalid CIDR. Enter a value between /16 and /30.');
  }
}

// Ask for a whole number. If allowZero is false, the number must be 1 or more.
function getWholeNumber(label, allowZero) {
  while (true) {
    const input = readlineSync.question(label + ': ').trim();
    const num = Number(input);
    const min = allowZero ? 0 : 1;
    if (input !== '' && Number.isInteger(num) && num >= min) {
      return num;
    }
    console.log(allowZero
      ? 'Invalid input. Enter a whole number that is 0 or greater.'
      : 'Invalid input. Enter a positive whole number.');
  }
}

// Ask for a dollar amount (0 or more, decimals allowed, "$" and commas are okay)
function getBudget(label) {
  while (true) {
    const input = readlineSync.question(label + ': $').trim().replace(/[$,]/g, '');
    const num = Number(input);
    if (input !== '' && !isNaN(num) && num >= 0) {
      return num;
    }
    console.log('Invalid budget. Enter a number that is 0 or greater.');
  }
}

// Ask for text that cannot be blank
function getText(label) {
  while (true) {
    const input = readlineSync.question(label + ': ').trim();
    if (input !== '') {
      return input;
    }
    console.log('This field cannot be blank.');
  }
}

// Ask a yes/no question and return true or false
function getYesNo(label) {
  while (true) {
    const input = readlineSync.question(label + ' (yes/no): ').trim().toLowerCase();
    if (input === 'yes' || input === 'y') return true;
    if (input === 'no' || input === 'n') return false;
    console.log('Please enter yes or no.');
  }
}

// ---------- Part A: Subnet Host Checker ----------

function subnetHostChecker() {
  console.log('\n--- Subnet Host Checker ---');

  const vpcCidr = getCidr('Enter the VPC CIDR');
  const subnetCidr = getCidr('Enter the Subnet CIDR');
  const devices = getWholeNumber('Enter the number of devices required', false);

  console.log('\n--- Results ---');

  // A subnet has to be the same size or smaller than the VPC,
  // so its prefix number must be equal to or larger than the VPC prefix.
  if (subnetCidr >= vpcCidr) {
    console.log('CIDR check: /' + subnetCidr + ' is consistent with the VPC /' + vpcCidr + '.');
  } else {
    console.log('CIDR check: /' + subnetCidr + ' is NOT consistent with the VPC /' + vpcCidr +
      '. The subnet is larger than the VPC.');
  }

  // Total IPs = 2^(32 - prefix). AWS reserves 5 in every subnet.
  const totalIps = Math.pow(2, 32 - subnetCidr);
  const usableIps = totalIps - AWS_RESERVED_IPS;

  console.log('Total IPs in subnet: ' + totalIps);
  console.log('Usable IPs (after AWS reserves ' + AWS_RESERVED_IPS + '): ' + usableIps);
  console.log('Devices required: ' + devices);

  if (usableIps >= devices) {
    console.log('Capacity check: The subnet IS sufficient.');
    console.log('Unused IP addresses: ' + (usableIps - devices));
  } else {
    console.log('Capacity check: The subnet is NOT sufficient.');
    console.log('Additional IP addresses needed: ' + (devices - usableIps));
  }
}

// ---------- Part B: Compute Environment Selector ----------

function computeEnvironmentSelector() {
  console.log('\n--- Compute Environment Selector ---');

  const appName = getText('Enter the application name');
  const users = getWholeNumber('Enter the number of monthly users', true);
  const budget = getBudget('Enter the monthly budget');
  const highAvailability = getYesNo('Is high availability required?');

  // Pick the architecture.
  // Auto Scaling wins if users are over 10,000 OR high availability is required.
  let architecture;
  if (users > 10000 || highAvailability) {
    architecture = 'EC2 + Load Balancer + Auto Scaling';
  } else if (users >= 1000) {
    architecture = 'EC2 + Load Balancer';
  } else {
    architecture = 'Single EC2';
  }

  console.log('\n--- Recommendation for ' + appName + ' ---');
  console.log('Monthly users: ' + users);
  console.log('Monthly budget: $' + budget.toFixed(2));
  console.log('High availability: ' + (highAvailability ? 'Yes' : 'No'));
  console.log('Recommended architecture: ' + architecture);

  // Budget warnings
  if (budget < 1000 && architecture !== 'Single EC2') {
    console.log('WARNING: Your budget is under $1,000, but the recommended architecture ' +
      'requires more than a single EC2 instance.');
  } else if (budget >= 1000 && budget <= 3000 && architecture.includes('Auto Scaling')) {
    console.log('WARNING: Your budget is between $1,000 and $3,000, but the recommended ' +
      'architecture requires Auto Scaling.');
  }
}

// ---------- Main menu ----------

function main() {
  console.log('=== Infrastructure Decision Tool ===');

  let keepGoing = true;
  while (keepGoing) {
    console.log('\nWhich tool would you like to use?');
    console.log('1. Subnet Host Checker');
    console.log('2. Compute Environment Selector');

    const choice = readlineSync.question('Enter 1 or 2: ').trim();

    if (choice === '1') {
      subnetHostChecker();
    } else if (choice === '2') {
      computeEnvironmentSelector();
    } else {
      console.log('Invalid choice. Please enter 1 or 2.');
      continue;
    }

    keepGoing = getYesNo('\nWould you like to run another check?');
  }

  console.log('Goodbye!');
}

main();
