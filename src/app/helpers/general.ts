export const escapeForILike = (str: string) =>
  str.replace(/[%_]/g, (s) => `\\${s}`);

export const convertToSubcurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};

export const getInterviewCredits = (numberOfQuestions: number) => {
  if (numberOfQuestions <= 5) return 1;
  if (numberOfQuestions <= 10) return 2;
  if (numberOfQuestions <= 20) return 3;
  if (numberOfQuestions <= 30) return 4;
  return 5;
};

export const generateInvoiceId = () => {
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `INV-${timestamp}${random}`.slice(0, 11); // e.g. "INV-9VZP7A2"
};
