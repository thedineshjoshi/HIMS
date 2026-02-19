using HIMS.DTO.Pagination;
using HIMS.DTO.Patient;
using HIMS.DTO.Response;
using HIMS.Model.Core_People_Entities;

namespace HIMS.Interfaces
{
    public interface IPatientService
    {
        Task<PagedResponseDto<GetPatientDto>> GetAllPatientsAsync(PagingRequestDto request);
        Task<GetPatientDto?> GetPatientByIdAsync(Guid id);
        Task<GetPatientDto?> SearchPatientAsync(SearchPatientDto request);
        Task<Guid> AddPatientAsync(CreatePatientDto patient);
        Task<ResponseDto> UpdatePatientAsync(Guid Id, UpdatePatientDto patient);
        Task<ResponseDto> DeletePatientAsync(Guid id);

    }
}
