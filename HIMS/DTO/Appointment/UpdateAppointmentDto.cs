using HIMS.Model.Enums;
using System.ComponentModel.DataAnnotations;

namespace HIMS.DTO.Appointment
{
    public class UpdateAppointmentDto
    {
        public DateTime AppointmentDate { get; set; }
        public string ReasonForVisit { get; set; }
        public AppointmentStatus_Enum Status { get; set; }
    }
}
