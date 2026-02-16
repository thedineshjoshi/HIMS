using HIMS.DTO.Appointment;
using HIMS.DTO.Response;
using HIMS.Model.Clinical_And_Scheduling_Entities;
using HIMS.Model.Core_People_Entities;
using HIMS.Model.Enums;

namespace HIMS.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<GetAppointmentDto>> GetAllAppointmentsAsync();
        Task<GetAppointmentDto?> GetAppointmentByIdAsync(Guid id);
        Task<Patient?> CheckPatientExistsAsync(PatientCheckDto dto);
        Task<Guid> AddAppointmentAsync(CreateAppointmentDto dto);
        Task<ResponseDto> UpdateAppointmentAsync(Guid Id, AppointmentStatus_Enum status);
        Task<ResponseDto> DeleteAppointmentAsync(Guid id);

    }
}
