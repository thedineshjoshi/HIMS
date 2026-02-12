using HIMS.Data;
using HIMS.Interfaces;
using HIMS.Model.Core_People_Entities;
using Microsoft.EntityFrameworkCore;

namespace HIMS.Services
{
    public class PatientService : IPatientService
    {
        private readonly ApplicationDbContext db;
        public PatientService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<List<Patient>> GetAllPatientsAsync()
        {
            return await db.Patients.ToListAsync();
        }
        public async Task<Patient?> GetPatientByIdAsync(Guid id)
        {
            return await db.Patients
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Patient> AddPatientAsync(Patient patient)
        {
            await db.Patients.AddAsync(patient);
            await db.SaveChangesAsync(); 
            return patient;
        }

        public async Task<bool> UpdatePatientAsync(Guid Id,Patient updatedPatient)
        {
            var patient = await db.Patients.FindAsync(Id);
            if (patient == null)
                return false;

            patient.FirstName = updatedPatient.FirstName;
            patient.MiddleName = updatedPatient.MiddleName;
            patient.LastName = updatedPatient.LastName;
            patient.BloodGroup = updatedPatient.BloodGroup;
            patient.ContactNumber = updatedPatient.ContactNumber;
            patient.Email = updatedPatient.Email;
            patient.Address = updatedPatient.Address;
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePatientAsync(Guid id)
        {
            var patient = await db.Patients.FindAsync(id);
            if (patient == null)
                return false;

            db.Patients.Remove(patient);
            await db.SaveChangesAsync();
            return true;
        }

        
    }
}
