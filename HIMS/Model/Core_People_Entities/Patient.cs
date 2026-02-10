using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Facility_And_Operational_Entities;
using HIMS.Model.Invoice_And_Bill;

namespace HIMS.Model.Core_People_Entities
{
    public class Patient
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string BloodGroup { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        public virtual ICollection<InPatientAdmission> Admissions { get; set; }
        public virtual ICollection<Bill> Bills { get; set; }

    }
}
