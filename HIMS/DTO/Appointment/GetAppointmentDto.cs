namespace HIMS.DTO.Appointment
{
    public class GetAppointmentDto
    {
        public Guid Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ReasonForVisit { get; set; }
        public string Status { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; }
        public string PatientContact { get; set; }
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; }
    }
}
