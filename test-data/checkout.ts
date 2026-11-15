export const checkoutInformation = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '12345',
} as const;

export type RequiredFieldScenario = {
  title: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedError: string;
};

export const requiredFieldScenarios = [
  {
    title: 'CHECKOUT-002: require a first name',
    firstName: '',
    lastName: checkoutInformation.lastName,
    postalCode: checkoutInformation.postalCode,
    expectedError: 'Error: First Name is required',
  },
  {
    title: 'CHECKOUT-003: require a last name',
    firstName: checkoutInformation.firstName,
    lastName: '',
    postalCode: checkoutInformation.postalCode,
    expectedError: 'Error: Last Name is required',
  },
  {
    title: 'CHECKOUT-004: require a postal code',
    firstName: checkoutInformation.firstName,
    lastName: checkoutInformation.lastName,
    postalCode: '',
    expectedError: 'Error: Postal Code is required',
  },
] as const satisfies readonly RequiredFieldScenario[];
