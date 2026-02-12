using HIMS.Common;
using HIMS.Model.Clinical_And_Scheduling_Entities;

namespace HIMS.Model.Core_People_Entities
{
    public class Doctor: People
    {
        public Guid Id { get; set; }
        public string Role { get; set; }
        public DateOnly HiringDate { get; set; }
        public double Salary { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
