using HIMS.Model.Core_People_Entities;

namespace HIMS.Model.Clinical_And_Scheduling_Entities
{
    public class MedicalRecord
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
        public List<string> Symptoms { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentPlan { get; set; }
        public string Medications { get; set; }
        public DateTime RecordDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
    }
}
