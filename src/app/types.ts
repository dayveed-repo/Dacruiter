export type FormType = {
  title: string;
  description: string;
  limitedApplicants: boolean;
  maxApplicants: number;
  interviewTypes: string[];
  duration: string;
  otherSkills: string[];
};

export type MetaDataType = {
  numberOfCredits: number;
  amount: number;
  userEmail: string;
  supabaseUserId: string;
};
