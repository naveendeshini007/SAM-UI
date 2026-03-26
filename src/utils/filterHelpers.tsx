export interface SelectOption {
  label: string;
  value: string;
}

export const STATES: SelectOption[] = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

export const MONTHS: SelectOption[] = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const getYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => String(currentYear - i));
};

export const CITIES_BY_STATE: Record<string, string[]> = {
  AL: ['Birmingham', 'Montgomery', 'Huntsville'],
  AK: ['Anchorage', 'Fairbanks', 'Juneau'],
  AZ: ['Phoenix', 'Tucson', 'Scottsdale'],
  AR: ['Little Rock', 'Fort Smith', 'Fayetteville'],
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
  CO: ['Denver', 'Colorado Springs', 'Aurora'],
  CT: ['Bridgeport', 'Hartford', 'New Haven'],
  DE: ['Wilmington', 'Dover', 'Newark'],
  FL: ['Jacksonville', 'Miami', 'Tampa', 'Orlando'],
  GA: ['Atlanta', 'Augusta', 'Columbus'],
  HI: ['Honolulu', 'Pearl City', 'Hilo'],
  ID: ['Boise', 'Meridian', 'Nampa'],
  IL: ['Chicago', 'Aurora', 'Rockford'],
  IN: ['Indianapolis', 'Fort Wayne', 'Evansville'],
  IA: ['Des Moines', 'Cedar Rapids', 'Davenport'],
  KS: ['Wichita', 'Overland Park', 'Kansas City'],
  KY: ['Louisville', 'Lexington', 'Bowling Green'],
  LA: ['New Orleans', 'Baton Rouge', 'Shreveport'],
  ME: ['Portland', 'Lewiston', 'Bangor'],
  MD: ['Baltimore', 'Frederick', 'Rockville'],
  MA: ['Boston', 'Worcester', 'Cambridge', 'Springfield'],
  MI: ['Detroit', 'Grand Rapids', 'Warren'],
  MN: ['Minneapolis', 'Saint Paul', 'Rochester'],
  MS: ['Jackson', 'Gulfport', 'Southaven'],
  MO: ['Kansas City', 'Saint Louis', 'Springfield'],
  MT: ['Billings', 'Missoula', 'Great Falls'],
  NE: ['Omaha', 'Lincoln', 'Bellevue'],
  NV: ['Las Vegas', 'Henderson', 'Reno'],
  NH: ['Manchester', 'Nashua', 'Concord'],
  NJ: ['Newark', 'Jersey City', 'Paterson'],
  NM: ['Albuquerque', 'Las Cruces', 'Rio Rancho'],
  NY: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Albany'],
  NC: ['Charlotte', 'Raleigh', 'Greensboro'],
  ND: ['Fargo', 'Bismarck', 'Grand Forks'],
  OH: ['Columbus', 'Cleveland', 'Cincinnati'],
  OK: ['Oklahoma City', 'Tulsa', 'Norman'],
  OR: ['Portland', 'Salem', 'Eugene'],
  PA: ['Philadelphia', 'Pittsburgh', 'Allentown'],
  RI: ['Providence', 'Cranston', 'Warwick'],
  SC: ['Columbia', 'Charleston', 'North Charleston'],
  SD: ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  TN: ['Nashville', 'Memphis', 'Knoxville'],
  TX: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'],
  UT: ['Salt Lake City', 'West Valley City', 'Provo'],
  VT: ['Burlington', 'South Burlington', 'Rutland'],
  VA: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond'],
  WA: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'],
  WV: ['Charleston', 'Huntington', 'Morgantown'],
  WI: ['Milwaukee', 'Madison', 'Green Bay'],
  WY: ['Cheyenne', 'Casper', 'Laramie'],
};

export const normaliseSearchTerm = (term: string): string => term.trim().toLowerCase();

export const rowMatchesSearch = (
  row: Record<string, unknown>,
  term: string,
): boolean => {
  if (!term) return true;
  const normalised = normaliseSearchTerm(term);
  return Object.values(row).some(value =>
    String(value ?? '').toLowerCase().includes(normalised),
  );
};