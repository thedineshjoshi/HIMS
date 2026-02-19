export enum StaffRole{
    Receptionist=0,
    Doctor=1,
    Nurse=2,
    LabTechnician=3,
    Pharmacist=4,
    Administrator=5,
    JanitorialStaff=6,
    SecurityPersonnel=7,
    ITSupport=8,
    HRManager=9
}

export interface RoleDetail {
  label: string;
  color: string;
  icon: string;
}

export const StaffRoleConfig = {
  [StaffRole.Receptionist]: { 
    label: 'Receptionist', color: '#36cfc9', icon: 'event' 
  },
  [StaffRole.Doctor]: { 
    label: 'Doctor', color: '#1890ff', icon: 'medical_services' 
  },
  [StaffRole.Nurse]: { 
    label: 'Nurse', color: '#95de64', icon: 'healing' 
  },
  [StaffRole.LabTechnician]: { 
    label: 'Lab Tech', color: '#722ed1', icon: 'biotech' 
  },
  [StaffRole.Pharmacist]: { 
    label: 'Pharmacist', color: '#faad14', icon: 'medication' 
  },
  [StaffRole.Administrator]: { 
    label: 'Admin', color: '#ff4d4f', icon: 'admin_panel_settings' 
  },
  [StaffRole.JanitorialStaff]: { 
    label: 'Janitorial', color: '#8c8c8c', icon: 'cleaning_services' 
  },
  [StaffRole.SecurityPersonnel]: { 
    label: 'Security', color: '#262626', icon: 'security' 
  },
  [StaffRole.ITSupport]: { 
    label: 'IT Support', color: '#003a8c', icon: 'terminal' 
  },
  [StaffRole.HRManager]: { 
    label: 'HR Manager', color: '#eb2f96', icon: 'groups' 
  }
};