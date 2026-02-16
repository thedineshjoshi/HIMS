using HIMS.DTO.Patient;
using HIMS.DTO.Response;
using HIMS.Model.Core_People_Entities;

namespace HIMS.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<GetPatientDto>> GetAllPatientsAsync();
        Task<GetPatientDto?> GetPatientByIdAsync(Guid id);
        Task<Guid> AddPatientAsync(CreatePatientDto patient);
        Task<ResponseDto> UpdatePatientAsync(Guid Id, UpdatePatientDto patient);
        Task<ResponseDto> DeletePatientAsync(Guid id);

    }
}
