using HIMS.DTO.Appointment;
using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;

namespace HIMS.Interfaces
{
    public interface IAppointmentService
    {
        Task<List<GetAppointmentDto>> GetAllAppointmentsAsync();
        Task<GetAppointmentDto?> GetAppointmentByIdAsync(Guid id);
        Task<Patient?> CheckPatientExistsAsync(PatientCheckDto dto);
        Task<Appointment> AddAppointmentAsync(CreateAppointmentDto dto);
        Task<bool> UpdateAppointmentAsync(Guid Id, AppointmentStatus_Enum status);
        Task<bool> DeleteAppointmentAsync(Guid id);

    }
}
