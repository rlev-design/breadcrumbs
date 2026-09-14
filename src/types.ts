export type Breadcrumb = {
  id: number;
  title: string;
  date: string;
  whatChanged: string;
  decisions: string[];
  nextStep: string;
  noteToFutureMe: string;
};

export type Project = {
  id: number;
  name: string;
  color: string;
  breadcrumbs: Breadcrumb[];
};

export type NewProjectInput = {
  name: string;
  color: string;
};

export type NewBreadcrumbInput = {
  title: string;
  date: string;
  whatChanged: string;
  decisions: string[];
  nextStep: string;
  noteToFutureMe: string;
};