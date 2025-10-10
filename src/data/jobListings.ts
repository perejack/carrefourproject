export interface JobListing {
  id: string;
  title: string;
  salary: string;
  medical: string;
  category: string;
  image?: string;
}

export const jobListings: JobListing[] = [
  {
    id: "1",
    title: "Receptionist",
    salary: "Ksh. 34,000",
    medical: "Ksh. 3,000",
    category: "Customer Service",
  },
  {
    id: "2",
    title: "Accountant & Cashier",
    salary: "Ksh. 32,000",
    medical: "Ksh. 3,000",
    category: "Finance",
  },
  {
    id: "3",
    title: "Warehouse Supervisor",
    salary: "Ksh. 31,000",
    medical: "Ksh. 2,000",
    category: "Operations",
  },
  {
    id: "4",
    title: "Distributor and Marketer",
    salary: "Ksh. 29,000",
    medical: "Ksh. 1,500",
    category: "Sales & Marketing",
  },
  {
    id: "5",
    title: "Driver",
    salary: "Ksh. 27,400",
    medical: "Ksh. 2,500",
    category: "Logistics",
  },
  {
    id: "6",
    title: "Guard",
    salary: "Ksh. 27,000",
    medical: "Ksh. 700",
    category: "Security",
  },
  {
    id: "7",
    title: "Sales Attendant",
    salary: "Ksh. 25,000",
    medical: "Ksh. 500",
    category: "Customer Service",
  },
  {
    id: "8",
    title: "Chef",
    salary: "Ksh. 23,750",
    medical: "Ksh. 1,500",
    category: "Food Service",
  },
  {
    id: "9",
    title: "Cleaner",
    salary: "Ksh. 22,400",
    medical: "Ksh. 500",
    category: "Facility Management",
  },
  {
    id: "10",
    title: "Store Keeper",
    salary: "Ksh. 22,000",
    medical: "Ksh. 500",
    category: "Operations",
  },
  {
    id: "11",
    title: "Loader and Off Loader",
    salary: "Ksh. 17,000",
    medical: "Ksh. 500",
    category: "Warehouse",
  },
];
