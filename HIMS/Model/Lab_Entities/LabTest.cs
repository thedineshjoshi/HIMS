using HIMS.Model.Core_People_Entities;

namespace HIMS.Model.Lab_Entities
{
    public class LabTest
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
        public string TestName { get; set; }
        public string TestType { get; set; }
        public string TestResults { get; set; }
        public DateTime TestDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
