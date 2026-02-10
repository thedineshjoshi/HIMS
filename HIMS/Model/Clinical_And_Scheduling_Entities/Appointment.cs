using HIMS.Model.Core_People_Entities;

namespace HIMS.Model.Clinical_And_Scheduling_Entities
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ReasonForVisit { get; set; }
        public AppointmentStatus_Enum Status { get; set; } // e.g., Scheduled, Completed, Canceled
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
