export type Users = {
  name: string;
  email: string;
  password: string;
};

export type Project = {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  type: string;
  link: string;
  githubLink?: string;
  order?: number;
};

export type Education = {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
};

export type Contact = {
  yapping?: string;
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
};

export type About = {
  name: string;
  role: string;
  description: string;
  skills: string[];
  hobbies: string[];
  photo?: string;
};
