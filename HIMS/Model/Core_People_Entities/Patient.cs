using HIMS.Common;
using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Facility_And_Operational_Entities;
using HIMS.Model.Invoice_And_Bill;

namespace HIMS.Model.Core_People_Entities
{
    public class Patient:People
    {
        public string BloodGroup { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        public virtual ICollection<InPatientAdmission> Admissions { get; set; }
        public virtual ICollection<Bill> Bills { get; set; }

    }
}
