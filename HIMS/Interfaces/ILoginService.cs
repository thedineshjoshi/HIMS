using HIMS.DTO.Authentication;

namespace HIMS.Interfaces
{
    public interface ILoginService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    }
}
