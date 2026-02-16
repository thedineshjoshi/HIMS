using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;

namespace HIMS.Model.Clinical_And_Scheduling_Entities
{
    public class Appointment:BaseEntity
    {
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ReasonForVisit { get; set; }
        public bool IsActive { get; set; }
        public AppointmentStatus_Enum Status { get; set; } 
       
    }
}
