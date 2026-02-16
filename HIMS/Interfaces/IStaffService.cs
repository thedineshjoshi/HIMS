using HIMS.DTO.Pagination;
using HIMS.DTO.Response;
using HIMS.DTO.Staff;
using HIMS.Model.Core_People_Entities;

namespace HIMS.Interfaces
{
    public interface IStaffService
    {
            Task<PagedResponseDto<GetStaffDto>> GetAllStaffAsync(PagingRequestDto request);
            Task<GetStaffDto> GetStaffByIdAsync(Guid id);
            Task<CreateStaffResponseDto> AddStaffAsync(CreateStaffDto staff);
            Task<ResponseDto> UpdateStaffAsync(Guid id, UpdateStaffDto staff);
            Task<ResponseDto> DeleteStaffAsync(Guid id);
    }
}
