using HIMS.Data;
using HIMS.DTO.Pagination;
using HIMS.DTO.Patient;
using HIMS.DTO.Response;
using HIMS.DTO.Staff;
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

        public async Task<PagedResponseDto<GetPatientDto>> GetAllPatientsAsync(PagingRequestDto request)
        {
            var query = db.Patients.Where(s => s.IsActive);
            var totalRecords = await query.CountAsync();
            var requestedPatients = await query
        .OrderBy(s => s.FirstName)
        .Skip((request.PageNumber - 1) * request.PageSize)
        .Take(request.PageSize).Select(
                 a => new GetPatientDto
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    MiddleName = a.MiddleName,
                    LastName = a.LastName,
                    Gender = a.Gender,
                    Address = a.Address,
                    ContactNumber = a.ContactNumber,
                    Email = a.Email,
                    BloodGroup = a.BloodGroup,
                    DateOfBirth = a.DateOfBirth,
                    CreatedOn = a.CreatedOn,
                    CreatedBy = a.CreatedBy,
                    UpdatedBy = a.UpdatedBy,
                    UpdatedOn = a.UpdatedOn
                 }
                ).ToListAsync();
            var response = new PagedResponseDto<GetPatientDto>
            {
                Items = requestedPatients,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };
            return response;
        }
        public async Task<GetPatientDto?> GetPatientByIdAsync(Guid id)
        {
            return await db.Patients.Where(a => a.IsActive == true && a.Id == id).Select(
                 a => new GetPatientDto
                 {
                     Id = a.Id,
                     FirstName = a.FirstName,
                     MiddleName = a.MiddleName,
                     LastName = a.LastName,
                     Gender = a.Gender,
                     Address = a.Address,
                     ContactNumber = a.ContactNumber,
                     Email = a.Email,
                     BloodGroup = a.BloodGroup,
                     DateOfBirth = a.DateOfBirth,
                     CreatedOn = a.CreatedOn,
                     CreatedBy = a.CreatedBy,
                     UpdatedBy = a.UpdatedBy,
                     UpdatedOn = a.UpdatedOn
                 }
                ).FirstOrDefaultAsync();
        }

        public async Task<GetPatientDto?> SearchPatientAsync(SearchPatientDto request)
        {
            return await db.Patients.Where(a => a.IsActive == true && (a.FirstName == request.FirstName && a.LastName == request.LastName && a.ContactNumber == request.ContactNumber))
                .Select(a => new GetPatientDto
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    MiddleName = a.MiddleName,
                    LastName = a.LastName,
                    Gender = a.Gender,
                    Address = a.Address,
                    ContactNumber = a.ContactNumber,
                    Email = a.Email,
                    BloodGroup = a.BloodGroup,
                    DateOfBirth = a.DateOfBirth,
                    CreatedOn = a.CreatedOn,
                    CreatedBy = a.CreatedBy,
                    UpdatedBy = a.UpdatedBy,
                    UpdatedOn = a.UpdatedOn
                }).FirstOrDefaultAsync();
        }
        public async Task<Guid> AddPatientAsync(CreatePatientDto patient)
        {
            var newPatient = new Patient
            {
                Id = Guid.NewGuid(),
                FirstName = patient.FirstName,
                MiddleName = patient.MiddleName,
                LastName = patient.LastName,
                Gender = patient.Gender,
                Address = patient.Address,
                ContactNumber = patient.ContactNumber,
                Email = patient.Email,
                BloodGroup = patient.BloodGroup,
                DateOfBirth = patient.DateOfBirth,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = patient.CreatedBy,
                IsActive = true
            };
            await db.Patients.AddAsync(newPatient);
            await db.SaveChangesAsync();
            return newPatient.Id;
        }

        public async Task<ResponseDto> UpdatePatientAsync(Guid Id,UpdatePatientDto updatedPatient)
        {
            var patient = await db.Patients.FindAsync(Id);
            if (patient == null)
                return new ResponseDto
                {
                    Success = false,
                    Message = "patient can't be null"
                };

            patient.FirstName = updatedPatient.FirstName;
            patient.MiddleName = updatedPatient.MiddleName;
            patient.LastName = updatedPatient.LastName;
            patient.BloodGroup = updatedPatient.BloodGroup;
            patient.ContactNumber = updatedPatient.ContactNumber;
            patient.Email = updatedPatient.Email;
            patient.Address = updatedPatient.Address;
            patient.UpdatedBy = updatedPatient.UpdatedBy;
            patient.UpdatedOn = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return new ResponseDto
            {
                Success = true,
                Message = "patient updated successfully"
            }; ;
        }

        public async Task<ResponseDto> DeletePatientAsync(Guid id)
        {
            var patient = await db.Patients.FindAsync(id);
            if (patient == null)
            { 
                return new ResponseDto
                {
                    Success = false,
                    Message = "Patient not found."
                };
            }
            patient.IsActive=false;
            await db.SaveChangesAsync();
            return new ResponseDto
            {
                Success = true,
                Message = "Patient deleted successfully."
            };
        }

        
    }
}
