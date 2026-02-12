using HIMS.Model.Core_People_Entities;

namespace HIMS.Interfaces
{
    public interface IPatientService
    {
        Task<List<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(Guid id);
        Task<Patient> AddPatientAsync(Patient patient);
        Task<bool> UpdatePatientAsync(Guid Id, Patient patient);
        Task<bool> DeletePatientAsync(Guid id);

    }
}
