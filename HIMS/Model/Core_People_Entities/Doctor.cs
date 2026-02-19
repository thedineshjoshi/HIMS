using HIMS.Common;
using HIMS.Model.Clinical_And_Scheduling_Entities;

namespace HIMS.Model.Core_People_Entities
{
    public class Doctor: People
    {
        public Guid Id { get; set; }

        public string Specialization { get; set; }
        public string Department { get; set; }
        public string Qualification { get; set; }
        public string LicenseNumber { get; set; }
        public DateOnly HiringDate { get; set; }
        public double Salary { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
