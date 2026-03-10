export interface NavLeaf {
  label: string;
  route: string;
}

export interface NavSubGroup {
  groupLabel: string;
  items: NavLeaf[];
}

export interface NavTopItem {
  label: string;
  icon: string;
  route?: string;
  subGroups?: NavSubGroup[];
}

export interface NavSection {
  sectionLabel: string;
  items: NavTopItem[];
}

/** Legacy – kept for backward compat */
export interface AppMenuItem {
  label: string;
  icon?: string;
  route?: string;
  items?: AppMenuItem[];
}
