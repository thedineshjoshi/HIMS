using HIMS.DTO.Doctor;

namespace HIMS.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<GetDoctorDto?>> GetDoctorsAsync();

    }
}
