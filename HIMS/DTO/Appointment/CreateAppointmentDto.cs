using HIMS.DTO.Patient;

namespace HIMS.DTO.Appointment
{
    public class CreateAppointmentDto:PatientCheckDto
    {
        public Guid DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string BloodGroup { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string ReasonForVisit { get; set; }
    }
}
