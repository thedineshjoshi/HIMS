using HIMS.Data;
using HIMS.DTO.Doctor;
using HIMS.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HIMS.Services
{
    public class DoctorService: IDoctorService
    {
        private readonly ApplicationDbContext db;
        public DoctorService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<IEnumerable<GetDoctorDto?>> GetDoctorsAsync()
        {
            var doctors = await db.Doctors.Where(d => d.IsActive == true).Select(
                d=>new GetDoctorDto
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    MiddleName = d.MiddleName,
                    LastName = d.LastName,
                    Specialization = d.Specialization,
                    Department = d.Department,
                    Qualification = d.Qualification,
                    LicenseNumber = d.LicenseNumber,
                    HiringDate = d.HiringDate
                }
                ).ToListAsync();
            if(doctors == null || doctors.Count == 0)
            {
                return null;
            }
            return doctors;

        }

    }
}
